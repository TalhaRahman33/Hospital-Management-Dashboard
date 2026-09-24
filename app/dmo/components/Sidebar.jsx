"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  LayoutDashboard,
  Users,
  X,
} from "lucide-react"
import { useAuthStore } from "@/store/authStore"

const NAV_ITEMS = [
  { label: "Overview", href: "/dmo/dashboard", icon: LayoutDashboard },
  { label: "Hospitals", href: "/dmo/hospitals", icon: Building2 },
  { label: "Patients", href: "/dmo/patients", icon: Users },
  { label: "Reports", href: "/dmo/reports", icon: ClipboardList },
]

const Navigation = ({ collapsed = false, onNavigate }) => {
  const pathname = usePathname()

  return (
    <nav className="space-y-1.5">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname?.startsWith(`${href}/`)

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={`group flex items-center rounded-xl py-3 text-sm font-medium transition ${collapsed ? "justify-center px-3" : "px-3"} ${isActive ? "bg-teal-50 text-teal-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
          >
            <Icon className={`h-[18px] w-[18px] shrink-0 ${collapsed ? "" : "mr-3"} ${isActive ? "text-teal-700" : "text-slate-400 group-hover:text-slate-600"}`} />
            {!collapsed && label}
          </Link>
        )
      })}
    </nav>
  )
}

const Sidebar = ({ isOpen, isCollapsed, onClose, onToggle }) => {
  const user = useAuthStore((state) => state.user)
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.name || "DMO User"

  const content = (mobile = false) => (
    <>
      <div className={`mb-8 flex items-center ${mobile || isCollapsed ? "justify-center" : "justify-between gap-3 px-2"}`}>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-lg shadow-teal-700/20">
            <Activity className="h-5 w-5" strokeWidth={2.25} />
          </div>
          {!isCollapsed && <div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">DMO Connect</p><p className="text-xs text-slate-500">District Medical Office</p></div>}
        </div>
        {mobile ? <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close menu"><X className="h-4 w-4" /></button> : <button type="button" onClick={onToggle} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>{isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</button>}
      </div>
      <Navigation collapsed={!mobile && isCollapsed} onNavigate={mobile ? onClose : undefined} />
      <div className={`mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3 ${!mobile && isCollapsed ? "flex justify-center" : ""}`}>
        {!mobile && isCollapsed ? <Users className="h-4 w-4 text-slate-500" /> : <><p className="text-xs font-medium text-slate-500">Signed in as</p><p className="mt-1 truncate text-sm font-semibold text-slate-900">{name}</p><p className="mt-0.5 text-xs text-teal-700">District Medical Officer</p></>}
      </div>
    </>
  )

  return (
    <>
      <aside className={`hidden h-screen shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white px-3 py-5 transition-[width] duration-300 xl:flex ${isCollapsed ? "w-[84px]" : "w-64"}`}>{content()}</aside>
      <div className={`fixed inset-0 z-40 bg-slate-950/30 transition ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} onClick={onClose} />
      <aside className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-xl transition-transform duration-300 xl:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>{content(true)}</aside>
    </>
  )
}

export default Sidebar