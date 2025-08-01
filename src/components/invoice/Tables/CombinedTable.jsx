import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import CustomDropDown from "@/components/ui/CustomDropDown";
import undo from "@/assets/image/undo.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@/components/ui/table";
import { headerNamesFormatter } from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import { Trash2, X, XCircle, RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";

const CombinedTable = ({
  data,
  document_uuid,
  isLoading,
  additionalData,
  loadingAdditionalData
}) => {
  // const {combinedTableHistory :history,setCombinedTableHistory}=invoiceDetailStore()
  const { history, setHistory, operations, setOperations } =
    invoiceDetailStore(); // History stack for undo
  const { columns = [], rows = [] } = data?.data?.processed_table;

  const setCachedData = (key, value) => {};
  const undoLastAction = () => {
    if (operations?.length !== 0) {
      if (history.length === 0) return;

      const { tableData: lastTableData, operations: lastOperations } =
        history?.pop();
      const lastOperation = lastOperations?.[lastOperations?.length - 1];
      if (lastOperation?.type === "delete_row") {
        const deletedRowUuid = lastOperation?.data?.transaction_uuid;
        const restoredRow = lastTableData?.data?.processed_table?.rows?.find(
          (row) => row?.transaction_uuid === deletedRowUuid
        );

        const updatedRows = [
          ...lastTableData?.data?.processed_table?.rows,
          restoredRow
        ];
        let copyData = JSON.parse(JSON.stringify(data));
        copyData.data.processed_table.rows = updatedRows;
        queryClient.setQueryData(["combined-table", document_uuid], copyData);
      } else {
        queryClient.setQueryData(
          ["combined-table", document_uuid],
          lastTableData
        );
      }

      setOperations(lastOperations);
      setHistory(history);
    }
  };
  useEffect(() => {
    if (data) {
      let copyObj = JSON.parse(JSON.stringify(data));
      const { columns = [], rows = [] } = copyObj?.data?.processed_table;

      // Create a mapping from column_uuid to column_order
      const columnOrderMap = columns?.reduce((acc, column) => {
        acc[column.column_uuid] = column?.column_order;
        return acc;
      }, {});

      // Sort cells in each row based on column_order
      copyObj?.data?.processed_table?.rows?.forEach((row) => {
        row?.cells?.sort((a, b) => {
          return columnOrderMap?.[a?.column_uuid] - columnOrderMap?.[b?.column_uuid];
        });
      });

      queryClient.setQueryData(["combined-table", document_uuid], copyObj);
    }
  }, []);

  const handleCheckboxChange = (column_uuid, val) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    const { rows = [], columns = [] } = copyObj?.data?.processed_table;
    let col_name="";
    columns?.forEach((col) => {
      if (col?.column_uuid == column_uuid) {
        col.selected_column = val;
        col_name=col?.column_name
      }
    });
    let operation = {
      type: "update_column",
      operation_order: operations?.length+1,
      data: {
        column_uuid: column_uuid,
        selected_column: val,
        column_name: col_name
      }
    };
    setOperations([...operations,operation])
    queryClient.setQueryData(["combined-table", document_uuid], copyObj);
  };

  const handleDropdownChange = (column_uuid, column_name) => {
    // Deep copy of the data to avoid direct mutation
    let copyObj = JSON.parse(JSON.stringify(data));
    const { rows, columns } = copyObj?.data?.processed_table;

    // Update the column name in the columns array
    columns?.forEach((col) => {
      if (col?.column_uuid === column_uuid) {
        col.column_name = column_name;
      }
    });

    // Update the query data with the modified table structure
    queryClient.setQueryData(["combined-table", document_uuid], copyObj);

    // Check if an update operation for this column already exists
    const existingIndex = operations?.findIndex(
      (op) =>
        op?.type === "update_column" && op?.data?.column_uuid === column_uuid
    );

    if (existingIndex === -1) {
      // Add a new operation if it doesn't exist
      const newOperation = {
        type: "update_column",
        operation_order: operations?.length + 1,
        data: {
          column_uuid,
          selected_column: true,
          column_name
        }
      };
      setOperations([...operations, newOperation]);
    } else {
      // Update the existing operation with the new column name
      let updatedOperations = [...operations];
      updatedOperations[existingIndex] = {
        ...updatedOperations[existingIndex],
        data: {
          ...updatedOperations?.[existingIndex]?.data,
          column_name
        }
      };
      setOperations(updatedOperations);
    }
  };

  const existingColumn_names = data?.data?.processed_table?.columns?.map(
    ({ column_uuid, selected_column, column_order, ...rest }) =>
      rest?.column_name
  );

  const handleDeleteColumn = (column_uuid) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    let { rows = [], columns = [] } = copyObj?.data?.processed_table;

    // Save current state to history
    setHistory([
      ...history,
      {
        tableData: JSON.parse(JSON.stringify(data)),
        operations: [...operations]
      }
    ]);

    // Remove the column from the columns array
    columns = columns?.filter((column) => column?.column_uuid !== column_uuid);

    // Remove the corresponding cell from each row
    rows.forEach((row) => {
      row.cells = row?.cells?.filter((cell) => cell?.column_uuid !== column_uuid);
    });

    copyObj.data.processed_table.columns = columns;
    copyObj.data.processed_table.rows = rows;

    // Update the query data

    let operation = {
      type: "delete_column",
      operation_order: operations?.length + 1,
      data: {
        column_uuid: column_uuid
      }
    };
    setOperations([...operations, operation]);
    queryClient.setQueryData(["combined-table", document_uuid], copyObj);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      // Retrieve the last state from the history
      const lastState = history?.[history?.length - 1];

      // Update the query data with the last state
      const copyObj = JSON.parse(JSON.stringify(data));
      copyObj.data.processed_table.columns = lastState?.columns;
      copyObj.data.processed_table.rows = lastState?.rows;

      queryClient.setQueryData(["combined-table", document_uuid], copyObj);

      // Remove the last state from the history
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="w-full mt-1 border border-[#F0F0F0] shadow-sm rounded-md -mt-3">
      <p className="font-poppins font-semibold border-b border-[#E0E0E0] p-3 text-base leading-6 flex justify-between">
        Items
        <CustomTooltip content={"Undo"}>
          <Button
            disabled={history?.length == 0}
            className="bg-transparent border-none shadow-none hover:bg-transparent"
          >
            <img
              src={undo}
              alt=""
              className="h-[1.25rem] ml-1 cursor-pointer"
              onClick={undoLastAction}
            />
          </Button>
        </CustomTooltip>
      </p>

      <div className="py-2  !max-h-[39.7rem] overflow-auto w-full ">
        <Table className="w-full  !max-h-[30rem]">
          <TableHead className=" px-0 w-full sticky top-0">
            <TableRow className="!w-full flex gap-x-2 hide-scrollbar  justify-between border-b border-[#E0E0E0] px-0.5">
              {columns?.map(
                ({
                  column_uuid,
                  column_name,
                  column_order,
                  selected_column
                }) => {
                  return (
                    <TableCell
                      className="!min-w-[11rem]  !pl-3 !max-w-full    flex  items-center gap-x-2 "
                      key={column_uuid}
                    >
                      <Checkbox
                        checked={selected_column}
                        onCheckedChange={(v) => {
                          handleCheckboxChange(column_uuid, v);
                        }}
                      />{" "}
                      <span className="pt-1 text-[#121212] capitalize font-poppins font-semibold !text-sm">
                        {" "}
                        {column_name}
                      </span>
                    </TableCell>
                  );
                }
              )}
            </TableRow>
          </TableHead>

          <TableBody className="!max-h-[30rem] hide-scrollbar  ">
            <div className=" flex gap-x-2 overflow-auto px-0.5 !max-h-[35rem] hide-scrollbar justify-between ">
              {columns?.map(
                ({
                  column_uuid,
                  column_name,
                  column_order,
                  selected_column
                }) => {
                  return (
                    <TableCell
                      className="!w-[11rem] !max-w-[15rem]    flex items-center "
                      key={column_uuid}
                    >
                      <div className="relative">
                        <CustomDropDown
                          Value={column_name}
                          className={"!w-[rem] "}
                          triggerClassName={
                            "!max-w-[10rem] !relative  !h-[2.25rem] !min-w-[9.5rem]  "
                          }
                          data={[...(headerNamesFormatter(
                            additionalData?.data
                              ?.processed_table_header_candidates
                          )?.filter(
                            (c) =>
                              !(
                                existingColumn_names?.includes(c?.label) &&
                                c.label !== column_name
                              )
                          )),{label:"NA",value:"NA"}]}
                          onChange={(c, item) => {
                            handleDropdownChange(column_uuid, c);
                          }}
                        />
                        <X
                          onClick={() => handleDeleteColumn(column_uuid)}
                          className="absolute h-4 w-4 bg-[#F15156] p-0.5 cursor-pointer  text-white rounded-full -right-1 !z-50 -top-1.5"
                        />
                      </div>
                    </TableCell>
                  );
                }
              )}
            </div>
            <div className=" flex flex-col gap-4 overflow-auto max-h-[30rem] px-0.5 hide-scrollbar">
              {rows?.map((row, index) => {
                return (
                  <TableRow
                    bordered
                    key={index}
                    className="flex w-full gap-x-2 border-none justify-between"
                  >
                    {row?.cells?.map((cell, i) => {
                      return (
                        <TableCell
                          className="!min-w-[11rem] font-poppins font-normal text-sm leading-4 text-[#121212] !max-w-full  justify-center   flex items-center  capitalize"
                          key={i}
                        >
                          {cell?.text || "--"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </div>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CombinedTable;
