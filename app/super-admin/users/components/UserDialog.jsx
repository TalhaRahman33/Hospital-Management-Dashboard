'use client';

import { X } from 'lucide-react';
import UserForm from './UserForm';

export default function UserDialog({
  open,
  mode,
  hospitals,
  editingUser,
  onSubmit,
  onCancel,
  loading,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {mode === 'edit' ? 'Edit User' : 'Add User'}
            </h3>
            <p className="text-sm text-slate-500">
              {mode === 'edit'
                ? 'Update the user details below.'
                : 'Fill in the details to create a new user.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <UserForm
            hospitals={hospitals}
            editingUser={editingUser}
            onSubmit={onSubmit}
            onCancel={onCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
