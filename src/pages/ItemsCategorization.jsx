import no_unchecked_items from "@/assets/image/no_unchecked_items.svg";
import {
  useGetRemovedVendorItems,
  useUpdateBulkItemsCategory
} from "@/components/bulk-categorization/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useGetAdditionalData } from "@/components/vendor/api";
import { categoryNamesFormatter } from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { queryClient } from "@/lib/utils";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";

const ItemsCategorization = () => {
  const { category_id, vendor_id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  let page_number = searchParams.get("page_number") || 1;
  let page = searchParams.get("page");
  let page_size = searchParams.get("page_size") || 10;
  let category_name = searchParams.get("category_name");
  const updateParams = useUpdateParams();
  let selected_vendor_id = searchParams.get("selected_vendor_id");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showShortCuts, setShowShortCuts] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const { mutate: updateCategoriesInBulk, isPending } =
    useUpdateBulkItemsCategory();
  let mode = searchParams.get("mode");
  const [updating, setUpdating] = useState(false);
  const { fiv_removed_items_mode } = invoiceDetailStore();
  const { data, isLoading } = useGetRemovedVendorItems({
    category_id,
    vendor_id: selected_vendor_id,
    mode,
    page: page_number,
    page_size
  });
  const { data: additionalData, isLoading: loadingAdditionalData } =
    useGetAdditionalData();
  const dropDownRef = useRef();
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
  const updateHandler = () => {
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
            setSelectedCategory(null);
            setSelectedItems([]);
            queryClient.invalidateQueries({
              queryKey: ["removed-vendor-items"]
            });
          }
        }
      );
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();
      const isEditable =
        document.activeElement.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select";
      if (/^[0-9]$/?.test(e.key)) {
        let matchedItem =mode=="vendor"?data?.data?.removed_items[Number(e.key)]: data?.data?.[Number(e.key)];

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
      if (!isEditable) {
        if (e.key === "ArrowLeft") {
          if (page_number > 1) {
            updateParams({
              page_number: Number(page_number) - 1
            });
          }
        }
        if (e.key === "ArrowRight") {
          if (page_number < data?.total_pages) {
            updateParams({
              page_number: Number(page_number) + 1
            });
          }
        }
      }
      if (e.altKey && e.key == "Enter") {
        if (!data?.data || !(Object?.keys(data?.data)?.length == 0)) {
          if (selectedCategory !== null && selectedItems?.length > 0) {
            updateHandler();
          }
        } else {
          navigate("/bulk-categorization");
        }
      }
      if (e.altKey && e.key == "c") {
        dropDownRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    data,
    updateHandler,
    selected_vendor_id,
    category_id,
    category_name,
    searchParams
  ]);

  return (
    <div className="py-4 ">
      <Toaster />
      {/* Navbar */}
      <div className="flex items-center gap-x-2 w-full md:px-8 px-4">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => {
            navigate(
              `/category-wise-items/${category_id}?category_name=${category_name}&page=${page}&selected_vendor_id=${selected_vendor_id}&mode=${mode}`
            );
          }}
        />
        <Link
          to={"/"}
          className="font-bold !text-[1.25rem]  font-poppins text-color/900 dark:text-[#FFFFFF]"
        >
          Invoice Intelligence Platform
        </Link>
      </div>

      <div className=" md:px-16 px-8">
        <div className="mt-8 flex items-center justify-between border-b-2  pb-2 border-b-[#E0E0E0]">
          <div>
            <p className="font-poppins font-semibold capitalize text-xl leading-8 text-black">
              Here are all the Non{" "}
              <span className="font-extrabold text-primary">
                {category_name}
              </span>{" "}
              Items {mode == "vendor" && "under"}{" "}
              {mode == "vendor" && (
                <span className="font-extrabold text-primary">{`${data?.data?.vendor?.vendor_name}`}</span>
              )}
            </p>
            <p className="font-poppins capitalize text-primary font-medium text-[0.9rem] leading-6 ">
              You can change the category of any item by clicking on the
              particular menu item
            </p>
          </div>
          <div className="flex items-center gap-x-4 font-normal ">
            <Button
              disabled={
                !data?.data ||
                !(
                  Object?.keys(
                    mode == "vendor"
                      ? data?.data?.removed_items?.length > 0
                      : data?.data?.length > 0
                  ) == 0
                )
              }
              className="rounded-sm font-normal leading-6 w-[9rem] h-[2.3rem] text-sm  text-white"
              onClick={() => {
                navigate("/bulk-categorization");
              }}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="w-full flex h-full gap-x-2 md:mt-0 2xl:mt-8  md:px-4 2xl:px-10">
          <div className="w-[60%] px-8  ">
            {(mode == "vendor"
              ? data?.data?.removed_items?.length > 0
              : data?.data?.length > 0) && (
              <TooltipProvider>
                <Tooltip open={showShortCuts} className="">
                  <TooltipTrigger className=""></TooltipTrigger>
                  <TooltipContent className="bg-white border  shadow-sm px-4 flex items-center ml-20  gap-x-1  h-10">
                    <span className="mr-2 text-gray-800 text-sm ">
                      Press <kbd>0-9</kbd> to check or uncheck items.
                    </span>
                    <span onClick={() => setShowShortCuts(false)}>
                      <X className="text-gray-800 h-[1rem] absolute w-[1rem] top-1 right-1 cursor-pointer" />
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div className="flex flex-col  relative gap-y-2 md:h-[30rem] 2xl:h-[35rem] px-4 pb-2 overflow-auto ">
              {" "}
              {isLoading ? (
                <div className="flex flex-col gap-y-4  md:mt-4 ">
                  {new Array(10).fill(Math.random(0, 11))?.map((_, index) => (
                    <Skeleton key={index} className={"w-full h-[2.25rem]"} />
                  ))}
                </div>
              ) : (
                  mode == "vendor"
                    ? data?.data?.removed_items?.length > 0
                    : data?.data?.length > 0
                ) ? (
                (mode == "vendor"
                  ? data?.data?.removed_items
                  : data?.data
                )?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`${
                        selectedItems?.includes(item) && "border-primary"
                      } flex justify-between items-center relative  px-4 border border-[#D9D9D9] rounded-sm min-h-[2.5rem]`}
                    >
                      <span className="font-poppins text-xs flex items-center gap-x-3 font-normal leading-4 text-[#888888]">
                        {" "}
                        <span className="font-semibold text-black">
                          {index}.
                        </span>
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
              ) : (
                <div className="w-full flex items-center justify-center flex-col h-full gap-y-8  md:max-h-[35rem] 2xl:h-[40rem] ">
                  <img
                    src={no_unchecked_items}
                    alt=""
                    className="h-[60%] w-[60%]"
                  />
                  <p className="font-poppins font-normal text-[0.9rem] leading-5 text-[#040807] max-w-xl text-center ">
                    All items have been successfully mapped, and there are no
                    additional items remaining in the list.
                  </p>
                </div>
              )}
            </div>
            <div className="my-4">
              {isLoading ? (
                <div className="flex items-center justify-center 2xl:mt-10 md:mt-4">
                  <div className="grid grid-cols-6 gap-x-3 px-4">
                    {new Array(6).fill(0).map((_, index) => {
                      return (
                        <Skeleton
                          key={index}
                          className={"w-[2.25rem] h-[2.25rem]"}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem className="!text-sm font-semibold cursor-pointer">
                      <PaginationLink
                        className={"border border-[#F1F1F1] rounded-lg"}
                        onClick={() => {
                          if (selectedItems?.length > 0) {
                            toast("Please update the selected items.", {
                              icon: "⚠️"
                            });
                          } else {
                            updateParams({
                              page_number: 1
                            });
                          }
                        }}
                      >
                        <ChevronsLeft className="h-[1rem] w-[1rem]" />
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="!text-sm font-semibold cursor-pointer">
                      <PaginationLink
                        className={"border border-[#F1F1F1] rounded-lg"}
                        onClick={() => {
                          if (selectedItems?.length > 0) {
                            toast("Please update the selected items.", {
                              icon: "⚠️"
                            });
                          } else {
                            if (page_number > 1) {
                              updateParams({
                                page_number: page_number - 1
                              });
                            }
                          }
                        }}
                      >
                        <ChevronLeft />
                      </PaginationLink>
                    </PaginationItem>
                    {new Array(data?.total_pages)
                      ?.fill(0)
                      ?.slice(0, data?.total_pages > 2 ? 2 : 1)
                      ?.map((_, index) => {
                        return (
                          <PaginationItem
                            key={index}
                            className="!text-sm font-semibold cursor-pointer"
                          >
                            <PaginationLink
                              className={`${
                                page_number == index + 1 &&
                                "bg-primary hover:bg-primary !text-white"
                              } text-[#000000] dark:text-[#F6F6F6] border  rounded-lg font-poppins font-semibold text-sm border-[#F1F1F1]`}
                              active={index + 1 === page_number}
                              onClick={() => {
                                if (selectedItems?.length > 0) {
                                  toast("Please update the selected items.", {
                                    icon: "⚠️"
                                  });
                                } else {
                                  updateParams({
                                    page_number: Number(index) + 1
                                  });
                                }
                              }}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                    {data?.total_pages > 2 && (
                      <PaginationEllipsis className="!text-sm font-semibold font-poppins " />
                    )}
                    {data?.total_pages > 3 &&
                      page_number > 2 &&
                      page_number < data?.total_pages && (
                        <PaginationItem className="!text-sm font-semibold cursor-pointer">
                          <PaginationLink
                            className={`${
                              true && "bg-primary !text-white hover:bg-primary"
                            } text-[#000000] border border-[#F1F1F1] rounded-lg font-poppins font-semibold text-sm dark:text-[#F6F6F6]`}
                            onClick={() => {
                              if (selectedItems?.length > 0) {
                                toast("Please update the selected items.", {
                                  icon: "⚠️"
                                });
                              } else {
                                updateParams({
                                  page_number: data?.total_pages
                                });
                              }
                            }}
                          >
                            {page_number}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                    {data?.total_pages > 1 && (
                      <PaginationItem className="!text-sm font-semibold cursor-pointer">
                        <PaginationLink
                          className={`${
                            page_number == data?.total_pages &&
                            "bg-primary !text-white hover:bg-primary"
                          } text-[#000000] border border-[#F1F1F1] rounded-lg font-poppins font-semibold text-sm dark:text-[#F6F6F6]`}
                          onClick={() => {
                            if (selectedItems?.length > 0) {
                              toast("Please update the selected items.", {
                                icon: "⚠️"
                              });
                            } else {
                              updateParams({
                                page_number: data?.total_pages
                              });
                            }
                          }}
                        >
                          {data?.total_pages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem className="!text-sm font-semibold cursor-pointer">
                      <PaginationLink
                        className={"border border-[#F1F1F1] rounded-lg"}
                        onClick={() => {
                          if (selectedItems?.length > 0) {
                            toast("Please update the selected items.", {
                              icon: "⚠️"
                            });
                          } else {
                            if (page_number < data?.total_pages) {
                              updateParams({
                                page_number: Number(page_number) + 1
                              });
                            }
                          }
                        }}
                      >
                        <ChevronRight />
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="!text-sm font-semibold cursor-pointer">
                      <PaginationLink
                        className={"border border-[#F1F1F1] rounded-lg"}
                        onClick={() => {
                          if (selectedItems?.length > 0) {
                            toast("Please update the selected items.", {
                              icon: "⚠️"
                            });
                          } else {
                            updateParams({
                              page_number: data?.total_pages
                            });
                          }
                        }}
                      >
                        <ChevronsRight />
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>

          <div className="w-[40%]  flex items-center justify-center 2xl:h-[42rem] md:max-h-[55rem]">
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

                  <div className="mt-4 border w-full p-2 border-[#D9D9D9] min-h-[10rem] max-h-[20rem]  py-2 rounded-sm   flex-wrap items-start justify-start    gap-2">
                    {selectedItems?.map((it) => {
                      return (
                        <p className="w-fit px-2 rounded-md bg-primary h-fit  border border-primary py-1  mb-2 mr-2 inline-flex items-center gap-x-2 ">
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
                    <TooltipProvider className="">
                      <Tooltip open={showShortCuts} className="">
                        <TooltipTrigger className="w-full">
                          {" "}
                          <div className="mt-2 ">
                            <CustomSelect
                              value={selectedCategory}
                              placeholder="Select Category"
                              showSearch={true}
                              contentClassName="max-h-[15rem]"
                              ref={dropDownRef}
                              data={
                                [
                                  ...categoryNamesFormatter(
                                    additionalData?.data?.category_choices
                                  ),
                                  { label: "NA", value: "NA" },
                                  { label: "None", value: null }
                                ] || []
                              }
                              onSelect={(v) => {
                                setSelectedCategory(v);
                              }}
                              triggerClassName={
                                "!shadow-sm !bg-white  !font-poppins !font-normal !text-sm border-opacity-50"
                              }
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white border relative shadow-sm px-4 flex items-center  gap-x-1  h-10">
                          <span className="mr-2 text-gray-800 text-sm ">
                            Press <kbd>Alt</kbd> + <kbd>C</kbd> to Focus
                          </span>
                          <span onClick={() => setShowShortCuts(false)}>
                            <X className="text-gray-800 h-[1rem] absolute w-[1rem] top-1 right-1 cursor-pointer" />
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

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

                  <TooltipProvider>
                    <Tooltip open={showShortCuts}>
                      <TooltipTrigger>
                        {" "}
                        <Button
                          disabled={updating}
                          onClick={() => updateHandler()}
                          className="w-[8.8rem] rounded-sm font-poppins text-[0.7rem] font-normal leading-4 text-white"
                        >
                          {updating ? "Updating..." : "Update"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white border relative shadow-sm px-4 flex items-center  gap-x-1  h-10">
                        <span className="mr-2 text-gray-800 text-sm ">
                          Press <kbd>Alt</kbd> + <kbd>Enter </kbd> to update
                        </span>
                        <span onClick={() => setShowShortCuts(false)}>
                          <X className="text-gray-800 h-[1rem] absolute w-[1rem] top-1 right-1 cursor-pointer" />
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[#666666] font-poppins font-normal text-base leading-5 mt-4 2xl:absolute 2xl:bottom-4 2xl:pb-4 bottom-0">
          Note: Once done, click on “Next” to proceed.
        </p>
      </div>
    </div>
  );
};

export default ItemsCategorization;
