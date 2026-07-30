import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,

  loginUser: (accessToken, user) => {
    set({
      accessToken,
      user,
    });
  },

  logoutUser: () => {
    set({
      accessToken: null,
      user: null,
    });
  },
}));