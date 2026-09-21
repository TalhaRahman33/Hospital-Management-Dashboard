const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

import { notifySessionExpired } from "@/store/authStore";

const getAuthToken = () => {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(sessionStorage.getItem("authState") || "{}").accessToken || null;
  } catch {
    return null;
  }
};

const request = async (path) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") notifySessionExpired();
    throw new Error(data?.message || "Failed to load discharged patients");
  }

  return data;
};

export const dischargedPatientAPI = {
  getAll: () => request("/discharged-patients"),
};