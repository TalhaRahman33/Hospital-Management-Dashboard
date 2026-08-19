// components/PatientForm.jsx
"use client";

import { useState, useEffect } from "react";
import { User, CreditCard, Users, ClipboardList, Loader2, AlertCircle } from "lucide-react";

const GENDER_OPTIONS = [
  { value: "Male", accent: "#6366F1" },
  { value: "Female", accent: "#14B8A6" },
  { value: "Other", accent: "#F59E0B" },
];

const PURPOSE_OPTIONS = ["Medical", "Non Medical"];

const CNIC_DIGIT_LIMIT = 13;

const formatCnic = (digits) => {
  if (digits.length > 12) {
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  }
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
};

export default function PatientForm({ initialData = null, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    cnic: "",
    gender: "",
    purposeOfVisit: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        cnic: initialData.cnic || "",
        gender: initialData.gender || "",
        purposeOfVisit: initialData.purposeOfVisit || "",
      });
    }
  }, [initialData]);

  const cnicDigits = formData.cnic.replace(/\D/g, "");
  const isCnicIncomplete = cnicDigits.length > 0 && cnicDigits.length < CNIC_DIGIT_LIMIT;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.cnic.trim()) {
      newErrors.cnic = "CNIC is required";
    } else if (cnicDigits.length < CNIC_DIGIT_LIMIT) {
      newErrors.cnic = `CNIC must be ${CNIC_DIGIT_LIMIT} digits`;
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.purposeOfVisit.trim()) {
      newErrors.purposeOfVisit = "Purpose of visit is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCnicChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, CNIC_DIGIT_LIMIT);
    const formatted = formatCnic(digits);

    setFormData((prev) => ({ ...prev, cnic: formatted }));
    if (errors.cnic) {
      setErrors((prev) => ({ ...prev, cnic: "" }));
    }
  };

  const handleGenderSelect = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const inputBase =
    "mt-1.5 block w-full rounded-lg border bg-white pl-10 pr-3 py-2.5 text-[13.5px] text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0";

  const cnicHasError = Boolean(errors.cnic) || isCnicIncomplete;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="text-[12.5px] font-medium text-slate-600">
          Patient Name
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2} />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${inputBase} ${
              errors.name
                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-200 focus:border-[#6366F1] focus:ring-[#6366F1]/15"
            }`}
            placeholder="Enter patient name"
            disabled={isLoading}
          />
        </div>
        {errors.name && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
            <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
            {errors.name}
          </p>
        )}
      </div>

      {/* CNIC */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="cnic" className="text-[12.5px] font-medium text-slate-600">
            CNIC
          </label>
          <span
            className={`font-['JetBrains_Mono'] text-[11px] font-medium ${
              cnicHasError ? "text-rose-500" : cnicDigits.length === CNIC_DIGIT_LIMIT ? "text-[#0d9488]" : "text-slate-400"
            }`}
          >
            ({cnicDigits.length}/{CNIC_DIGIT_LIMIT})
          </span>
        </div>
        <div className="relative">
          <CreditCard className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2} />
          <input
            type="text"
            inputMode="numeric"
            id="cnic"
            name="cnic"
            value={formData.cnic}
            onChange={handleCnicChange}
            maxLength={15}
            className={`${inputBase} font-['JetBrains_Mono'] tracking-wide ${
              cnicHasError
                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100 text-rose-600"
                : "border-slate-200 focus:border-[#6366F1] focus:ring-[#6366F1]/15"
            }`}
            placeholder="16201-9869560-2"
            disabled={isLoading}
          />
        </div>
        {errors.cnic ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
            <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
            {errors.cnic}
          </p>
        ) : isCnicIncomplete ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
            <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
            {CNIC_DIGIT_LIMIT - cnicDigits.length} digit(s) remaining
          </p>
        ) : null}
      </div>

      {/* Gender */}
      <div>
        <label className="text-[12.5px] font-medium text-slate-600">Gender</label>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {GENDER_OPTIONS.map(({ value, accent }) => {
            const isActive = formData.gender === value;
            return (
              <button
                key={value}
                type="button"
                disabled={isLoading}
                onClick={() => handleGenderSelect(value)}
                className="rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: isActive ? accent : "#E2E8F0",
                  backgroundColor: isActive ? `${accent}14` : "#FFFFFF",
                  color: isActive ? accent : "#64748B",
                }}
              >
                {value}
              </button>
            );
          })}
        </div>
        {errors.gender && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
            <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
            {errors.gender}
          </p>
        )}
      </div>

      {/* Purpose of visit */}
      <div>
        <label htmlFor="purposeOfVisit" className="text-[12.5px] font-medium text-slate-600">
          Purpose of Visit
        </label>
        <div className="relative">
          <ClipboardList className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2} />
          <select
            id="purposeOfVisit"
            name="purposeOfVisit"
            value={formData.purposeOfVisit}
            onChange={handleChange}
            className={`${inputBase} appearance-none pr-8 ${
              errors.purposeOfVisit
                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-200 focus:border-[#6366F1] focus:ring-[#6366F1]/15"
            }`}
            disabled={isLoading}
          >
            <option value="">Select purpose</option>
            {PURPOSE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {errors.purposeOfVisit && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
            <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
            {errors.purposeOfVisit}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#14B8A6] px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-105 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />}
        {isLoading ? "Saving..." : initialData ? "Update Patient" : "Add Patient"}
      </button>
    </form>
  );
}