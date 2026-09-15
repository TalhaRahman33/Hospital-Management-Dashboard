"use client";

import { useEffect, useId, useState } from "react";
import {
  Building2,
  Building,
  Hash,
  Loader2,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  createHospitalApi,
  updateHospitalApi,
} from "../_lib/apiHandler";

const emptyForm = {
  name: "",
  code: "",
  address: "",
  city: "",
  phone: "",
  email: "",
};

const fields = [
  {
    name: "name",
    label: "Hospital name",
    placeholder: "St. Mary's General Hospital",
    icon: Building2,
    required: true,
    span: 2,
  },
  {
    name: "code",
    label: "Hospital code",
    placeholder: "STM-001",
    icon: Hash,
    required: true,
  },
  {
    name: "city",
    label: "City",
    placeholder: "Lahore",
    icon: Building,
    required: true,
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Enter the complete street address",
    icon: MapPin,
    required: true,
    span: 2,
  },
  {
    name: "phone",
    label: "Phone number",
    placeholder: "+92 300 0000000",
    icon: Phone,
    type: "tel",
  },
  {
    name: "email",
    label: "Email address",
    placeholder: "contact@hospital.com",
    icon: Mail,
    type: "email",
  },
];

export default function HospitalDialog({
  open,
  mode = "create",
  hospital,
  onClose,
  onSaved,
}) {
  const titleId = useId();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const isEditing = mode === "edit";

  useEffect(() => {
    if (!open) return;

    setFormData({
      ...emptyForm,
      ...(hospital || {}),
    });
  }, [open, hospital]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  const handleChange = ({ target: { name, value } }) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );

    try {
      const data = isEditing
        ? await updateHospitalApi(hospital.id, payload)
        : await createHospitalApi(payload);

      onSaved?.(data.hospital || data);

      await Swal.fire({
        icon: "success",
        title: isEditing ? "Hospital updated" : "Hospital created",
        text:
          data.message ||
          `The hospital has been ${
            isEditing ? "updated" : "created"
          } successfully.`,
        timer: 1800,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: isEditing
          ? "Unable to update hospital"
          : "Unable to create hospital",
        text: error?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#0284c7",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[95dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl"
      >
        <header className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <Building2 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
              >
                {isEditing ? "Edit hospital" : "Add a new hospital"}
              </h2>

              <p className="mt-0.5 text-sm leading-5 text-slate-500">
                {isEditing
                  ? "Update the hospital information below."
                  : "Enter the facility details to add it to your network."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close dialog"
            className="ml-3 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="overflow-y-auto px-5 py-6 sm:px-7">
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              {fields.map(
                ({
                  name,
                  label,
                  placeholder,
                  icon: Icon,
                  required,
                  type = "text",
                  span,
                }) => (
                  <div
                    key={name}
                    className={span === 2 ? "sm:col-span-2" : ""}
                  >
                    <label
                      htmlFor={name}
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      {label}

                      {required && (
                        <>
                          <span className="ml-1 text-rose-500">*</span>
                          <span className="sr-only"> required</span>
                        </>
                      )}
                    </label>

                    <div className="relative">
                      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                      <input
                        id={name}
                        name={name}
                        type={type}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                        required={required}
                        autoComplete={
                          name === "email"
                            ? "email"
                            : name === "phone"
                              ? "tel"
                              : "off"
                        }
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}

              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Save changes"
                  : "Create hospital"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}