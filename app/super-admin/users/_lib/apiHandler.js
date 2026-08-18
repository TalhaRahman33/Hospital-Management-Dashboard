const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

// =====================================================
// PARSE RESPONSE
// =====================================================

const parseResponseData = async (response) => {
  try {
    const text = await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      return {
        message: text,
      };
    }
  } catch {
    return {};
  }
};

// =====================================================
// HANDLE API ERROR
// =====================================================

const handleApiError = async (
  response,
  fallbackMessage
) => {
  const data = await parseResponseData(response);

  const message =
    data?.message || fallbackMessage;

  // Authentication failed
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("authState");
      window.location.href = data?.redirectTo || "/login";
    }
  }

  // Permission denied
  if (response.status === 403) {
    console.error("Access denied:", message);
  }

  throw new Error(message);
};

// =====================================================
// CREATE USER
// =====================================================

export const createUserApi = async (userData) => {
  const response = await fetch(
    `${API_URL}/users`,
    {
      method: "POST",
      headers: buildHeaders(true),
      credentials: "include",
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to create user"
    );
  }

  return await parseResponseData(response);
};

// =====================================================
// GET ALL USERS
// =====================================================

export const getUsersApi = async () => {
  const response = await fetch(
    `${API_URL}/users`,
    {
      method: "GET",
      headers: buildHeaders(),
      credentials: "include",
    }
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to get users"
    );
  }

  return await parseResponseData(response);
};

// =====================================================
// GET SINGLE USER
// =====================================================

export const getUserByIdApi = async (id) => {
  const response = await fetch(
    `${API_URL}/users/${id}`,
    {
      method: "GET",
      headers: buildHeaders(),
      credentials: "include",
    }
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to get user"
    );
  }

  return await parseResponseData(response);
};

// =====================================================
// UPDATE USER
// =====================================================

export const updateUserApi = async (
  id,
  userData
) => {
  const response = await fetch(
    `${API_URL}/users/${id}`,
    {
      method: "PUT",
      headers: buildHeaders(true),
      credentials: "include",
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to update user"
    );
  }

  return await parseResponseData(response);
};

// =====================================================
// DELETE USER
// =====================================================

export const deleteUserApi = async (id) => {
  const response = await fetch(
    `${API_URL}/users/${id}`,
    {
      method: "DELETE",
      headers: buildHeaders(),
      credentials: "include",
    }
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to delete user"
    );
  }

  return await parseResponseData(response);
};

// =====================================================
// GET ALL HOSPITALS
// =====================================================

export const getHospitalsApi = async () => {
  const response = await fetch(
    `${API_URL}/hospitals`,
    {
      method: "GET",
      headers: buildHeaders(),
      credentials: "include",
    }
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to get hospitals"
    );
  }

  return await parseResponseData(response);
};