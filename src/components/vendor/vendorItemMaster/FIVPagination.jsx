import React, { useEffect } from "react";
import navigate_back from "@/assets/image/navigate_back.svg";
import navigate_next from "@/assets/image/navigate_next.svg";
import { Button } from "@/components/ui/button";
import fastItemVerificationStore from "@/store/fastItemVerificationStore";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetVendorItemMasterAllItems } from "../api";

const FIVPagination = ({ data }) => {
  const {
    fiv_current_item,
    fiv_items,
    setFIVCurrentItem,
    fiv_item_number,
    setFIVItemNumber,
    resetStore,
    setFIVItems
  } = fastItemVerificationStore();
  const { mutate: getAllItems } = useGetVendorItemMasterAllItems();

  const total_items = fiv_items?.length || 0;
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  const { vendor_id } = useParams();
  const updateParams = useUpdateParams();

  const handleNext = () => {
    if (fiv_items?.length == 0) {
      getAllItems(
        {
          vendor_id,
          document_uuid: data?.data?.item?.[0]?.document_uuid,
          page: page
        },
        {
          onSuccess: (data) => {
            setFIVItems(
              data?.data?.items?.filter(
                (it) => it.item_uuid !== fiv_current_item?.item_uuid
              )
            );
            setIsGoodDocument(false);

            setFIVCurrentItem(data?.data?.items[fiv_item_number + 2]);
          }
        }
      );
    }
    if (fiv_item_number < total_items - 1) {
      setFIVItemNumber(fiv_item_number + 1);
      setFIVCurrentItem(fiv_items[fiv_item_number + 1]);
    } else {
      if (fiv_item_number >= total_items - 1) {
        if ((page<=data?.data?.total_item_count)) {
          updateParams({ page: Number(page) + 1 });
        }
        setFIVItemNumber(0);
        setFIVCurrentItem({});
        resetStore();
      }
    }
  };

  const handlePrevious = () => {
    if (fiv_item_number > 0) {
      setFIVItemNumber(fiv_item_number - 1);
      setFIVCurrentItem(fiv_items[fiv_item_number - 1]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent navigation if an input field or textarea is focused
      const activeElement = document.activeElement;
      if (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fiv_item_number, fiv_items, total_items, page]);
  return (
    <div className="w-full flex items-center gap-x-3">
      <Button
        className="rounded-sm px-1 flex items-center disabled:bg-gray-500"
        onClick={handlePrevious}
        disabled={fiv_item_number <= 0}
      >
        <img src={navigate_back} alt="Previous" className="h-8 w-8" />
      </Button>
      <Button
        disabled={data?.is_final_page}
        className="rounded-sm px-1 flex items-center"
        onClick={handleNext}
      >
        <img src={navigate_next} alt="Next" className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default FIVPagination;
