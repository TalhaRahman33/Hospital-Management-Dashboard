'use client';

import { useEffect } from 'react';
import { Building2, Users, Activity, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getCurrentUser } from '../_lib/apiHandler';

export default function HospitalHomePage() {
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

	const hospitalAssignment = user?.hospitalAssignments?.[0];
	const hospitalName = hospitalAssignment?.hospital?.name || 'No hospital assigned';
	const hospitalCity = hospitalAssignment?.hospital?.city;
	const userRole = hospitalAssignment?.role;

	return (
		<section className="relative flex min-h-[calc(100vh-136px)] items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4">
			{/* Decorative background blobs */}
			<div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-100/60 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

			<div className="relative w-full max-w-3xl">
				<div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 text-center shadow-xl shadow-slate-200/50 backdrop-blur-sm md:p-14">
					<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30">
						<Building2 className="h-9 w-9" strokeWidth={1.8} />
					</div>

					<p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">
						Hospital Portal
					</p>

					<h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
						{hospitalName}
					</h1>

					{hospitalCity && (
						<p className="mt-1 text-sm text-slate-400">{hospitalCity}</p>
					)}

					<p className="mx-auto mt-4 max-w-md text-slate-500">
						Welcome back{user?.firstName ? `, ${user.firstName}` : ''}. Here&apos;s a quick
						overview of your hospital management system.
					</p>

					{userRole && (
						<span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
							<Activity className="h-3.5 w-3.5" />
							{userRole}
						</span>
					)}

				
				</div>
			</div>
		</section>
	);
}