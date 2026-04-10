import React from 'react';

export default function Home() {
  // TODO: Card-based boarding browser, filters, actions
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      <h2 className="text-3xl font-extrabold text-cyan-200 mb-6">Browse Boarding Places</h2>
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {/* Card browser, filters, actions */}
        <div className="bg-white/80 rounded-xl shadow-lg p-6 text-cyan-900">Boarding cards coming soon...</div>
      </div>
    </div>
  );
}
