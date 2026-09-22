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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") notifySessionExpired();
    throw new Error(data?.message || "Package rate request failed");
  }

  return data;
};

export const packageRateAPI = {
  getAll: () => request("/package-rates"),
  create: (packageRate) => request("/package-rates", { method: "POST", body: JSON.stringify(packageRate) }),
  update: (id, packageRate) => request(`/package-rates/${id}`, { method: "PUT", body: JSON.stringify(packageRate) }),
  delete: (id) => request(`/package-rates/${id}`, { method: "DELETE" }),
};