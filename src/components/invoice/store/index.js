import { create } from "zustand";

export const useInvoiceStore = create((set) => ({
  vendorFilterValue: "none",
  restaurantFilterValue: "none",
  vendorsNames: [],
  setVendorNames: (vendors) => set({ vendorsNames: vendors }),
  setVendorFilter: (val) => set({ vendorFilterValue: val }),
  setRestaurantFilter: (val) => set({ restaurantFilterValue: val })
}));
