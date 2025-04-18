import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
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

const VendorsTable = ({ columns, data, isLoading, vendorName }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortConfig, setSortConfig] = useState([]); // [{ key: "vendor[vendor_name]", order: "asc" }]

  let vendor_name = searchParams.get("vendor_name");

  const handleSort = (column) => {
    setSortConfig((prevConfig) => {
      const existingIndex = prevConfig.findIndex(
        (item) => item.key === column.key
      );
      let updatedConfig = [...prevConfig];

      if (existingIndex > -1) {
        const currentOrder = prevConfig[existingIndex].order;
        if (currentOrder === "asc") {
          updatedConfig[existingIndex].order = "desc";
        } else if (currentOrder === "desc") {
          updatedConfig.splice(existingIndex, 1); // remove it (reset)
        }
      } else {
        updatedConfig.push({ key: column.key, order: "asc" });
      }

      // optional: sync to search params
      const keys = updatedConfig.map((s) => s.key).join(",");
      const orders = updatedConfig.map((s) => s.order).join(",");
      setSearchParams({ sort_by: keys, sort_order: orders });

      return updatedConfig;
    });
  };

  const getValue = (obj, key) => {
    return key.includes("[")
      ? key
          ?.split(/[[\]]/g)
          ?.filter(Boolean)
          ?.reduce((o, k) => (o ? o[k] : null), obj)
      : obj[key];
  };
  const sortedData = useMemo(() => {
    if (!sortConfig.length) return data;

    return [...data]?.sort((a, b) => {
      for (const { key, order } of sortConfig) {
        const aValue = getValue(a, key);
        const bValue = getValue(b, key);

        let compareResult = 0;

        if (key === "vendor[recent_addition_date]") {
          compareResult = new Date(aValue) - new Date(bValue);
        } else if (key === "vendor[vendor_name]") {
          compareResult = (aValue || "").localeCompare(bValue || "");
        } else {
          compareResult = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }

        if (compareResult !== 0) {
          return order === "asc" ? compareResult : -compareResult;
        }
      }
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className="w-full mt-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="!rounded-md !relative box-border flex flex-col min-w-full h-[75vh] 2xl:max-h-[78vh] overflow-auto">
          <TableHeader className="w-full sticky top-0 z-10 bg-white dark:bg-primary">
            <TableRow
              className={`!text-white !rounded-md w-full grid grid-cols-${columns?.length} md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center items-center justify-center text-xs sm:text-sm`}
            >
              {columns?.map((column) => (
                <TableHead
                  key={column?.key}
                  onClick={() => handleSort(column)}
                  className="cursor-pointer font-poppins !px-[0.75rem] font-semibold text-black md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center leading-5 text-sm border-r items-center flex gap-1"
                >
                  {column?.label}
                  {(() => {
                    const sort = sortConfig?.find((s) => s?.key === column?.key);
                    if (!sort) return <ChevronsUpDown className="w-4 h-4" />;
                    return sort.order === "asc" ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    );
                  })()}
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
                {sortedData?.length > 0 ? (
                  sortedData
                    ?.filter((r) =>
                      r?.vendor?.vendor_name
                        ?.toLowerCase()
                        ?.includes(vendorName?.toLowerCase())
                    )

                    ?.map((row, rowIndex) => (
                      <Link
                        to={`/fast-item-verification/${
                          row?.vendor?.vendor_id
                        }?vendor_name=${encodeURIComponent(
                          row?.vendor?.vendor_name
                        )}&human_verified=${
                          row?.vendor?.human_verified
                        }&from_view=item-master-vendors`}
                        target="_blank"
                        key={rowIndex}
                        className={`grid grid-cols-${columns?.length} w-full md:max-h-[2.75rem]  md:min-h-[2.65rem] 2xl:min-h-[4rem] xl:min-h-[3.25rem] border border-grey/5 self-center content-center cursor-pointer text-xs sm:text-sm`}
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
                                : column?.key === "percentage_approved"
                                ? `${getValue(row, column?.key)} %`
                                : getValue(row, column?.key) || 0}
                              {column?.key === "vendor[vendor_name]" &&
                                row?.vendor?.human_verified && (
                                  <img src={approved} alt="" />
                                )}
                            </div>
                          </TableCell>
                        ))}
                      </Link>
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
