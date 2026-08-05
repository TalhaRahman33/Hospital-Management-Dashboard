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

  logoutUser: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("authState");
    }

    set({
      accessToken: null,
      user: null,
    });
  },
}));