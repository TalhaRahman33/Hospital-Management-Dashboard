// components/Sidebar.jsx
"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BedDouble, ClipboardPlus, DoorOpen, Activity, Settings, Home, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const NAV_ITEMS = [
  { label: 'Home', href: '/hospital/home', icon: Home, accent: '#14B8A6' },
  { label: 'Dashboard', href: '/hospital/dashboard', icon: LayoutDashboard, accent: '#14B8A6' },
  { label: 'Patient', href: '/hospital/patient', icon: BedDouble, accent: '#6366F1' },
  { label: 'Checkup Patient', href: '/hospital/checkup-patient', icon: ClipboardPlus, accent: '#F59E0B' },
  { label: 'Discharge Patient', href: '/hospital/discharge-patient', icon: DoorOpen, accent: '#EF4444' },
  { label: 'Hospital HR', href: '/hospital/hospital-hr', icon: User, accent: '#F97316' },
]

const Sidebar = () => {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const hospitalName = user?.hospitalAssignments?.[0]?.hospital?.name || 'No hospital assigned'

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#0B1526] flex flex-col z-20">
      {/* Logo lockup */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/15 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-[#14B8A6]" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <p className="font-['Space_Grotesk'] text-white text-[15px] font-semibold leading-tight truncate">
            {hospitalName}
          </p>
          <p className="font-['JetBrains_Mono'] text-[10px] tracking-[0.14em] text-slate-500 uppercase mt-0.5">
            Patient Care System
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon, accent }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={[
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-150',
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]',
              ].join(' ')}
              style={{
                backgroundColor: isActive ? `${accent}1A` : undefined,
              }}
            >
              <span
                className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full transition-opacity duration-150"
                style={{ backgroundColor: accent, opacity: isActive ? 1 : 0 }}
              />
              <Icon
                className="w-[18px] h-[18px] shrink-0"
                strokeWidth={2}
                style={{ color: isActive ? accent : undefined }}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Live status + settings */}
      <div className="px-3 pb-5 space-y-2">
        <div className="rounded-xl bg-white/[0.04] px-4 py-3 flex items-center gap-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]" />
          </span>
          <div className="min-w-0">
            <p className="font-['JetBrains_Mono'] text-white text-sm font-medium leading-none">12</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-none">patients admitted now</p>
          </div>
        </div>

        <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors">
          <Settings className="w-[18px] h-[18px]" strokeWidth={2} />
          Settings
        </button>
      </div>
    </aside>
  )
}

export default Sidebar