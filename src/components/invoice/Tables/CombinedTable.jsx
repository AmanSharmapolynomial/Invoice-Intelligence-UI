import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import React from "react";

const CombinedTable = ({ data, document_uuid }) => {
  const { columns, rows } = data?.data?.processed_table;
  const setCachedData=(key,value)=>{
    
  }
  return (
    <div className="w-full mt-1 border border-[#F0F0F0] shadow-sm rounded-md">
      <p className="font-poppins font-semibold border-b border-[#E0E0E0] p-3 text-base leading-6">
        Items
      </p>

      <div className="py-2  overflow-auto w-full">
        <Table>
          <TableHead className=" px-0">
            <TableRow className="w-full flex border-b border-[#E0E0E0]">
              {columns?.map(
                ({
                  column_uuid,
                  column_name,
                  column_order,
                  selected_column
                }) => {
                  return (
                    <TableCell
                      className="min-w-[15%] flex items-center gap-x-2 "
                      key={column_uuid}
                    >
                      <Checkbox checked={selected_column} />{" "}
                      <span className="pt-1"> {column_name}</span>
                    </TableCell>
                  );
                }
              )}
            </TableRow>
          </TableHead>
        </Table>
      </div>
    </div>
  );
};

export default CombinedTable;
