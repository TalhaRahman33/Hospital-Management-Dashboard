import { create } from "zustand";

const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { accessToken: null, user: null };
  }

  try {
    const stored = sessionStorage.getItem("authState");

    if (!stored) {
      return { accessToken: null, user: null };
    }

    const parsed = JSON.parse(stored);

    return {
      accessToken: parsed?.accessToken ?? null,
      user: parsed?.user ?? null,
    };
  } catch {
    return { accessToken: null, user: null };
  }
};

const initialAuth = getStoredAuth();

export const clearAuthSession = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("authState");
  }
};

export const useAuthStore = create((set) => ({
  accessToken: initialAuth.accessToken,
  user: initialAuth.user,

  loginUser: (accessToken, user) => {
    const nextAuth = { accessToken, user };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("authState", JSON.stringify(nextAuth));
    }

    set(nextAuth);
  },

  updateUser: (user) => {
    set((state) => {
      const nextAuth = {
        accessToken: state.accessToken,
        user,
      };

      if (typeof window !== "undefined") {
        sessionStorage.setItem("authState", JSON.stringify(nextAuth));
      }

      return { user };
    });
  },

  logoutUser: () => {
    clearAuthSession();

    set({
      accessToken: null,
      user: null,
    });
  },
}));