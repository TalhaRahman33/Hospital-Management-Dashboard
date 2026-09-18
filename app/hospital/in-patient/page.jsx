"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, BedDouble, CheckCircle2, Loader2, Search, X } from "lucide-react";
import { inpatientAPI } from "./_lib/apiHandler";
import { getItems } from "../_lib/patientWorkflow";

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");
const getPatient = (record) => record.patient || record.Patient || {};
const getPatientName = (record) => {
  const patient = getPatient(record);
  return patient.name || [patient.firstName, patient.lastName].filter(Boolean).join(" ") || record.patientName;
};

export default function InPatientPage() {
  const [status, setStatus] = useState("ADMITTED");
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState(null);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await inpatientAPI.getAll(status);
      setRecords(getItems(response, "inpatients").filter((record) => !record.status || record.status === status));
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to load inpatient records." });
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    const timer = setTimeout(loadRecords, 0);
    return () => clearTimeout(timer);
  }, [loadRecords]);

  const filteredRecords = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return records;
    return records.filter((record) => {
      const patient = getPatient(record);
      return [getPatientName(record), patient.visitNumber, record.visitNumber, record.admissionReason, record.roomNumber, record.bedNumber]
        .some((field) => String(field || "").toLowerCase().includes(value));
    });
  }, [records, query]);

  const discharge = async () => {
    if (!selected || savingId) return;
    try {
      setSavingId(selected.id);
      await inpatientAPI.discharge(selected.id, "Patient discharged successfully");
      setSelected(null);
      setMessage({ type: "success", text: "Patient discharged successfully." });
      await loadRecords();
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to discharge patient." });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-emerald-600">Patient care</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Inpatient records</h1>
        <p className="mt-1 text-sm text-slate-500">Track admitted patients and preserve discharged records.</p>
      </div>

      {message && <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${message.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
        {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
        {message.text}
      </div>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2">
            {[['ADMITTED', 'Active'], ['DISCHARGED', 'Discharged']].map(([value, label]) => <button key={value} type="button" onClick={() => setStatus(value)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}>{label}</button>)}
          </div>
          <div className="relative w-full lg:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inpatient records" className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500" /></div>
        </div>

        {loading ? <div className="flex justify-center py-14"><Loader2 className="h-6 w-6 animate-spin text-emerald-500" /></div> : filteredRecords.length === 0 ? <div className="flex flex-col items-center py-14 text-center"><BedDouble className="mb-3 h-8 w-8 text-slate-300" /><p className="text-sm text-slate-400">No {status === "ADMITTED" ? "active inpatient" : "discharged patient"} records found.</p></div> : <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100"><table className="w-full min-w-[900px] text-left"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400"><tr>{status === "ADMITTED" ? <><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Visit #</th><th className="px-4 py-3">Admission reason</th><th className="px-4 py-3">Room / Bed</th><th className="px-4 py-3">Admission date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></> : <><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Visit #</th><th className="px-4 py-3">Admitted at</th><th className="px-4 py-3">Discharged at</th><th className="px-4 py-3">Notes</th><th className="px-4 py-3">Status</th></>}</tr></thead><tbody>{filteredRecords.map((record) => { const patient = getPatient(record); return <tr key={record.id} className="border-t border-slate-100 text-sm"><td className="px-4 py-3 font-medium text-slate-800">{getPatientName(record) || `Patient #${record.patientId}`}</td><td className="px-4 py-3 text-slate-600">#{patient.visitNumber || record.visitNumber || "-"}</td>{status === "ADMITTED" ? <><td className="max-w-xs truncate px-4 py-3 text-slate-600">{record.admissionReason || record.reason || "-"}</td><td className="px-4 py-3 text-slate-600">{record.roomNumber || record.room || "-"} / {record.bedNumber || record.bed || "-"}</td><td className="px-4 py-3 text-slate-600">{formatDate(record.admittedAt || record.admissionDate)}</td><td className="px-4 py-3"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">INPATIENT</span></td><td className="px-4 py-3 text-right"><button type="button" onClick={() => setSelected(record)} disabled={savingId !== null} className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-50">Discharge</button></td></> : <><td className="px-4 py-3 text-slate-600">{formatDate(record.admittedAt)}</td><td className="px-4 py-3 text-slate-600">{formatDate(record.dischargedAt)}</td><td className="max-w-xs truncate px-4 py-3 text-slate-600">{record.dischargeNotes || "-"}</td><td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">DISCHARGED</span></td></>}</tr>; })}</tbody></table></div>}
      </section>

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4" onClick={() => !savingId && setSelected(null)}><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Confirm discharge</h2><button type="button" onClick={() => setSelected(null)} disabled={Boolean(savingId)} aria-label="Close"><X className="h-5 w-5 text-slate-400" /></button></div><p className="mt-3 text-sm text-slate-600">Discharge {selected.patient?.name || selected.patientName || "this patient"}? This record will remain available in Discharged.</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setSelected(null)} disabled={Boolean(savingId)} className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</button><button type="button" onClick={discharge} disabled={Boolean(savingId)} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{savingId ? "Discharging..." : "Confirm discharge"}</button></div></div></div>}
    </div>
  );
}
