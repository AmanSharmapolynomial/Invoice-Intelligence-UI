import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import approved from "@/assets/image/approved.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDateTimeToReadable } from "@/lib/helpers";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import no_data from "@/assets/image/no-data.svg";

const sortingStates = ["all", "asc", "desc"];

const VendorsTable = ({ columns, data, isLoading }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortingOrder, setSortingOrder] = useState({});

  const getValue = (obj, key) => {
    return key.includes("[")
      ? key
          .split(/[[\]]/g)
          .filter(Boolean)
          .reduce((o, k) => (o ? o[k] : null), obj)
      : obj[key];
  };

  const handleSort = (column) => {
    if (!column.sorting_key) return;

    const currentOrder = sortingOrder[column.key] || "all";

    let nextOrder;
    if (column.sorting_key === "human_verified") {
      const humanVerifiedStates = ["all", "true", "false"];
      nextOrder =
        humanVerifiedStates[
          (humanVerifiedStates.indexOf(currentOrder) + 1) % 3
        ];
    } else {
      nextOrder = sortingStates[(sortingStates.indexOf(currentOrder) + 1) % 3];
    }

    setSortingOrder((prev) => ({ ...prev, [column.key]: nextOrder }));

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (nextOrder === "all") {
      newParams.delete(column.sorting_key);
    } else {
      newParams.set(column.sorting_key, nextOrder);
    }
    setSearchParams(newParams);
  };

  const getSortingIcon = (column) => {
    const order = sortingOrder[column.key] || "all";
    if (order === "asc") return <ChevronUp size={16} />;
    if (order === "desc") return <ChevronDown size={16} />;
    return <ChevronsUpDown size={16} />;
  };

  return (
    <div className="w-full mt-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="!rounded-md !relative box-border flex flex-col min-w-full min-h-[70vh] 2xl:max-h-[78vh] overflow-auto">
          <TableHeader className="w-full sticky top-0 z-10 bg-white dark:bg-primary">
            <TableRow
              className={`!text-white !rounded-md w-full grid grid-cols-${columns?.length} md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center items-center justify-center text-xs sm:text-sm`}
            >
              {columns?.map((column) => (
                <TableHead
                  key={column.key}
                  onClick={() => handleSort(column)}
                  className="cursor-pointer font-poppins !px-[0.75rem] font-semibold text-black md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center leading-5 text-sm border-r items-center flex gap-1"
                >
                  {column?.label}
                  {column?.sorting_key && getSortingIcon(column)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {isLoading ? (
              Array?.from({ length: 10 }).map((_, i) => (
                <TableRow
                  key={i}
                  className={`grid grid-cols-${columns?.length} md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] content-center self-center w-full items-center text-xs sm:text-sm`}
                >
                  {columns?.map((col, idx) => (
                    <TableCell
                      key={idx}
                      className="border-r h-full font-poppins px-[0.8rem] capitalize text-sm md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] content-center self-center font-normal"
                    >
                      <Skeleton className="w-44 h-5" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <div className="w-full flex flex-col justify-between h-full">
                {data?.length > 0 ? (
                  data?.map((row, rowIndex) => (
                    <TableRow
                      onClick={() =>
                        navigate(
                          `/fast-item-verification/${row?.vendor?.vendor_id}?vendor_name=${row?.vendor?.vendor_name}&human_verified=${row?.vendor?.human_verified}&from_view=item-master-vendors`
                        )
                      }
                      key={rowIndex}
                      className={`grid grid-cols-${columns?.length} w-full md:max-h-[2.75rem]  md:min-h-[2.65rem] 2xl:min-h-[4rem] xl:min-h-[3.25rem] self-center content-center cursor-pointer text-xs sm:text-sm`}
                    >
                      {columns?.map((column) => (
                        <TableCell
                          key={column.key}
                          className="border-r h-full font-poppins !break-word dark:text-white md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center !truncate whitespace-normal px-[0.8rem] capitalize text-sm font-normal"
                        >
                          <div className="flex gap-x-4 !break-word whitespace-normal">
                            {column?.key === "vendor[recent_addition_date]"
                              ? formatDateTimeToReadable(
                                  getValue(row, column?.key)
                                ) || "NA"
                              : getValue(row, column?.key) || 0}
                            {column?.key === "vendor[vendor_name]" &&
                              row?.vendor?.human_verified && (
                                <img src={approved} alt="" />
                              )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <div className="w-full flex items-center justify-center h-full">
                    <img src={no_data} alt="" className="h-[50%] w-[40%]" />
                  </div>
                )}
              </div>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VendorsTable;
