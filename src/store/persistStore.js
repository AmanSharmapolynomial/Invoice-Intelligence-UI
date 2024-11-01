import { create } from "zustand";
import { persist } from "zustand/middleware";


const persistStore= create(
  persist(
    (set) => ({
      
      vendorNames:[],
      setVendorNames:(names)=>set({vendorNames:names})
    }),
    {
      name: 'common-store', 
      getStorage: () => localStorage, 
    }
  )
);

export default persistStore;
