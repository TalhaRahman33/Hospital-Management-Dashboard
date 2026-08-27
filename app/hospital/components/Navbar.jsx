// components/Navbar.jsx
"use client"
import React, { useEffect } from 'react'
import { Bell, ChevronDown, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { getCurrentUser } from '../_lib/apiHandler'

const Navbar = () => {
  const router = useRouter();
  const { accessToken, user, updateUser, logoutUser } = useAuthStore();

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!accessToken) {
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (currentUser) {
          updateUser(currentUser);
        }
      } catch {
        // Keep the cached user visible when the profile request is unavailable.
      }
    };

    loadCurrentUser();
  }, [accessToken, updateUser]);

  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(' ') || user?.name || 'User';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const roleName = user?.role?.name || user?.role?.title || user?.role || 'Staff';
  const hospitalName = user?.hospitalAssignments?.[0]?.hospital?.name || 'No hospital assigned';
  const assignmentRole = user?.hospitalAssignments?.[0]?.role || roleName;

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex min-h-20 items-center justify-between gap-6 border-b border-slate-200 bg-white px-6 md:px-8">
      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold text-slate-900 md:text-lg">
          Welcome back, {fullName} <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 truncate text-xs text-slate-500 md:text-[13px]">
          Here&apos;s what&apos;s happening in your hospital today.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 md:gap-5">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-[19px] w-[19px]" strokeWidth={1.8} />
          <span className="absolute right-0.5 top-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#EF4444] px-1 text-[9px] font-bold leading-none text-white">
            3
          </span>
        </button>

        <button className="group flex items-center gap-2.5 text-left" type="button">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2196B5] text-xs font-semibold text-white shadow-sm">
            {initials}
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-52 truncate text-[13px] font-semibold leading-tight text-slate-800">{fullName}</p>
            <p className="mt-1 max-w-52 truncate text-[11px] leading-tight text-slate-400">{assignmentRole} · {hospitalName}</p>
          </div>
          <ChevronDown
            className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-600"
            strokeWidth={2}
          />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          aria-label="Logout"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>
      </div>
    </header>
  )
}

export default Navbar