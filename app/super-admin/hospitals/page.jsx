"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import HospitalDialog from "./components/HospitalDialog";
import HospitalTable from "./components/HospitalTable";

export default function HospitalsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleHospitalSaved = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Hospital Management</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Hospitals</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Create, review, and manage hospital records with a clean and focused interface.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          Add Hospital
        </button>
      </section>

      <HospitalTable refreshKey={refreshKey} onEditRequested={handleHospitalSaved} />

      <HospitalDialog
        open={dialogOpen}
        mode="create"
        onClose={() => setDialogOpen(false)}
        onSaved={handleHospitalSaved}
      />
    </div>
  );
}