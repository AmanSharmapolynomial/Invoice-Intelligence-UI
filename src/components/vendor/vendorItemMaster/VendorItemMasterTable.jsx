import approved from "@/assets/image/approved.svg";
import unApproved from "@/assets/image/unapproved.svg";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { keysCapitalizer } from "@/lib/helpers";
import fastItemVerificationStore from "@/store/fastItemVerificationStore";
import { useEffect, useRef, useState } from "react";
import { useUpdateVendorItemMaster } from "../api";
import { Skeleton } from "@/components/ui/skeleton";

const VendorItemMasterTable = ({ isLoading, extraHeaders, similarItems }) => {
  const {
    mutate: updateVendorItemMaster,
    isPending: updatingVendorItemMaster
  } = useUpdateVendorItemMaster();
  const {
    fiv_current_item,
    setFIVCurrentItem,
    setIsGoodDocument,
    isGoodDocument,
    fiv_items,
    setFIVItems
  } = fastItemVerificationStore();
  useEffect(() => {}, [fiv_current_item]);

  const textAreaRefs = useRef([]);

  useEffect(() => {
    setTimeout(() => {
      if (textAreaRefs.current[0]) {
        textAreaRefs.current[0].focus();
      }
    }, 100);
  }, [isLoading]);

  const approveHandler = () => {
    updateVendorItemMaster(
      {
        item_uuid: fiv_current_item?.item_uuid,
        data: { human_verified: true }
      },
      {
        onSuccess: () => {
          const updatedItems = fiv_items.map((item) =>
            item.item_uuid === fiv_current_item?.item_uuid
              ? { ...item, human_verified: true }
              : item
          );

          setFIVItems(updatedItems);
          setFIVCurrentItem({ ...fiv_current_item, human_verified: true });
        }
      }
    );
  };
  const [cols, setCols] = useState(3);

  useEffect(() => {
    setCols(Number(fiv_current_item?.required_columns?.length) + 1);
  }, [fiv_current_item]);

  return (
    <Table className="mt-4">
      <TableHeader className="w-full ">
        <TableRow
          className={`min-h-12 rounded-sm  items-center ${
            isLoading
              ? "grid grid-cols-3"
              : `grid  grid-cols-${cols}`
          } ${
            fiv_current_item?.required_columns?.length == 0 &&
            "grid grid-cols-3"
          } relative border`}
        >
          {isLoading ? (
            ["item_code", "item_description"]?.map((it, index) => (
              <TableCell
                key={index}
                className={` border-r w-72 flex items-center h-full border-b-0 font-poppins font-semibold text-sm`}
              >
                {keysCapitalizer(it)}
              </TableCell>
            ))
          ) : !(fiv_current_item?.required_columns?.length > 0) ? (
            <>
              {["item_code", "item_description"]?.map((it, index) => (
                <TableCell
                  key={index}
                  className={` border-r flex items-center h-full border-b-0 font-poppins font-semibold text-sm`}
                >
                  {keysCapitalizer(it)}
                </TableCell>
              ))}
            </>
          ) : (
            fiv_current_item?.required_columns?.map((it, index) => (
              <TableCell
                key={index}
                className={`${
                  it === "item_description" ? "col-span-1" : "col-span-1"
                }   border-r flex items-center h-full border-b-0 font-poppins font-semibold text-sm`}
              >
                {keysCapitalizer(it)}
              </TableCell>
            ))
          )}
          {extraHeaders?.map((it, index) => (
            <TableCell
              key={index}
              className="border-r justify-center col-span-1 border-b-0 h-full flex items-center font-poppins font-semibold text-sm"
            >
              {it}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {similarItems?.data?.matching_items?.find(
          (item) =>
            item["human_verified"] &&
            item["item_uuid"] == fiv_current_item?.item_uuid
        ) && (
          <p className=" top-0 w-fit mt-1 ml-1  bg-red-400 text-white rounded-sm px-2 py-1 text-xs ">
            Duplicate
          </p>
        )}
        <TableRow
          className={`min-h-12 rounded-sm grid ${
            isLoading ? "grid-cols-3" : `grid-cols-${cols || 3}`
          }  items-center relative`}
        >
          {isLoading ? (
            <>
              {[0, 1, 2]?.map((i) => (
                <TableCell
                  key={i}
                  className={`${
                    i == 1 ? "col-span-1" : "col-span-1"
                  } border-r border-b ${i == 0 && "border-l"} border-t-0`}
                >
                  <Skeleton className={"w-full h-5"} />
                </TableCell>
              ))}
            </>
          ) : (
            fiv_current_item?.required_columns?.map((col, i) => {
              return (
                <TableCell
                  key={i}
                  className={`${
                    col == "item_description" ? "col-span-1" : "col-span-1"
                  } border-r border-b ${i == 0 && "border-l"} border-t-0`}
                >
                  <Textarea
                    disabled={col == "category"}
                    className="disabled:!text-black disabled:!bg-none disabled:opacity-100 "
                    ref={(el) => (textAreaRefs.current[i] = el)}
                    value={fiv_current_item?.line_item?.[col]?.text || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      let copyObj = JSON.parse(
                        JSON.stringify(fiv_current_item)
                      );
                      copyObj.line_item[col].text = val;
                      setFIVCurrentItem(copyObj);
                    }}
                  />
                </TableCell>
              );
            })
          )}
          {!isLoading && (
            <TableCell className="flex items-center justify-center border-r border-b h-full">
              <Button
                disabled={() => {
                  if (!fiv_current_item?.human_verified) {
                    updatingVendorItemMaster();
                  }
                }}
                className="border-none bg-transparent hover:bg-transparent shadow-none"
                onClick={() => approveHandler()}
              >
                {fiv_current_item?.human_verified ? (
                  <img src={approved} alt="" className="h-5 w-5" />
                ) : (
                  <img src={unApproved} alt="" className="h-5 w-5" />
                )}
              </Button>
            </TableCell>
          )}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default VendorItemMasterTable;
