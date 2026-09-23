"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { loginApi } from "../_lib/apiHandler";
import { useAuthStore } from "@/store/authStore";

export default function LoginForm() {
  const router = useRouter();
  const loginUser = useAuthStore((state) => state.loginUser);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginApi(
        formData.email,
        formData.password
      );

      if (data.requires2FA) {
        sessionStorage.setItem(
          "loginUserId",
          String(data.userId)
        );

        router.push("/verify-2fa");
        return;
      }

      const token = data?.accessToken || data?.token || data?.authToken || data?.data?.accessToken || data?.data?.token || data?.data?.authToken;
      const user = data?.user || data?.profile || data?.data?.user || data?.data?.profile || null;

      if (token) {
        loginUser(token, user);
      }

      sessionStorage.removeItem("loginUserId");

      const roleId = user?.roleId ?? data.roleId;

      if (roleId === 1) {
        router.replace("/super-admin/dashboard");
      } else if (roleId === 2) {
        router.replace("/pmo/dashboard");
      } else if (roleId === 3) {
        router.replace("/dmo/dashboard");
      } else if (roleId === 4 || roleId === 5 || roleId === 6) {
        router.replace("/hospital/home");
      } else {
        setError("Your account role is not configured.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left — visual panel */}
      <div className="relative hidden w-1/2 shrink-0 overflow-hidden bg-slate-900 lg:block">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />

        {/* Subtle grid pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.07]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Soft accent glow */}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4.5 w-4.5 text-white"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-white">
              Hospital Management System
            </span>
          </div>

          <div className="max-w-md">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>

            <h2 className="text-3xl font-semibold leading-tight text-white xl:text-4xl">
              Care, coordinated in one place
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Manage patients, staff, and operations across your facilities
              from a single, secure dashboard.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
              <div>
                <div className="text-xl font-semibold text-white">24/7</div>
                <div className="mt-1 text-xs text-slate-400">
                  System uptime
                </div>
              </div>
              <div>
                <div className="text-xl font-semibold text-white">HIPAA</div>
                <div className="mt-1 text-xs text-slate-400">Compliant</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-white">256-bit</div>
                <div className="mt-1 text-xs text-slate-400">Encryption</div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Hospital Management System. All
            rights reserved.
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex w-full flex-1 items-center justify-center overflow-y-auto bg-white px-6 py-10 sm:px-10 lg:w-1/2">
        <div className="w-full max-w-[420px]">
          {/* Logo shown only on mobile/tablet, where the left panel is hidden */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4.5 w-4.5 text-white"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-900">
              Hospital Management System
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-900/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-slate-600"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-[18px] w-[18px]"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-[18px] w-[18px]"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

         

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Protected access &middot; Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}