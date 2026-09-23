"use client";

import { useEffect, useState } from "react";
import { BedDouble, CalendarDays, DoorOpen, Loader2 } from "lucide-react";
import { dashboardAPI } from "./_lib/apiHandler";
import { getItems } from "../_lib/patientWorkflow";

const getDate = (item) => item.createdAt || item.created_at || item.date || item.admittedAt || item.admissionDate || item.dischargedAt || item.dischargeDate;

const isInPeriod = (value, period) => {
  if (period === "all") return true;
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  if (Number.isNaN(date.getTime())) return false;
  if (period === "today") return date.toDateString() === now.toDateString();
  if (period === "month") return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  return date.getFullYear() === now.getFullYear();
};

const countInPeriod = (items, period) => items.filter((item) => isInPeriod(getDate(item), period)).length;

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardAPI.getData().then(setData).catch((loadError) => setError(loadError.message || "Failed to load dashboard data."));
  }, []);

  if (!data && !error) return <div className="flex justify-center py-24"><Loader2 className="h-7 w-7 animate-spin text-teal-500" /></div>;

  const inpatients = getItems(data?.inpatients, "inpatients");
  const discharged = getItems(data?.dischargedPatients, "dischargedPatients");
  const activeInpatients = inpatients.filter((item) => !item.status || item.status === "ADMITTED");
  const periodStats = [["Today", "today"], ["This month", "month"], ["This year", "year"], ["All time", "all"]];
  const graphData = periodStats.map(([label, period]) => ({
    label,
    active: period === "all" ? activeInpatients.length : countInPeriod(activeInpatients, period),
    discharged: countInPeriod(discharged, period),
  }));
  const graphMax = Math.max(1, ...graphData.flatMap(({ active, discharged: dischargedCount }) => [active, dischargedCount]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-600">Hospital overview</p>
          <h1 className="text-2xl font-semibold text-slate-900">Live operations dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Patient and care activity from your hospital.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-600"><CalendarDays className="h-4 w-4 text-teal-500" />{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">In-patient and discharge overview</h3>
            <p className="text-sm text-slate-500">Active admissions compared with discharged patients</p>
          </div>
          <div className="flex gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-teal-600" />Active in-patient</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-500" />Discharged</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <span className="rounded-lg bg-teal-600 p-2 text-white"><BedDouble className="h-4 w-4" /></span>
            <div><p className="text-xs font-medium text-slate-600">Currently active in-patients</p><p className="text-xl font-semibold text-slate-900">{activeInpatients.length}</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <span className="rounded-lg bg-slate-600 p-2 text-white"><DoorOpen className="h-4 w-4" /></span>
            <div><p className="text-xs font-medium text-slate-600">Total discharged patients</p><p className="text-xl font-semibold text-slate-900">{discharged.length}</p></div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {graphData.map(({ label, active, discharged: dischargedCount }) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
              <div className="mb-4 flex items-center justify-between"><p className="text-sm font-semibold text-slate-700">{label}</p><span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-slate-400">{active + dischargedCount} total</span></div>
              <div className="flex h-36 items-end justify-center gap-3 border-b border-slate-200 px-2 pb-0 sm:h-44 sm:gap-5">
                <div className="flex h-full w-1/3 flex-col items-center justify-end gap-1"><span className="text-sm font-bold text-teal-700">{active}</span><div className="w-full rounded-t-lg bg-teal-600" style={{ height: `${Math.max(active ? 4 : 0, (active / graphMax) * 100)}%` }} /></div>
                <div className="flex h-full w-1/3 flex-col items-center justify-end gap-1"><span className="text-sm font-bold text-slate-600">{dischargedCount}</span><div className="w-full rounded-t-lg bg-slate-500" style={{ height: `${Math.max(dischargedCount ? 4 : 0, (dischargedCount / graphMax) * 100)}%` }} /></div>
              </div>
              <div className="mt-3 space-y-1 text-xs"><p className="flex justify-between text-teal-700"><span>Active</span><strong>{active}</strong></p><p className="flex justify-between text-slate-600"><span>Discharged</span><strong>{dischargedCount}</strong></p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
