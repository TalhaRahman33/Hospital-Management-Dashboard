"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, UserPlus, MoreVertical, Pencil, Trash2, UserRoundCog } from "lucide-react";

const STATUS_STYLES = {
  ACTIVE: { bg: "#10B9811A", text: "#047857" },
  INACTIVE: { bg: "#F59E0B1A", text: "#B45309" },
  ON_LEAVE: { bg: "#3B82F61A", text: "#1D4ED8" },
  RETIRED: { bg: "#EF44441A", text: "#B91C1C" },
};

export default function HospitalHRTable({ employees, onAdd, canAdd, canDelete, onEdit, onDelete, isLoading }) {
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

  const filteredEmployees = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;

    return employees.filter((employee) => {
      const name = (employee.employeeName || "").toLowerCase();
      const designation = (employee.designation || "").toLowerCase();
      const department = (employee.department || "").toLowerCase();
      const pmc = (employee.pmcNo || "").toLowerCase();

      return name.includes(q) || designation.includes(q) || department.includes(q) || pmc.includes(q);
    });
  }, [employees, query]);

  return (
    <div className="font-sans">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, department or PMC"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-[12.5px] text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30"
          />
        </div>

        {query && (
          <span className="text-[11.5px] text-slate-400">
            {filteredEmployees.length} result{filteredEmployees.length !== 1 ? "s" : ""}
          </span>
        )}

        <button
          onClick={onAdd}
          disabled={isLoading || !canAdd}
          title={!canAdd ? "Only Hospital HR can add employees" : "Add employee"}
          className="flex shrink-0 items-center justify-center gap-1.5 self-end rounded-lg bg-gradient-to-r from-[#F97316] to-[#F59E0B] px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:brightness-105 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
        >
          <UserPlus className="h-3.5 w-3.5" strokeWidth={2.25} />
          Add Employee
        </button>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
            <UserRoundCog className="h-6 w-6 text-orange-300" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-slate-600">No employees found</p>
          <p className="mt-1 text-[12.5px] text-slate-400">
            {query ? "Try a different employee name or PMC number." : "Add a new employee to get started."}
          </p>
        </div>
      ) : (
        <div className="h-[420px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "Employee",
                  "Designation",
                  "Department",
                  "PMC No",
                  "Contact",
                  "Status",
                  "Actions",
                ].map((label) => (
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
              {filteredEmployees.map((employee, idx) => {
                const statusStyle = STATUS_STYLES[employee.status] || {
                  bg: "#64748B14",
                  text: "#475569",
                };

                const initials = (employee.employeeName || "?")
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={employee.id}
                    className={`transition-colors hover:bg-slate-50 ${
                      idx !== filteredEmployees.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F97316] to-[#F59E0B] text-[9.5px] font-semibold text-white">
                          {initials}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-800">{employee.employeeName}</p>
                          <p className="text-[11px] text-slate-400">{employee.hospitalName || "Current Hospital"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-2 text-[12.5px] text-slate-600">{employee.designation}</td>
                    <td className="px-3 py-2 text-[12.5px] text-slate-600">{employee.department}</td>
                    <td className="px-3 py-2">
                      <span className="font-mono text-[11.5px] text-slate-500">{employee.pmcNo}</span>
                    </td>
                    <td className="px-3 py-2 text-[12.5px] text-slate-600">{employee.contactNo}</td>
                    <td className="px-3 py-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div
                        className="relative inline-block"
                        ref={(el) => {
                          if (el) {
                            menuRefs.current[employee.id] = el;
                          } else {
                            delete menuRefs.current[employee.id];
                          }
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(openMenuId === employee.id ? null : employee.id)}
                          disabled={isLoading}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Open employee actions"
                        >
                          <MoreVertical className="h-[14px] w-[14px]" strokeWidth={2.2} />
                        </button>

                        {openMenuId === employee.id && (
                          <div className="absolute right-0 z-20 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-200/80">
                            <button
                              type="button"
                              onClick={() => {
                                onEdit(employee);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] text-slate-700 transition-colors hover:bg-slate-50"
                            >
                              <Pencil className="h-[13px] w-[13px] text-[#F97316]" strokeWidth={2} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onDelete(employee.id);
                                setOpenMenuId(null);
                              }}
                              disabled={!canDelete || isLoading}
                              title={!canDelete ? "Only Hospital HR can delete employees" : "Delete employee"}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
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
