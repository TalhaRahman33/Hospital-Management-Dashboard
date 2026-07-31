'use client';

import { useState } from 'react';
import SuperAdminNavbar from './SuperAdminNavbar';
import SuperAdminSidebar from './SuperAdminSidebar';
import { useAuthStore } from '@/store/authStore';

export default function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#f3f8ff_45%,#eefbf7_100%)] text-slate-800">
      <div className="flex min-h-screen">
        <SuperAdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userName={user?.name} />

        <div className="flex-1">
          <SuperAdminNavbar onMenuClick={() => setSidebarOpen(true)} userName={user?.name} />
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
