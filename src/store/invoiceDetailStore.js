import { create } from "zustand";

export const invoiceDetailStore = create((set, get) => ({
  categoryWiseSum: [],
  tableData: [],
  operations: [],
  last_update_info: {},
  invoiceType: null,
  metaData: {},
  bounding_box: {},
  bounding_boxes: [],
  highlightAll: false,
  combinedTableCopy: {},
  reCalculateCWiseSum: false,
  added: false,
  history: [],
  combinedTableHistory: [],

  highlightRow: false,
  prefetchedLinks: {},
  updatedFields: {},
  vendorChanged: false,
  branchChanged: false,
  newVendor: "",
  newBranch: "",
  editBranch: false,
  editVendor: false,
  totalPages: null,
  setCombinedTableHistory: (history) => set({ combinedTableHistory: history }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setVendorChanged: (value) => set({ vendorChanged: value }),
  setBranchChanged: (value) => set({ branchChanged: value }),
  setNewVendor: (value) => set({ newVendor: value }),
  setNewBranch: (value) => set({ newBranch: value }),
  setEditBranch: (value) => set({ editBranch: value }),
  setEditVendor: (value) => set({ editVendor: value }),
  isModalOpen: false,
  setIsModalOpen: (val) => set({ isModalOpen: val }),
  setUpdatedFields: (update) =>
    set((state) => ({
      updatedFields:
        typeof update === "function"
          ? update(state.updatedFields)
          : { ...state.updatedFields, ...update }
    })),
  clearUpdatedFields: () => set({ updatedFields: {} }),
  totalExtendedPrce: 0,
  setTotalExtendedPrice: (val) => set({ totalExtendedPrce: val }),

  setHighlightRow: (val) => set({ highlightRow: val }),
  setPrefetchedLinks: (link) => set({ prefetchedLinks: link }),
  setHistory: (his) => set({ history: his }),
  setReCalculateCWiseSum: (val) => set({ reCalculateCWiseSum: val }),
  setCategoryWiseSum: (sum) => set({ categoryWiseSum: sum }),
  setTableData: (data) => set({ tableData: data }),
  setCombinedTableCopy: (data) => set({ combinedTableCopy: data }),
  setOperations: (data) => set({ operations: data }),
  setLastUpdateInfo: (info) => set({ last_update_info: info }),
  setInvoiceType: (type) => set({ invoiceType: type }),
  setMetaData: (data) => set({ metaData: data }),
  setBoundingBox: (box) => set({ bounding_box: box }),
  setBoundingBoxes: (boxes) => set({ bounding_boxes: boxes }),
  setHighlightAll: (highlightAll) => set({ highlightAll: highlightAll }),
  setAdded: (flag) => set({ added: flag }),
  clearStore: () =>
    set({
      categoryWiseSum: [],
      bounding_box: {},
      tableData: [],
      last_update_info: {},
      operations: [],
      invoiceType: null,
      metaData: {},
      highlightAll: false,
      combinedTableCopy: {},
      vendorChanged: false,
      branchChanged: false,
      newVendor: "",
      newBranch: "",
      editBranch: false,
      editVendor: false
    })
}));
