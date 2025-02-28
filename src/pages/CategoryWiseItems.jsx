import check_circle from "@/assets/image/check_circle.svg";
import no_items from "@/assets/image/no_items.svg";
import user_grey from "@/assets/image/user_grey.svg";
import user_white from "@/assets/image/user_white.svg";
import {
  useApproveCategoryVendorItems,
  useGetCategoryWiseVendor,
  useGetCategoryWiseVendorItems,
  useGetRemovedVendorItems,
  useRemoveVendorItem
} from "@/components/bulk-categorization/api";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/Custom/CustomInput";
import Loader from "@/components/ui/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { queryClient } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListX
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
const CategoryWiseItems = () => {
  const { category_id } = useParams();
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  const selected_vendor_id = searchParams.get("selected_vendor_id");
  let searchTerm=searchParams.get("search_term")||""
  let category_name = searchParams.get("category_name");
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  const inputRef = useRef();
  const { data: vendors, isLoading: loadingVendors } = useGetCategoryWiseVendor(
    { category_id }
  );
  const [selectedVendor, setSelectedVendor] = useState(
    vendors?.data?.find((v) => v?.vendor?.vendor_id == selected_vendor_id)
  );

  useEffect(() => {
    setSelectedVendor(
      vendors?.data?.find((v) => v?.vendor?.vendor_id == selected_vendor_id)
    );
  }, [vendors]);

  const [saving, setSaving] = useState();
  const { data: items, isLoading: loadingItems } =
    useGetCategoryWiseVendorItems({
      category_id,
      vendor_id: selectedVendor?.vendor?.vendor_id,
      page,
      page_size
    });
  const { data: removedItems, isLoading: loadingRemovedItems } =
    useGetRemovedVendorItems({
      category_id,
      vendor_id: selectedVendor?.vendor?.vendor_id
    });
  const { mutate: removeItem, isPending: removingItem } = useRemoveVendorItem();
  const navigate = useNavigate();
  const { mutate: approveVendorItems, isPending: approvingVendorItems } =
    useApproveCategoryVendorItems();

  const saveAndNextHandler = () => {
    const removedItemsIDs =
      removedItems?.data?.length > 0
        ? removedItems?.data?.map((ri) => ri?.item_uuid)
        : [];

    let item_uuids =
      items?.data?.items
        ?.filter((it) => !(removedItemsIDs?.includes(it?.item_uuid)))
        ?.map((it) => it.item_uuid) || [];



    if (item_uuids?.length > 0) {
      setSaving(true);
      approveVendorItems(item_uuids, {
        onSuccess: (data) => {
          toast.success(data?.message);
          setSaving(false);
          queryClient.invalidateQueries({ queryKey: ["category-wise-items"] });
          updateParams({search_term:""})
        },
        onError: (data) => {
          toast.error(data?.message);
          setSaving(false);
        }
      });
    }

    if (item_uuids?.length == 0) {
      if (page < items?.total_pages) {
        setSaving(false);
        updateParams({
          page: Number(page) + 1
        });
      } else {
        setSaving(false);
        navigate(
          `/items-categorization/${category_id}/${selectedVendor?.vendor?.vendor_id}?category_name=${category_name}&page=${page}&selected_vendor_id=${selected_vendor_id}`
        );
      }
    }
  };
let timer;
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();
      const isEditable =
        document.activeElement.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select";
      if (e.key == "/") {
     clearTimeout(timer)
       timer= setTimeout(() => {
          inputRef.current.focus();
          updateParams({search_term:""})
        }, 200);
      }

      if (e.altKey && e.key == "n") {
        saveAndNextHandler();
      }
      if (e.altKey && e.key == "r") {
        if (selectedVendor) {
          navigate(
            `/items-categorization/${category_id}/${selectedVendor?.vendor?.vendor_id}?category_name=${category_name}&page=${page}&selected_vendor_id=${selected_vendor_id}`
          );
        }
      }
      if (isEditable && inputRef.current.focus && /^[0-9]$/?.test(e.key)) {
        inputRef.current.blur();
        let matchedItemIndex = items?.data?.items.findIndex(
          (item, i) => i == Number(e.key)
        );
        if (matchedItemIndex > -1) {
          removeItem(
            {
              item_uuid: items?.data?.items[matchedItemIndex]?.item_uuid
            },
            {
              onSuccess: (data) => {
                toast.success(
                  items?.data?.items[matchedItemIndex]?.item_description +
                    " removed successfully"
                );
              },
              onError: (data) => {
                toast.error(data?.message);
              }
            }
          );
        }
      }

      if (e.key == "Enter" && searchTerm !== "") {
        if (inputRef.current) {
          setSelectedVendor(
            vendors?.data?.filter((v) =>
              v?.vendor?.vendor_name
                ?.toLowerCase()
                ?.includes(searchTerm?.toLowerCase())
            )[0]
          );
        }
      }

      if (!isEditable) {
        if (e.key === "ArrowLeft") {
          if (page > 1) {
            updateParams({
              page: page - 1
            });
          }
        }
        if (e.key === "ArrowRight") {
          if (page < items?.total_pages) {
            updateParams({
              page: Number(page) + 1
            });
          }
        }

        let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (!removingItem) {
          if (numbers.includes(Number(e.key))) {
            inputRef.current.blur();
            let matchedItemIndex = items?.data?.items.findIndex(
              (item, i) => i == Number(e.key)
            );
            if (matchedItemIndex > -1) {
              removeItem(
                {
                  item_uuid: items?.data?.items[matchedItemIndex]?.item_uuid
                },
                {
                  onSuccess: (data) => {
                    toast.success(
                      items?.data?.items[matchedItemIndex]?.item_description +
                        " removed successfully"
                    );
                  },
                  onError: (data) => {
                    toast.error(data?.message);
                  }
                }
              );
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    items,
    removedItems,
    selectedVendor,
    searchParams,
    selected_vendor_id,
    searchTerm
  ]);

  return (
    <div className="py-4 ">
      {/* Navbar */}
      <div className="flex items-center gap-x-2 w-full md:px-8 px-4">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => {
            navigate(`/bulk-categorization`);
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
        <Toaster />

        {/* Header */}
        <div className="mt-8 flex items-center justify-between border-b-2  pb-2 border-b-[#E0E0E0]">
          <div>
            <p className="font-poppins font-semibold capitalize text-xl leading-8 text-black">
              Here are all the items under the category {category_name}{" "}
            </p>
            <p className="font-poppins capitalize text-primary font-medium text-[0.9rem] leading-6 ">
              You can change the category of any item by clicking on the
              particular menu item
            </p>
          </div>
          <div className="flex items-center gap-x-4 font-normal ">
            {!loadingItems && items?.data?.items?.length > 0 && (
              <p className="rounded-3xl h-[2.3rem] px-4 flex items-center justify-center font-poppins font-medium text-sm leading-5 text-black border border-[#E0E0E0]">
                Total Items : {items?.total_records}
              </p>
            )}

            <Button
              disabled={
                saving ||
                removingItem ||
                !selectedVendor ||
                items?.data?.items?.length == 0
              }
              className="rounded-sm font-normal leading-6 w-[9rem] h-[2.3rem] text-sm  text-white"
              onClick={() => {
                saveAndNextHandler();
              }}
            >
              {saving ? "Saving..." : " Save & Next"}
            </Button>
          </div>
        </div>

        {/* Vendor List and Items Section */}

        <div className="flex gap-x-4 items-start h-full">
          <div className="w-[40%]  bg-[#FAFAFA] flex items-center justify-center h-full py-8">
            <div className="w-[90%] h-full">
              <p className="font-poppins font-semibold text-base leading-6 pl-3 text-[#3D3D3D]">
                Vendors List
              </p>
              <div className="mt-4">
                <CustomInput
                  showIcon={true}
                  variant="search"
                  placeholder="Search Vendor"
                  
                  debounceTime={500}
                  value={searchTerm}
                  ref={inputRef}
                  onChange={(value) => {
                    updateParams({search_term:value});
                  }}
                  onKeyDown={(e) => {}}
                  className="min-w-72 max-w-96 border border-gray-200 relative   focus:!ring-0 focus:!outline-none remove-number-spinner"
                />
              </div>

              <div className="md:h-[42vh] 2xl:h-[50vh]  mt-2  overflow-auto">
                {loadingVendors ? (
                  <div className="flex w-full flex-col gap-y-2">
                    {[0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11]?.map((_, index) => (
                      <Skeleton className={"w-full h-[2.5rem]"} />
                    ))}
                  </div>
                ) : (
                  vendors?.data?.length > 0 &&
                  vendors?.data
                    ?.filter((v) =>
                      v?.vendor?.vendor_name
                        ?.toLowerCase()
                        ?.includes(searchTerm?.toLowerCase())
                    )
                    ?.sort((a, b) =>
                      a?.vendor?.vendor_id === selectedVendor?.vendor?.vendor_id
                        ? -1
                        : 1
                    )
                    ?.map((vendor, index) => {
                      let isSelected =
                        selectedVendor?.vendor?.vendor_id ===
                        vendor?.vendor?.vendor_id;
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedVendor(vendor);
                            updateParams({
                              page: 1,
                              selected_vendor_id: vendor?.vendor?.vendor_id
                            });
                          }}
                          className={`${isSelected && "bg-primary"}  
                  flex items-center justify-between cursor-pointer min-h-[2.5rem] max-h-[5rem] break-words truncate gap-x-4 mt-4 px-4 ${
                    isSelected && "sticky top-0"
                  }`}
                        >
                          <div className="font-poppins flex items-center gap-x-4 py-2 capitalize font-normal text-sm leading-5 text-black">
                            {isSelected ? (
                              <img src={user_white} alt="" />
                            ) : (
                              <img src={user_grey} alt="" />
                            )}
                            <span
                              className={` ${
                                isSelected && "text-white"
                              } text-[#222222] font-poppins truncate break-word max-w-56 whitespace-normal font-normal text-[0.9rem] leading-5`}
                            >
                              {" "}
                              {vendor?.vendor?.vendor_name}
                            </span>
                          </div>
                          <span
                            className={`${
                              isSelected ? "text-white" : "text-[#AEAEAE]"
                            }   font-poppins font-medium text-xs leading-4`}
                          >
                            {vendor?.items_count}
                          </span>
                        </div>
                      );
                    })
                )}
              </div>
              <div className="border-b  border-b-[#D9D9D9] mt-3" />

              <div
                onClick={() => {
                  if (selectedVendor) {
                    navigate(
                      `/items-categorization/${category_id}/${selectedVendor?.vendor?.vendor_id}?category_name=${category_name}&page=${page}&selected_vendor_id=${selected_vendor_id}`
                    );
                  }
                }}
                className="  flex items-center justify-between  cursor-pointer h-[2.5rem] gap-x-4 mt-2 pl-4 xl:pr-[1.7rem] md:pr-[1.1rem] "
              >
                <div className="font-poppins flex items-center gap-x-[0.70rem] capitalize font-normal text-sm leading-5 text-black">
                  <ListX className="text-[#F15156]" />
                  <span
                    className={` ${
                      false && "text-white"
                    } text-[#222222] font-poppins font-normal text-[0.9rem] leading-5`}
                  >
                    {" "}
                    Removed Items
                  </span>
                </div>
                <span
                  className={`${
                    false ? "text-white" : "text-[#AEAEAE]"
                  }   font-poppins font-medium text-xs leading-4`}
                >
                  {removedItems?.total_records || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="w-[60%]  h-full pt-8 relative">
            <div className="flex flex-col gap-y-2 md:min-h-[30rem] 2xl:min-h-[35rem] max-h-[40rem]">
              {removingItem ||
                (saving && (
                  <Loader className="absolute top-[40%]  right-[50%]" />
                ))}
              {loadingItems ? (
                <div className="flex flex-col gap-y-4 h-[50vh]">
                  {new Array(10).fill(0).map((_, index) => {
                    return (
                      <Skeleton key={index} className={"w-full h-[2.5rem]"} />
                    );
                  })}
                </div>
              ) : (
                <>
                  {!selectedVendor || loadingItems ? (
                    <div className="flex items-center justify-center    md:min-h-[25rem] 2xl:min-h-[30rem] h-[30rem] w-full">
                      <div className="flex flex-col justify-center items-center gap-y-4">
                        <img
                          src={no_items}
                          alt=""
                          className="h-[70%] w-[60%] mt-8"
                        />
                        <p className="text-[#040807] font-poppins font-normal  text-[0.9rem] leading-5">
                          To proceed, kindly choose a vendor from the side
                          navigation menu.
                        </p>
                      </div>
                    </div>
                  ) : (
                    items?.data?.items?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={` ${
                            removedItems?.data?.length > 0 &&
                            removedItems?.data?.find(
                              (it) => it?.item_uuid == item?.item_uuid
                            ) &&
                            "border-[#E4897B]"
                          } ${
                            removingItem ||
                            (saving && "opacity-50 border-opacity-50")
                          } border rounded-sm w-full px-4 border-[#D9D9D9] min-h-[2.5rem] flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-x-4">
                            <span className="font-poppins font-normal text-xs leading-5 capitalize flex items-center gap-x-2 text-black">
                              <span className="font-poppins font-semibold">
                                {index}.
                              </span>{" "}
                              <span>{item?.item_description}</span>
                            </span>
                          </div>
                          {!(
                            removedItems?.data?.length > 0 &&
                            removedItems?.data?.find(
                              (it) => it?.item_uuid == item?.item_uuid
                            )
                          ) && (
                            <img
                              src={check_circle}
                              alt=""
                              className="h-5 w-5"
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>
            {loadingItems ? (
              <div className="flex items-center justify-center 2xl:mt-6 md:mt-2">
                <div className="grid grid-cols-5 gap-x-3 px-4">
                  {new Array(5).fill(0).map((_, index) => {
                    return (
                      <Skeleton
                        key={index}
                        className={"w-[2.5rem] h-[2.5rem]"}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              items?.data?.items?.length > 0 && (
                <div className="2xl:mt-6 md:mt-2">
                  {/* i need to  show max at 2 and then ellipssis and then at the end */}

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem className="!text-sm font-semibold cursor-pointer">
                        <PaginationLink
                          className={"border border-[#F1F1F1] rounded-lg"}
                          onClick={() => {
                            updateParams({
                              page: 1
                            });
                          }}
                        >
                          <ChevronsLeft className="h-[1rem] w-[1rem]" />
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="!text-sm font-semibold cursor-pointer">
                        <PaginationLink
                          className={"border border-[#F1F1F1] rounded-lg"}
                          onClick={() => {
                            if (page > 1) {
                              updateParams({
                                page: page - 1
                              });
                            }
                          }}
                        >
                          <ChevronLeft />
                        </PaginationLink>
                      </PaginationItem>
                      {new Array(items?.total_pages)
                        ?.fill(0)
                        ?.slice(0, items?.total_pages > 2 ? 2 : 1)
                        ?.map((_, index) => {
                          return (
                            <PaginationItem
                              key={index}
                              className="!text-sm font-semibold cursor-pointer"
                            >
                              <PaginationLink
                                className={`${
                                  page == index + 1 &&
                                  "bg-primary hover:bg-primary !text-white"
                                } text-[#000000] dark:text-[#F6F6F6] border  rounded-lg font-poppins font-semibold text-sm border-[#F1F1F1]`}
                                active={index + 1 === page}
                                onClick={() => {
                                  updateParams({
                                    page: Number(index) + 1
                                  });
                                }}
                              >
                                {index + 1}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                      {items?.total_pages > 2 && (
                        <PaginationEllipsis className="!text-sm font-semibold font-poppins " />
                      )}
                      {items?.total_pages > 3 &&
                        page > 2 &&
                        page < items?.total_pages && (
                          <PaginationItem className="!text-sm font-semibold cursor-pointer">
                            <PaginationLink
                              className={`${
                                true &&
                                "bg-primary !text-white hover:bg-primary"
                              } text-[#000000] border border-[#F1F1F1] rounded-lg font-poppins font-semibold text-sm dark:text-[#F6F6F6]`}
                              onClick={() => {
                                updateParams({
                                  page: items?.total_pages
                                });
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )}
                      {items?.total_pages > 1 && (
                        <PaginationItem className="!text-sm font-semibold cursor-pointer">
                          <PaginationLink
                            className={`${
                              page == items?.total_pages &&
                              "bg-primary !text-white hover:bg-primary"
                            } text-[#000000] border border-[#F1F1F1] rounded-lg font-poppins font-semibold text-sm dark:text-[#F6F6F6]`}
                            onClick={() => {
                              updateParams({
                                page: items?.total_pages
                              });
                            }}
                          >
                            {items?.total_pages}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      <PaginationItem className="!text-sm font-semibold cursor-pointer">
                        <PaginationLink
                          className={"border border-[#F1F1F1] rounded-lg"}
                          onClick={() => {
                            if (page < items?.total_pages) {
                              updateParams({
                                page: Number(page) + 1
                              });
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
                            updateParams({
                              page: items?.total_pages
                            });
                          }}
                        >
                          <ChevronsRight />
                        </PaginationLink>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )
            )}
          </div>
        </div>

        <p className="text-[#666666] font-poppins font-normal text-base leading-5 mt-4 2xl:absolute 2xl:bottom-4 2xl:pb-4 bottom-0">
          Note: Once done, click on “Next” to proceed. You can categorises the
          deselected items later.
        </p>
      </div>
    </div>
  );
};

export default CategoryWiseItems;
