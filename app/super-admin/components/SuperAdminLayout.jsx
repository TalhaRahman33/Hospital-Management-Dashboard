'use client';

import { useEffect, useState } from 'react';
import SuperAdminNavbar from './SuperAdminNavbar';
import SuperAdminSidebar from './SuperAdminSidebar';
import { useAuthStore } from '@/store/authStore';
import { getCurrentUser } from '../_lib/apiHandler';

export default function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        <SuperAdminSidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
          userName={userName}
        />

        <div className="min-w-0 flex-1">
          <SuperAdminNavbar
            onMenuClick={() => setSidebarOpen(true)}
            userName={userName}
            isSidebarCollapsed={sidebarCollapsed}
          />
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
