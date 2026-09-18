const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import { notifySessionExpired } from "@/store/authStore";

const getAuthToken = () => {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem("authState");
    return stored ? JSON.parse(stored)?.accessToken ?? null : null;
  } catch {
    return null;
  }
};

const request = async (path, options = {}) => {
  const headers = { ...(options.body ? { "Content-Type": "application/json" } : {}) };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, credentials: "include", headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") notifySessionExpired();
    throw new Error(data?.message || "Checkup request failed");
  }

  return data;
};

export const checkupAPI = {
  getAll: (status = "") => request(`/checkups${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  create: (data) => request("/checkups", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/checkups/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};
