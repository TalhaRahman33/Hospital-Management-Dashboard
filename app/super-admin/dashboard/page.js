"use client";

import { useEffect, useState } from "react";
import { Building2, ShieldCheck } from "lucide-react";
import { getHospitalsApi } from "../hospitals/_lib/apiHandler";
import { getUsersApi } from "../users/_lib/apiHandler";

const getCount = (response, key) => {
  const records = response?.[key];
  return Array.isArray(records) ? records.length : 0;
};

const DashboardPage = () => {
  const [counts, setCounts] = useState({ hospitals: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [hospitalsResponse, usersResponse] = await Promise.all([
          getHospitalsApi(),
          getUsersApi(),
        ]);

        setCounts({
          hospitals: getCount(hospitalsResponse, "hospitals"),
          users: getCount(usersResponse, "users"),
        });
      } catch (loadError) {
        setError(loadError?.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const cards = [
    {
      title: "Total Hospitals",
      value: counts.hospitals,
      detail: "Registered facilities",
      icon: Building2,
    },
    {
      title: "Total Users",
      value: counts.users,
      detail: "Registered accounts",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Super Admin Dashboard</h1>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
          <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500">{card.title}</p>
            </div>
            <p className="mt-4 text-3xl font-semibold text-slate-900">
              {loading ? "..." : card.value}
            </p>
            <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
