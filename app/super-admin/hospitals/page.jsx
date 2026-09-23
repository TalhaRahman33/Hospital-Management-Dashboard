"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import HospitalDialog from "./components/HospitalDialog";
import HospitalTable from "./components/HospitalTable";

export default function HospitalsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleHospitalCreated = () => {
    setRefreshKey((current) => current + 1);
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <div className="w-full px-0 py-1 sm:py-2">
        <section className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              Facility management
            </p>

            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Hospitals
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 sm:w-auto md:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add hospital
          </button>
        </section>

        <HospitalTable refreshKey={refreshKey} />

        <HospitalDialog
          open={dialogOpen}
          mode="create"
          onClose={() => setDialogOpen(false)}
          onSaved={handleHospitalCreated}
        />
      </div>
    </div>
  );
}