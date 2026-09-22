"use client";

import { useEffect, useState } from "react";
import { DollarSign, X } from "lucide-react";
import PackageRateForm from "./PackageRateForm";

export default function PackageRateDialog({ isOpen, onClose, onSubmit, initialData, isLoading }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(frame);
    }
    const frame = requestAnimationFrame(() => setShow(false));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm transition-opacity ${show ? "opacity-100" : "opacity-0"}`} onClick={onClose}>
      <div onClick={(event) => event.stopPropagation()} className={`w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all ${show ? "scale-100" : "scale-95"}`}>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50"><DollarSign className="h-5 w-5 text-sky-600" /></div><div><h2 className="text-lg font-semibold text-slate-900">{initialData ? "Edit Package Rate" : "Add Package Rate"}</h2><p className="text-xs text-slate-400">Set treatment pricing for this hospital</p></div></div>
          <button type="button" onClick={onClose} disabled={isLoading} aria-label="Close" className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <PackageRateForm initialData={initialData} onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}