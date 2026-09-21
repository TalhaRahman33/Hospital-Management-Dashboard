"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, DoorOpen, Loader2, Search } from "lucide-react";
import { dischargedPatientAPI } from "./_lib/apiHandler";

const getItems = (data) => {
  if (Array.isArray(data)) return data;

  const containers = [data, data?.data, data?.result, data?.payload];
  for (const container of containers) {
    if (Array.isArray(container)) return container;
    for (const key of ["dischargedPatients", "dischargedpatients", "dischargedPatient"]) {
      if (Array.isArray(container?.[key])) return container[key];
    }
  }

  return [];
};

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");
const getPatient = (record) => record.patient || record.Patient || {};
const getPatientName = (record) => {
  const patient = getPatient(record);
  return patient.name || [patient.firstName, patient.lastName].filter(Boolean).join(" ") || record.patientName || "-";
};

export default function DischargePatientPage() {
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setMessage(null);
      setRecords(getItems(await dischargedPatientAPI.getAll()));
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to load discharged patients." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadRecords, 0);
    return () => clearTimeout(timer);
  }, [loadRecords]);

  const filteredRecords = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return records;

    return records.filter((record) => {
      const patient = getPatient(record);
      return [
        getPatientName(record),
        patient.visitNumber,
        record.visitNumber,
        record.dischargeNotes,
        record.notes,
        record.roomNumber,
        record.bedNumber,
      ].some((field) => String(field || "").toLowerCase().includes(value));
    });
  }, [records, query]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-rose-600">Patient care</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Discharged patients</h1>
        <p className="mt-1 text-sm text-slate-500">Review the separate discharge history for this hospital.</p>
      </div>

      {message && <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><AlertCircle className="h-4 w-4" />{message.text}</div>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500">{filteredRecords.length} discharged {filteredRecords.length === 1 ? "patient" : "patients"}</p>
          <div className="relative w-full lg:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search discharged patients" className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-rose-500" /></div>
        </div>

        {loading ? <div className="flex justify-center py-14"><Loader2 className="h-6 w-6 animate-spin text-rose-500" /></div> : filteredRecords.length === 0 ? <div className="flex flex-col items-center py-14 text-center"><DoorOpen className="mb-3 h-8 w-8 text-slate-300" /><p className="text-sm text-slate-400">No discharged patients found.</p></div> : <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100"><table className="w-full min-w-[900px] text-left"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400"><tr><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Visit #</th><th className="px-4 py-3">Admitted at</th><th className="px-4 py-3">Discharged at</th><th className="px-4 py-3">Notes</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{filteredRecords.map((record) => { const patient = getPatient(record); return <tr key={record.id} className="border-t border-slate-100 text-sm"><td className="px-4 py-3 font-medium text-slate-800">{getPatientName(record)}</td><td className="px-4 py-3 text-slate-600">#{patient.visitNumber || record.visitNumber || "-"}</td><td className="px-4 py-3 text-slate-600">{formatDate(record.admittedAt || record.admissionDate)}</td><td className="px-4 py-3 text-slate-600">{formatDate(record.dischargedAt || record.dischargeDate || record.createdAt)}</td><td className="max-w-xs truncate px-4 py-3 text-slate-600">{record.dischargeNotes || record.notes || "-"}</td><td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700"><CheckCircle2 className="h-3.5 w-3.5" />Discharged</span></td></tr>; })}</tbody></table></div>}
      </section>
    </div>
  );
}