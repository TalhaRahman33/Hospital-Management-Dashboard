// HospitalTable.jsx
"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getHospitalsApi,
  deleteHospitalApi,
} from "../_lib/apiHandler";
import {
  Building2,
  Hash,
  MapPin,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  Inbox,
  Pencil,
  Trash2,
} from "lucide-react";
import HospitalDialog from "./HospitalDialog";

const statusStyles = {
  active: "bg-teal-50 text-teal-700 border-teal-200",
  inactive: "bg-slate-100 text-slate-500 border-slate-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function HospitalTable({ refreshKey, onEditRequested }) {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  const loadHospitals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHospitalsApi();
      setHospitals(data.hospitals || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, [refreshKey]);

  const handleDelete = async (hospital) => {
    const result = await Swal.fire({
      title: `Delete ${hospital.name}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteHospitalApi(hospital.id);
      setHospitals((prev) => prev.filter((h) => h.id !== hospital.id));

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: `${hospital.name} was removed.`,
        confirmButtonColor: "#0d9488",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Couldn't delete hospital",
        text: err.message,
        confirmButtonColor: "#0d9488",
      });
    }
  };

  const openEdit = (hospital) => setEditing({ ...hospital });

  const closeEdit = () => {
    setEditing(null);
  };

  const handleDialogSaved = (savedHospital) => {
    setHospitals((prev) => {
      if (editing?.id) {
        return prev.map((h) => (h.id === editing.id ? { ...h, ...savedHospital } : h));
      }

      return [savedHospital, ...prev];
    });

    setEditing(null);

    if (onEditRequested) {
      onEditRequested(savedHospital);
    }
  };

  return (
    <div className="rounded-2xl border border-sky-100 bg-white/80 backdrop-blur-sm p-6 shadow-lg shadow-sky-100/60">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 shadow-md shadow-teal-200">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-800">Hospitals</h2>
          <p className="text-sm text-slate-500">
            {hospitals.length} registered {hospitals.length === 1 ? "facility" : "facilities"}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading hospitals...
        </div>
      )}

      {!loading && !error && hospitals.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <Inbox className="h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-500">No hospitals found.</p>
          <p className="text-xs text-slate-400">Newly added hospitals will show up here.</p>
        </div>
      )}

      {!loading && !error && hospitals.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2 font-medium">Hospital</th>
                <th className="px-3 py-2 font-medium">Code</th>
                <th className="px-3 py-2 font-medium">City</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map((hospital) => (
                <tr key={hospital.id} className="border-b border-slate-50 transition hover:bg-teal-50/40">
                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-800">{hospital.name}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                      {hospital.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {hospital.phone}
                        </span>
                      )}
                      {hospital.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {hospital.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      <Hash className="h-3 w-3" />
                      {hospital.code}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {hospital.city}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${
                        statusStyles[hospital.status] || statusStyles.pending
                      }`}
                    >
                      {hospital.status || "pending"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(hospital)}
                        className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hospital)}
                        className="flex items-center gap-1 rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <HospitalDialog
        open={Boolean(editing)}
        mode="edit"
        hospital={editing}
        onClose={closeEdit}
        onSaved={handleDialogSaved}
      />
    </div>
  );
}