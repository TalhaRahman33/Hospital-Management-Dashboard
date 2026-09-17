"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, BedDouble, CheckCircle2, Loader2, Search, XCircle } from "lucide-react";
import { checkupAPI } from "../checkup-patient/_lib/apiHandler";
import { getItems } from "../_lib/patientWorkflow";

export default function InPatientPage() {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const loadPatients = useCallback(async () => {
    try {
      setLoading(true);
      setMessage(null);
      const response = await checkupAPI.getAll("COMPLETED");
      setPatients(getItems(response, "checkups"));
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to load in-patients." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadPatients, 0);
    return () => clearTimeout(timer);
  }, [loadPatients]);

  const filteredPatients = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return patients;
    return patients.filter((item) => {
      const patient = item.patient || {};
      return [patient.name, patient.visitNumber, patient.cnic, item.diagnosis]
        .some((field) => String(field || "").toLowerCase().includes(value));
    });
  }, [patients, query]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-emerald-600">Patient care</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">In-Patients</h1>
        <p className="mt-1 text-sm text-slate-500">Patients whose check-up has been completed.</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${message.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {message.text}
          <button type="button" className="ml-auto" onClick={() => setMessage(null)} aria-label="Dismiss message"><XCircle className="h-4 w-4" /></button>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex justify-end">
          <div className="relative w-full lg:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search in-patients" className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500" /></div>
        </div>

        {loading ? <div className="flex justify-center py-14"><Loader2 className="h-6 w-6 animate-spin text-emerald-500" /></div> : filteredPatients.length === 0 ? <div className="flex flex-col items-center justify-center py-14 text-center"><BedDouble className="mb-3 h-8 w-8 text-slate-300" /><p className="text-sm text-slate-400">No in-patients found.</p></div> : <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100"><table className="w-full min-w-[720px] text-left"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400"><tr><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Visit #</th><th className="px-4 py-3">Diagnosis</th><th className="px-4 py-3">Prescription</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{filteredPatients.map((item) => { const patient = item.patient || {}; return <tr key={item.id} className="border-t border-slate-100 text-sm"><td className="px-4 py-3"><p className="font-medium text-slate-800">{patient.name || `Patient #${item.patientId}`}</p><p className="text-xs text-slate-400">{patient.cnic || "CNIC unavailable"}</p></td><td className="px-4 py-3 text-slate-600">#{patient.visitNumber || "-"}</td><td className="max-w-xs truncate px-4 py-3 text-slate-600" title={item.diagnosis}>{item.diagnosis || "-"}</td><td className="max-w-xs truncate px-4 py-3 text-slate-600" title={item.prescription}>{item.prescription || "-"}</td><td className="px-4 py-3"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">IN-PATIENT</span></td></tr>; })}</tbody></table></div>}
      </section>
    </div>
  );
}