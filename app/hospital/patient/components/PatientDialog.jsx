// components/PatientDialog.jsx
"use client";

import { useEffect, useState } from "react";
import { X, BedDouble } from "lucide-react";
import PatientForm from "./PatientForm";

export default function PatientDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(raf);
    }
    setShow(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0B1526]/60 backdrop-blur-sm px-4 transition-opacity duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 ${
          show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
        }`}
      >
        {/* Accent top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#6366F1] to-[#14B8A6]" />

        <div className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6366F1]/10">
                <BedDouble className="h-5 w-5 text-[#6366F1]" strokeWidth={2.25} />
              </div>
              <div>
                <h2 className="font-['Space_Grotesk'] text-[17px] font-semibold leading-tight text-slate-900">
                  {initialData ? "Edit Patient" : "Add New Patient"}
                </h2>
                <p className="text-[11.5px] text-slate-400 mt-0.5">
                  {initialData ? "Update patient record" : "Register a new patient"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>
          </div>

          <PatientForm
            initialData={initialData}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}