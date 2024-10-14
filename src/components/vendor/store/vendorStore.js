import { create } from "zustand";

export const vendorStore = create((set) => ({
  checkedBranches: [],
  checkedVendors:[],
  masterVendor:null,
  masterBranch: null,
  setCheckedBranches: (branches) => set({ checkedBranches: branches }),
  setMasterBranch: (branch) => set({ masterBranch: branch }),
  setMasterVendor:(vendor)=>set({masterVendor:vendor}),
  setCheckedVendors:(vendors)=>set({checkedVendors:vendors})
}));
