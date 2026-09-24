"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Activity, ArrowUpRight, Building2, ClipboardCheck, LoaderCircle, ShieldCheck, Users } from "lucide-react"
import { getDmoDashboard } from "./_lib/apiHandler"

const DashboardPage = () => {
	const user = useAuthStore((state) => state.user)
	const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.name || "DMO User"
	const [dashboard, setDashboard] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	useEffect(() => {
		let active = true

		getDmoDashboard()
			.then((data) => active && setDashboard(data))
			.catch((loadError) => active && setError(loadError?.message || "Unable to load dashboard data."))
			.finally(() => active && setLoading(false))

		return () => { active = false }
	}, [])

	const totals = dashboard?.totals || dashboard?.summary || dashboard || {}
	const hospitals = dashboard?.hospitals || dashboard?.assignedHospitals || []
	const getTotal = (...keys) => keys.reduce((value, key) => value ?? totals?.[key], null) ?? 0

	const metrics = [
		{ label: "Assigned hospitals", value: getTotal("hospitals", "hospitalCount", "totalHospitals") || hospitals.length, icon: Building2, color: "bg-teal-50 text-teal-700" },
		{ label: "Total patients", value: getTotal("patients", "patientCount", "totalPatients"), icon: Users, color: "bg-sky-50 text-sky-700" },
		{ label: "Discharged patients", value: getTotal("dischargedPatients", "dischargedPatientCount", "totalDischargedPatients"), icon: ClipboardCheck, color: "bg-amber-50 text-amber-700" },
	]

	return (
		<div className="mx-auto max-w-7xl space-y-6">
			<section className="relative overflow-hidden rounded-2xl bg-[#123c40] px-6 py-7 text-white shadow-xl shadow-teal-900/10 md:px-8 md:py-9">
				<div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[32px] border-teal-300/10" />
				<div className="absolute bottom-[-90px] right-24 h-52 w-52 rounded-full border-[24px] border-cyan-200/10" />
				<div className="relative max-w-2xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-teal-100"><ShieldCheck className="h-3.5 w-3.5" />DMO command center</div><h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Good morning, {name.split(" ")[0]}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-teal-100/80">A clear view of district healthcare operations, hospital performance, and patient activity.</p></div>
			</section>
			{error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

			<section className="grid gap-4 md:grid-cols-3">
				{metrics.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></div><ArrowUpRight className="h-4 w-4 text-slate-300" /></div><p className="mt-5 text-3xl font-semibold text-slate-900">{loading ? <LoaderCircle className="h-8 w-8 animate-spin text-slate-300" /> : value.toLocaleString()}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div>)}
			</section>

			<section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Assigned network</p><h3 className="mt-1 text-lg font-semibold text-slate-900">Hospital activity</h3></div><Activity className="h-5 w-5 text-teal-600" /></div><div className="mt-5 space-y-3">{hospitals.slice(0, 4).map((hospital) => <div key={hospital.id || hospital._id || hospital.hospitalId || hospital.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{hospital.name || hospital.hospitalName || "Assigned hospital"}</p><p className="text-xs text-slate-500">{hospital.patients ?? hospital.patientCount ?? 0} patients</p></div><Building2 className="h-4 w-4 shrink-0 text-teal-600" /></div>)}{!loading && !hospitals.length && <p className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-500">No assigned hospitals found.</p>}</div></div>
				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Quick access</p><h3 className="mt-1 text-lg font-semibold text-slate-900">Keep work moving</h3><div className="mt-5 space-y-3"><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm"><Building2 className="h-4 w-4" /></div><div><p className="text-sm font-semibold text-slate-800">Hospital network</p><p className="text-xs text-slate-500">Review connected facilities</p></div></div><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sky-700 shadow-sm"><ClipboardCheck className="h-4 w-4" /></div><div><p className="text-sm font-semibold text-slate-800">Pending reviews</p><p className="text-xs text-slate-500">No new reviews available</p></div></div></div></div>
			</section>
		</div>
	)
}

export default DashboardPage
