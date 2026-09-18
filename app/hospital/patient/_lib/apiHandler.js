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

export const patientAPI = {
  // Create a new patient
  create: async (patientData) => {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      if (response.status === 401 && typeof window !== "undefined") {
        notifySessionExpired();
      }

      throw new Error(data?.message || "Failed to create patient");
    }

    return response.json();
  },

  // Get all patients
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      if (response.status === 401 && typeof window !== "undefined") {
        notifySessionExpired();
      }

      throw new Error(data?.message || "Failed to fetch patients");
    }

    return response.json();
  },

  admit: async (id, symptoms = "") => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}/admit`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(true),
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      if (response.status === 401 && typeof window !== "undefined") {
        notifySessionExpired();
      }

      throw new Error(data?.message || "Failed to admit patient");
    }

    return response.json();
  },

  // Get patient by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "GET",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch patient");
    }

    return response.json();
  },

  // Get patient by visit number
  getByVisitNumber: async (visitNumber) => {
    const response = await fetch(
      `${API_BASE_URL}/patients/visit/${visitNumber}`,
      {
        method: "GET",
        headers: buildHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch patient");
    }

    return response.json();
  },

  // Update patient
  update: async (id, patientData) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "PUT",
      headers: buildHeaders(true),
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      if (response.status === 401 && typeof window !== "undefined") {
        notifySessionExpired();
      }

      throw new Error(data?.message || "Failed to update patient");
    }

    return response.json();
  },

  // Delete patient
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      if (response.status === 401 && typeof window !== "undefined") {
        notifySessionExpired();
      }

      throw new Error(data?.message || "Failed to delete patient");
    }

    return response.json();
  },
};
