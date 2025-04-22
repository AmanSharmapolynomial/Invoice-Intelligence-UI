import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFilterStore = create(
  persist(
    (set) => ({
      filters: {
        page: 1,
        page_size: 10,
        invoice_type: "",
        invoice_detection_status: "",
        auto_accepted: "",
        auto_accepted_by_vda:"all",
        start_date: "",
        end_date: "",
        clickbacon_status: "",
        human_verification: "all",
        vendor: "",
        sort_order: "desc",
        restaurant: "",
        human_verified: "all",
        assigned_to: "",
        document_priority:"all",
        token:"",
        review_later:"false",
        supported_documents:null,
        restaurant_tier:"all",
        rejected:"all"
      },
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),
      setToken: (token) => set({ token }),
      setDefault: () =>
        set({
          filters: {
            page: 1,
            page_size: 10,
            invoice_type: "",
            invoice_detection_status: "",
            auto_accepted: "",
            auto_accepted_by_vda:"all",
            start_date: "",
            end_date: "",
            clickbacon_status: "",
            human_verification: "all",
            vendor: "",
            sort_order: "desc",
            restaurant: "",
            human_verified: "all",
            assigned_to: "",
            document_priority:"all",
            token:"",
            review_later:"false",
            supported_documents:null,
            restaurant_tier:"all",
            rejected:'all'
          }
        })
    }),
    {
      name: "filter-store", 
      partialize: (state) => ({ filters: state.filters })
    }
  )
);

export default useFilterStore;
