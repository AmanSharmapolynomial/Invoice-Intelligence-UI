import { create } from "zustand";
import { persist } from "zustand/middleware";

const fastItemVerificationStore = create(
  persist(
    (set) => ({
      lineItems: [],
      setLineItems: (items) => set({ lineItems: items })
    }),
    {
      name: "fat-item-verification-store" // unique name for localStorage key
    }
  )
);

export default fastItemVerificationStore;
