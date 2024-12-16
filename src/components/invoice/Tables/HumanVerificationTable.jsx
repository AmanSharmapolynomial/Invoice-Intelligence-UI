import approved from "@/assets/image/approved.svg";
import sort from "@/assets/image/sort.svg";
import unapproved from "@/assets/image/unapproved.svg";
import undo from "@/assets/image/undo.svg";
import { Button } from "@/components/ui/button";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@/components/ui/table";
import { headerNamesFormatter } from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { useEffect, useState } from "react";

const HumanVerificationTable = ({
  data,
  isLoading,
  additionalData,
  loadingAdditionalData,
  document_uuid
}) => {
  const [autoCalculate, setAutoCalculate] = useState(false);
  const [stopHovering, setStopHovering] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(false);

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
    newBranch,
    branchChanged,
    vendorChanged
  } = invoiceDetailStore();
  const { columns, rows } = data?.data?.processed_table;
  const existingColumn_names = data?.data?.processed_table?.columns?.map(
    ({ column_uuid, selected_column, column_order, ...rest }) =>
      rest?.column_name
  );

  const handleCheckboxChange = (column_uuid, val) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    const { rows, columns } = copyObj?.data?.processed_table;
    columns?.forEach((col) => {
      if (col?.column_uuid == column_uuid) {
        col.selected_column = val;
      }
    });
    queryClient.setQueryData(["combined-table", document_uuid], copyObj);
  };

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

  return (
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
          <div className="border rounded-sm h-8 w-8 flex justify-center items-center">
            <img src={sort} alt="" className="h-[0.6rem]" />
          </div>
          <Button className="bg-transparent border border-primary hover:bg-transparent w-[3.5rem] h-[1.75rem] font-poppins text-primary space-x-1 font-normal text-xs leading-4">
            <span>+</span>
            <span>R</span>
          </Button>
          <Button className="bg-transparent border border-primary hover:bg-transparent w-[3.5rem] h-[1.75rem] font-poppins text-primary space-x-1 font-normal text-xs leading-4">
            <span>+</span>
            <span>C</span>
          </Button>

          <img src={undo} alt="" className="h-[1.25rem] ml-1" />
        </div>
      </div>

      <div className="py-2  overflow-hidden w-full">
        <Table className="w-full ">
          <TableBody>
            <div className=" flex gap-x-2  px-0.5 sticky top-0 bg-white/80 z-50">
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
              <TableCell className="sticky w-[7rem] flex justify-center items-center font-poppins font-normal text-xs leading-4 bg-white/90 !z-30 right-0">
                Item Status
              </TableCell>
            </div>

            <div className=" flex flex-col gap-x-4  !max-h-[35.5rem]  px-0.5">
              {rows?.map((row, index) => {
                return (
                  <TableRow
                    bordered
                    key={index}
                    className="flex w-full gap-x-2   border-none"
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
                          onMouseLeave={() => {
                            if (stopHovering) {
                              setBoundingBox({});
                              setHighlightRow(false);
                              setBoundingBoxes([]);
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
                    <TableCell className="sticky w-[7rem] flex justify-center items-center font-poppins font-normal text-xs leading-4 bg-white/90  right-0 !z-10">
                      {row?.item_master?.human_verified ? (
                        <img src={approved} alt="" className="h-4 w-4" />
                      ) : (
                        <img src={unapproved} alt="" className="h-4 w-4" />
                      )}
                    </TableCell>
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

export default HumanVerificationTable;
