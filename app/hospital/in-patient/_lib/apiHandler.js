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

const request = async (path, options = {}) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") notifySessionExpired();
    throw new Error(data?.message || "Inpatient request failed");
  }
  return data;
};

export const inpatientAPI = {
  getAll: (status) => request(`/inpatients?status=${encodeURIComponent(status)}`),
  discharge: (id, dischargeNotes) => request(`/inpatients/${id}/discharge`, {
    method: "PUT",
    body: JSON.stringify({ dischargeNotes }),
  }),
};