"use client"
import React from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 h-[72px] px-8 bg-white border-b border-slate-200">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
        <input
          type="text"
          placeholder="Search patients, rooms, or records..."
          className="w-full h-10 pl-9 pr-4 rounded-lg bg-slate-100 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#14B8A6]/40 transition-shadow"
        />
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-5 shrink-0">
        <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
          <Bell className="w-[18px] h-[18px] text-slate-500" strokeWidth={2} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
        </button>

        <div className="w-px h-6 bg-slate-200" />

        <button className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6366F1] to-[#14B8A6] flex items-center justify-center text-white text-xs font-semibold font-['Space_Grotesk']">
            AR
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[13px] font-medium text-slate-800 leading-tight">Dr. Ayesha Raza</p>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Chief Physician</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}

export default Navbar