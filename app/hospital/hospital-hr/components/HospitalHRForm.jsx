"use client";

import { useEffect, useState } from "react";
import { User, Briefcase, Building2, GraduationCap, BadgeCheck, Phone, Loader2 } from "lucide-react";

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "ON_LEAVE", "RETIRED"];
const DESIGNATION_OPTIONS = [
  "Professor",
  "Medical Officer",
  "General Surgeon",
  "Consultant",
  "Senior Registrar",
  "Resident Doctor",
  "Nurse",
  "Lab Technician",
  "Pharmacist",
  "HR Officer",
];
const DEPARTMENT_OPTIONS = [
  "ENT",
  "Gynecology",
  "Urology",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Radiology",
  "Laboratory",
  "Administration",
];

export default function HospitalHRForm({ initialData = null, onSubmit, isLoading, hospitalName }) {
  const [formData, setFormData] = useState({
    employeeName: "",
    designation: "",
    department: "",
    qualification: "",
    pmcNo: "",
    contactNo: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        employeeName: initialData.employeeName || "",
        designation: initialData.designation || "",
        department: initialData.department || "",
        qualification: initialData.qualification || "",
        pmcNo: initialData.pmcNo || "",
        contactNo: initialData.contactNo || "",
        status: initialData.status || "ACTIVE",
      });
    } else {
      setFormData({
        employeeName: "",
        designation: "",
        department: "",
        qualification: "",
        pmcNo: "",
        contactNo: "",
        status: "ACTIVE",
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.employeeName.trim()) nextErrors.employeeName = "Employee name is required";
    if (!formData.designation.trim()) nextErrors.designation = "Designation is required";
    if (!formData.department.trim()) nextErrors.department = "Department is required";
    if (!formData.qualification.trim()) nextErrors.qualification = "Qualification is required";
    if (!formData.pmcNo.trim()) nextErrors.pmcNo = "PMC number is required";
    if (!formData.contactNo.trim()) nextErrors.contactNo = "Contact number is required";
    if (!formData.status) nextErrors.status = "Status is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const inputClassName = (fieldName) =>
    `mt-1.5 block w-full rounded-xl border bg-white px-3 py-2.5 text-[13.5px] text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
      errors[fieldName]
        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
        : "border-slate-200 focus:border-[#F97316] focus:ring-[#F97316]/15"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl bg-orange-50 px-3 py-2.5 text-[12.5px] text-orange-700 border border-orange-100">
        <div className="flex items-center gap-2 font-medium">
          <Building2 className="h-4 w-4" strokeWidth={2} />
          {hospitalName || "Current Hospital"}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="employeeName" className="text-[12.5px] font-medium text-slate-600">
            Employee Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2} />
            <input
              id="employeeName"
              name="employeeName"
              type="text"
              value={formData.employeeName}
              onChange={handleChange}
              className={`${inputClassName("employeeName")} pl-9`}
              placeholder="Enter employee name"
              disabled={isLoading}
            />
          </div>
          {errors.employeeName && <p className="mt-1.5 text-xs text-rose-500">{errors.employeeName}</p>}
        </div>

        <div>
          <label htmlFor="designation" className="text-[12.5px] font-medium text-slate-600">
            Designation
          </label>
          <div className="relative">
            <Briefcase className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2} />
            <select
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={`${inputClassName("designation")} pl-9 appearance-none`}
              disabled={isLoading}
            >
              <option value="">Select designation</option>
              {DESIGNATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {errors.designation && <p className="mt-1.5 text-xs text-rose-500">{errors.designation}</p>}
        </div>

        <div>
          <label htmlFor="department" className="text-[12.5px] font-medium text-slate-600">
            Department
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={inputClassName("department")}
            disabled={isLoading}
          >
            <option value="">Select department</option>
            {DEPARTMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.department && <p className="mt-1.5 text-xs text-rose-500">{errors.department}</p>}
        </div>

        <div>
          <label htmlFor="qualification" className="text-[12.5px] font-medium text-slate-600">
            Qualification
          </label>
          <div className="relative">
            <GraduationCap className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2} />
            <input
              id="qualification"
              name="qualification"
              type="text"
              value={formData.qualification}
              onChange={handleChange}
              className={`${inputClassName("qualification")} pl-9`}
              placeholder="e.g. MBA, HR"
              disabled={isLoading}
            />
          </div>
          {errors.qualification && <p className="mt-1.5 text-xs text-rose-500">{errors.qualification}</p>}
        </div>

        <div>
          <label htmlFor="pmcNo" className="text-[12.5px] font-medium text-slate-600">
            PMC No
          </label>
          <div className="relative">
            <BadgeCheck className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2} />
            <input
              id="pmcNo"
              name="pmcNo"
              type="text"
              value={formData.pmcNo}
              onChange={handleChange}
              className={`${inputClassName("pmcNo")} pl-9`}
              placeholder="e.g. PMC-12345"
              disabled={isLoading}
            />
          </div>
          {errors.pmcNo && <p className="mt-1.5 text-xs text-rose-500">{errors.pmcNo}</p>}
        </div>

        <div>
          <label htmlFor="contactNo" className="text-[12.5px] font-medium text-slate-600">
            Contact No
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2} />
            <input
              id="contactNo"
              name="contactNo"
              type="tel"
              value={formData.contactNo}
              onChange={handleChange}
              className={`${inputClassName("contactNo")} pl-9`}
              placeholder="0300-1234567"
              disabled={isLoading}
            />
          </div>
          {errors.contactNo && <p className="mt-1.5 text-xs text-rose-500">{errors.contactNo}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="status" className="text-[12.5px] font-medium text-slate-600">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={inputClassName("status")}
          disabled={isLoading}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.status && <p className="mt-1.5 text-xs text-rose-500">{errors.status}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
              Saving...
            </>
          ) : initialData ? (
            "Update Employee"
          ) : (
            "Save Employee"
          )}
        </button>
      </div>
    </form>
  );
}
