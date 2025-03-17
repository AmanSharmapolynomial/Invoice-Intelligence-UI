import React, { useEffect } from "react";
import navigate_back from "@/assets/image/navigate_back.svg";
import navigate_next from "@/assets/image/navigate_next.svg";
import { Button } from "@/components/ui/button";
import fastItemVerificationStore from "@/store/fastItemVerificationStore";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetVendorItemMasterAllItems } from "../api";

const FIVPagination = ({ data ,masterUUID,setMasterUUID,selectedItems,setSelectedItems,setIsAccordionOpen,isAccordionOpen}) => {
  const {
    fiv_current_item,
    fiv_items,
    setFIVCurrentItem,
    fiv_item_number,
    setFIVItemNumber,
    resetStore,
    setFIVItems,
    fiv_total_items_count,
    fiv_verified_items_count,
    fiv_document_loaded,
    fiv_is_final_page
  } = fastItemVerificationStore();
  const { mutate: getAllItems } = useGetVendorItemMasterAllItems();

  const total_items = fiv_items?.length || 0;
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  const { vendor_id } = useParams();
  const updateParams = useUpdateParams();

  const handleNext = () => {
    if (fiv_items?.length == 0) {
      if(fiv_document_loaded){
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
  
              setFIVCurrentItem(data?.data?.items[fiv_item_number + 1]);
            }
          }
        );
      }
    }
    if (fiv_item_number < total_items - 1) {
      setFIVItemNumber(Number(fiv_item_number) + 1);
      setFIVCurrentItem(fiv_items[Number(fiv_item_number)]);
      setFIVItems(fiv_items?.filter((it)=>!it?.human_verified))
    } else {
      if (fiv_item_number < total_items - 1) {
        setFIVItemNumber(fiv_item_number + 1);
        setFIVCurrentItem(fiv_items[fiv_item_number]);
      } else if (!data?.is_final_page) {
        if (!fiv_is_final_page) {
          updateParams({ page: Number(page) + 1 });
        }
        resetStore();
      }
    }

    setSelectedItems([])
    setMasterUUID(null)
    setIsAccordionOpen(false)
  };

  const handlePrevious = () => {
    if (fiv_item_number > 0) {
      setFIVItemNumber(fiv_item_number - 1);
      setFIVCurrentItem(fiv_items[fiv_item_number]);
      setFIVItems(fiv_items?.filter((it)=>!it?.human_verified))
    }
    setSelectedItems([])
    setMasterUUID(null)
    setIsAccordionOpen(false)
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
        disabled={fiv_item_number <= 0|| fiv_total_items_count==fiv_verified_items_count}
      >
        <img src={navigate_back} alt="Previous" className="h-8 w-8" />
      </Button>
      <Button
        disabled={fiv_is_final_page||(fiv_item_number == total_items - 1)||page==data?.is_final_page || !(data?.data?.item?.[0]?.document_uuid) || fiv_total_items_count===fiv_verified_items_count}
        className="rounded-sm px-1 flex items-center disabled:bg-gray-500"
        onClick={handleNext}
      >
        <img src={navigate_next} alt="Next" className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default FIVPagination;
