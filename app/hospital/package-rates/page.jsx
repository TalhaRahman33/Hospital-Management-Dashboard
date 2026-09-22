"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/authStore";
import PackageRateDialog from "./components/PackageRateDialog";
import PackageRateTable from "./components/PackageRateTable";
import { packageRateAPI } from "./_lib/apiHandler";

export default function PackageRatesPage() {
  const user = useAuthStore((state) => state.user);
  const [packageRates, setPackageRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const roleId = Number(user?.roleId);
  const roleName = user?.role?.name || user?.role?.title || user?.role;
  const canManageRates = roleId === 5 || roleName === "HOSPITAL_HR";

  const fetchPackageRates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await packageRateAPI.getAll();
      setPackageRates(response.packageRates || response.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch package rates");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchPackageRates, 0);
    return () => clearTimeout(timer);
  }, [fetchPackageRates]);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedRate(null);
  };

  const handleSubmit = async (formData) => {
    if (!canManageRates) {
      setError("Only Hospital HR can manage package rates.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      if (selectedRate) {
        await packageRateAPI.update(selectedRate.id, formData);
        setSuccess("Package rate updated successfully.");
      } else {
        await packageRateAPI.create(formData);
        setSuccess("Package rate created successfully.");
      }
      await fetchPackageRates();
      closeDialog();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to save package rate");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canManageRates) {
      setError("Only Hospital HR can manage package rates.");
      return;
    }

    const result = await Swal.fire({
      title: "Delete this package rate?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      setIsLoading(true);
      setError(null);
      await packageRateAPI.delete(id);
      setSuccess("Package rate deleted successfully.");
      await fetchPackageRates();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete package rate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />{error}</div>}
      {success && <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />{success}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-4 md:p-5">
          <PackageRateTable
            packageRates={packageRates}
            canManage={canManageRates}
            onAdd={() => { if (canManageRates) { setSelectedRate(null); setIsDialogOpen(true); } }}
            onEdit={(rate) => { if (canManageRates) { setSelectedRate(rate); setIsDialogOpen(true); } }}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </div>

      <PackageRateDialog isOpen={isDialogOpen} onClose={closeDialog} onSubmit={handleSubmit} initialData={selectedRate} isLoading={isLoading} />
    </div>
  );
}