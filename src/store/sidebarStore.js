import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSidebarStore = create(
  persist(
    (set, get) => ({
      expanded: true,
      options:[],
      setOptions:(opt)=>set({options:opt}),
      setExpanded: () => set({ expanded: !get().expanded })
    }),
    {
      name: "sidebar-store",
      getStorage: () => localStorage
    }
  )
);

export default useSidebarStore;
