import dashed_line from "@/assets/image/dashed_line.svg";
import no_items from "@/assets/image/no_items.svg";
import { forwardRef, useEffect, useRef, useState } from "react";
import circle_check from "@/assets/image/check_circle.svg";
import circle_check_grey from "@/assets/image/check_circle_grey.svg";
import { Skeleton } from "../ui/skeleton";
import { debounce } from "lodash";
import { Check, CirclePlus } from "lucide-react";

const ItemsListingWithScrollingApproval = forwardRef(
  (
    {
      items,
      showShortCuts,
      loadingItems,
      selectedVendor,
      removedItems,
      unCheckedItems,
      mode,
      page,
      setUnCheckedItems,
      checkedItems,
      setCheckedItems,
      scrollingMode,
      fromTop,
      setFromTop
    },
    ref // 👈 this is the received ref
  ) => {
    const lineRef = useRef(null);

    const [lastItemAboveLine, setLastItemAboveLine] = useState(null);
    const [manualChange, setManualChange] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const itemsScrollRef = useRef(null);
    useEffect(() => {
      const handleScroll = debounce(
        () => {
          if (lineRef.current) {
            setScrolling(true);

            const linePosition = lineRef.current.getBoundingClientRect().top;
            const itemElements = document.querySelectorAll(".item-row");

            let latestAboveLine = null;
            const newCheckedItems = [];
            const newUncheckedItems = [];

            itemElements.forEach((item) => {
              const itemPosition = item.getBoundingClientRect().bottom;
              const itemUuid = item.getAttribute("data-uuid");

              if (itemPosition < linePosition) {
                latestAboveLine = item;

                // Handle CHECKED items
                if (
                  !unCheckedItems.includes(itemUuid) &&
                  !items?.data?.items?.find(
                    (item) => item.item_uuid === itemUuid
                  )?.category_review_required
                ) {
                  if (!newCheckedItems.includes(itemUuid)) {
                    newCheckedItems.push(itemUuid);
                  }
                }

                if (checkedItems.includes(itemUuid)) {
                  // if (!newCheckedItems.includes(itemUuid)) {
                  //   newCheckedItems.push(itemUuid);
                  // }
                }

                // Ensure unchecked items ABOVE the line stay unchecked
                if (unCheckedItems.includes(itemUuid)) {
                  if (!newUncheckedItems.includes(itemUuid)) {
                    newUncheckedItems.push(itemUuid);
                  }
                }
              } else {
                // Handle items BELOW the line
                if (unCheckedItems.includes(itemUuid)) {
                  return; // Remove it from `unCheckedItems`
                }

                if (checkedItems.includes(itemUuid)) {
                  if (!newUncheckedItems.includes(itemUuid)) {
                    // newUncheckedItems.push(itemUuid);
                  }
                }
              }
            });

            setLastItemAboveLine(latestAboveLine);
            setCheckedItems(newCheckedItems);
            setUnCheckedItems(newUncheckedItems);
          }
        },
        mode == "all" ? 50 : 0
      );

      const handleKeyDown = (e) => {
        if (e.key == "0") {
          return;
        }
        if (e.key === "x" && lastItemAboveLine) {
          const itemUuid = lastItemAboveLine.getAttribute("data-uuid");

          if (checkedItems.includes(itemUuid)) {
            setCheckedItems(checkedItems.filter((item) => item !== itemUuid));
            setUnCheckedItems([...unCheckedItems, itemUuid]);
          } else {
            setCheckedItems([...checkedItems, itemUuid]);
            setUnCheckedItems(
              unCheckedItems.filter((item) => item !== itemUuid)
            );
          }
        }
      };

      setScrolling(false);
      const container = ref.current;
      if (container) {
        container.addEventListener("scroll", handleScroll);
      }

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        if (container) {
          container.removeEventListener("scroll", handleScroll);
        }
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [items, checkedItems, unCheckedItems]);
    console.log(unCheckedItems);
    useEffect(() => {
      if (checkedItems?.length == 0) {
        setFromTop(0);
      }
      if (scrolling) {
        setFromTop(18.2);
      }
    }, [checkedItems, items?.length, scrolling]);

    useEffect(() => {
      setCheckedItems([]);
    }, [items]);

    const handleRemoveItem = (item_uuid) => {
      setManualChange(true);

      if (unCheckedItems?.includes(item_uuid)) {
        setUnCheckedItems(unCheckedItems?.filter((it) => it !== item_uuid));
        if (!checkedItems?.includes(item_uuid)) {
          setCheckedItems([...checkedItems, item_uuid]);
        }
      } else {
        setCheckedItems(checkedItems?.filter((it) => it !== item_uuid));
        setUnCheckedItems([...unCheckedItems, item_uuid]);
      }

      setManualChange(false);
    };

    return (
      <div className="w-[60%] flex flex-col">
        <div className="my-0 w-full flex justify-end pr-4  items-start gap-x-8 mt-4">
          <div className="flex items-center gap-x-2">
            <img src={circle_check} className=" h-[1.9rem] w-[1.9rem]" />
            <span className="font-poppins font-medium text-xl">
              {checkedItems?.length}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <CirclePlus className="rotate-45 h-[1.75rem] w-[1.65rem] text-red-500" />
            <span className="font-poppins font-medium text-xl">
              {unCheckedItems?.length}
            </span>
          </div>
        </div>
        <div className=" h-full pt-2 max-w-full !relative">
          <div
            ref={ref}
            className="flex flex-col gap-y-2 md:h-[30rem] max-w-full 2xl:h-[40rem] !h-[38rem] overflow-auto"
          >
            {loadingItems ? (
              <div className="flex flex-col gap-y-4 h-[50vh]">
                {new Array(10).fill(0).map((_, index) => (
                  <Skeleton key={index} className={"w-full h-[2.5rem]"} />
                ))}
              </div>
            ) : (
              <>
                {(!selectedVendor && mode !== "all") || loadingItems ? (
                  <div className="flex items-center justify-center md:min-h-[25rem] 2xl:min-h-[30rem] h-[30rem] w-full">
                    <div className="flex flex-col justify-center items-center gap-y-4">
                      <img
                        src={no_items}
                        alt=""
                        className="h-[70%] w-[60%] mt-8"
                      />
                      <p className="text-[#040807] font-poppins font-normal text-[0.9rem] leading-5">
                        To proceed, kindly choose a vendor from the side
                        navigation menu.
                      </p>
                    </div>
                  </div>
                ) : (
                  items?.data?.items?.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (
                          checkedItems?.includes(item?.item_uuid) ||
                          unCheckedItems?.includes(item?.item_uuid)
                        ) {
                          handleRemoveItem(item?.item_uuid);
                        }
                      }}
                      data-uuid={item?.item_uuid}
                      className={`item-row border rounded-sm w-full px-4 cursor-pointer min-h-[2.5rem] border-[#D9D9D9] flex items-center justify-between ${
                        (unCheckedItems?.includes(item?.item_uuid) ||
                          item?.category_review_required) &&
                        "border-[#ca5644]"
                      }  ${
                        ((!unCheckedItems?.includes(item?.item_uuid) &&
                          !checkedItems?.includes(item?.item_uuid)) ||
                          item?.category_review_required) &&
                        "bg-[#D1D1D1]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full gap-x-4">
                        <span className="font-poppins font-normal text-xs leading-5 capitalize flex items-center gap-x-2 text-black">
                          <span className="font-poppins font-semibold">
                            {index}.
                          </span>{" "}
                          <span>
                            {item?.item_description?.length > 90
                              ? item?.item_description?.slice(0, 90) + "..."
                              : item?.item_description}
                          </span>
                        </span>
                        {checkedItems.includes(item?.item_uuid) ? (
                          <img src={circle_check} alt="" />
                        ) : (
                          (!unCheckedItems?.includes(item?.item_uuid) ||
                            item?.category_review_required) && (
                            <img
                              src={circle_check_grey}
                              className="fill-white"
                            />
                          )
                        )}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* Line after 6th item */}
          {scrollingMode && items?.data?.items?.length > 0 && (
            <div
              ref={lineRef}
              src={dashed_line}
              style={{ top: `${fromTop}rem` }}
              className="w-[98.5%] absolute border-t-[0.2rem] border-dashed border-black/45 "
            ></div>
          )}
        </div>
      </div>
    );
  }
);

export default ItemsListingWithScrollingApproval;
