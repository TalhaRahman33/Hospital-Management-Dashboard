"use client";

import { useEffect, useState } from "react";

export default function UserForm({
  hospitals,
  editingUser,
  onSubmit,
  onCancel,
  loading,
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    roleId: "",
    hospitalIds: [],
  });

  useEffect(() => {
    if (editingUser) {
      const assignedHospitals =
        editingUser.hospitalAssignments?.map(
          (item) => item.hospitalId
        ) || [];

      setForm({
        firstName: editingUser.firstName || "",
        lastName: editingUser.lastName || "",
        email: editingUser.email || "",
        phone: editingUser.phone || "",
        password: "",
        roleId: editingUser.roleId?.toString() || "",
        hospitalIds: assignedHospitals,
      });
    } else {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        roleId: "",
        hospitalIds: [],
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // When role changes, reset hospital selection
    if (name === "roleId") {
      setForm((prev) => ({
        ...prev,
        roleId: value,
        hospitalIds: [],
      }));
    }
  };

  const roleId = Number(form.roleId);

  // According to your role table
  const isPMO = roleId === 2;
  const isDMO = roleId === 3;
  const isHFO = roleId === 4;
  const isDoctor = roleId === 5;

  const isMultipleHospitalRole = isPMO || isDMO;
  const isSingleHospitalRole = isHFO || isDoctor;

  const handleHospitalChange = (e) => {
    const value = Number(e.target.value);

    if (isSingleHospitalRole) {
      setForm((prev) => ({
        ...prev,
        hospitalIds: [value],
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      hospitalIds: prev.hospitalIds.includes(value)
        ? prev.hospitalIds.filter((id) => id !== value)
        : [...prev.hospitalIds, value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      roleId: Number(form.roleId),
      hospitalIds: form.hospitalIds,
    });
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-100 md:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {editingUser ? "Update User" : "Create User"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {editingUser ? "Adjust the user profile and access rights below." : "Add a new healthcare team member and assign their hospital access."}
          </p>
        </div>

        {editingUser && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {editingUser ? "New Password (optional)" : "Password"}
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required={!editingUser}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Role
          </label>
          <select
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          >
            <option value="">Select Role</option>
            <option value="2">PMO</option>
            <option value="3">DMO</option>
            <option value="4">HFO</option>
            <option value="5">DOCTORS</option>
          </select>
        </div>

        {form.roleId && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {isMultipleHospitalRole ? "Assign Hospitals" : "Assign Hospital"}
            </label>

            {hospitals.length === 0 && (
              <p className="text-sm text-slate-500">No hospitals available.</p>
            )}

            <div className="grid gap-2 md:grid-cols-2">
              {hospitals.map((hospital) => {
                const checked = form.hospitalIds.includes(hospital.id);

                return (
                  <label
                    key={hospital.id}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition hover:border-sky-300"
                  >
                    <input
                      type={isSingleHospitalRole ? "radio" : "checkbox"}
                      name="hospital"
                      value={hospital.id}
                      checked={checked}
                      onChange={handleHospitalChange}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span>{hospital.name} ({hospital.code})</span>
                  </label>
                );
              })}
            </div>

            {isMultipleHospitalRole && (
              <p className="mt-2 text-xs text-slate-500">PMO and DMO can be assigned to multiple hospitals.</p>
            )}

            {isSingleHospitalRole && (
              <p className="mt-2 text-xs text-slate-500">HFO and Doctors can only be assigned to one hospital at a time.</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : editingUser ? "Update User" : "Create User"}
        </button>
      </form>
    </div>
  );
}