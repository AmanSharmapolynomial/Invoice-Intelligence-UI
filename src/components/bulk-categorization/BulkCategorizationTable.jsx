import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const BulkCategorizationTable = ({ data, isLoading, columns, searchTerm }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();

  // Sorting keys that should be managed
  const sortableKeys = [
    "items_count_order",
    "vendors_count_order",
    "approved_items_count_order",
    "not_approved_items_count_order"
  ];

  // Function to handle sorting logic
  const handleSort = (key) => {
    if (!sortableKeys.includes(key)) return; // Skip non-sortable columns

    const currentOrder = searchParams.get(key) || "all";
    const newOrder =
      currentOrder === "asc" ? "desc" : currentOrder === "desc" ? "all" : "asc";

    updateParams({ [key]: newOrder });
  };

  return (
    <div className="w-full mt-4">
      <div className="relative rounded-lg overflow-hidden">
        <Table className="w-full min-w-[600px]">
          <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
            <TableRow className="border-b border-t border-gray-300 h-[2.75rem]">
              {columns?.map(({ label, key, sorting_key }) => (
                <TableHead
                  key={key}
                  onClick={() => handleSort(sorting_key)}
                  className={`${
                    key?.includes("[") ? "pl-4 md:pl-6" : ""
                  } !font-poppins !font-semibold text-sm w-1/5 text-sm  leading-5 text-black px-4 md:px-6`}
                >
                  <div
                    className={`flex ${
                      key?.includes("[") ? "justify-start" : "justify-center "
                    } items-center `}
                  >
                    <div className="flex items-center gap-x-2">
                      <span>{label}</span>
                      <span className="cursor-pointer">
                        {sortableKeys.includes(sorting_key) &&
                          (searchParams.get(sorting_key) === "asc" ? (
                            <ArrowUp size={16} />
                          ) : searchParams.get(sorting_key) === "desc" ? (
                            <ArrowDown size={16} />
                          ) : (
                            <ArrowUpDown size={16} className="opacity-50" />
                          ))}
                      </span>
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>

        <div className="md:h-[60vh] 2xl:h-[67vh] overflow-y-auto">
          <Table className="w-full min-w-[600px] mb-8">
            <TableBody>
              {isLoading &&
                new Array(10).fill(0).map((_, index) => (
                  <TableRow key={index} className="border-none h-[3.75rem]">
                    {[0, 1, 2, 3, 4].map((it) => (
                      <TableCell key={it}>
                        <Skeleton className="w-full h-[2.5rem]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {/* Table Data */}
              {data?.data
                ?.filter((item) =>
                  item?.category?.name
                    ?.toLowerCase()
                    ?.includes(searchTerm?.toLowerCase())
                )
                ?.map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => {
                      navigate(
                        `/category-wise-items/${item?.category?.category_id}?category_name=${item?.category?.name}`
                      );
                    }}
                    className="border-none h-[3.75rem] cursor-pointer"
                  >
                    {columns?.map(({ key }) => (
                      <TableCell
                        key={key}
                        className={`!font-poppins !font-normal text-sm md:text-base leading-5 text-black w-1/5 px-4 md:px-6 ${
                          key?.includes("[") ? "pl-4 md:pl-6" : ""
                        }`}
                      >
                        <div
                          className={`flex ${
                            key?.includes("[")
                              ? "justify-start"
                              : "justify-center"
                          } items-center `}
                        >
                          {key?.includes("[")
                            ? key.split("[")[0] === "category"
                              ? item.category.name
                              : item[key]
                            : item[key]}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BulkCategorizationTable;
