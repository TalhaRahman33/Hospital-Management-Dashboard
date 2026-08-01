"use client"
import React from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <Sidebar />
      <div className="ml-[260px] flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

export default Layout