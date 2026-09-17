'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, ChevronLeft, ChevronRight, LayoutDashboard, Menu, Users, X } from 'lucide-react';

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

function Navigation({ collapsed = false, onNavigate }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center rounded-xl py-3 text-sm font-medium transition ${collapsed ? 'justify-center px-3' : 'justify-between px-3'} ${
                  isActive
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                  <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {!collapsed && item.label}
                </span>
              </Link>
            );
          })}
        </nav>
  );
}

export default function SuperAdminSidebar({ isOpen, isCollapsed, onClose, onToggle, userName }) {
  return (
    <>
      <aside className={`hidden shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-5 transition-[width] duration-300 xl:flex ${isCollapsed ? 'w-[84px]' : 'w-64'}`}>
        <div className={`mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between gap-3 px-2'}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            {!isCollapsed && <div><p className="text-sm font-semibold text-slate-900">CareSync</p><p className="text-xs text-slate-500">Super Admin</p></div>}
          </div>
          <button type="button" onClick={onToggle} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!isCollapsed}>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <Navigation collapsed={isCollapsed} />

        <div className={`mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {isCollapsed ? <UserIcon /> : <><p className="text-xs font-medium text-slate-500">Signed in as</p><p className="mt-1 truncate text-sm font-semibold text-slate-900">{userName || 'Super Admin'}</p></>}
        </div>
      </aside>

      <div className={`fixed inset-0 z-40 bg-slate-950/40 transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} xl:hidden`} onClick={onClose} />

      <aside className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-xl transition-transform duration-300 xl:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
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

        <Navigation onNavigate={onClose} />

        <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-900">Welcome back</p>
          <p className="mt-1 text-sm text-slate-500">{userName || 'Super Admin'}</p>
        </div>
      </aside>
    </>
  );
}

function UserIcon() {
  return <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500"><Users className="h-4 w-4" /></span>;
}
