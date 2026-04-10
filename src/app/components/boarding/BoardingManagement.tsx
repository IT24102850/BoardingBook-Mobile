import React from 'react';

export default function BoardingManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-700 flex flex-col items-center py-12 px-4 text-white">
      <h2 className="text-4xl font-extrabold mb-6 text-center drop-shadow-lg">Boarding House & Room Management</h2>
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl text-indigo-900">
        <p className="mb-4 text-lg font-semibold">Owner tools for managing houses, rooms, tenants, and payments will appear here.</p>
        <ul className="list-disc pl-6 space-y-2 text-base">
          <li>Add, edit, and delete boarding houses and rooms</li>
          <li>Upload photos, set prices, facilities, and vacancies</li>
          <li>Tenant overview dashboard</li>
          <li>Send payment reminders, view/download receipts</li>
        </ul>
      </div>
    </div>
  );
}
