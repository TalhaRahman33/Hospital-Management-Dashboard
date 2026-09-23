"use client";

import {
  AlertCircle,
  Building2,
  Filter,
  Inbox,
  Loader2,
  Mail,
  Pencil,
  ShieldCheck,
  Trash2,
} from "lucide-react";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-slate-100 text-slate-500 border-slate-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function UserTable({
  users,
  loading,
  selectedRole,
  onRoleChange,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-[24px] border border-sky-100 bg-white/85 p-4 shadow-lg shadow-sky-100/60 backdrop-blur-sm md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 shadow-md shadow-sky-200">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-800">Users</h2>
            <p className="text-sm text-slate-500">
              {users.length} registered {users.length === 1 ? "account" : "accounts"}
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-500">
          <Filter className="h-4 w-4 text-sky-600" />
          <span className="sr-only">Filter users by role</span>
          <select
            value={selectedRole}
            onChange={(event) => onRoleChange(event.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            aria-label="Filter users by role"
          >
            <option value="all">All Users</option>
            <option value="hfo">HFO</option>
            <option value="dmo">DMO</option>
            <option value="pmo">PMO</option>
            <option value="hospital_hr">Hospital HR</option>
          </select>
        </label>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading users...
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <Inbox className="h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-500">No users found.</p>
          <p className="text-xs text-slate-400">Newly added users will appear here.</p>
        </div>
      )}

      {!loading && users.length > 0 && (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-2 font-medium">User</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Hospitals</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 transition hover:bg-sky-50/40">
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-800">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">{user.phone || "No phone"}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{user.role?.name || "-"}</td>
                    <td className="px-3 py-3 text-slate-600">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {user.hospitalAssignments?.filter((assignment) => assignment.isActive).length ? (
                          user.hospitalAssignments
                            ?.filter((assignment) => assignment.isActive)
                            .map((assignment) => (
                              <span key={assignment.id} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                <Building2 className="h-3 w-3" />
                                {assignment.hospital?.name || "-"}
                              </span>
                            ))
                        ) : (
                          <span className="text-slate-400">No hospitals</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[user.status] || statusStyles.pending}`}>
                        {user.status || "pending"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(user)}
                          className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(user.id)}
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

          <div className="space-y-3 md:hidden">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-800">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <Mail className="h-3.5 w-3.5" />
                      {user.email}
                    </div>
                  </div>
                  <span className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[user.status] || statusStyles.pending}`}>
                    {user.status || "pending"}
                  </span>
                </div>

                <div className="mt-3 text-sm text-slate-600">
                  <div className="font-medium text-slate-700">Role</div>
                  <div className="mt-1">{user.role?.name || "-"}</div>
                </div>

                <div className="mt-3 text-sm text-slate-600">
                  <div className="font-medium text-slate-700">Hospitals</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {user.hospitalAssignments?.filter((assignment) => assignment.isActive).length ? (
                      user.hospitalAssignments
                        ?.filter((assignment) => assignment.isActive)
                        .map((assignment) => (
                          <span key={assignment.id} className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600">
                            <Building2 className="h-3 w-3" />
                            {assignment.hospital?.name || "-"}
                          </span>
                        ))
                    ) : (
                      <span className="text-slate-400">No hospitals</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}