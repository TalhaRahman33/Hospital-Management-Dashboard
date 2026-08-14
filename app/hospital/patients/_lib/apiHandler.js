const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const patientAPI = {
  // Create a new patient
  create: async (patientData) => {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      throw new Error("Failed to create patient");
    }

    return response.json();
  },

  // Get all patients
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch patients");
    }

    return response.json();
  },

  // Get patient by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      throw new Error("Failed to update patient");
    }

    return response.json();
  },

  // Delete patient
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete patient");
    }

    return response.json();
  },
};
