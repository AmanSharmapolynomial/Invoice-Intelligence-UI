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
        rerun_status: "",
        auto_accepted: "",
        start_date: "",
        end_date: "",
        clickbacon_status: "",
        human_verification: "all",
        vendor: "",
        sort_order: "desc",
        restaurant: "",
        human_verified: "all",
        assigned_to: "",
        document_priority:"desc",
        token:""
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
            rerun_status: "",
            auto_accepted: "",
            start_date: "",
            end_date: "",
            clickbacon_status: "",
            human_verification: "all",
            vendor: "",
            sort_order: "desc",
            restaurant: "",
            human_verified: "all",
            assigned_to: "",
            document_priority:"desc",
            token:""
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
