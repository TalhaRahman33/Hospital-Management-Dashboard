"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  forgotPasswordApi,
  resetPasswordApi,
} from "../../login/_lib/apiHandler";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState("request");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleRequestCode = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await forgotPasswordApi(formData.email);
      setStep("reset");
      setSuccess("If an account exists for this email, a reset code has been sent.");
    } catch (requestError) {
      setError(requestError.message || "Unable to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.otp.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Your new password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPasswordApi(
        formData.email,
        formData.otp,
        formData.newPassword
      );
      setSuccess("Your password has been reset. You can now sign in.");
      setStep("complete");
    } catch (resetError) {
      setError(resetError.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
      <div className="mb-8">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {step === "request" && "Forgot your password?"}
          {step === "reset" && "Create a new password"}
          {step === "complete" && "Password reset complete"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {step === "request" && "Enter your email and we will send you a reset code."}
          {step === "reset" && `Enter the code sent to ${formData.email}.`}
          {step === "complete" && success}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && step !== "complete" && (
        <div
          role="status"
          className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700"
        >
          {success}
        </div>
      )}

      {step === "request" && (
        <form onSubmit={handleRequestCode} className="space-y-4" noValidate>
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-900/10"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending code..." : "Send reset code"}
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
          <label className="block text-sm font-medium text-slate-700" htmlFor="otp">
            Reset code
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              value={formData.otp}
              onChange={(event) =>
                handleChange({
                  target: {
                    name: "otp",
                    value: event.target.value.replace(/\D/g, "").slice(0, 6),
                  },
                })
              }
              placeholder="123456"
              autoComplete="one-time-code"
              required
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-900/10"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700" htmlFor="newPassword">
            New password
            <div className="relative mt-1.5">
              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-11 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-900/10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((previous) => !previous)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-slate-600"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                >
                  {showNewPassword ? (
                    <>
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </>
                  ) : (
                    <>
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </label>
          <label className="block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
            Confirm password
            <div className="relative mt-1.5">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-11 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-900/10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-slate-600"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                >
                  {showConfirmPassword ? (
                    <>
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </>
                  ) : (
                    <>
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Resetting password..." : "Reset password"}
          </button>
        </form>
      )}

      {step === "complete" && (
        <button
          type="button"
          onClick={() => router.replace("/login")}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Return to login
        </button>
      )}

      {step !== "complete" && (
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-5 w-full text-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Back to login
        </button>
      )}
    </section>
  );
}
