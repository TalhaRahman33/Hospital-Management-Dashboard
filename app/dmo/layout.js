"use client"

import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"

export default function DmoLayout({ children }) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

	return (
		<div className="h-screen overflow-hidden bg-[#f4f7f8] text-slate-800">
			<div className="flex h-full min-h-0">
				<Sidebar
					isOpen={sidebarOpen}
					isCollapsed={sidebarCollapsed}
					onClose={() => setSidebarOpen(false)}
					onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
				/>
				<div className="flex min-h-0 min-w-0 flex-1 flex-col">
					<Navbar onMenuClick={() => setSidebarOpen(true)} />
					<main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
						{children}
					</main>
				</div>
			</div>
		</div>
	)
}
