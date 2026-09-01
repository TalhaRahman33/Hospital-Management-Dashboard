"use client";

import { useEffect, useState } from "react";
import { X, UserRoundCog } from "lucide-react";
import HospitalHRForm from "./HospitalHRForm";

export default function HospitalHRDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading,
  hospitalName,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timeout = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(timeout);
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
        className={`w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 ${
          show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
        }`}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#F97316] to-[#F59E0B]" />

        <div className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F97316]/10">
                <UserRoundCog className="h-5 w-5 text-[#F97316]" strokeWidth={2.25} />
              </div>
              <div>
                <h2 className="font-['Space_Grotesk'] text-[17px] font-semibold leading-tight text-slate-900">
                  {initialData ? "Edit Employee" : "Add New Employee"}
                </h2>
                <p className="mt-0.5 text-[11.5px] text-slate-400">
                  {initialData ? "Update employee record" : `Add a staff member for ${hospitalName || "this hospital"}`}
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

          <HospitalHRForm
            initialData={initialData}
            onSubmit={onSubmit}
            isLoading={isLoading}
            hospitalName={hospitalName}
          />
        </div>
      </div>
    </div>
  );
}
