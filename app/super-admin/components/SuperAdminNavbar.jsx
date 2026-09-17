'use client';

import { useRouter } from 'next/navigation';
import { Bell, ChevronDown, LogOut, Menu, UserCircle2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function SuperAdminNavbar({ onMenuClick, userName }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { logoutUser } = useAuthStore();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const pageName = pathname?.split('/').filter(Boolean).pop() || 'dashboard';
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3 md:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 xl:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Super Admin</span>
              <span>/</span>
              <span className="text-slate-600">{title}</span>
            </div>
            <h1 className="mt-0.5 text-lg font-semibold text-slate-900">Control center</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setProfileOpen(false)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
          </button>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 text-left transition hover:border-sky-200 hover:bg-slate-50"
              aria-expanded={profileOpen}
              aria-label="Open admin profile menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <UserCircle2 className="h-4 w-4" />
              </span>
              <span className="hidden max-w-32 truncate text-sm font-semibold text-slate-800 sm:block">{userName || 'Super Admin'}</span>
              <ChevronDown className={`hidden h-4 w-4 text-slate-400 transition sm:block ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-200/60">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="truncate text-sm font-semibold text-slate-900">{userName || 'Super Admin'}</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <button type="button" onClick={handleLogout} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-rose-50 hover:text-rose-700">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
