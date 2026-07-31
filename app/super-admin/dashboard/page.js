import React from 'react';

const page = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Super Admin Dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Monitor platform activity, hospital performance, and administration tasks from one elegant control center.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Hospitals', value: '24', detail: 'Active facilities' },
          { title: 'Admins', value: '8', detail: 'Operational staff' },
          { title: 'Pending', value: '3', detail: 'Approvals needed' },
        ].map((card) => (
          <div key={card.title} className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">{card.title}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
