import approved from "@/assets/image/approved.svg";
import unApproved from "@/assets/image/unApproved.svg";
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
import { useEffect, useRef } from "react";
import { useUpdateVendorItemMaster } from "../api";
import { Skeleton } from "@/components/ui/skeleton";

const VendorItemMasterTable = ({ isLoading, extraHeaders }) => {
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
          if (!isGoodDocument && fiv_items?.length == 0) {
            setIsGoodDocument(true);
          }
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
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow
          className={`min-h-12 bg-gray-100 rounded-sm border grid grid-cols-${
            isLoading
              ? 4
              : fiv_current_item?.required_columns?.filter(
                  (c) => c !== "category"
                )?.length +
                extraHeaders?.length +
                1
          } items-center`}
        >
          {isLoading ? (
            <>
              {["item_code", "item_description"]?.map((it, index) => (
                <TableCell
                  key={index}
                  className={`${
                    it == "item_description" ? "col-span-2" : "col-span-1"
                  }  border-r flex  items-center h-full border-b-0 font-poppins font-semibold text-sm`}
                >
                  {keysCapitalizer(it)}
                </TableCell>
              ))}
            </>
          ) : (
            fiv_current_item?.required_columns
              ?.filter((c) => c !== "category")
              ?.map((it, index) => (
                <TableCell
                  key={index}
                  className={`${
                    it == "item_description" ? "col-span-2" : "col-span-1"
                  }  border-r flex  items-center h-full border-b-0 font-poppins font-semibold text-sm`}
                >
                  {keysCapitalizer(it)}
                </TableCell>
              ))
          )}
          {extraHeaders?.map((it, index) => (
            <TableCell
              key={index}
              className=" border-r justify-center border-b-0 h-full flex items-center font-poppins font-semibold text-sm "
            >
              {it}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          className={`min-h-12 rounded-sm grid grid-cols-${
            isLoading
              ? 4
              : fiv_current_item?.required_columns?.filter(
                  (c) => c !== "category"
                )?.length +
                extraHeaders?.length +
                1
          } items-center`}
        >
          {isLoading ? (
            <>
              {[0, 1, 2]?.map((i) => (
                <TableCell
                  key={i}
                  className={`${
                    i == 1 ? "col-span-2" : "col-span-1"
                  } border-r border-b ${i == 0 && "border-l"} border-t-0`}
                >
                  <Skeleton className={"w-full h-5"} />
                </TableCell>
              ))}
            </>
          ) : (
            fiv_current_item?.required_columns
              ?.filter((c) => c !== "category")
              ?.map((col, i) => {
                return (
                  <TableCell
                    key={i}
                    className={`${
                      col == "item_description" ? "col-span-2" : "col-span-1"
                    } border-r border-b ${i == 0 && "border-l"} border-t-0`}
                  >
                    <Textarea
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
         {!isLoading&& <TableCell className="flex items-center justify-center border-r border-b h-full">
            <Button
              disabled={updatingVendorItemMaster}
              className="border-none bg-transparent hover:bg-transparent shadow-none"
              onClick={() => approveHandler()}
            >
              {fiv_current_item?.human_verified ? (
                <img src={approved} alt="" className="h-5 w-5" />
              ) : (
                <img src={unApproved} alt="" className="h-5 w-5" />
              )}
            </Button>
          </TableCell>}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default VendorItemMasterTable;
