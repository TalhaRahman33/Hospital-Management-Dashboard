import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,

  loginUser: (user) => {
    set({
      user,
    });
  },

  logoutUser: () => {
    set({
      user: null,
    });
  },
}));