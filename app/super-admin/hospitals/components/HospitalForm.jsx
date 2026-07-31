// HospitalForm.jsx
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { createHospitalApi } from "../_lib/apiHandler";
import { Building2, Hash, MapPin, Building, Phone, Mail, Loader2 } from "lucide-react";

const emptyForm = {
  name: "",
  code: "",
  address: "",
  city: "",
  phone: "",
  email: "",
};

const fields = [
  { name: "name", label: "Hospital Name", placeholder: "e.g. St. Mary's General", icon: Building2, required: true, span: 2 },
  { name: "code", label: "Hospital Code", placeholder: "e.g. STM-001", icon: Hash, required: true, span: 1 },
  { name: "address", label: "Address", placeholder: "Street address", icon: MapPin, required: true, span: 1 },
  { name: "city", label: "City", placeholder: "e.g. Lahore", icon: Building, required: true, span: 2 },
  { name: "phone", label: "Phone", placeholder: "+92 300 0000000", icon: Phone, required: false, span: 1 },
  { name: "email", label: "Hospital Email", placeholder: "contact@hospital.com", icon: Mail, required: false, type: "email", span: 1 },
];

export default function HospitalForm({ onHospitalCreated }) {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await createHospitalApi(formData);

      setFormData(emptyForm);

      if (onHospitalCreated) {
        onHospitalCreated(data.hospital);
      }

      Swal.fire({
        icon: "success",
        title: "Hospital added",
        text: data.message || "The hospital was created successfully.",
        confirmButtonColor: "#0d9488",
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Couldn't create hospital",
        text: error.message,
        confirmButtonColor: "#0d9488",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-sky-100 bg-white/80 backdrop-blur-sm p-8 shadow-lg shadow-sky-100/60"
    >
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 shadow-md shadow-teal-200">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-800">Add Hospital</h2>
          <p className="text-sm text-slate-500">Register a new facility in the network</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map(({ name, label, placeholder, icon: Icon, required, type, span }) => (
          <div key={name} className={span === 2 ? "sm:col-span-2" : ""}>
            <label htmlFor={name} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600">
              {label}
              {required && <span className="text-teal-500">*</span>}
            </label>
            <div className="relative">
              <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id={name}
                name={name}
                type={type || "text"}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Hospital"
        )}
      </button>
    </form>
  );
}