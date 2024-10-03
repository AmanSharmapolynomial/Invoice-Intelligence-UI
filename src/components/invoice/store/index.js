import { create } from "zustand";

export const useInvoiceStore = create((set) => ({
  restaurantFilterValue: "none", // Initial state
  vendorFilterValue: "none", // Initial state
  setRestaurantFilter: (val) => set({ restaurantFilterValue: val }),
  setVendorFilter: (val) => set({ vendorFilterValue: val }),
}));
