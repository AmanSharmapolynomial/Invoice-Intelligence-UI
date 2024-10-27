import { create } from "zustand";
import { persist } from "zustand/middleware";

const userStore = create(
  persist(
    (set) => ({
      username: null,
      first_name: null,
      last_name: null,
      email: null,
      role: null,
      access_token: null,
      refresh_token: null,
      setUsername: (data) => set({ username: data }),
      setFirstName: (data) => set({ first_name: data }),
      setLastName: (data) => set({ last_name: data }),
      setEmail: (data) => set({ email: data }),
      setRole: (data) => set({ role: data }),
      setAccessToken: (data) => set({ access_token: data }),
      setRefreshToken: (data) => set({ refresh_token: data })
    }),
    {
      name: "user-store"
    }
  )
);

export default userStore;
