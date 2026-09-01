const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import { notifySessionExpired } from "@/store/authStore";

const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = sessionStorage.getItem("authState");

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    return parsed?.accessToken ?? null;
  } catch {
    return null;
  }
};

const buildHeaders = (includeJson = false) => {
  const headers = {};

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  const token = getAuthToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const hospitalEmployeeAPI = {
  create: async (employeeData) => {
    const response = await fetch(`${API_BASE_URL}/hospital-employees`, {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      if (response.status === 401 && typeof window !== "undefined") {
        notifySessionExpired();
      }

      throw new Error(data?.message || "Failed to create employee");
    }

    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/hospital-employees`, {
      method: "GET",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      if (response.status === 401 && typeof window !== "undefined") {
        notifySessionExpired();
      }

      throw new Error(data?.message || "Failed to fetch employees");
    }

    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/hospital-employees/${id}`, {
      method: "GET",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.message || "Failed to fetch employee");
    }

    return response.json();
  },

  update: async (id, employeeData) => {
    const response = await fetch(`${API_BASE_URL}/hospital-employees/${id}`, {
      method: "PUT",
      headers: buildHeaders(true),
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      if (response.status === 401 && typeof window !== "undefined") {
        notifySessionExpired();
      }

      throw new Error(data?.message || "Failed to update employee");
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/hospital-employees/${id}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      if (response.status === 401 && typeof window !== "undefined") {
        notifySessionExpired();
      }

      throw new Error(data?.message || "Failed to delete employee");
    }

    return response.json();
  },
};
