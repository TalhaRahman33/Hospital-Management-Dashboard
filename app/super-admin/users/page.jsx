"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
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
    loadData();
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

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">User Management</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Users</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Create, review, and manage PMO, DMO, HFO, and doctor accounts with a consistent workflow.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingUser(null);
            setDialogOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </section>

      <UserTable
        users={users}
        loading={loading}
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