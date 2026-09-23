"use client";

import { useEffect, useState } from "react";
import { Check, Plus, Users } from "lucide-react";
import Swal from "sweetalert2";

import UserDialog from "./components/UserDialog";
import UserTable from "./components/UserTable";

import {
  getUsersApi,
  getHospitalsApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "./_lib/apiHandler";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRole, setSelectedRole] = useState("all");

  const roleCards = [
    { key: "all", label: "All Users", role: null },
    { key: "hfo", label: "HFO", role: "HFO" },
    { key: "dmo", label: "DMO", role: "DMO" },
    { key: "pmo", label: "PMO", role: "PMO" },
    { key: "hospital_hr", label: "Hospital HR", role: "HOSPITAL_HR" },
  ];

  const loadData = async () => {
    try {
      setLoading(true);

      const [usersResponse, hospitalsResponse] = await Promise.all([
        getUsersApi(),
        getHospitalsApi(),
      ]);

      setUsers(usersResponse.users || []);
      setHospitals(hospitalsResponse.hospitals || []);
    } catch (error) {
      console.error("Load users error:", error);
      Swal.fire({
        icon: "error",
        title: "Couldn't load users",
        text: error?.response?.data?.message || "Failed to load users",
        confirmButtonColor: "#0d9488",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUsersData = async () => {
      await loadData();
    };

    loadUsersData();
  }, [refreshKey]);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);

      if (editingUser) {
        await updateUserApi(editingUser.id, data);
      } else {
        await createUserApi(data);
      }

      setEditingUser(null);
      setDialogOpen(false);
      setRefreshKey((prev) => prev + 1);

      Swal.fire({
        icon: "success",
        title: editingUser ? "User updated" : "User created",
        text: editingUser ? "The user details were updated successfully." : "A new user was created successfully.",
        confirmButtonColor: "#0d9488",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Save user error:", error);
      Swal.fire({
        icon: "error",
        title: editingUser ? "Couldn't update user" : "Couldn't create user",
        text: error?.response?.data?.message || "Failed to save user",
        confirmButtonColor: "#0d9488",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setDialogOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete this user?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    });

    if (!confirmed.isConfirmed) {
      return;
    }

    try {
      await deleteUserApi(id);
      setRefreshKey((prev) => prev + 1);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "The user was removed successfully.",
        confirmButtonColor: "#0d9488",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete user error:", error);
      Swal.fire({
        icon: "error",
        title: "Couldn't delete user",
        text: error?.response?.data?.message || "Failed to delete user",
        confirmButtonColor: "#0d9488",
      });
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
  };

  const getRoleName = (user) => user.role?.name?.toUpperCase() || "";

  const roleCounts = roleCards.reduce((counts, card) => {
    counts[card.key] = card.role
      ? users.filter((user) => getRoleName(user) === card.role).length
      : users.length;
    return counts;
  }, {});

  const filteredUsers = selectedRole === "all"
    ? users
    : users.filter((user) => {
        const selectedCard = roleCards.find((card) => card.key === selectedRole);
        return selectedCard?.role === getRoleName(user);
      });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">User Management</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Users</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingUser(null);
            setDialogOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </section>

      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {roleCards.map((card) => {
          const isSelected = selectedRole === card.key;

          return (
            <button
              key={card.key}
              type="button"
              onClick={() => setSelectedRole(card.key)}
              className={`rounded-xl border p-2.5 text-left shadow-sm transition ${
                isSelected
                  ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100"
                  : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/40"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-100 text-sky-700">
                  <Users className="h-3.5 w-3.5" />
                </div>
                {isSelected && <Check className="h-4 w-4 text-sky-600" />}
              </div>
              <p className="mt-2 truncate text-xs font-medium text-slate-500">{card.label}</p>
              <p className="mt-0.5 text-xl font-semibold text-slate-900">
                {loading ? "..." : roleCounts[card.key]}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-slate-500">
                {card.role ? `${card.label} users` : "Registered accounts"}
              </p>
            </button>
          );
        })}
      </section>

      <UserTable
        users={filteredUsers}
        loading={loading}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UserDialog
        open={dialogOpen}
        mode={editingUser ? "edit" : "create"}
        hospitals={hospitals}
        editingUser={editingUser}
        loading={saving}
        onSubmit={handleSubmit}
        onCancel={closeDialog}
        onClose={closeDialog}
      />
    </div>
  );
}