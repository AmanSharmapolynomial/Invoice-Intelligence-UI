import { create } from "zustand";
import { persist } from "zustand/middleware";

const globalStore = create(
  persist(
    (set) => ({
      selectedInvoiceVendorName: "",
      selectedInvoiceRestaurantName: "",
      setSelectedInvoiceVendorName: (name) =>
        set({ selectedInvoiceVendorName: name }),
      setSelectedInvoiceRestaurantName: (name) =>
        set({ selectedInvoiceRestaurantName: name })
    }),
    {
      name: "global-store" // unique name for localStorage key
    }
  )
);

export default globalStore;
