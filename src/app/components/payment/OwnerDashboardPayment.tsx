import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Trash2, AlertCircle, Eye, CheckCircle, XCircle, ArrowRight, DownloadCloud } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  roomId: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  monthlyRent: number;
  dueDate: string; // YYYY-MM-DD
  checkInDate: string;
}

interface Room {
  id: string;
  roomNumber: string;
  bedCount: number;
  tenants: Tenant[];
}

interface BoardingHouse {
  _id?: string;
  id?: string;
  name: string;
  address: string;
  city?: string;
  monthlyPrice?: number;
  roomCount?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  totalRooms?: number;
  totalTenants?: number;
  availableRooms?: number;
  rooms?: Room[];
}

// Utility function to calculate days overdue
const getDaysOverdue = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Utility function to check if overdue 10+ days
const isOverdue10Plus = (dueDate: string) => getDaysOverdue(dueDate) >= 10;

// Mock boarding places with rooms and tenants
const mockBoardingPlaces: BoardingHouse[] = [
  {
    id: '1',
    name: 'Sunrise Boarding House',
    address: '123 Malabe, Colombo',
    rooms: [
      {
        id: '101',
        roomNumber: '101',
        bedCount: 2,
        tenants: [
          { id: 't1', name: 'Alice Perera', roomId: '101', paymentStatus: 'paid', monthlyRent: 15000, dueDate: '2026-02-28', checkInDate: '2024-01-15' },
          { id: 't2', name: 'Bob Silva', roomId: '101', paymentStatus: 'overdue', monthlyRent: 15000, dueDate: '2026-02-05', checkInDate: '2024-02-01' },
        ]
      },
      {
        id: '102',
        roomNumber: '102',
        bedCount: 3,
        tenants: [
          { id: 't3', name: 'Charlie Brown', roomId: '102', paymentStatus: 'overdue', monthlyRent: 18000, dueDate: '2026-01-15', checkInDate: '2024-01-10' },
          { id: 't4', name: 'Dana White', roomId: '102', paymentStatus: 'pending', monthlyRent: 18000, dueDate: '2026-03-05', checkInDate: '2024-03-01' },
        ]
      },
    ]
  },
  {
    id: '2',
    name: 'Green Villa Boarding',
    address: '45 Kaduwela, Colombo',
    rooms: [
      {
        id: '201',
        roomNumber: '201',
        bedCount: 2,
        tenants: [
          { id: 't5', name: 'Eve Johnson', roomId: '201', paymentStatus: 'paid', monthlyRent: 12000, dueDate: '2026-02-25', checkInDate: '2024-02-01' },
          { id: 't6', name: 'Frank Miller', roomId: '201', paymentStatus: 'paid', monthlyRent: 12000, dueDate: '2026-03-10', checkInDate: '2024-03-10' },
        ]
      },
      {
        id: '202',
        roomNumber: '202',
        bedCount: 2,
        tenants: [
          { id: 't7', name: 'Grace Lee', roomId: '202', paymentStatus: 'overdue', monthlyRent: 12000, dueDate: '2026-01-10', checkInDate: '2024-01-10' },
        ]
      },
    ]
  },
];

export default function OwnerDashboardPayment() {
  const navigate = useNavigate();

  // Mock pending slips for demo
  const [pendingSlips, setPendingSlips] = useState([
    { id: 'ps1', tenantName: 'Dana White', roomNumber: '102', placeId: '1', placeName: 'Sunrise Boarding House', amount: 18000, date: '2026-03-05' },
    { id: 'ps2', tenantName: 'Grace Lee', roomNumber: '202', placeId: '2', placeName: 'Green Villa Boarding', amount: 12000, date: '2026-01-10' }
  ]);

  const handleApproveSlip = (slipId: string) => {
    setPendingSlips(prev => prev.filter(s => s.id !== slipId));
  };

  const handleRejectSlip = (slipId: string) => {
    setPendingSlips(prev => prev.filter(s => s.id !== slipId));
  };

  const handleDownloadSlip = (slipId: string) => {
    const slip = pendingSlips.find(s => s.id === slipId);
    if (!slip) return;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Slip - ${slip.tenantName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { font-size: 28px; color: #1e40af; margin-bottom: 8px; }
            .header p { color: #666; font-size: 14px; }
            .details { margin: 20px 0; }
            .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
            .label { font-weight: 600; color: #374151; }
            .value { color: #6b7280; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
            .badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 4px; font-size: 12px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💳 Payment Slip</h1>
              <p>${slip.placeName}</p>
              <span class="badge">Slip ID: ${slip.id}</span>
            </div>
            <div class="details">
              <div class="row">
                <span class="label">Tenant Name:</span>
                <span class="value">${slip.tenantName}</span>
              </div>
              <div class="row">
                <span class="label">Room Number:</span>
                <span class="value">${slip.roomNumber}</span>
              </div>
              <div class="row">
                <span class="label">Amount:</span>
                <span class="value" style="font-weight: 600; color: #059669; font-size: 16px;">Rs. ${slip.amount.toLocaleString()}</span>
              </div>
              <div class="row">
                <span class="label">Due Date:</span>
                <span class="value">${slip.date}</span>
              </div>
              <div class="row">
                <span class="label">Generated:</span>
                <span class="value">${new Date().toLocaleString()}</span>
              </div>
            </div>
            <div class="footer">
              <p>This is an official payment slip document. Please keep it for your records.</p>
              <p style="margin-top: 10px;">© 2026 Boarding House Management System</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create blob and download as HTML file
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-slip-${slip.tenantName.replace(/\s+/g, '-')}-${slip.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Owner Payment Dashboard</h2>
      </div>

      {/* Review Payment Slips Section */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
          New Payment Slips to Review
          {pendingSlips.length > 0 && (
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-xs">
              {pendingSlips.length}
            </span>
          )}
        </h3>

        <div className="space-y-3">
          {pendingSlips.length > 0 ? (
            pendingSlips.map(slip => (
              <div key={slip.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 border border-amber-500/20 rounded-xl hover:bg-white/10 transition-colors">
                <div className="mb-3 md:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-white font-semibold">{slip.tenantName}</p>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">{slip.placeName}</span>
                  </div>
                  <p className="text-xs text-gray-400">Room {slip.roomNumber} • Rs.{slip.amount.toLocaleString()} • Uploaded: {slip.date}</p>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-cyan-300 font-medium transition-all shadow-sm border border-cyan-500/20">
                    <Eye size={16} />
                    View Slip
                  </button>
                  <button
                    onClick={() => handleDownloadSlip(slip.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-emerald-300 font-medium transition-all shadow-sm border border-emerald-500/20"
                    title="Download Slip"
                  >
                    <DownloadCloud size={16} />
                    Download
                  </button>
                  <button
                    onClick={() => handleApproveSlip(slip.id)}
                    className="flex items-center justify-center p-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg text-green-400 transition-all border border-green-500/20"
                    title="Approve Payment"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleRejectSlip(slip.id)}
                    className="flex items-center justify-center p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-all border border-red-500/20"
                    title="Reject Payment"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed border-white/5 rounded-xl">
              <CheckCircle size={32} className="mb-3 text-white/20" />
              <p className="text-sm font-medium">You're all caught up!</p>
              <p className="text-xs mt-1 opacity-60">No pending payment slips to review at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Select Boarding Place Section */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Manage Boarding Places</h3>
        <p className="text-xs text-gray-400 mb-6">Select a boarding place to view detailed payment status, overdue tenants, and management options.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockBoardingPlaces.map(place => {
            const allTenantsInPlace = place.rooms ? place.rooms.flatMap(r => r.tenants) : [];
            const overdueCount = allTenantsInPlace.filter(t => t.paymentStatus === 'overdue').length;

            return (
              <div
                key={place.id}
                onClick={() => navigate(`/payment-rental/${place.id}`)}
                className="group p-5 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                  <ArrowRight size={20} className="text-cyan-400" />
                </div>

                <h4 className="text-base font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">{place.name}</h4>
                <p className="text-xs text-gray-400 mb-4">{place.address}</p>

                <div className="flex items-center gap-4 border-t border-white/10 pt-4 mt-2">
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Tenants</p>
                    <p className="text-sm font-bold text-white">{allTenantsInPlace.length}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Overdue</p>
                    <p className={`text-sm font-bold ${overdueCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {overdueCount}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
