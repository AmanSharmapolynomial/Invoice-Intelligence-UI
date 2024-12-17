import approved from "@/assets/image/approved.svg";
import sort from "@/assets/image/sort.svg";
import unapproved from "@/assets/image/unapproved.svg";
import undo from "@/assets/image/undo.svg";
import { Button } from "@/components/ui/button";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { v4 as uuidv4 } from "uuid";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { headerNamesFormatter } from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { useEffect, useState } from "react";
import {
  ArrowDownFromLine,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowUpToLine,
  Trash2
} from "lucide-react";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";

const HumanVerificationTable = ({
  data,
  isLoading,
  additionalData,
  loadingAdditionalData,
  document_uuid
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-8">
        {[1, 2, 3, 4, 5, 6, 7, 8.9, 10].map((_, i) => {
          return (
            <div
              key={i}
              className="grid grid-cols-3 items-center gap-y-8 gap-x-8"
            >
              <Skeleton key={i} className={"w-[19rem] h-[2rem]"} />
              <Skeleton key={i} className={"w-[19rem] h-[2rem]"} />
              <Skeleton key={i} className={"w-[19rem] h-[2rem]"} />
            </div>
          );
        })}
      </div>
    );
  }

  const [autoCalculate, setAutoCalculate] = useState(false);
  const [stopHovering, setStopHovering] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(false);
  const [showActionsPopup, setShowActionsPopup] = useState(false);
  const [viewVerificationColumn, setViewVerificationColumn] = useState(true);
  const [viewDeleteColumn, setViewDeleteColumn] = useState(false);
  const [viewShiftColumn, setViewShiftColumn] = useState(false);

  const {
    highlightAll,
    setHighlightAll,
    setBoundingBox,
    setBoundingBoxes,
    bounding_box,
    bounding_boxes,
    totalExtendedPrce,
    setTotalExtendedPrice,
    setHistory,
    setReCalculateCWiseSum,
    setHighlightRow,
    updatedFields,
    setUpdatedFields,
    reCalculateCWiseSum,
    clearUpdatedFields,
    editVendor,
    editBranch,
    newVendor,
    history,
    newBranch,
    setOperations,
    operations,
    branchChanged,
    vendorChanged,
    metaData
  } = invoiceDetailStore();

  const { columns = [], rows = [] } = data?.data?.processed_table;
  const existingColumn_names = data?.data?.processed_table?.columns?.map(
    ({ column_uuid, selected_column, column_order, ...rest }) =>
      rest?.column_name
  );
  const handleDropdownChange = (column_uuid, col_name) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    const { rows, columns } = copyObj?.data?.processed_table;
    columns?.forEach((col) => {
      if (col?.column_uuid == column_uuid) {
        col.column_name = col_name;
      }
    });
    queryClient.setQueryData(["combined-table", document_uuid], copyObj);
  };
  useEffect(() => {
    if (highlightAll == true) {
      let pushed = [];
      data?.data?.processed_table?.rows?.map((row) =>
        row?.cells?.map((cell) =>
          pushed.push({
            box: cell?.bounding_box,
            page_index: cell.page_index || 0
          })
        )
      );
      setBoundingBoxes(pushed);
    } else {
      setBoundingBoxes([]);
    }
  }, [highlightAll]);
  useEffect(() => {
    if (data?.data) {
      const extPriceColNum = data?.data?.processed_table?.columns?.findIndex(
        (col) => col.column_name == "Extended Price"
      );

      const totalExtendedPrice = data?.data?.processed_table?.rows?.reduce(
        (acc, row) => {
          const price = Number(row?.cells[extPriceColNum]?.text || 0);
          return acc + price;
        },
        0
      );

      setTotalExtendedPrice(totalExtendedPrice);
    }
  }, [reCalculateCWiseSum, history, setHistory, operations, data]);
  let calculatedsum = (
    totalExtendedPrce +
    metaData?.document_metadata?.added_taxes?.reduce((acc, it, i) => {
      return (acc += Number(it));
    }, 0) +
    metaData?.document_metadata?.added_fees?.reduce((acc, it, i) => {
      return (acc += Number(it));
    }, 0) -
    metaData?.document_metadata?.added_discounts?.reduce((acc, it, i) => {
      return (acc += Number(it));
    }, 0)
  ).toFixed(2);

  // Table Operations
  const saveHistory = () => {
    setHistory([
      ...history,
      {
        tableData: JSON.parse(JSON.stringify(data)),
        operations: [...operations]
      }
    ]);
  };

  const undoLastAction = () => {
    if (history.length === 0) return;

    const { tableData: lastTableData, operations: lastOperations } =
      history.pop();
    const lastOperation = lastOperations[lastOperations.length - 1];
    if (lastOperation?.type === "delete_row") {
      const deletedRowUuid = lastOperation.data.transaction_uuid;
      const restoredRow = lastTableData.data.processed_table.rows.find(
        (row) => row.transaction_uuid === deletedRowUuid
      );

      const updatedRows = [
        ...lastTableData.data.processed_table.rows,
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

      // setContextMenu({
      //   visible: false,
      //   position: { x: 0, y: 0 }
      // });
    }

    setOperations(lastOperations);
    setHistory(history);
  };

  const addEmptyRow = () => {
    saveHistory();
    let copyData = JSON.parse(JSON.stringify(data));
    let { rows, columns } = copyData?.data?.processed_table;
    let newRow = {
      cells: data?.data?.processed_table?.columns.map((column) => ({
        column_uuid: column?.column_uuid,
        text: "",
        actual_text: null,
        confidence: null,
        page_index: 0,
        row_uuid: uuidv4(),
        cell_uuid: uuidv4(),
        selected_column: column.selected_column
      })),
      row_order:
        data?.data?.processed_table?.rows[
          data?.data?.processed_table?.rows.length - 1
        ]?.row_order + 1 || 1,
      transaction_uuid: uuidv4()
    };
    let operation = {
      type: "create_row",
      operation_order: operations?.length + 1,
      data: {
        transaction_uuid: newRow.transaction_uuid,
        row_order: newRow.row_order,
        cells: newRow.cells
      }
    };
    setOperations([...operations, operation]);
    rows.push(newRow);
    console.log(copyData);
    queryClient.setQueryData(["combined-table", document_uuid], copyData);
  };
  return (
    <>
      {" "}
      <div className="w-full mt-1 border border-[#F0F0F0] shadow-sm rounded-md">
        <div className="w-full flex items-center justify-between pr-[1rem] border-b border-[#E0E0E0]">
          <p className="font-poppins font-semibold  p-3 text-base leading-6">
            Items
          </p>
          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-x-2">
              <p className=" font-poppins font-normal text-xs leading-4 text-[#000000]">
                Highlight
              </p>
              <Switch
                className="!bg-[#888888] data-[state=checked]:!bg-primary "
                checked={stopHovering}
                onCheckedChange={(v) => setStopHovering(v)}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <p className=" font-poppins font-normal text-xs leading-4 text-[#000000]">
                Highlight All
              </p>
              <Switch
                className="!bg-[#888888] data-[state=checked]:!bg-primary "
                checked={highlightAll}
                onCheckedChange={(v) => setHighlightAll(v)}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <p className=" font-poppins font-normal text-xs leading-4 text-[#000000]">
                Auto Calculate
              </p>
              <Switch className="!bg-[#888888] data-[state=checked]:!bg-primary " />
            </div>

            <CustomTooltip content={"Row Actions"}>

            <div className="relative">
              <div
                className="border  rounded-sm h-8 w-8 flex justify-center items-center cursor-pointer "
                onClick={() => setShowActionsPopup(!showActionsPopup)}
                >
                <img src={sort} alt="" className="h-[0.6rem]" />
              </div>
              
              {showActionsPopup && (
                <div
                  onMouseLeave={() => setShowActionsPopup(false)}
                  style={{ boxShadow: "4px 4px 8px 0px rgba(0, 0, 0, 0.12)" }}
                  className="absolute bg-white rounded-lg flex flex-col gap-y-1  p-2  !z-50 w-[15rem] right-0 top-8"
                >
                  <p
                    onClick={() => {
                      setViewDeleteColumn(!viewDeleteColumn);
                    }}
                    className={`${
                      viewDeleteColumn && "bg-primary text-white"
                    } cursor-pointer px-4 py-1.5 font-poppins font-normal text-xs rounded-sm`}
                  >
                    View Row Delete Button
                  </p>
                  <p
                    onClick={() => {
                      setViewVerificationColumn(!viewVerificationColumn);
                    }}
                    className={`${
                      viewVerificationColumn && "bg-primary text-white"
                    } cursor-pointer px-4 py-1.5 font-poppins font-normal text-xs rounded-sm`}
                  >
                    View Verification Button
                  </p>
                  <p
                    onClick={() => {
                      setViewShiftColumn(!viewShiftColumn);
                    }}
                    className={`${
                      viewShiftColumn && "bg-primary text-white"
                    } cursor-pointer px-4 py-1.5 font-poppins font-normal text-xs rounded-sm`}
                  >
                    View Row Shift Button
                  </p>
                </div>
              )}
            </div>
            </CustomTooltip>
            <CustomTooltip content={"Add Empty Row"}>
              <Button
                onClick={() => addEmptyRow()}
                className="bg-transparent border border-primary hover:bg-transparent w-[3.5rem] h-[1.75rem] font-poppins text-primary space-x-1 font-normal rounded-sm text-xs leading-4"
              >
                <span>+</span>
                <span>R</span>
              </Button>
            </CustomTooltip>
            <CustomTooltip content={"Add New Column"}>
            <Button className="bg-transparent border border-primary hover:bg-transparent w-[3.5rem] h-[1.75rem] font-poppins text-primary space-x-1 font-normal rounded-sm text-xs leading-4">
              <span>+</span>
              <span>C</span>
            </Button>
            </CustomTooltip>
            <CustomTooltip content={"Undo"}>


            <img
              src={undo}
              alt=""
              className="h-[1.25rem] ml-1 cursor-pointer"
              onClick={() => undoLastAction()}
              />
              </CustomTooltip>
          </div>
        </div>
        <div
          className={`flex items-center justify-between py-3 !text-[#121212] !font-poppins !font-semibold !text-base px-8 ${
            metaData?.document_metadata?.invoice_extracted_total ==
            calculatedsum
              ? "bg-green-100"
              : "bg-[#FFEEEF]"
          }`}
        >
          <p>Difference</p>
          <p>{calculatedsum}</p>
        </div>

        <div className="pb-2  overflow-hidden w-full">
          <Table className="w-full ">
            <TableBody
              onMouseLeave={() => {
                if (stopHovering) {
                  setBoundingBox({});
                  setHighlightRow(false);
                  setBoundingBoxes([]);
                }
              }}
            >
              <div className=" flex gap-x-2  px-0.5 sticky top-0 bg-white/80 z-20">
                {columns?.map(
                  ({
                    column_uuid,
                    column_name,
                    column_order,
                    selected_column
                  }) => {
                    return (
                      <TableCell
                        className="!w-[10rem] !max-w-[12rem]     flex items-center "
                        key={column_uuid}
                      >
                        <CustomDropDown
                          Value={column_name}
                          className={"!w-[rem]"}
                          triggerClassName={
                            "!max-w-[10rem] !h-[2.25rem] !min-w-[9.5rem]  "
                          }
                          data={headerNamesFormatter(
                            additionalData?.data
                              ?.processed_table_header_candidates
                          )?.filter(
                            (c) =>
                              !(
                                existingColumn_names?.includes(c?.label) &&
                                c.label !== column_name
                              )
                          )}
                          onChange={(c, item) => {
                            handleDropdownChange(column_uuid, c);
                          }}
                        />
                      </TableCell>
                    );
                  }
                )}
                <TableCell className=" !border-l  sticky w-[110px]   flex justify-center items-center font-poppins font-normal text-xs leading-4 bg-white/90 !z-30 right-0">
                  Actions
                </TableCell>
              </div>

              <div className=" flex flex-col gap-x-2  !max-h-[35.5rem]  px-0.5">
                {rows?.map((row, index) => {
                  return (
                    <div className="flex">
                      <TableRow
                        bordered
                        key={index}
                        className="flex w-full gap-x-2  mb-2  border-none"
                      >
                        {row?.cells?.map((cell, i) => {
                          return (
                            <TableCell
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                if (stopHovering) {
                                  if (cell.bounding_box == null) {
                                    setHoveredRow(true);
                                  } else {
                                    setHoveredRow(false);
                                  }
                                  setBoundingBox({
                                    box: cell?.bounding_box,
                                    page_index: cell?.page_index
                                  });

                                  let pushed = [];

                                  row.cells?.map((cell) =>
                                    pushed.push({
                                      box: cell?.bounding_box,
                                      page_index:
                                        cell?.bounding_box?.page_index || 0
                                    })
                                  );

                                  setBoundingBoxes(pushed);
                                  setHighlightRow(true);
                                  setHighlightAll(false);
                                }
                              }}
                              //   onContextMenu={(event) =>
                              //     handleRowRightClick(
                              //       event,
                              //       rowIndex,
                              //       cellIndex,
                              //       cell?.column_uuid,
                              //       cell?.cell_uuid,
                              //       item?.transaction_uuid
                              //     )
                              //   }
                              className="!w-[10rem] font-poppins font-normal text-sm leading-4 text-[#121212] !max-w-[12rem]  justify-center !z-10 border-b border-b-[#F6F6F6]   flex items-center  capitalize"
                              key={i}
                            >
                              {cell?.text || "--"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      <TableCell className="sticky w-[120px] border-l gap-x-4 flex justify-center items-center font-poppins font-normal text-xs leading-4 bg-white/90  right-0 !z-10">
                        {row?.item_master?.human_verified ? (
                          <img
                            src={approved}
                            alt=""
                            className="h-4 w-4 mt-[0.8px]"
                          />
                        ) : row?.item_master?.human_verified == false ? (
                          <img
                            src={unapproved}
                            alt=""
                            className="h-4 w-4 mt-[0.8px]"
                          />
                        ) : (
                          <ExclamationTriangleIcon className="h-4 w-4 mt-[0.8px]" />
                        )}
                        {viewDeleteColumn && (
                          <Trash2 className="h-4 w-4 text-[#1C1C1E]" />
                        )}
                        {viewShiftColumn && (
                          <div className="flex flex-col gap-y-1">
                            <ArrowUpFromLine className="h-4 w-4 text-[#1C1C1E]" />
                            <ArrowDownFromLine className="h-4 w-4 text-[#1C1C1E]" />
                          </div>
                        )}
                      </TableCell>
                    </div>
                  );
                })}
              </div>
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mt-8 mb-4 justify-end flex items-center">
        <Button className=" !h-[2.4rem] rounded-sm bg-transparent hover:bg-transparent font-poppins  font-normal text-sm leading-4 shadow-none text-[#000000] border-[0.125rem] border-primary">
          Auto Categorize
        </Button>
      </div>
      {metaData?.invoice_type !== "Summary Invoice" ? (
        <>
          <div className="flex gap-x-2 items-center  justify-between px-3">
            <div className="flex  items-center gap-x-2">
              <Button
                disabled={
                  Number(metaData?.document_metadata?.added_taxes?.at(-1)) === 0
                }
                className=" !h-[1.75rem] rounded-sm bg-transparent hover:bg-transparent font-poppins  font-normal text-xs leading-4 shadow-none flex gap-x-1 !text-[#348355] border-[0.1rem] border-primary"
              >
                <span>+</span>
                <span>Tax</span>
              </Button>
              <Button
                className=" !h-[1.75rem] rounded-sm bg-transparent hover:bg-transparent font-poppins  font-normal text-xs leading-4 shadow-none !text-[#348355] border-[0.1rem] border-primary"
                disabled={
                  Number(metaData?.document_metadata?.added_fees?.at(-1)) === 0
                }
              >
                <span>+</span> <span>Fees</span>
              </Button>
              <Button
                className=" !h-[1.75rem] rounded-sm bg-transparent hover:bg-transparent font-poppins  font-normal text-xs leading-4 shadow-none !text-[#348355] border-[0.1rem] border-primary"
                disabled={
                  Number(
                    metaData?.document_metadata?.added_discounts?.at(-1)
                  ) === 0
                }
              >
                <span>+</span> <span>Discount</span>
              </Button>
            </div>
            <div>
              <p className="text-[#121212] font-poppins  font-semibold text-sm leading-5 flex gap-x-2">
                <span className="flex gap-x-3 items-center">
                  <span>Sub Total</span> <span>:</span>{" "}
                </span>{" "}
                <span>$ {totalExtendedPrce}</span>
              </p>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default HumanVerificationTable;
