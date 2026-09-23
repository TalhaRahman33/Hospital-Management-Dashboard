"use client"
import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-800">
      <div className="flex h-full min-h-0">
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default Layout