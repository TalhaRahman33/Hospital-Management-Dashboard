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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm sm:py-8">
      <div className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-3 sm:px-6 sm:py-4">
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

        <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
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
