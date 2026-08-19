'use client';

import { useEffect, useState } from 'react';
import SuperAdminNavbar from './SuperAdminNavbar';
import SuperAdminSidebar from './SuperAdminSidebar';
import { useAuthStore } from '@/store/authStore';
import { getCurrentUser } from '../_lib/apiHandler';

export default function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { accessToken, user, updateUser } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    getCurrentUser()
      .then((currentUser) => {
        if (currentUser) {
          updateUser(currentUser);
        }
      })
      .catch(() => {
        // Keep the cached user visible when the profile request is unavailable.
      });
  }, [accessToken, updateUser]);

  const userName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(' ') || user?.name || 'Super Admin';

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#f3f8ff_45%,#eefbf7_100%)] text-slate-800">
      <div className="flex min-h-screen">
        <SuperAdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userName={userName} />

        <div className="flex-1">
          <SuperAdminNavbar onMenuClick={() => setSidebarOpen(true)} userName={userName} />
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
