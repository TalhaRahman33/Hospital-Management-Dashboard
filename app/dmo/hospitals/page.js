"use client"

import { useEffect, useMemo, useState } from "react"
import { Building2, ChevronRight, LoaderCircle, Search, Users } from "lucide-react"
import { getDmoDashboard, getDmoHospitalDetail } from "../dashboard/_lib/apiHandler"

const getHospitalId = (hospital) => hospital?.id || hospital?._id || hospital?.hospitalId

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([])
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [detail, setDetail] = useState(null)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getDmoDashboard()
      .then((data) => setHospitals(data?.hospitals || data?.assignedHospitals || []))
      .catch((loadError) => setError(loadError?.message || "Unable to load assigned hospitals."))
      .finally(() => setLoading(false))
  }, [])

  const filteredHospitals = useMemo(() => hospitals.filter((hospital) => {
    const text = `${hospital.name || hospital.hospitalName || ""} ${hospital.location || hospital.city || ""}`
    return text.toLowerCase().includes(query.toLowerCase())
  }), [hospitals, query])

  const selectHospital = async (hospital) => {
    const hospitalId = getHospitalId(hospital)
    setSelectedHospital(hospital)
    if (!hospitalId) return
    setDetailLoading(true)
    try {
      setDetail(await getDmoHospitalDetail(hospitalId))
    } catch (loadError) {
      setError(loadError?.message || "Unable to load hospital details.")
    } finally {
      setDetailLoading(false)
    }
  }

  const getCount = (source, ...keys) => keys.reduce((value, key) => value ?? source?.[key], null) ?? 0
  const totalPatients = hospitals.reduce((total, hospital) => total + getCount(hospital, "patients", "patientCount"), 0)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">DMO / Facilities</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Assigned hospitals</h2><p className="mt-2 text-sm text-slate-500">Monitor hospitals assigned to your district office.</p></section>
      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      <section className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Building2 className="h-5 w-5" /></div><p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? "--" : hospitals.length}</p><p className="mt-1 text-sm text-slate-500">Assigned hospitals</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><Users className="h-5 w-5" /></div><p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? "--" : totalPatients.toLocaleString()}</p><p className="mt-1 text-sm text-slate-500">Patients across assignments</p></div></section>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><div className="relative max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input aria-label="Search hospitals" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assigned hospitals" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10" /></div></div><div className="divide-y divide-slate-100">{loading ? <div className="flex items-center gap-2 p-6 text-sm text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" />Loading hospitals...</div> : filteredHospitals.map((hospital) => { const id = getHospitalId(hospital); const active = selectedHospital && id === getHospitalId(selectedHospital); return <button type="button" key={id || hospital.name} onClick={() => selectHospital(hospital)} className={`flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-teal-50/60 ${active ? "bg-teal-50" : ""}`}><span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-800">{hospital.name || hospital.hospitalName || "Assigned hospital"}</span><span className="mt-1 block text-xs text-slate-500">{hospital.location || hospital.city || "District assignment"}</span></span><ChevronRight className="h-4 w-4 shrink-0 text-slate-400" /></button> })}{!loading && !filteredHospitals.length && <p className="p-6 text-sm text-slate-500">No assigned hospitals found.</p>}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Hospital detail</p>{!selectedHospital ? <div className="mt-10 text-center"><Building2 className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-3 text-sm text-slate-500">Select a hospital to view its patient summary.</p></div> : <><h3 className="mt-2 text-xl font-semibold text-slate-900">{selectedHospital.name || selectedHospital.hospitalName}</h3>{detailLoading ? <div className="mt-8 flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" />Loading detail...</div> : <div className="mt-6 grid grid-cols-2 gap-3">{[["Patients", ["patients", "patientCount"]], ["In-patients", ["inpatients", "inPatientCount", "inpatientsCount"]], ["Discharged", ["dischargedPatients", "dischargedPatientCount"]], ["Status", ["status"]]].map(([label, keys]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-semibold text-slate-900">{keys[0] === "status" ? (detail?.status || selectedHospital.status || "Active") : getCount(detail?.totals || detail?.summary || detail || selectedHospital, ...keys).toLocaleString()}</p></div>)}</div>}</>}</div>
      </section>
    </div>
  )
}
