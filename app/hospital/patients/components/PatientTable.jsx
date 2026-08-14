"use client";

export default function PatientTable({ patients, onEdit, onDelete, isLoading }) {
  if (patients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No patients found. Add a new patient to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Visit #
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
              CNIC
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Gender
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Purpose
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50 transition">
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                {patient.visitNumber}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                {patient.name}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                {patient.cnic}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                {patient.gender}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                <div className="line-clamp-1">{patient.purposeOfVisit}</div>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm">
                <button
                  onClick={() => onEdit(patient)}
                  disabled={isLoading}
                  className="mr-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(patient.id)}
                  disabled={isLoading}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
