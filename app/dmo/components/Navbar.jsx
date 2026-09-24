"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, ChevronDown, LogOut, Menu, ShieldCheck, UserCircle2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { getCurrentUser } from "../dashboard/_lib/apiHandler"

export default function Navbar({ onMenuClick }) {
  const router = useRouter()
  const pathname = usePathname()
  const profileRef = useRef(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const { accessToken, user, updateUser, logoutUser } = useAuthStore()

  useEffect(() => {
    const closeMenu = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false)
    }
    document.addEventListener("mousedown", closeMenu)
    return () => document.removeEventListener("mousedown", closeMenu)
  }, [])

  useEffect(() => {
    if (!accessToken) return
    getCurrentUser().then((currentUser) => currentUser && updateUser(currentUser)).catch(() => {})
  }, [accessToken, updateUser])

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.name || "DMO User"
  const roleName = user?.role?.name || user?.role?.title || user?.role || "District Medical Officer"
  const pageName = pathname?.split("/").filter(Boolean).pop() || "dashboard"
  const title = pageName.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onMenuClick} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 xl:hidden" aria-label="Open menu"><Menu className="h-4 w-4" /></button>
          <div className="min-w-0"><div className="flex items-center gap-2 text-xs font-medium text-slate-400"><span>DMO Portal</span><span>/</span><span className="truncate text-slate-600">{title}</span></div><h1 className="mt-0.5 truncate text-lg font-semibold text-slate-900">District Medical Office</h1></div>
        </div>
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" />System online</div>
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-teal-50 hover:text-teal-700" aria-label="Notifications"><Bell className="h-[19px] w-[19px]" /><span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-teal-600" /></button>
          <div ref={profileRef} className="relative"><button type="button" onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 text-left hover:border-teal-200 hover:bg-slate-50" aria-expanded={profileOpen}><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white"><UserCircle2 className="h-4 w-4" /></span><span className="hidden max-w-36 truncate text-sm font-semibold text-slate-800 sm:block">{fullName}</span><ChevronDown className={`hidden h-4 w-4 text-slate-400 transition sm:block ${profileOpen ? "rotate-180" : ""}`} /></button>
            {profileOpen && <div className="absolute right-0 top-full z-30 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/60"><div className="border-b border-slate-100 px-3 py-2"><p className="truncate text-sm font-semibold text-slate-900">{fullName}</p><p className="truncate text-xs text-slate-500">{roleName}</p></div><button type="button" onClick={() => { logoutUser(); router.push("/login") }} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-700"><LogOut className="h-4 w-4" />Sign out</button></div>}
          </div>
        </div>
      </div>
    </header>
  )
}