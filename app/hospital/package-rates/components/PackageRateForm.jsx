"use client";

import { useEffect, useState } from "react";

export default function PackageRateForm({ initialData = null, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({ lineOfTreatment: "", treatment: "", price: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData({
        lineOfTreatment: initialData?.lineOfTreatment || "",
        treatment: initialData?.treatment || "",
        price: initialData?.price ?? "",
      });
      setErrors({});
    }, 0);
    return () => clearTimeout(timer);
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!formData.lineOfTreatment.trim()) nextErrors.lineOfTreatment = "Line of treatment is required";
    if (!formData.treatment.trim()) nextErrors.treatment = "Treatment is required";
    if (formData.price === "" || Number.isNaN(Number(formData.price)) || Number(formData.price) < 0) nextErrors.price = "Enter a valid non-negative price";
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSubmit({ ...formData, price: Number(formData.price) });
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const inputClass = (name) => `mt-1.5 block w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 ${errors[name] ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-sky-500 focus:ring-sky-100"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[["lineOfTreatment", "Line of Treatment", "e.g. Surgical"], ["treatment", "Treatment", "e.g. Appendectomy"]].map(([name, label, placeholder]) => (
        <div key={name}>
          <label htmlFor={name} className="text-sm font-medium text-slate-600">{label}</label>
          <input id={name} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} className={inputClass(name)} disabled={isLoading} />
          {errors[name] && <p className="mt-1 text-xs text-rose-500">{errors[name]}</p>}
        </div>
      ))}
      <div>
        <label htmlFor="price" className="text-sm font-medium text-slate-600">Price</label>
        <input id="price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} placeholder="Enter package price" className={inputClass("price")} disabled={isLoading} />
        {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
      </div>
      <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Saving..." : initialData ? "Update Package Rate" : "Add Package Rate"}</button>
    </form>
  );
}