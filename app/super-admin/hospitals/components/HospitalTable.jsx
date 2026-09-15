"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  AlertCircle,
  Building2,
  Hash,
  Inbox,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  deleteHospitalApi,
  getHospitalsApi,
} from "../_lib/apiHandler";
import HospitalDialog from "./HospitalDialog";

const statusStyles = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive: "border-slate-200 bg-slate-100 text-slate-600",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
};

export default function HospitalTable({ refreshKey }) {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  const loadHospitals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHospitalsApi();
      setHospitals(data.hospitals || []);
    } catch (error) {
      setError(
        error?.message || "Unable to load hospitals. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHospitals();
  }, [loadHospitals, refreshKey]);

  const handleDelete = async (hospital) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete hospital?",
      text: `${hospital.name} will be permanently removed.`,
      showCancelButton: true,
      confirmButtonText: "Delete hospital",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(hospital.id);
      await deleteHospitalApi(hospital.id);

      setHospitals((current) =>
        current.filter((item) => item.id !== hospital.id)
      );

      Swal.fire({
        icon: "success",
        title: "Hospital deleted",
        text: `${hospital.name} has been removed.`,
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to delete hospital",
        text: error?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#0284c7",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleHospitalUpdated = (updatedHospital) => {
    setHospitals((current) =>
      current.map((item) =>
        item.id === updatedHospital.id
          ? { ...item, ...updatedHospital }
          : item
      )
    );
  };

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-col gap-4 border-b border-slate-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Registered hospitals
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {loading
                  ? "Loading hospital records..."
                  : `${hospitals.length} ${
                      hospitals.length === 1 ? "facility" : "facilities"
                    } in your network`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadHospitals}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </header>

        {error && (
          <div className="m-4 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:m-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={loadHospitals}
              className="font-semibold underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-sky-600" />
            <p className="text-sm text-slate-500">
              Loading hospital records...
            </p>
          </div>
        )}

        {!loading && !error && hospitals.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Inbox className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="font-semibold text-slate-900">
              No hospitals found
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Add your first hospital to start managing facilities in your
              network.
            </p>
          </div>
        )}

        {!loading && !error && hospitals.length > 0 && (
          <>
            {/* Mobile cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {hospitals.map((hospital) => {
                const status = hospital.status?.toLowerCase() || "pending";

                return (
                  <article key={hospital.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900">
                          {hospital.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <Hash className="h-3.5 w-3.5" />
                          {hospital.code}
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                          statusStyles[status] || statusStyles.pending
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <span>
                          {[hospital.address, hospital.city]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </p>

                      {hospital.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          {hospital.phone}
                        </p>
                      )}

                      {hospital.email && (
                        <p className="flex items-center gap-2 break-all">
                          <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                          {hospital.email}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing({ ...hospital })}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(hospital)}
                        disabled={deletingId === hospital.id}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                      >
                        {deletingId === hospital.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50/80">
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3.5">Hospital</th>
                    <th className="px-4 py-3.5">Code</th>
                    <th className="px-4 py-3.5">Location</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {hospitals.map((hospital) => {
                    const status =
                      hospital.status?.toLowerCase() || "pending";

                    return (
                      <tr
                        key={hospital.id}
                        className="transition hover:bg-sky-50/40"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">
                            {hospital.name}
                          </p>

                          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            {hospital.phone && (
                              <span className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5" />
                                {hospital.phone}
                              </span>
                            )}

                            {hospital.email && (
                              <span className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                {hospital.email}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                            <Hash className="h-3.5 w-3.5" />
                            {hospital.code}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-start gap-2 text-slate-600">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                            <div>
                              <p>{hospital.city || "Not specified"}</p>
                              {hospital.address && (
                                <p className="mt-0.5 max-w-52 truncate text-xs text-slate-400">
                                  {hospital.address}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                              statusStyles[status] || statusStyles.pending
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditing({ ...hospital })}
                              aria-label={`Edit ${hospital.name}`}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(hospital)}
                              disabled={deletingId === hospital.id}
                              aria-label={`Delete ${hospital.name}`}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 px-3 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId === hospital.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <HospitalDialog
        open={Boolean(editing)}
        mode="edit"
        hospital={editing}
        onClose={() => setEditing(null)}
        onSaved={handleHospitalUpdated}
      />
    </>
  );
}