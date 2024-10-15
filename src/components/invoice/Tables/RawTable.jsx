import React from "react";
import { useGetRawTableData } from "../api";
import { formatRawDataTable } from "@/lib/helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const RawTable = ({ document_uuid }) => {
  const { data, isLoading } = useGetRawTableData(document_uuid);
  console.log( formatRawDataTable(data?.data?.raw_table))
  return (
    <>
      {isLoading ? (
        <Table>
          {new Array(20).fill(10)?.map((_, index) => (
            <TableRow key={index}>
              {new Array(7).fill(7)?.map((_, i) => (
                <TableCell key={i}>
                  <Skeleton className={"w-56 h-5"} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {!isLoading &&
                formatRawDataTable(data?.data?.raw_table)?.[0]?.map(
                  (header, index) => <TableHead key={index}>{header}</TableHead>
                )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              formatRawDataTable(data?.data?.raw_table)
                .slice(1, formatRawDataTable(data?.data?.raw_table)?.length)
                ?.map((col, index) => (
                  <TableRow key={index}>
                    {col?.map((item, i) => (
                      <TableCell key={i}>{item}</TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default RawTable;
