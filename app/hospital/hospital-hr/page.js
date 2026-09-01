"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/authStore";
import HospitalHRDialog from "./components/HospitalHRDialog";
import HospitalHRTable from "./components/HospitalHRTable";
import { hospitalEmployeeAPI } from "./_lib/apiHandler";

export default function HospitalHRPage() {
  const { user } = useAuthStore();
  const [employees, setEmployees] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const hospitalName = user?.hospitalAssignments?.[0]?.hospital?.name || "Current Hospital";

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await hospitalEmployeeAPI.getAll();
      setEmployees(response.employees || response.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch employees");
      console.error("Error fetching employees:", err);
      Swal.fire({
        icon: "error",
        title: "Couldn't load employees",
        text: err?.message || "Failed to fetch employees",
        confirmButtonColor: "#F97316",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleSubmitForm = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        ...formData,
        hospitalName,
        hospitalId: user?.hospitalAssignments?.[0]?.hospitalId || user?.hospitalAssignments?.[0]?.hospital?.id,
      };

      if (selectedEmployee) {
        await hospitalEmployeeAPI.update(selectedEmployee.id, payload);
        setSuccess("Employee updated successfully!");
        Swal.fire({
          icon: "success",
          title: "Employee updated",
          text: "The employee record was updated successfully.",
          confirmButtonColor: "#F97316",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await hospitalEmployeeAPI.create(payload);
        setSuccess("Employee created successfully!");
        Swal.fire({
          icon: "success",
          title: "Employee created",
          text: "A new employee was added successfully.",
          confirmButtonColor: "#F97316",
          timer: 1800,
          showConfirmButton: false,
        });
      }

      await fetchEmployees();
      handleCloseDialog();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to save employee");
      console.error("Error saving employee:", err);
      Swal.fire({
        icon: "error",
        title: selectedEmployee ? "Couldn't update employee" : "Couldn't create employee",
        text: err?.message || "Failed to save employee",
        confirmButtonColor: "#F97316",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    const confirmed = await Swal.fire({
      title: "Delete this employee?",
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
      setIsLoading(true);
      setError(null);
      await hospitalEmployeeAPI.delete(employeeId);
      setSuccess("Employee deleted successfully!");
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "The employee was removed successfully.",
        confirmButtonColor: "#F97316",
        timer: 1600,
        showConfirmButton: false,
      });
      await fetchEmployees();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete employee");
      console.error("Error deleting employee:", err);
      Swal.fire({
        icon: "error",
        title: "Couldn't delete employee",
        text: err?.message || "Failed to delete employee",
        confirmButtonColor: "#F97316",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-4 md:p-5">
          <HospitalHRTable
            employees={employees}
            onAdd={handleAddEmployee}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
            isLoading={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" strokeWidth={2} />
          <span className="text-[13.5px] text-rose-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2} />
          <span className="text-[13.5px] text-emerald-700">{success}</span>
        </div>
      )}

      <HospitalHRDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitForm}
        initialData={selectedEmployee}
        isLoading={isLoading}
        hospitalName={hospitalName}
      />
    </div>
  );
}
