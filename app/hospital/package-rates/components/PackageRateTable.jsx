"use client";

import { useMemo, useState } from "react";
import { CircleDollarSign, Pencil, Plus, Search, Trash2 } from "lucide-react";

export default function PackageRateTable({ packageRates, onAdd, onEdit, onDelete, isLoading, canManage }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRates = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return packageRates;

    return packageRates.filter((rate) =>
      [rate.lineOfTreatment, rate.treatment].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [packageRates, searchTerm]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Package Rates</h1>
          <p className="mt-1 text-sm text-slate-500">
            {canManage ? "Manage treatment prices for your hospital." : "View treatment prices for your hospital."}
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={isLoading || !canManage}
          title={!canManage ? "Only Hospital HR can add package rates" : "Add package rate"}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Rate
        </button>
      </div>

      {packageRates.length > 0 && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Filter by line or treatment"
              aria-label="Filter package rates by line of treatment or treatment"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <span className="text-xs text-slate-400">Showing {filteredRates.length} of {packageRates.length} rates</span>
        </div>
      )}

      {packageRates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
          <CircleDollarSign className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          No package rates found. {canManage ? "Add the first treatment rate." : "Hospital HR has not added any rates yet."}
        </div>
      ) : filteredRates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">No rates match &quot;{searchTerm}&quot;.</div>
      ) : (
        <div className="max-h-[min(65vh,560px)] overflow-auto rounded-xl border border-slate-100">
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Line of Treatment</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Treatment</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>
                {canManage && <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRates.map((rate) => (
                <tr key={rate.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-800">{rate.lineOfTreatment}</td>
                  <td className="px-4 py-3 text-sm text-slate-800">{rate.treatment}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{Number(rate.price).toLocaleString()}</td>
                  {canManage && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => onEdit(rate)} disabled={isLoading} aria-label={`Edit ${rate.treatment}`} className="rounded-lg p-2 text-sky-600 hover:bg-sky-50 disabled:opacity-50"><Pencil className="h-4 w-4" /></button>
                        <button type="button" onClick={() => onDelete(rate.id)} disabled={isLoading} aria-label={`Delete ${rate.treatment}`} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
