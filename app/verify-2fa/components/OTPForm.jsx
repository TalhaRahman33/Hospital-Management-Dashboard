"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  verifyOTPApi,
  resendOTPApi,
} from "../_lib/apiHandler";

import { useAuthStore } from "@/store/authStore";

export default function OTPForm() {
  const router = useRouter();

  const loginUser = useAuthStore(
    (state) => state.loginUser
  );

  const [userId, setUserId] = useState(null);

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");

  // 60 seconds resend countdown
  const [countdown, setCountdown] = useState(60);


  // =====================================================
  // GET USER ID
  // =====================================================

  useEffect(() => {
    const storedUserId =
      sessionStorage.getItem("loginUserId");

    if (!storedUserId) {
      router.replace("/login");
      return;
    }

    setUserId(storedUserId);
  }, [router]);


  // =====================================================
  // COUNTDOWN
  // =====================================================

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);


  // =====================================================
  // OTP INPUT
  // =====================================================

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    setOtp(value.slice(0, 6));

    setError("");
  };


  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError(
        "User session expired. Please login again."
      );
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await verifyOTPApi(
        userId,
        otp
      );

      const token =
        data?.accessToken ||
        data?.token ||
        data?.authToken ||
        data?.data?.accessToken ||
        data?.data?.token ||
        data?.data?.authToken;

      const user =
        data?.user ||
        data?.data?.user ||
        null;

      // Save authentication
      if (token) {
        loginUser(token, user);
      }

      // Remove temporary login session
      sessionStorage.removeItem(
        "loginUserId"
      );

      // Role based redirect
      switch (user?.roleId) {
        case 1:
          router.replace(
            "/super-admin/dashboard"
          );
          break;

        case 2:
          router.replace(
            "/pmo/dashboard"
          );
          break;

        case 3:
          router.replace(
            "/dmo/dashboard"
          );
          break;

        case 4:
          router.replace(
            "/hospital/home"
          );
          break;

        case 5:
          router.replace(
            "/hospital/home"
          );
          break;

        default:
          setError(
            "Your account role is not configured."
          );
      }

    } catch (error) {
      setError(
        error.message || "Invalid OTP."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOTP = async () => {
    if (!userId) {
      setError(
        "User session expired. Please login again."
      );
      return;
    }

    // Don't allow before countdown ends
    if (countdown > 0) {
      return;
    }

    setError("");
    setResending(true);

    try {
      await resendOTPApi(userId);

      // Clear previous OTP
      setOtp("");

      // Restart countdown
      setCountdown(60);

    } catch (error) {
      setError(
        error.message || "Failed to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60"
    >

      {/* HEADER */}

      <div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-blue-600"
          >
            <rect
              x="3"
              y="11"
              width="18"
              height="11"
              rx="2"
              ry="2"
            />

            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>

        </div>

        <h1 className="text-center text-2xl font-bold text-gray-900">
          Verify Your Login
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Enter the 6-digit OTP sent to your
          registered email address.
        </p>
      </div>


      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* OTP */}

      <div>

        <label
          htmlFor="otp"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Verification Code
        </label>

        <input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={handleChange}
          placeholder="000000"
          maxLength={6}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-xl font-semibold tracking-[0.5em] text-gray-900 placeholder-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>


      {/* VERIFY BUTTON */}

      <button
        type="submit"
        disabled={
          loading ||
          otp.length !== 6
        }
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Verifying..."
          : "Verify OTP"}
      </button>


      {/* RESEND SECTION */}

      <div className="text-center text-sm">

        {countdown > 0 ? (
          <p className="text-gray-500">
            Didn&apos;t receive the code?{" "}

            <span className="font-medium text-gray-700">
              Resend in {countdown}s
            </span>
          </p>
        ) : (
          <p className="text-gray-500">

            Didn&apos;t receive the code?{" "}

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              className="font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending
                ? "Sending..."
                : "Resend OTP"}
            </button>

          </p>
        )}

      </div>

    </form>
  );
}