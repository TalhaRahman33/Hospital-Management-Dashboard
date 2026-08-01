import React from 'react'
import { Activity, BedDouble, ClipboardPlus, Users, Stethoscope, CalendarDays } from 'lucide-react'

const stats = [
  { label: 'Admissions Today', value: '124', change: '+8.2%', icon: BedDouble, tone: 'from-teal-500 to-cyan-500' },
  { label: 'Outpatients', value: '86', change: '+4.1%', icon: ClipboardPlus, tone: 'from-indigo-500 to-violet-500' },
  { label: 'Available Beds', value: '42', change: '12 free now', icon: Activity, tone: 'from-amber-500 to-orange-500' },
  { label: 'Doctors On Duty', value: '18', change: '3 available', icon: Stethoscope, tone: 'from-rose-500 to-pink-500' },
]

const appointments = [
  { patient: 'Amina Khan', time: '09:30 AM', doctor: 'Dr. Raza', status: 'Confirmed' },
  { patient: 'Bilal Ahmed', time: '11:00 AM', doctor: 'Dr. Sana', status: 'Pending' },
  { patient: 'Sara Imran', time: '01:15 PM', doctor: 'Dr. Ali', status: 'Confirmed' },
]

const recentPatients = [
  { name: 'Hassan Malik', room: 'Room 204', condition: 'Stable', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Nadia Qureshi', room: 'Room 118', condition: 'Observation', color: 'bg-amber-100 text-amber-700' },
  { name: 'Zainab Farooq', room: 'Room 306', condition: 'Recovering', color: 'bg-sky-100 text-sky-700' },
]

const page = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-600">Hospital overview</p>
          <h1 className="text-2xl font-semibold text-slate-900">Good morning, Dr. Ayesha</h1>
          <p className="text-sm text-slate-500 mt-1">Here’s a quick snapshot of today’s operations.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays className="h-4 w-4 text-teal-500" />
            Friday, August 1, 2026
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`inline-flex rounded-xl bg-gradient-to-br ${item.tone} p-2 text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-500">{item.label}</p>
                <div className="mt-1 flex items-end justify-between">
                  <h2 className="text-2xl font-semibold text-slate-900">{item.value}</h2>
                  <span className="text-sm font-medium text-emerald-600">{item.change}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Today’s appointments</h3>
              <p className="text-sm text-slate-500">Upcoming visits and consultation status</p>
            </div>
            <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">View all</button>
          </div>

          <div className="mt-4 space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.patient} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-800">{appointment.patient}</p>
                  <p className="text-sm text-slate-500">{appointment.doctor} • {appointment.time}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${appointment.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-500" />
            <h3 className="text-lg font-semibold text-slate-900">Patient status</h3>
          </div>
          <div className="mt-4 space-y-3">
            {recentPatients.map((patient) => (
              <div key={patient.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                <div>
                  <p className="font-medium text-slate-800">{patient.name}</p>
                  <p className="text-sm text-slate-500">{patient.room}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${patient.color}`}>
                  {patient.condition}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
