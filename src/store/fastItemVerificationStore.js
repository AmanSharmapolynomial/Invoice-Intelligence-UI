import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  fiv_items: [],
  fiv_bounding_boxes: [],
  is_good_document: false,
  fiv_document_link: null,
  fiv_current_item: {},
  fiv_document_uuid: null,
  fiv_document_source: null,
  fiv_item_number: 0,
};

const fastItemVerificationStore = create(
  persist(
    (set) => ({
      ...initialState,
      setFIVItems: (items) => set({ fiv_items: items }),
      setFIVBoundingBoxes: (bb) => set({ fiv_bounding_boxes: bb }),
      setIsGoodDocument: (val) => set({ is_good_document: val }),
      setFIVDocumentLink: (link) => set({ fiv_document_link: link }),
      setFIVCurrentItem: (item) => set({ fiv_current_item: item }),
      setFIVDocumentSource: (source) => set({ fiv_document_source: source }),
      setFIVDocumentUUID: (id) => set({ fiv_document_uuid: id }),
      setFIVItemNumber: (no) => set({ fiv_item_number: no }),
      resetStore: () => set(initialState),
    }),
    {
      name: "fat-item-verification-store",
    }
  )
);

export default fastItemVerificationStore;
