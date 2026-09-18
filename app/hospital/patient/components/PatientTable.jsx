// components/PatientTable.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Trash2, BedDouble, Search, UserPlus, MoreVertical, BedSingle } from "lucide-react";

const GENDER_STYLES = {
  Male: { bg: "#6366F114", text: "#6366F1" },
  Female: { bg: "#14B8A614", text: "#0d9488" },
  Other: { bg: "#F59E0B14", text: "#b45309" },
};

export default function PatientTable({ patients, onAdd, onEdit, onDelete, onAdmit, isLoading }) {
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      const activeMenu = menuRefs.current[openMenuId];
      if (activeMenu && !activeMenu.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const visit = String(p.visitNumber || "").toLowerCase();
      return name.includes(q) || visit.includes(q);
    });
  }, [patients, query]);

  return (
    <div className="font-sans">
      {/* Search / Filter bar */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or visit #"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-[12.5px] text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30"
          />
        </div>
        {query && (
          <span className="text-[11.5px] text-slate-400">
            {filteredPatients.length} result{filteredPatients.length !== 1 ? "s" : ""}
          </span>
        )}
        <button
          onClick={onAdd}
          disabled={isLoading}
          className="flex shrink-0 items-center justify-center gap-1.5 self-end rounded-lg bg-gradient-to-r from-[#6366F1] to-[#14B8A6] px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:brightness-105 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
        >
          <UserPlus className="h-3.5 w-3.5" strokeWidth={2.25} />
          Add Patient
        </button>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
            <BedDouble className="h-6 w-6 text-slate-300" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-slate-600">No patients found</p>
          <p className="mt-1 text-[12.5px] text-slate-400">
            {query ? "Try a different name or visit number." : "Add a new patient to get started."}
          </p>
        </div>
      ) : (
        <div className="h-[420px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Visit #", "Name", "CNIC", "Gender", "Purpose", "Status", "Actions"].map((label) => (
                  <th
                    key={label}
                    className="px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, idx) => {
                const genderStyle = GENDER_STYLES[patient.gender] || {
                  bg: "#64748B14",
                  text: "#475569",
                };
                const initials = (patient.name || "?")
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={patient.id}
                    className={`transition-colors hover:bg-slate-50 ${
                      idx !== filteredPatients.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                  >
                    <td className="px-3 py-2">
                      <span className="rounded-md bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">
                        #{patient.visitNumber}
                      </span>
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#14B8A6] text-[9.5px] font-semibold text-white">
                          {initials}
                        </div>
                        <span className="text-[13px] font-medium text-slate-800">
                          {patient.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <span className="font-mono text-[12px] text-slate-500">{patient.cnic}</span>
                    </td>

                    <td className="px-3 py-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={{ backgroundColor: genderStyle.bg, color: genderStyle.text }}
                      >
                        {patient.gender}
                      </span>
                    </td>

                    <td className="max-w-[200px] px-3 py-2">
                      <div className="truncate text-[12.5px] text-slate-600" title={patient.purposeOfVisit}>
                        {patient.purposeOfVisit}
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                        REGISTERED
                      </span>
                    </td>

                    <td className="px-3 py-2">
                      <div
                        className="relative inline-block"
                        ref={(el) => {
                          if (el) {
                            menuRefs.current[patient.id] = el;
                          } else {
                            delete menuRefs.current[patient.id];
                          }
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(openMenuId === patient.id ? null : patient.id)}
                          disabled={isLoading}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Open patient actions"
                        >
                          <MoreVertical className="h-[14px] w-[14px]" strokeWidth={2.2} />
                        </button>

                        {openMenuId === patient.id && (
                          <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-200/80">
                            <button
                              type="button"
                              onClick={() => {
                                onEdit(patient);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] text-slate-700 transition-colors hover:bg-slate-50"
                            >
                              <Pencil className="h-[13px] w-[13px] text-[#6366F1]" strokeWidth={2} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onAdmit(patient);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] text-slate-700 transition-colors hover:bg-slate-50"
                            >
                              <BedSingle className="h-[13px] w-[13px] text-[#0d9488]" strokeWidth={2} />
                              Admit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onDelete(patient.id);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] text-rose-600 transition-colors hover:bg-rose-50"
                            >
                              <Trash2 className="h-[13px] w-[13px]" strokeWidth={2} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}