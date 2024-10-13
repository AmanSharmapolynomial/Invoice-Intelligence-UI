import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomDropDown from "@/components/ui/CustomDropDown";
import CustomInput from "@/components/ui/CustomInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import no_data from "@/assets/image/no-data.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { keysCapitalizer } from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import { BadgeCheck, Edit, Eye, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import {
  useDeleteVendorItemMaster,
  useGetAdditionalData,
  useUpdateVendorItemMaster
} from "../api";
import { vendorStore } from "../store/vendorStore";
import { Modal, ModalDescription } from "@/components/ui/Modal";

const VendorItemMasterTable = ({ data = [], isLoading = false }) => {
  const { masterVendor, setMasterVendor, checkedVendors, setCheckedVendors } =
    vendorStore();
  const [currentDesc, setCurrentDesc] = useState(null);
  const [editableRow, setEditableRow] = useState(null);
  const [rowUUID, setRowUUID] = useState(null);
  const [open, setOpen] = useState(false);
  const {
    mutate: updateVendorItemMaster,
    isPending: updatingVendorItemMaster
  } = useUpdateVendorItemMaster();
  const {
    mutate: deleteItemMasterVendor,
    isPending: deletingVendorItemMaster
  } = useDeleteVendorItemMaster();
  const { data: additionalData, isLoading: loadingAdditionalData } =
    useGetAdditionalData();

  // Funtions
  const handleCheckedChange = (uuid, check) => {
    if (check) {
      setCheckedVendors([...checkedVendors, uuid]);
    } else {
      let filtered = checkedVendors?.filter((item) => item != uuid);
      setCheckedVendors(filtered);
    }
  };

  const handleUpdateVendorItemMaster = (uuid, data) => {
    updateVendorItemMaster(
      { item_uuid: uuid, data },
      {
        onSuccess: () => {
          setEditableRow(null);
          return "success";
        }
      }
    );
  };

  const handleVendorItemMasterDelete = (type) => {
    deleteItemMasterVendor(
      { item_uuid: rowUUID, type },
      {
        onSuccess: () => {
          setRowUUID(null);
          setCurrentDesc(null);
          setOpen(false);
        }
      }
    );
  };
  return (
    <div className="w-full overflow-auto   ">
      <div className="w-full overflow-auto ">
        {isLoading ? (
          new Array(11).fill(11)?.map((_, index) => {
            return (
              <TableRow key={index} className="flex w-full">
                {new Array(7).fill(7)?.map((_, ind) => {
                  return (
                    <TableHead
                      key={ind}
                      className={`flex  border-r !text-left items-center min-w-[10%]  justify-center  !font-semibold !text-gray-800  border-b  bg-gray-200 h-14`}
                    >
                      <Skeleton className={"w-96 h-5"} />
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })
        ) : (
          <Table className="flex flex-col   box-border  scrollbar min-h-[65vh] !w-full ">
            <TableHeader className="min-h-14">
              <TableRow className="flex  text-base  !border-none !w-full !pb-0 !mb-0 ">
                {data?.data?.required_columns?.map((item, index) => (
                  <TableHead
                    key={index}
                    className={`${
                      item == "item_description"
                        ? "!min-w-[20%] "
                        : item == "category" && "!min-w-[15%]"
                    } border-r !text-left items-center !pl-6  flex  !font-semibold !text-gray-800    bg-gray-200 min-w-[10%] h-14 `}
                  >
                    {keysCapitalizer(item)}
                  </TableHead>
                ))}

                {[
                  "Verified By",
                  "Approved",
                  "Select Master",
                  "Select Item",
                  "Invoice",
                  "Actions"
                ]?.map((item, i) => (
                  <TableHead
                    key={i}
                    className={`flex  border-r !text-left items-center min-w-[9.16%]  justify-center  !font-semibold !text-gray-800  border-b  bg-gray-200 h-14`}
                  >
                    {item}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="!w-full">
              <div className="!w-full flex-1">
                {data?.data?.items?.length == 0 ? (
                  <div className="w-full flex items-center justify-center flex-1">
                    <img src={no_data} alt="" className="max-h-[50vh]" />
                  </div>
                ) : (
                  data?.data?.items?.map((item, ind) => {
                    return (
                      <TableRow
                        key={item?.item_uuid}
                        className="!border-none !h-14 w-full flex !flex-1"
                      >
                        {data?.data?.required_columns?.map((col, index) => (
                          <TableCell
                            key={index}
                            className={`${
                              col === "item_description"
                                ? "!min-w-[20%]"
                                : col == "category"
                                ? "!min-w-[15%]"
                                : "min-w-[10%]"
                            }  !border-b  flex  border-r !min-h-14 !text-left items-center justify-start pl-6 !font-normal !text-gray-800   `}
                          >
                            {editableRow == item?.item_uuid ? (
                              <>
                                {col === "category" ? (
                                  <CustomDropDown
                                    Value={item[col]["category_id"]}
                                    className="!min-w-[300px] !max-w-[400px]"
                                    triggerClassName={"bg-gray-100 !min-w-full"}
                                    contentClassName={"bg-gray-100 !min-w-full"}
                                    data={additionalData?.data?.category_choices?.map(
                                      ({ name, category_id }) => {
                                        let obj = {
                                          label: name,
                                          value: category_id
                                        };
                                        return obj;
                                      }
                                    )}
                                    onChange={(val, valObj) => {
                                      let copyObj = { ...data };
                                      let { items } = data?.data;

                                      items[ind][col]["category_id"] = val;
                                      items[ind][col]["name"] = valObj?.label;

                                      queryClient.setQueryData(
                                        ["vendor-item-master"],
                                        copyObj
                                      );
                                    }}
                                    placeholder="None"
                                    searchPlaceholder="Category"
                                  />
                                ) : (
                                  <CustomInput
                                    value={
                                      col == "category"
                                        ? item[col]["name"]
                                        : item[col]
                                    }
                                    onChange={(val) => {
                                      let copyObj = { ...data };
                                      let { items } = data?.data;

                                      items[ind][col] = val;

                                      queryClient.setQueryData(
                                        ["vendor-item-master"],
                                        copyObj
                                      );
                                    }}
                                  />
                                )}
                              </>
                            ) : //   Values only
                            col == "category" ? (
                              item[col]["name"]
                            ) : (
                              item[col]
                            )}
                          </TableCell>
                        ))}

                        <TableCell className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[9.16%] border-b  ">
                          {item?.["verified_by"]?.username}
                        </TableCell>
                        <TableCell className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[9.16%] border-b  ">
                          {item?.["human_verified"] == true ? (
                            <BadgeCheck
                              className="text-primary  h-5 w-5"
                              disabled={updatingVendorItemMaster}
                            />
                          ) : (
                            <BadgeCheck
                              className="text-gray-800 h-5 w-5 cursor-pointer"
                              onClick={() => {
                                handleUpdateVendorItemMaster(
                                  item?.item_uuid,
                                  item
                                );
                                let copyObj = { ...data };
                                let { items } = data?.data;
                                items[ind]["human_verified"] = true;
                                queryClient.setQueryData(
                                  ["vendor-item-master"],
                                  copyObj
                                );
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[9.16%] border-b  ">
                          <RadioGroup
                            value={masterVendor}
                            onValueChange={(val) => {
                              setMasterVendor(val);
                              if (checkedVendors?.includes(item?.item_uuid)) {
                                setCheckedVendors(
                                  checkedVendors.filter(
                                    (it) => it !== item?.item_uuid
                                  )
                                );
                              }
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                onClick={() => setMasterVendor("")}
                                value={item?.item_uuid}
                                id={`branch-${item?.item_uuid}`}
                              />
                            </div>
                          </RadioGroup>
                        </TableCell>
                        <TableCell className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[9.16%] border-b  ">
                          <Checkbox
                            checked={checkedVendors?.includes(item?.item_uuid)}
                            disabled={
                              masterVendor == "" ||
                              masterVendor == item?.item_uuid
                            }
                            className="h-4 w-4"
                            onCheckedChange={(val) =>
                              handleCheckedChange(item?.item_uuid, val)
                            }
                          />
                        </TableCell>
                        <TableCell className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[9.16%] border-b  ">
                          <Eye className="text-primary h-5 w-5 cursor-pointer" />
                        </TableCell>
                        <TableCell className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[9.16%] border-b  ">
                          {editableRow !== item?.item_uuid ? (
                            <Button
                              className="hover:bg-transparent bg-transparent shadow-none"
                              onClick={() => setEditableRow(item?.item_uuid)}
                              disabled={updatingVendorItemMaster}
                            >
                              <Edit className="h-5 w-5 text-primary" />
                            </Button>
                          ) : (
                            <Button
                              disabled={updatingVendorItemMaster}
                              className="hover:bg-transparent bg-transparent shadow-none"
                              onClick={() =>
                                handleUpdateVendorItemMaster(
                                  item?.item_uuid,
                                  item
                                )
                              }
                            >
                              <Save className="h-5 w-5 text-primary" />
                            </Button>
                          )}

                          <Button
                            onClick={() => {
                              setOpen(true);
                              setCurrentDesc(item?.["item_description"]);
                              setRowUUID(item?.item_uuid);
                            }}
                            className="hover:bg-transparent bg-transparent shadow-none"
                            disabled={updatingVendorItemMaster}
                          >
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </div>
            </TableBody>
          </Table>
        )}
      </div>
      <Modal
        open={open}
        setOpen={setOpen}
        className=""
        titleClassName={"border-b pb-1"}
        title={"Delete Item Master"}
      >
        <ModalDescription>
          <div className="flex flex-col gap-y-4 overflow-scroll">
            <div className="mb-2 py-2">
              <p className="font-semibold px-1 ">
                Are you sure to delete{" "}
                <span className="px-1">{currentDesc}</span> ?
              </p>
            </div>
            <div className=" flex   justify-end gap-x-2 overflow-auto">
              <Button
                className="font-normal"
                disabled={deletingVendorItemMaster}
                onClick={() => handleVendorItemMasterDelete("soft")}
              >
                {deletingVendorItemMaster ? (
                  <>
                    Deleting
                    <LoaderIcon className="ml-2" />
                  </>
                ) : (
                  " Soft Delete"
                )}
              </Button>
              <Button
                disabled={deletingVendorItemMaster}
                onClick={() => handleVendorItemMasterDelete("hard")}
                className="bg-red-500 hover:bg-red-500/90 font-normal"
              >
                Hard Delete
              </Button>
              <Button
                className="font-normal bg-transparent text-gray-700 border hover:bg-gray-100"
                disabled={deletingVendorItemMaster}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </ModalDescription>
      </Modal>
    </div>
  );
};

export default VendorItemMasterTable;
