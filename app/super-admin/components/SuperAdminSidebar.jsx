'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, ChevronRight, LayoutDashboard, Users, X } from 'lucide-react';

const navItems = [
  {
    href: '/super-admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/super-admin/hospitals',
    label: 'Hospitals',
    icon: Building2,
  },
  {
    href: '/super-admin/users',
    label: 'Users',
    icon: Users,
  },
];

export default function SuperAdminSidebar({ isOpen, onClose, userName }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-72 flex-col border-r border-slate-200/80 bg-white/80 px-5 py-6 backdrop-blur xl:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-400 text-white shadow-lg shadow-sky-100">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">CareSync</p>
            <p className="text-xs text-slate-500">Super Admin Hub</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {item.label}
                </span>
                <ChevronRight className={`h-4 w-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Welcome back</p>
          <p className="mt-1 text-sm text-slate-500">{userName || 'Super Admin'}</p>
        </div>
      </aside>

      <div className={`fixed inset-0 z-40 bg-slate-950/40 transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} xl:hidden`} onClick={onClose} />

      <aside className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-2xl transition-transform xl:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-400 text-white shadow-lg shadow-sky-100">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">CareSync</p>
              <p className="text-xs text-slate-500">Super Admin Hub</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {item.label}
                </span>
                <ChevronRight className={`h-4 w-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Welcome back</p>
          <p className="mt-1 text-sm text-slate-500">{userName || 'Super Admin'}</p>
        </div>
      </aside>
    </>
  );
}
