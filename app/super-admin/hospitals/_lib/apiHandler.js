const API_URL = process.env.NEXT_PUBLIC_API_URL;

// =====================================================
// CREATE HOSPITAL
// =====================================================

export const createHospitalApi = async (hospitalData) => {
  const response = await fetch(`${API_URL}/hospitals`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify(hospitalData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create hospital"
    );
  }

  return data;
};

// =====================================================
// GET ALL HOSPITALS
// =====================================================

export const getHospitalsApi = async () => {
  const response = await fetch(`${API_URL}/hospitals`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get hospitals"
    );
  }

  return data;
};

// =====================================================
// GET SINGLE HOSPITAL
// =====================================================

export const getHospitalByIdApi = async (id) => {
  const response = await fetch(
    `${API_URL}/hospitals/${id}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get hospital"
    );
  }

  return data;
};

// =====================================================
// UPDATE HOSPITAL
// =====================================================

export const updateHospitalApi = async (
  id,
  hospitalData
) => {
  const response = await fetch(
    `${API_URL}/hospitals/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(hospitalData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update hospital"
    );
  }

  return data;
};

// =====================================================
// DELETE HOSPITAL
// =====================================================

export const deleteHospitalApi = async (id) => {
  const response = await fetch(
    `${API_URL}/hospitals/${id}`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete hospital"
    );
  }

  return data;
};