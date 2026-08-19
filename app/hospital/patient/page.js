// app/hospital/patient/page.js
"use client";

import { useState, useEffect } from "react";
import { UserPlus, AlertCircle, CheckCircle2, BedDouble } from "lucide-react";
import PatientDialog from "./components/PatientDialog";
import PatientTable from "./components/PatientTable";
import { patientAPI } from "./_lib/apiHandler";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await patientAPI.getAll();
      setPatients(response.patients || []);
    } catch (err) {
      setError(err.message || "Failed to fetch patients");
      console.error("Error fetching patients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsDialogOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleSubmitForm = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (selectedPatient) {
        // Update existing patient
        await patientAPI.update(selectedPatient.id, formData);
        setSuccess("Patient updated successfully!");
      } else {
        // Create new patient
        await patientAPI.create(formData);
        setSuccess("Patient created successfully!");
      }

      // Refresh patients list
      await fetchPatients();
      handleCloseDialog();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to save patient");
      console.error("Error saving patient:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this patient? This action cannot be undone."
      )
    ) {
      try {
        setIsLoading(true);
        setError(null);
        await patientAPI.delete(patientId);
        setSuccess("Patient deleted successfully!");
        await fetchPatients();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.message || "Failed to delete patient");
        console.error("Error deleting patient:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1]/10 to-[#14B8A6]/10">
              <BedDouble className="h-6 w-6 text-[#6366F1]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-['Space_Grotesk'] text-2xl font-semibold text-slate-900">
                Patients
              </h1>
              <p className="mt-0.5 text-[13px] text-slate-500">
                Manage patient information and records
              </p>
            </div>
          </div>
          <button
            onClick={handleAddPatient}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#14B8A6] px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-105 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="h-4 w-4" strokeWidth={2.25} />
            Add Patient
          </button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" strokeWidth={2} />
            <span className="text-[13.5px] text-rose-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#14B8A6]/25 bg-[#14B8A6]/[0.07] px-4 py-3.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0d9488] mt-0.5" strokeWidth={2} />
            <span className="text-[13.5px] text-[#0d9488]">{success}</span>
          </div>
        )}

        {/* Content */}
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100">
          <div className="p-6">
            <PatientTable
              patients={patients}
              onEdit={handleEditPatient}
              onDelete={handleDeletePatient}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Patient Dialog */}
      <PatientDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitForm}
        initialData={selectedPatient}
        isLoading={isLoading}
      />
    </div>
  );
}