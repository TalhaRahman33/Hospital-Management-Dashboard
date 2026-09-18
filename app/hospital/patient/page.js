// app/hospital/patient/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
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
  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const patientResponse = await patientAPI.getAll();
      setPatients((patientResponse.patients || []).filter((patient) => patient.status === "REGISTERED"));
    } catch (err) {
      setError(err.message || "Failed to fetch patients");
      console.error("Error fetching patients:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchPatients, 0);
    return () => clearTimeout(timer);
  }, [fetchPatients]);

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

  const handleAdmitPatient = async (patient) => {
    if (!patient) return;

    setPatients((currentPatients) => currentPatients.filter((item) => item.id !== patient.id));

    try {
      setIsLoading(true);
      setError(null);
      const symptoms = window.prompt("Symptoms (optional)", patient.purposeOfVisit || "") ?? "";
      await patientAPI.admit(patient.id, symptoms.trim());
      setSuccess(`${patient.name || "Patient"} has been added to the checkup queue.`);
      await fetchPatients();
    } catch (err) {
      setPatients((currentPatients) =>
        currentPatients.some((item) => item.id === patient.id)
          ? currentPatients
          : [...currentPatients, patient]
      );
      setError(err.message || "Failed to admit patient");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="w-full">
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
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="p-4 md:p-5">
            <PatientTable
              patients={patients}
              onAdd={handleAddPatient}
              onEdit={handleEditPatient}
              onDelete={handleDeletePatient}
              onAdmit={handleAdmitPatient}
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