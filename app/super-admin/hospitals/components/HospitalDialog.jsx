'use client';

import { useEffect, useState } from 'react';
import { Loader2, X, Building2, Hash, MapPin, Building, Phone, Mail } from 'lucide-react';
import Swal from 'sweetalert2';
import { createHospitalApi, updateHospitalApi } from '../_lib/apiHandler';

const emptyForm = {
  name: '',
  code: '',
  address: '',
  city: '',
  phone: '',
  email: '',
};

const fields = [
  { name: 'name', label: 'Hospital Name', placeholder: 'e.g. St. Mary\'s General', icon: Building2, required: true, span: 2 },
  { name: 'code', label: 'Hospital Code', placeholder: 'e.g. STM-001', icon: Hash, required: true, span: 1 },
  { name: 'address', label: 'Address', placeholder: 'Street address', icon: MapPin, required: true, span: 1 },
  { name: 'city', label: 'City', placeholder: 'e.g. Lahore', icon: Building, required: true, span: 2 },
  { name: 'phone', label: 'Phone', placeholder: '+92 300 0000000', icon: Phone, required: false, span: 1 },
  { name: 'email', label: 'Hospital Email', placeholder: 'contact@hospital.com', icon: Mail, required: false, type: 'email', span: 1 },
];

export default function HospitalDialog({ open, mode, hospital, onClose, onSaved }) {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(hospital ? { ...hospital } : emptyForm);
    }
  }, [open, hospital]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = mode === 'edit'
        ? await updateHospitalApi(hospital.id, formData)
        : await createHospitalApi(formData);

      if (onSaved) {
        onSaved(data.hospital || data);
      }

      Swal.fire({
        icon: 'success',
        title: mode === 'edit' ? 'Hospital updated' : 'Hospital added',
        text: data.message || 'The hospital was saved successfully.',
        confirmButtonColor: '#0d9488',
        timer: 2200,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: mode === 'edit' ? "Couldn't update hospital" : "Couldn't create hospital",
        text: error.message,
        confirmButtonColor: '#0d9488',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{mode === 'edit' ? 'Edit Hospital' : 'Add Hospital'}</h3>
            <p className="text-sm text-slate-500">{mode === 'edit' ? 'Update the hospital details below.' : 'Fill in the details to register a new hospital.'}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map(({ name, label, placeholder, icon: Icon, required, type, span }) => (
              <div key={name} className={span === 2 ? 'sm:col-span-2' : ''}>
                <label htmlFor={name} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                  {label}
                  {required && <span className="text-teal-500">*</span>}
                </label>
                <div className="relative">
                  <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id={name}
                    name={name}
                    type={type || 'text'}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : mode === 'edit' ? 'Save Changes' : 'Create Hospital'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
