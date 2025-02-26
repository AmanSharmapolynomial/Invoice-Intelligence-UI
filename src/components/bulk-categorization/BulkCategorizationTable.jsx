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
import { useNavigate } from "react-router-dom";

const BulkCategorizationTable = ({ data, isLoading, columns }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full mt-4">
      <div className="relative rounded-lg  overflow-hidden">
        <Table className="w-full min-w-[600px]">
          <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
            <TableRow className="border-b border-t border-t-[#E0E0E0] border-b-[#E0E0E0] h-[2.75rem]">
              {columns?.map(({ label, key }) => (
                <TableHead
                  key={key}
                  className={`${
                    key?.includes("[") ? "pl-4 md:pl-6" : ""
                  } !font-poppins !font-semibold text-sm w-1/5 md:text-base leading-5 text-black px-4 md:px-6`}
                >
                  <div
                    className={`flex ${
                      key?.includes("[") ? "justify-start" : "justify-center "
                    } items-center  `}
                  >
                    {label}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
        <div className="md:max-h-[60vh] 2xl:max-h-[65vh]  3xl:max-h-[68vh] overflow-y-auto">
          <Table className="w-full min-w-[600px] mb-8">
            <TableBody>
              {isLoading &&
                new Array(10).fill(0).map((_, index) => (
                  <TableRow key={index} className="border-none h-[3.75rem]">
                    {[0, 1, 2, 3, 4]?.map((it) => (
                      <TableCell key={it}>
                        <Skeleton className={"w-full h-[2.5rem]"} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {/* Table Data */}
              {data?.data?.map((item, index) => (
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
