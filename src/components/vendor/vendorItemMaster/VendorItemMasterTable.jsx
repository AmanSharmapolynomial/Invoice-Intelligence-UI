import no_data from "@/assets/image/no-data.svg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomDropDown from "@/components/ui/CustomDropDown";
import CustomInput from "@/components/ui/CustomInput";
import { Modal, ModalDescription } from "@/components/ui/Modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
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
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { BadgeCheck, Edit, Eye, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import {
  useDeleteVendorItemMaster,
  useGetAdditionalData,
  useUpdateVendorItemMaster
} from "../api";
import { vendorStore } from "../store/vendorStore";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Switch } from "@/components/ui/switch";

const VendorItemMasterTable = ({
  data = [],
  isLoading = false,
  showPdfs,
  setShowPdfs,
  setViewIconIndex,
  viewIconIndex,
  extraHeaders,
  setItem_uuid
}) => {
  const { masterVendor, setMasterVendor, checkedVendors, setCheckedVendors } =
    vendorStore();
  const [currentDesc, setCurrentDesc] = useState(null);
  const [saveError, setSaveError] = useState(false);
  const [editableRow, setEditableRow] = useState(null);
  const [updateHumanVerified, setUpdateHumanVerified] = useState({
    status: null,
    index: -1,
    key:null
  });
  const [rowUUID, setRowUUID] = useState(null);
  const updateParams = useUpdateParams();
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

  const handleUpdateVendorItemMaster = (uuid, payload, ind) => {

    setSaveError(true);
    updateVendorItemMaster(
      { item_uuid: uuid, data: payload },
      {
        onSuccess: () => {
          setSaveError(false);
          setEditableRow(null);
          if(updateHumanVerified.key=='human_verified'){
            setUpdateHumanVerified((prevState) => ({
              ...prevState,
              status: true
            }));
          }
      
        },
        onError: (e) => {
          setSaveError(false);
        }
      }
    );
  };
  useEffect(() => {
    if (updateHumanVerified?.status == true&& updateHumanVerified?.key=="human_verified") {
      let copyObj = {...data};
      let { items } = copyObj.data;

      items[updateHumanVerified.index].human_verified = true;

      queryClient.setQueryData(["vendor-item-master"], copyObj);
    } else if (updateHumanVerified?.status == false) {
      let copyObj = {...data};
      let { items } = copyObj.data;
      items[updateHumanVerified.index].human_verified = false;
      queryClient.setQueryData(["vendor-item-master"], copyObj);
    }
  }, [updateHumanVerified]);
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
        {loadingAdditionalData || isLoading ? (
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
                        ? "!min-w-[20%] w-full"
                        : item == "category" && "!min-w-[15%] w-full"
                    } border-r !text-left w-full items-center !pl-6  flex  !font-semibold !text-gray-800    bg-gray-200 min-w-[10%] h-14 `}
                  >
                    {keysCapitalizer(item)}
                  </TableHead>
                ))}

                {extraHeaders?.map((item, i) => (
                  <TableHead
                    key={i}
                    className={`flex  border-r w-full !text-left items-center min-w-[9.16%]  justify-center  !font-semibold !text-gray-800  border-b  bg-gray-200 h-14`}
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
                            }  !border-b  flex w-full border-r !min-h-14 !text-left items-center justify-start pl-6 !font-normal !text-gray-800   `}
                          >
                            {editableRow == item?.item_uuid ? (
                              <>
                                {col === "category" ? (
                                  <CustomDropDown
                                    Value={item?.[col]?.["category_id"]}
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

                                      let catObj = {
                                        category_id: val,
                                        name: valObj?.label
                                      };

                                      items[ind][col] = catObj;
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
                                        ? item?.[col]?.["name"]
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
                              item?.[col]?.["name"]
                            ) : (
                              item[col]
                            )}
                          </TableCell>
                        ))}

                        {extraHeaders?.includes("Verified By") && (
                          <TableCell className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[9.16%] border-b  ">
                            {item?.["verified_by"]?.username}
                          </TableCell>
                        )}
                        <TableCell className="flex w-full border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[9.16%] border-b  ">
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
                                  { ...item, human_verified: true },
                                  ind
                                );
                                setUpdateHumanVerified(prevState => ({
                                  ...prevState,
                                  index: ind,
                                  key:"human_verified"
                                }));
                                
                              }}
                            />
                          )}
                        </TableCell>
                        {extraHeaders.includes("Category Review") && (
                          <TableCell className="flex w-full border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[9.16%] border-b  ">
                            <Switch
                              value={item?.["category_review_required"]}
                              onCheckedChange={(val) => {
                                let copyObj = JSON.parse(JSON.stringify(data));
                                let { items } = data?.data;

                                items[0]["category_review_required"] = val;

                                queryClient.setQueryData(
                                  ["vendor-item-master"],
                                  copyObj
                                );
                              }}
                            />
                          </TableCell>
                        )}
                        {extraHeaders.includes("Select Master") && (
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
                        )}
                        {extraHeaders.includes("Select Item") && (
                          <TableCell className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[9.16%] border-b  ">
                            <Checkbox
                              checked={checkedVendors?.includes(
                                item?.item_uuid
                              )}
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
                        )}

                        {extraHeaders.includes("Invoice") && (
                          <TableCell className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800  !min-w-[9.16%] border-b  ">
                            {!showPdfs ? (
                              <Button
                                // disabled={viewIconIndex == 0}
                                onClick={() => {
                                  setShowPdfs((prev) => !prev);
                                  setItem_uuid(item?.item_uuid);
                                  // updateParams({ branch: branch_id });
                                  setViewIconIndex(ind + 1);
                                }}
                                className="min-w-12 bg-transparent border-none shadow-none hover:bg-transparent"
                              >
                                <Eye className="h-5 w-5 text-primary cursor-pointer" />
                              </Button>
                            ) : viewIconIndex == ind + 1 ? (
                              <EyeClosedIcon
                                className="h-5 w-5 text-primary cursor-pointer"
                                onClick={() => {
                                  updateParams({ document_uuid: undefined });
                                  setViewIconIndex(0);
                                  setShowPdfs((prev) => !prev);
                                }}
                              />
                            ) : (
                              <Button
                                onClick={() => {
                                  setShowPdfs((prev) => !prev);
                                  setViewIconIndex(0);
                                }}
                                disabled={viewIconIndex !== ind + 1}
                                className=" !p-0 bg-transparent border-none shadow-none hover:bg-transparent"
                              >
                                <Eye className="h-5 w-5 text-primary cursor-pointer" />
                              </Button>
                            )}
                          </TableCell>
                        )}

                        <TableCell className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[9.16%] w-full border-b  ">
                          {editableRow !== item?.item_uuid ? (
                            <Button
                              className="hover:bg-transparent bg-transparent shadow-none"
                              onClick={() => setEditableRow(item?.item_uuid)}
                              disabled={saveError || updatingVendorItemMaster}
                            >
                              <Edit className="h-5 w-5 text-primary" />
                            </Button>
                          ) : (
                            <Button
                              disabled={saveError || updatingVendorItemMaster}
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
                            disabled={saveError || updatingVendorItemMaster}
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
