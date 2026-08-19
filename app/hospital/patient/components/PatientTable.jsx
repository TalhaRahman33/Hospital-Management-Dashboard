// components/PatientTable.jsx
"use client";

import { Pencil, Trash2, BedDouble } from "lucide-react";

const GENDER_STYLES = {
  Male: { bg: "#6366F114", text: "#6366F1" },
  Female: { bg: "#14B8A614", text: "#0d9488" },
  Other: { bg: "#F59E0B14", text: "#b45309" },
};

export default function PatientTable({ patients, onEdit, onDelete, isLoading }) {
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
          <BedDouble className="h-6 w-6 text-slate-300" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-medium text-slate-600">No patients found</p>
        <p className="mt-1 text-[12.5px] text-slate-400">Add a new patient to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            {["Visit #", "Name", "CNIC", "Gender", "Purpose", "Actions"].map((label, i) => (
              <th
                key={label}
                className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${
                  i === 0 ? "text-left" : "text-left"
                }`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
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
                className="group bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <td className="rounded-l-xl border-y border-l border-slate-100 px-4 py-3">
                  <span className="rounded-md bg-slate-50 px-2 py-1 font-['JetBrains_Mono'] text-[11.5px] text-slate-500">
                    #{patient.visitNumber}
                  </span>
                </td>

                <td className="border-y border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#14B8A6] text-[11px] font-semibold text-white font-['Space_Grotesk']">
                      {initials}
                    </div>
                    <span className="text-[13.5px] font-medium text-slate-800">
                      {patient.name}
                    </span>
                  </div>
                </td>

                <td className="border-y border-slate-100 px-4 py-3">
                  <span className="font-['JetBrains_Mono'] text-[12.5px] text-slate-500">
                    {patient.cnic}
                  </span>
                </td>

                <td className="border-y border-slate-100 px-4 py-3">
                  <span
                    className="rounded-full px-2.5 py-1 text-[11.5px] font-medium"
                    style={{ backgroundColor: genderStyle.bg, color: genderStyle.text }}
                  >
                    {patient.gender}
                  </span>
                </td>

                <td className="border-y border-slate-100 px-4 py-3 max-w-[220px]">
                  <div className="truncate text-[13px] text-slate-600" title={patient.purposeOfVisit}>
                    {patient.purposeOfVisit}
                  </div>
                </td>

                <td className="rounded-r-xl border-y border-r border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEdit(patient)}
                      disabled={isLoading}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6366F1] transition-colors hover:bg-[#6366F1]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Edit patient"
                    >
                      <Pencil className="h-[15px] w-[15px]" strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => onDelete(patient.id)}
                      disabled={isLoading}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Delete patient"
                    >
                      <Trash2 className="h-[15px] w-[15px]" strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}