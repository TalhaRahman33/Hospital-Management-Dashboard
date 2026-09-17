"use client"
import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
        <div className="min-w-0 flex-1">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default Layout