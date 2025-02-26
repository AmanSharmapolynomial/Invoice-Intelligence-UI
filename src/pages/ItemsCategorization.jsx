import {
  useGetRemovedVendorItems,
  useUpdateBulkItemsCategory
} from "@/components/bulk-categorization/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdditionalData } from "@/components/vendor/api";
import { categoryNamesFormatter, headerNamesFormatter } from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useParams, useSearchParams } from "react-router-dom";

const ItemsCategorization = () => {
  const { category_id, vendor_id } = useParams();
  const [searchParams] = useSearchParams();
  let category_name = searchParams.get("category_name");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { mutate: updateCategoriesInBulk, isPending } =
    useUpdateBulkItemsCategory();
  const [updating, setUpdating] = useState(false);
  const { data, isLoading } = useGetRemovedVendorItems({
    category_id,
    vendor_id
  });
  const { data: additionalData, isLoading: loadingAdditionalData } =
    useGetAdditionalData();
  const handleCheckboxChange = (value, item) => {
    if (value == true) {
      if (!selectedItems?.find((it) => it.item_uuid == item.item_uuid)) {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      setSelectedItems(
        selectedItems?.filter((it) => it.item_uuid !== item?.item_uuid)
      );
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/^[0-9]$/?.test(e.key)) {
        let matchedItem = data?.data?.[Number(e.key)];

        if (!matchedItem) return;

        setSelectedItems((prevSelectedItems) => {
          return prevSelectedItems.some(
            (it) => it?.item_uuid === matchedItem?.item_uuid
          )
            ? prevSelectedItems.filter(
                (it) => it?.item_uuid !== matchedItem?.item_uuid
              )
            : [...prevSelectedItems, matchedItem];
        });
      }
      if (e.altKey && e.key == "Enter") {
        let payload = selectedItems?.map((it) => {
          let obj = {
            item_uuid: it?.item_uuid,
            category_id: selectedCategory
          };
          return obj;
        });

       
        if (payload?.length > 0) {
          setUpdating(true);
          updateCategoriesInBulk(
            { items_category: [...payload] },
            {
              onSuccess: (data) => {
                setUpdating(false);
                toast.success(data?.message);
                setSelectedCategory(null)
                setSelectedItems([]);
                queryClient.invalidateQueries({queryKey:['removed-vendor-items']})
              }
            }
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data]);

  return (
    <div className="py-4 md:px-16 px-8">
      <Toaster />
      {/* Navbar */}
      <div>
        <Link
          to={"/"}
          className="font-bold !text-[1.25rem]  font-poppins text-color/900 dark:text-[#FFFFFF]"
        >
          Invoice Intelligence Platform
        </Link>
      </div>
      <div className="mt-8 flex items-center justify-between border-b-2  pb-2 border-b-[#E0E0E0]">
        <div>
          <p className="font-poppins font-semibold capitalize text-xl leading-8 text-black">
            Here are all the Non {category_name} Items{" "}
          </p>
          <p className="font-poppins capitalize text-primary font-medium text-[0.9rem] leading-6 ">
            You can change the category of any item by clicking on the
            particular menu item
          </p>
        </div>
        <div className="flex items-center gap-x-4 font-normal ">
          <Button
            className="rounded-sm font-normal leading-6 w-[9rem] h-[2.3rem] text-sm  text-white"
            onClick={() => {}}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="w-full flex h-full gap-x-2 mt-8 md:px-4 2xl:px-10">
        <div className="w-[60%] px-8  ">
          <div className="flex flex-col gap-y-3 md:max-h-[30rem] 2xl:max-h-[35rem] px-4 py-2 overflow-auto ">
            {isLoading ? (
              <div className="flex flex-col gap-y-2 ">
                {new Array(10).fill(Math.random(0, 10))?.map((_, index) => (
                  <Skeleton key={index} className={"w-full h-[2.5rem]"} />
                ))}
              </div>
            ) : (
         data?.data?.length>0&&     data?.data?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className=" flex justify-between items-center px-4 border border-[#D9D9D9] rounded-sm min-h-[2.5rem]"
                  >
                    <span className="font-poppins text-xs flex items-center gap-x-3 font-normal leading-4 text-[#888888]">
                      {" "}
                      <span className="font-semibold text-black">{index}.</span>
                      <span>{item?.item_description}</span>
                    </span>
                    <Checkbox
                      className="border-[#666667] border-[1.33px]"
                      checked={selectedItems?.includes(item)}
                      onCheckedChange={(v) => {
                        handleCheckboxChange(v, item);
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="w-[40%]  flex items-center justify-center 2xl:h-[40rem] md:max-h-[35rem]">
          <div className="bg-[#FAFAFA] border border-[#ECECEC] w-[100%] max-w-lg pt-5 flex flex-col justify-between pb-8 rounded-2xl h-full relative">
            <div>
              <div className="w-full flex justify-center items-center">
                <p className="flex items-center gap-x-1">
                  <span className="text-black font-poppins font-medium text-sm">
                    Change
                  </span>
                  <span className="text-primary font-poppins font-medium text-sm">
                    Category
                  </span>
                </p>
              </div>
              <div className="px-4 mt-6 mb-4">
                <p className="font-poppins font-normal text-sm leading-5">
                  Items Selected
                </p>

                <div className="mt-4 border w-full p-2 border-[#D9D9D9] min-h-[10rem] max-h-[20rem]  py-2 rounded-sm flex  flex-wrap items-start justify-start    gap-2">
                  {selectedItems?.map((it) => {
                    return (
                      <p className="w-fit px-2 rounded-md bg-primary h-fit  border border-primary py-1  flex items-center gap-x-2 ">
                        <span className="text-[#F5F5F5] text-xs">
                          {it?.item_description}
                        </span>
                        <X
                          className="text-white h-4 w-4 cursor-pointer"
                          onClick={() =>
                            setSelectedItems(
                              selectedItems?.filter(
                                (item) => item?.item_uuid !== it?.item_uuid
                              )
                            )
                          }
                        />
                      </p>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <p className="font-poppins font-normal text-sm leading-5 text-black">
                    Select New Category
                  </p>

                  <div className="mt-2 ">
                    <CustomDropDown
                      Value={selectedCategory}
                      data={
                        loadingAdditionalData
                          ? []
                          : [
                              ...categoryNamesFormatter(
                                additionalData?.data?.category_choices
                              ),
                              { label: "NA", value: "NA" },
                              { label: "None", value: null }
                            ]
                      }
                      onChange={(v, obj) => {
                        setSelectedCategory(obj.value);
                      }}
                      triggerClassName={
                        "!shadow-sm !bg-white  border-opacity-50"
                      }
                    />
                  </div>
                  <p className="text-[#666666] font-poppins font-normal text-[0.7rem] max-w-xs leading-4 mt-4">
                    Note: The updated category will be displayed under the new
                    category directly.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex  items-center justify-center  mt-4 ">
              <div className="flex items-center gap-x-4">
                <Button
                  disabled={updating}
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedItems([]);
                  }}
                  className="w-[8.8rem] rounded-sm font-poppins text-[0.7rem] leading-4  font-normal shadow-none bg-[#F1F1F1] hover:bg-[#F1F1F1] text-[#2E2E2E]"
                >
                  Cancel
                </Button>
                <Button
                  disabled={updating}
                  className="w-[8.8rem] rounded-sm font-poppins text-[0.7rem] font-normal leading-4 text-white"
                >
                  {updating ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[#666666] font-poppins font-normal text-base leading-5 mt-4 absolute 2xl:bottom-10 bottom-2">
        Note: Once done, click on “Next” to proceed. You can categorises the
        deselected items later.
      </p>
    </div>
  );
};

export default ItemsCategorization;
