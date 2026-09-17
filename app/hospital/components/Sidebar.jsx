// components/Sidebar.jsx
"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BedDouble, ClipboardPlus, DoorOpen, Activity, Home, User, ChevronLeft, ChevronRight, X, Users } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const NAV_ITEMS = [
  { label: 'Home', href: '/hospital/home', icon: Home },
  { label: 'Dashboard', href: '/hospital/dashboard', icon: LayoutDashboard },
  { label: 'Patient', href: '/hospital/patient', icon: BedDouble },
  { label: 'Checkup Patient', href: '/hospital/checkup-patient', icon: ClipboardPlus },
  { label: 'In-Patient', href: '/hospital/in-patient', icon: BedDouble },
  { label: 'Discharge Patient', href: '/hospital/discharge-patient', icon: DoorOpen },
  { label: 'Hospital HR', href: '/hospital/hospital-hr', icon: User },
]

const Navigation = ({ collapsed = false, onNavigate }) => {
  const pathname = usePathname()

  return (
    <nav className="space-y-1.5">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`)

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={`group flex items-center rounded-xl py-3 text-sm font-medium transition ${collapsed ? 'justify-center px-3' : 'justify-between px-3'} ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <span className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
              <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'}`} strokeWidth={2} />
              {!collapsed && label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

const Sidebar = ({ isOpen, isCollapsed, onClose, onToggle }) => {
  const user = useAuthStore((state) => state.user)
  const hospitalName = user?.hospitalAssignments?.[0]?.hospital?.name || 'No hospital assigned'
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || 'Hospital Staff'

  return (
    <>
      <aside className={`hidden shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-5 transition-[width] duration-300 xl:flex ${isCollapsed ? 'w-[84px]' : 'w-64'}`}>
        <div className={`mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between gap-3 px-2'}`}>
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Activity className="h-5 w-5" strokeWidth={2.25} />
            </div>
            {!isCollapsed && <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{hospitalName}</p><p className="text-xs text-slate-500">Patient Care System</p></div>}
          </div>
          <button type="button" onClick={onToggle} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!isCollapsed}>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <Navigation collapsed={isCollapsed} />

        <div className={`mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {isCollapsed ? <Users className="h-4 w-4 text-slate-500" /> : <><p className="text-xs font-medium text-slate-500">Signed in as</p><p className="mt-1 truncate text-sm font-semibold text-slate-900">{userName}</p></>}
        </div>
      </aside>

      <div className={`fixed inset-0 z-40 bg-slate-900/30 transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} xl:hidden`} onClick={onClose} />

      <aside className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-xl transition-transform duration-300 xl:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center justify-between gap-3 px-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white"><Activity className="h-5 w-5" /></div>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{hospitalName}</p><p className="text-xs text-slate-500">Patient Care System</p></div>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close menu"><X className="h-4 w-4" /></button>
        </div>
        <Navigation onNavigate={onClose} />
        <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-medium text-slate-500">Signed in as</p><p className="mt-1 truncate text-sm font-semibold text-slate-900">{userName}</p></div>
      </aside>
    </>
  )
}

export default Sidebar