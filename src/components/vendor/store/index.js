import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePersistStore = create(
  persist(
    (set) => ({
      actualVendorName:"",
      setActualVendorName:(val)=>set({actualVendorName:val})
    }),
    {
      name: "required-data", // unique name for storage
      getStorage: () => localStorage, // (optional) by default, it uses localStorage
    }
  )
);
