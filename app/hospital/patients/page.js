"use client";

import { useState, useEffect } from "react";
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
    <div className="w-full min-w-0">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <p className="mt-1 text-gray-600">
              Manage patient information and records
            </p>
          </div>
          <button
            onClick={handleAddPatient}
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            + Add Patient
          </button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-red-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-3 text-red-800">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-green-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-3 text-green-800">{success}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="rounded-lg bg-white shadow">
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
