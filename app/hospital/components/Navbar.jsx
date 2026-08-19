// components/Navbar.jsx
"use client"
import React from 'react'
import { Bell, ChevronDown, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const Navbar = () => {
  const router = useRouter();
  const { logoutUser } = useAuthStore();

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 h-[72px] px-8 bg-white/90 backdrop-blur-sm border-b border-slate-200">
      <div className="flex-1" />

      <div className="flex items-center gap-5 shrink-0">
        <button
          className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px] text-slate-500" strokeWidth={2} />
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EF4444]" />
          </span>
        </button>

        <div className="w-px h-6 bg-slate-200" />

        <button className="flex items-center gap-3 group" type="button">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6366F1] to-[#14B8A6] flex items-center justify-center text-white text-xs font-semibold font-['Space_Grotesk'] shadow-sm">
            AR
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[13px] font-medium text-slate-800 leading-tight">Dr. Ayesha Raza</p>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Chief Physician</p>
          </div>
          <ChevronDown
            className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors"
            strokeWidth={2}
          />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}

export default Navbar