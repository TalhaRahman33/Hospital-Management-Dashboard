"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ClipboardPlus,
  Loader2,
  Play,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { patientAPI } from "../patient/_lib/apiHandler";
import { checkupAPI } from "./_lib/apiHandler";

const STATUSES = ["", "WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const STATUS_STYLES = {
  WAITING: "bg-amber-50 text-amber-700",
  IN_PROGRESS: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-rose-50 text-rose-700",
};

const getItems = (data, key) => data?.[key] || (Array.isArray(data) ? data : []);

export default function CheckupPatientPage() {
  const [patients, setPatients] = useState([]);
  const [checkups, setCheckups] = useState([]);
  const [status, setStatus] = useState("WAITING");
  const [patientId, setPatientId] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState({ diagnosis: "", prescription: "", notes: "" });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [patientData, checkupData] = await Promise.all([
        patientAPI.getAll(),
        checkupAPI.getAll(status),
      ]);
      setPatients(patientData?.patients || []);
      setCheckups(getItems(checkupData, "checkups"));
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    const timer = setTimeout(loadData, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const filteredCheckups = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return checkups;
    return checkups.filter((item) => {
      const patient = item.patient || {};
      return [patient.name, patient.visitNumber, item.symptoms]
        .some((field) => String(field || "").toLowerCase().includes(value));
    });
  }, [checkups, query]);

  const submit = async (event) => {
    event.preventDefault();
    if (!patientId || !symptoms.trim()) {
      setMessage({ type: "error", text: "Select a patient and enter symptoms." });
      return;
    }

    try {
      setSaving(true);
      await checkupAPI.create({ patientId: Number(patientId), symptoms: symptoms.trim() });
      setPatientId("");
      setSymptoms("");
      setMessage({ type: "success", text: "Patient added to the checkup queue." });
      await loadData();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const updateCheckup = async (id, data, successText) => {
    try {
      setSaving(true);
      await checkupAPI.update(id, data);
      setSelected(null);
      setMessage({ type: "success", text: successText });
      await loadData();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const startCheckup = (item) => updateCheckup(item.id, { status: "IN_PROGRESS" }, "Checkup started.");
  const cancelCheckup = (item) => updateCheckup(item.id, { status: "CANCELLED" }, "Checkup cancelled.");

  const openComplete = (item) => {
    setSelected(item);
    setDetails({
      diagnosis: item.diagnosis || "",
      prescription: item.prescription || "",
      notes: item.notes || "",
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-amber-600">Patient care</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Checkup queue</h1>
        <p className="mt-1 text-sm text-slate-500">Add patients, start their checkup, and record the outcome.</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${message.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {message.text}
          <button type="button" className="ml-auto" onClick={() => setMessage(null)} aria-label="Dismiss message"><XCircle className="h-4 w-4" /></button>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-amber-50 p-2 text-amber-600"><ClipboardPlus className="h-5 w-5" /></div>
          <div><h2 className="font-semibold text-slate-900">Add to queue</h2><p className="text-xs text-slate-500">Only active duplicate checkups are rejected by the server.</p></div>
        </div>
        <form onSubmit={submit} className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.5fr_auto] lg:items-end">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Patient
            <select value={patientId} onChange={(event) => setPatientId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100" disabled={saving}>
            <option value="">Choose a patient</option>
            {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} · #{patient.visitNumber}</option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Symptoms
            <input value={symptoms} onChange={(event) => setSymptoms(event.target.value)} placeholder="e.g. fever, headache, or reason for visit" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100" disabled={saving} />
          </label>
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"><Plus className="h-4 w-4" />Add patient</button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">{STATUSES.map((value) => <button key={value || "ALL"} type="button" onClick={() => setStatus(value)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{value || "ALL"}</button>)}</div>
          <div className="relative w-full lg:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search queue" className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-amber-500" /></div>
        </div>

        {loading ? <div className="flex justify-center py-14"><Loader2 className="h-6 w-6 animate-spin text-amber-500" /></div> : filteredCheckups.length === 0 ? <div className="py-14 text-center text-sm text-slate-400">No checkups in this queue.</div> : <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100"><table className="w-full min-w-[720px] text-left"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400"><tr><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Symptoms</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>{filteredCheckups.map((item) => { const patient = item.patient || {}; return <tr key={item.id} className="border-t border-slate-100 text-sm"><td className="px-4 py-3"><p className="font-medium text-slate-800">{patient.name || `Patient #${item.patientId}`}</p><p className="text-xs text-slate-400">Visit #{patient.visitNumber || "-"}</p></td><td className="max-w-xs truncate px-4 py-3 text-slate-600" title={item.symptoms}>{item.symptoms || "-"}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[item.status] || "bg-slate-100 text-slate-600"}`}>{item.status}</span></td><td className="px-4 py-3"><div className="flex justify-end gap-2">{item.status === "WAITING" && <button type="button" onClick={() => startCheckup(item)} disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 disabled:opacity-50"><Play className="h-3.5 w-3.5" />Start</button>}{item.status === "IN_PROGRESS" && <button type="button" onClick={() => openComplete(item)} disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"><Activity className="h-3.5 w-3.5" />Complete</button>}{["WAITING", "IN_PROGRESS"].includes(item.status) && <button type="button" onClick={() => cancelCheckup(item)} disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"><XCircle className="h-3.5 w-3.5" />Cancel</button>}</div></td></tr>; })}</tbody></table></div>}
      </section>

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4" onClick={() => setSelected(null)}><form onSubmit={(event) => { event.preventDefault(); updateCheckup(selected.id, { status: "COMPLETED", ...details }, "Checkup completed."); }} onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-lg font-semibold text-slate-900">Complete checkup</h2><p className="mt-1 text-sm text-slate-500">{selected.patient?.name || `Patient #${selected.patientId}`}</p><div className="mt-5 space-y-4">{[["diagnosis", "Diagnosis"], ["prescription", "Prescription"], ["notes", "Notes"]].map(([field, label]) => <label key={field} className="block text-sm font-medium text-slate-600">{label}<textarea value={details[field]} onChange={(event) => setDetails((current) => ({ ...current, [field]: event.target.value }))} rows={field === "notes" ? 3 : 2} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-emerald-500" disabled={saving} /></label>)}</div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setSelected(null)} className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Close</button><button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">{saving ? "Saving..." : "Complete checkup"}</button></div></form></div>}
    </div>
  );
}
