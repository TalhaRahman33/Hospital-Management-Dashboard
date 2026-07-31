'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Menu, UserCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function SuperAdminNavbar({ onMenuClick, userName }) {
  const router = useRouter();
  const { logoutUser } = useAuthStore();

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 xl:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <p className="text-sm font-semibold text-sky-600">Operations Hub</p>
            <h1 className="text-xl font-semibold text-slate-900">Super Admin Panel</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-400 text-white">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800">{userName || 'Super Admin'}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
