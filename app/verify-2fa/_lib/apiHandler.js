const API_URL = process.env.NEXT_PUBLIC_API_URL;

// =====================================================
// VERIFY OTP
// =====================================================

const verifyOTPApi = async (userId, otp) => {
  const response = await fetch(
    `${API_URL}/auth/verify-otp`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        userId,
        otp,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "OTP verification failed"
    );
  }

  return data;
};


// =====================================================
// RESEND OTP
// =====================================================

const resendOTPApi = async (userId) => {
  const response = await fetch(
    `${API_URL}/auth/resend-otp`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        userId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to resend OTP"
    );
  }

  return data;
};


module.exports = {
  verifyOTPApi,
  resendOTPApi,
};