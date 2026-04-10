import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-[#181f36]">
      <div className="w-full max-w-4xl p-8 mb-8 bg-[#1e2436] border border-[rgba(129,140,248,0.15)] rounded-2xl shadow-sm">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#818cf8] via-purple-400 to-[#22d3ee] bg-clip-text text-transparent">Administration & Monitoring</h1>
        <p className="text-slate-400 mb-6">Verify users, moderate listings, handle complaints, and view system reports.</p>
        {/* TODO: Add admin verification, moderation, reports, complaints UI */}
      </div>
    </div>
  );
}
