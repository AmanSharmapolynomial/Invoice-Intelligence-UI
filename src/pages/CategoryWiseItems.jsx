import user_grey from "@/assets/image/user_grey.svg";
import user_white from "@/assets/image/user_white.svg";
import {
  useApproveCategoryVendorItems,
  useGetCategoryWiseVendor,
  useGetCategoryWiseVendorItems,
  useGetRemovedItemsCount,
  useGetRemovedVendorItems,
  useRemoveCategoryItemsInBulk,
  useRemoveVendorItem
} from "@/components/bulk-categorization/api";
import ItemsListingWithoutScrollingApproval from "@/components/bulk-categorization/ItemsListingWithoutScrollingApproval";
import ItemsListingWithScrollingApproval from "@/components/bulk-categorization/ItemsListingWithScrollingApproval";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/Custom/CustomInput";
import { Label } from "@/components/ui/label";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { queryClient } from "@/lib/utils";
import { ArrowLeft, ListX, X } from "lucide-react";
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
  let searchTerm = searchParams.get("search_term") || "";
  let category_name = searchParams.get("category_name");
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  let mode = searchParams.get("mode");
  const { mutate: removeItemsInBulk, isPending: removingItemsInBulk } =
    useRemoveCategoryItemsInBulk();

  const inputRef = useRef();
  const { data: vendors, isLoading: loadingVendors } = useGetCategoryWiseVendor(
    { category_id }
  );
  const [unCheckedItems, setUnCheckedItems] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(
    vendors?.data?.length > 0
      ? vendors?.data?.find((v) => v?.vendor?.vendor_id == selected_vendor_id)
      : null
  );
  const [selectedVendorIndex, setSelectedVendorIndex] = useState(
    vendors?.data?.length > 0
      ? vendors?.data?.findIndex(
          (v) => v?.vendor?.vendor_id == selected_vendor_id
        )
      : 0
  );
  const [checkedItems, setCheckedItems] = useState([]);
  const [scrollingMode, setScrollingMode] = useState(false);

  const { data: removedItemsCount, isLoading: loadingRemovedItemsCount } =
    useGetRemovedItemsCount({
      mode,
      vendor_id: selectedVendor?.vendor?.vendor_id,
      category_id
    });
  useEffect(() => {
    if (vendors?.data?.length > 0) {
      setSelectedVendor(
        vendors?.data?.find((v) => v?.vendor?.vendor_id == selected_vendor_id)
      );
      setSelectedVendorIndex(
        vendors?.data?.findIndex(
          (v) => v?.vendor?.vendor_id == selected_vendor_id
        ) || 0
      );
    }
  }, [selected_vendor_id]);

  const [saving, setSaving] = useState();
  const { data: items, isLoading: loadingItems } =
    useGetCategoryWiseVendorItems({
      category_id,
      vendor_id: selectedVendor?.vendor?.vendor_id || null,
      page: page || 1,
      page_size: page_size || 10,
      scrollingMode: scrollingMode
    });
  const { data: removedItems, isLoading: loadingRemovedItems } =
    useGetRemovedVendorItems({
      category_id,
      vendor_id: selectedVendor?.vendor?.vendor_id,
      page,
      page_size
    });
  const { mutate: removeItem, isPending: removingItem } = useRemoveVendorItem();
  const navigate = useNavigate();
  const { mutate: approveVendorItems, isPending: approvingVendorItems } =
    useApproveCategoryVendorItems();

  const saveAndNextHandler = () => {
    if (scrollingMode) {
      setSaving(true);
      if (unCheckedItems?.length > 0) {
        removeItemsInBulk(
          { item_uuids: unCheckedItems },
          {
            onSuccess: () => {
              setUnCheckedItems([]);
              setSaving(false);
              if (!checkedItems?.length > 0) {
                queryClient.invalidateQueries({
                  queryKey: ["category-wise-items"]
                });
                queryClient.invalidateQueries({
                  queryKey: ["removed-items-count"]
                });
                queryClient.invalidateQueries({
                  queryKey: ["removed-vendor-items"]
                });
              }
              {
                if (checkedItems?.length > 0) {
                  approveVendorItems(checkedItems, {
                    onSuccess: (data) => {
                      setUnCheckedItems([]);
                      toast.success(data?.message);
                      setSaving(false);
                      queryClient.invalidateQueries({
                        queryKey: ["category-wise-items"]
                      });
                      queryClient.invalidateQueries({
                        queryKey: ["removed-items-count"]
                      });
                      queryClient.invalidateQueries({
                        queryKey: ["removed-vendor-items"]
                      });
                    },
                    onError: (data) => {
                      toast.error(data?.message);
                      setSaving(false);
                    }
                  });
                }
              }
            }
          }
        );
      }
      if (checkedItems?.length > 0) {
        approveVendorItems(checkedItems, {
          onSuccess: (data) => {
            setUnCheckedItems([]);
            toast.success(data?.message);
            setSaving(false);
            queryClient.invalidateQueries({
              queryKey: ["category-wise-items"]
            });
            queryClient.invalidateQueries({
              queryKey: ["removed-items-count"]
            });
            queryClient.invalidateQueries({
              queryKey: ["removed-vendor-items"]
            });
          },
          onError: (data) => {
            toast.error(data?.message);
            setSaving(false);
          }
        });
      }
    } else {
      const removedItemsIDs =
        mode == "vendor"
          ? removedItems?.data?.removed_items?.length > 0
            ? removedItems?.data?.removed_items?.map((ri) => ri?.item_uuid)
            : []
          : removedItems?.data?.length > 0
          ? removedItems?.data?.map((ri) => ri?.item_uuid)
          : [];

      let item_uuids =
        items?.data?.items
          ?.filter((it) => !unCheckedItems?.includes(it?.item_uuid))
          ?.map((it) => it.item_uuid)
          ?.filter((it) => !removedItemsIDs?.includes(it)) || [];

      if (unCheckedItems?.length > 0) {
        setSaving(true);
        removeItemsInBulk(
          { item_uuids: unCheckedItems },
          {
            onSuccess: () => {
              setSaving(false);
              queryClient.invalidateQueries({
                queryKey: ["category-wise-items"]
              });
              queryClient.invalidateQueries({
                queryKey: ["removed-items-count"]
              });
              queryClient.invalidateQueries({
                queryKey: ["removed-vendor-items"]
              });

              if (item_uuids?.length > 0) {
                setSaving(true);
                approveVendorItems(item_uuids, {
                  onSuccess: (data) => {
                    setUnCheckedItems([]);
                    toast.success(data?.message);
                    setSaving(false);
                    queryClient.invalidateQueries({
                      queryKey: ["category-wise-items"]
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["removed-items-count"]
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["removed-vendor-items"]
                    });
                    if (selectedVendorIndex + 1 < vendors?.data?.length) {
                      setSelectedVendor(vendors?.data[selectedVendorIndex + 1]);
                      setSelectedVendorIndex(selectedVendorIndex + 1);
                      updateParams({
                        selected_vendor_id:
                          vendors?.data[selectedVendorIndex + 1]?.vendor
                            ?.vendor_id
                      });
                      updateParams({ search_term: "" });
                    } else {
                      setSelectedVendor(vendors?.data[0]);
                      setSelectedVendorIndex(0);
                      updateParams({
                        selected_vendor_id: vendors?.data[0]?.vendor?.vendor_id
                      });
                      updateParams({ search_term: "" });
                    }
                    updateParams({
                      selected_vendor_id: vendors?.data[0]?.vendor?.vendor_id
                    });
                    updateParams({ search_term: "" });
                    if (item_uuids?.length == 0) {
                      if (page < items?.total_pages) {
                        setSaving(false);
                        updateParams({
                          page: Number(page) + 1
                        });
                      } else {
                        setSaving(false);
                        if (mode == "vendor" && selectedVendor == null) {
                          toast.error("Select a vendor.");
                        } else {
                          navigate(
                            `/items-categorization/${category_id}/${selectedVendor?.vendor?.vendor_id}?category_name=${category_name}&page=${page}&selected_vendor_id=${selected_vendor_id}&mode=${mode}`
                          );
                        }
                      }
                    }
                  },
                  onError: (data) => {
                    toast.error(data?.message);
                    setSaving(false);
                  }
                });
              }
              setUnCheckedItems([]);
            },
            onError: () => {
              setSaving(false);
            }
          }
        );
      } else {
        if (item_uuids?.length > 0) {
          setSaving(true);
          approveVendorItems(item_uuids, {
            onSuccess: (data) => {
              setUnCheckedItems([]);
              toast.success(data?.message);
              setSaving(false);
              queryClient.invalidateQueries({
                queryKey: ["category-wise-items"]
              });
              queryClient.invalidateQueries({
                queryKey: ["removed-items-count"]
              });
              queryClient.invalidateQueries({
                queryKey: ["removed-vendor-items"]
              });

              if (selectedVendorIndex + 1 < vendors?.data?.length) {
                setSelectedVendor(vendors?.data[selectedVendorIndex + 1]);
                setSelectedVendorIndex(selectedVendorIndex + 1);

                updateParams({
                  selected_vendor_id: vendors?.data[0]?.vendor?.vendor_id
                });
                updateParams({ search_term: "" });
              } else {
                setSelectedVendor(vendors?.data[0]);
                setSelectedVendorIndex(0);
                updateParams({
                  selected_vendor_id: vendors?.data[0]?.vendor?.vendor_id
                });
                updateParams({ search_term: "" });
              }

              if (item_uuids?.length == 0) {
                if (page < items?.total_pages) {
                  setSaving(false);
                  updateParams({
                    page: Number(page) + 1
                  });
                } else {
                  setSaving(false);
                  if (mode == "vendor" && selectedVendor == null) {
                    toast.error("Select a vendor.");
                  } else {
                    navigate(
                      `/items-categorization/${category_id}/${selectedVendor?.vendor?.vendor_id}?category_name=${category_name}&page=${page}&selected_vendor_id=${selected_vendor_id}&mode=${mode}`
                    );
                  }
                }
              }
            },
            onError: (data) => {
              toast.error(data?.message);
              setSaving(false);
            }
          });
        } else {
          if (page < items?.total_pages) {
            updateParams({
              page: Number(page) + 1
            });
            setUnCheckedItems([]);
          }
        }
      }
    }
  };

  let timer;
  const vendorListRef = useRef(null); // Ref for the scrollable container
  const vendorItemRefs = useRef([]); // Refs for each vendor item

  const [focusedVendor, setFocusedVendor] = useState(-1);
  const [showShortCuts, setShowShortCuts] = useState(true);
  // **Filtered Vendors List**
  const filteredVendors =
    vendors?.data?.length > 0
      ? vendors?.data
          ?.filter((v) =>
            v?.vendor?.vendor_name
              ?.toLowerCase()
              ?.includes(searchTerm?.toLowerCase())
          )
          ?.sort((a, b) =>
            a?.vendor?.vendor_id === selectedVendor?.vendor?.vendor_id ? -1 : 1
          )
      : [] || [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();
      const isEditable =
        document.activeElement.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select";

      if (!isEditable && e.key == "Backspace") {
        navigate("/bulk-categorization");
      }
      if (e.key == "/") {
        clearTimeout(timer);
        timer = setTimeout(() => {
          inputRef.current.focus();
          updateParams({ search_term: "" });
        }, 200);
      }

      if (e.altKey && e.key == "n") {
        saveAndNextHandler();
      }
      if (e.altKey && e.key == "r") {
        if (mode == "vendor" && selectedVendor == null) {
          toast.error("Select a vendor.");
        } else {
          navigate(
            `/items-categorization/${category_id}/${selectedVendor?.vendor?.vendor_id}?category_name=${category_name}&page=${page}&selected_vendor_id=${selected_vendor_id}&mode=${mode}`
          );
        }
      }
      if (isEditable && inputRef.current.focus && /^[0-9]$/?.test(e.key)) {
        inputRef.current.blur();
        let matchedItemIndex = items?.data?.items.findIndex(
          (item, i) => i == Number(e.key)
        );

        if (
          matchedItemIndex > -1 &&
          !items?.data?.items[matchedItemIndex]?.category_review_required
        ) {
          if (
            unCheckedItems?.includes(
              items?.data?.items[matchedItemIndex]?.item_uuid
            )
          ) {
            setUnCheckedItems(
              unCheckedItems?.filter(
                (it) => it !== items?.data?.items[matchedItemIndex]?.item_uuid
              )
            );
          } else {
            setUnCheckedItems([
              ...unCheckedItems,
              items?.data?.items[matchedItemIndex]?.item_uuid
            ]);
          }
        }
      }

      if (e.key == "Enter" && searchTerm !== "" && focusedVendor == -1) {
        if (inputRef.current) {
          setSelectedVendor(
            vendors?.data?.filter((v) =>
              v?.vendor?.vendor_name
                ?.toLowerCase()
                ?.includes(searchTerm?.toLowerCase())
            )[0]
          );
          setSelectedVendorIndex(
            vendors?.data?.findIndex((v) =>
              v?.vendor?.vendor_name
                ?.toLowerCase()
                ?.includes(searchTerm?.toLowerCase())
            ) || 0
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
          if (unCheckedItems?.length > 0 || checkedItems?.length > 0) {
            toast("Please save to proceed.", {
              icon: "⚠️"
            });
          } else {
            if (page < items?.total_pages) {
              updateParams({
                page: Number(page) + 1
              });
            }
          }
        }

        let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (!removingItem) {
          if (numbers.includes(Number(e.key))) {
            inputRef.current.blur();
            let matchedItemIndex = items?.data?.items.findIndex(
              (item, i) => i == Number(e.key)
            );
            if (
              matchedItemIndex > -1 &&
              !items?.data?.items[matchedItemIndex]?.category_review_required
            ) {
              // items?.data?.items[matchedItemIndex]?.item_uuid
              if (
                unCheckedItems?.includes(
                  items?.data?.items[matchedItemIndex]?.item_uuid
                )
              ) {
                setUnCheckedItems(
                  unCheckedItems?.filter(
                    (it) =>
                      it !== items?.data?.items[matchedItemIndex]?.item_uuid
                  )
                );
              } else {
                setUnCheckedItems([
                  ...unCheckedItems,
                  items?.data?.items[matchedItemIndex]?.item_uuid
                ]);
              }
            }
          }
        }
      }
      if (!filteredVendors.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedVendor((prev) => {
          let newIndex = prev < filteredVendors.length - 1 ? prev + 1 : prev;
          scrollToFocusedVendor(newIndex);
          return newIndex;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedVendor((prev) => {
          let newIndex = prev > 0 ? prev - 1 : prev;
          scrollToFocusedVendor(newIndex);
          return newIndex;
        });
      } else if (e.key === "Enter" && focusedVendor !== -1) {
        e.preventDefault();
        const selected = filteredVendors[focusedVendor];
        setSelectedVendor(selected);
        setSelectedVendorIndex(
          vendors?.data?.findIndex(
            (v) => v?.vendor?.vendor_id == selected?.vendor?.vendor_id
          ) || 0
        );

        setFocusedVendor(-1);
        updateParams({
          page: 1,
          selected_vendor_id: selected?.vendor?.vendor_id
        });
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
    searchTerm,
    focusedVendor,
    filteredVendors
  ]);

  useEffect(() => {
    setUnCheckedItems([]);
  }, [page]);
  // Reset focus when search changes
  useEffect(() => {
    setFocusedVendor(-1);
  }, [searchTerm]);

  // Function to scroll to the focused vendor
  const scrollToFocusedVendor = (index) => {
    if (vendorItemRefs.current[index]) {
      vendorItemRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        top: 20
      });
    }
  };

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
              Here are all the items under the category{" "}
              <span className="font-extrabold text-primary">
                {category_name}
              </span>{" "}
            </p>
            <p className="font-poppins capitalize text-primary font-medium text-[0.9rem] leading-6 ">
              You can change the category of any item by clicking on the
              particular menu item
            </p>
          </div>
          <div className="flex items-center gap-x-4 font-normal ">
            {!scrollingMode && (
              <div className="mx-4 flex items-center gap-x-3">
                <Label htmlFor="airplane-mode">Vendor Items</Label>
                <Switch
                  checked={mode == "vendor" ? false : true}
                  onCheckedChange={(v) => {
                    updateParams({
                      mode: v ? "all" : "vendor"
                    });
                  }}
                />
                <Label htmlFor="airplane-mode">All Items</Label>
              </div>
            )}
            <div className=" flex items-center gap-x-3">
              <Switch
                checked={scrollingMode}
                onCheckedChange={(v) => {
                  updateParams({
                    scrolling_mode: v
                  });
                  setScrollingMode(v);
                }}
              />
              <Label htmlFor="airplane-mode">Auto Approve On Scroll</Label>
            </div>
            <div className="flex flex-col gap-y-4 rounded-3xl px-6 py-2 items-center justify-center font-poppins font-medium text-sm leading-5 text-black border border-[#E0E0E0] cursor-pointer">
              {!loadingItems &&
                selectedVendor !== null > 0 &&
                items?.data?.items?.length > 0 && (
                  <p className=" ">
                    {!loadingItems &&
                      selectedVendor !== null &&
                      items?.data?.items?.length > 0 && (
                        <p className="!no-underline text-sm">
                          Total Items : {items?.total_records}
                        </p>
                      )}
                    <span
                      className="underline  "
                      onClick={() => {
                        window.open(
                          `/fast-item-verification/${selectedVendor?.vendor?.vendor_id}?vendor_name=${selectedVendor?.vendor?.vendor_name}&human_verified=${selectedVendor?.vendor?.human_verified}&from_view=item-master-vendors`,
                          "_blank"
                        );
                      }}
                    >
                      {" "}
                      FIV Items:{" "}
                      {selectedVendor?.non_human_verified_items_count}
                    </span>
                  </p>
                )}
            </div>

            <TooltipProvider>
              <Tooltip open={showShortCuts}>
                <TooltipTrigger>
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
                    {saving
                      ? "Saving..."
                      : scrollingMode
                      ? "Save"
                      : " Save & Next"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white border relative shadow-sm px-4 flex items-center  gap-x-1  h-10">
                  <span className="mr-2 text-gray-800 text-sm ">
                    Press <kbd>Alt</kbd> + <kbd>N</kbd> to Save & Next
                  </span>
                  <span onClick={() => setShowShortCuts(false)}>
                    <X className="text-gray-800 h-[1rem] absolute w-[1rem] top-1 right-1 cursor-pointer" />
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Vendor List and Items Section */}

        <div className="flex gap-x-4 items-start h-full">
          <div className="w-[40%]  bg-[#FAFAFA] flex items-center justify-center h-full py-8">
            <div className="w-[90%] h-full">
              <p className="font-poppins font-semibold text-base pb-2 leading-6 pl-3 text-[#3D3D3D]">
                Vendors List
              </p>
              <TooltipProvider>
                <Tooltip open={showShortCuts}>
                  <TooltipTrigger className="w-full">
                    <div className=" w-full">
                      <CustomInput
                        showIcon={true}
                        variant="search"
                        placeholder="Search Vendor"
                        debounceTime={500}
                        value={searchTerm}
                        ref={inputRef}
                        onChange={(value) => {
                          updateParams({ search_term: value });
                        }}
                        onKeyDown={(e) => {}}
                        className="min-w-72 max-w-96 border border-gray-200 relative   focus:!ring-0 focus:!outline-none remove-number-spinner"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border relative mb-0 mt-0 shadow-sm px-4 ml-20 flex items-center  gap-x-1 w-40 h-10">
                    <span className="mr-2 text-gray-800 text-sm ">
                      Press <kbd>/</kbd> to search
                    </span>
                    <span onClick={() => setShowShortCuts(false)}>
                      <X className="text-gray-800 h-[1rem] absolute w-[1rem] top-1 right-1 cursor-pointer" />
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div
                className="md:h-[42vh] 2xl:h-[50vh]  mt-2  overflow-auto"
                ref={vendorListRef}
              >
                {loadingVendors ? (
                  <div className="flex w-full flex-col gap-y-2">
                    {[0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11]?.map((_, index) => (
                      <Skeleton className={"w-full h-[2.5rem]"} />
                    ))}
                  </div>
                ) : (
                  vendors?.data?.length > 0 &&
                  vendors?.data
                    ?.sort((a, b) => b.items_count - a.items_count)

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
                            if (
                              unCheckedItems?.length > 0 ||
                              checkedItems?.length > 0
                            ) {
                              toast("Please save to proceed.", {
                                icon: "⚠️"
                              });
                            } else {
                              setSelectedVendor(vendor);
                              setSelectedVendorIndex(index);

                              updateParams({
                                page: 1,
                                selected_vendor_id: vendor?.vendor?.vendor_id
                              });
                            }
                          }}
                          ref={(el) => (vendorItemRefs.current[index] = el)}
                          className={`${isSelected && "bg-primary"}  
                  flex items-center justify-between cursor-pointer min-h-[2.5rem] max-h-[5rem] break-words truncate gap-x-4 mt-4 px-4 ${
                    isSelected && "sticky top-0"
                  }  ${
                            focusedVendor === index && !isSelected
                              ? "bg-gray-200 "
                              : focusedVendor == index &&
                                isSelected &&
                                "!text-white"
                          }`}
                        >
                          <div className="font-poppins flex items-center gap-x-4 py-2 capitalize font-normal text-sm leading-5 text-black">
                            {isSelected ? (
                              <img src={user_white} alt="" />
                            ) : (
                              <img src={user_grey} alt="" />
                            )}
                            <span
                              className={` ${isSelected && "!text-white"} ${
                                focusedVendor === index && !isSelected
                                  ? " !text-black"
                                  : focusedVendor == index &&
                                    isSelected &&
                                    "!text-white"
                              } text-[#222222]  font-poppins truncate break-word max-w-56 whitespace-normal font-normal text-[0.9rem] leading-5`}
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
              <div className="border-b  border-b-[#D9D9D9] mt-3 w-full" />

              <div className="w-full">
                <TooltipProvider>
                  <Tooltip open={showShortCuts} className="w-full">
                    <TooltipTrigger className="w-full">
                      <div
                        onClick={() => {
                          if (mode == "vendor" && selectedVendor == null) {
                            toast.error("Select a vendor.");
                          } else {
                            navigate(
                              `/items-categorization/${category_id}/${selectedVendor?.vendor?.vendor_id}?category_name=${category_name}&page=${page}&selected_vendor_id=${selected_vendor_id}&mode=${mode}`
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
                          {removedItemsCount?.data?.removed_items_count || 0}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border relative shadow-sm px-4 flex items-center  gap-x-1  h-10">
                      <span className="mr-2 text-gray-800 text-sm ">
                        Press <kbd>Alt</kbd> + <kbd>R</kbd> to navigate
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

          {/* Items List */}
          {scrollingMode ? (
            <ItemsListingWithScrollingApproval
              items={items}
              setUnCheckedItems={setUnCheckedItems}
              showShortCuts={showShortCuts}
              loadingItems={loadingItems}
              unCheckedItems={unCheckedItems}
              selectedVendor={selectedVendor}
              checkedItems={checkedItems}
              setShowShortCuts={setShowShortCuts}
              setCheckedItems={setCheckedItems}
              removedItems={removedItems}
              mode={mode}
              page={page}
            />
          ) : (
            <ItemsListingWithoutScrollingApproval
              items={items}
              showShortCuts={showShortCuts}
              loadingItems={loadingItems}
              setUnCheckedItems={setUnCheckedItems}
              unCheckedItems={unCheckedItems}
              selectedVendor={selectedVendor}
              setShowShortCuts={setShowShortCuts}
              removedItems={removedItems}
              mode={mode}
              page={page}
            />
          )}
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
