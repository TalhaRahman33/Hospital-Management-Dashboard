"use client";

import { useState } from "react";
import { Building2, Plus } from "lucide-react";
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
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm sm:flex">
                <Building2 className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
                  Facility management
                </p>

                <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Hospitals
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Add and manage hospital information from one simple,
                  organized workspace.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add hospital
            </button>
          </div>
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