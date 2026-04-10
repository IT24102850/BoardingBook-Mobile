import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, AlertCircle, Trash2, Star, MapPin, Home, Users as UsersIcon, CreditCard, ChevronRight, X, CheckCircle, Navigation, TrendingUp, TrendingDown, Clock, ShieldAlert } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  roomId: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  monthlyRent: number;
  outstandingBalance?: number;
  dueDate: string;
  checkInDate: string;
  phone?: string;
  email?: string;
  trustScore?: 'high' | 'medium' | 'low';
}

interface Room {
  id: string;
  roomNumber: string;
  bedCount: number;
  occupiedBeds: number;
  price: number;
  status: 'available' | 'partial' | 'full';
  tenants: Tenant[];
}

interface BoardingHouse {
  _id?: string;
  id?: string;
  name: string;
  address: string;
  city?: string;
  image?: string;
  rating?: number;
  totalReviews?: number;
  totalRooms?: number;
  occupiedRooms?: number;
  monthlyPrice?: number;
  roomCount?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  totalTenants?: number;
  availableRooms?: number;
  rooms: Room[];
}

// Utility function to calculate days overdue
const getDaysOverdue = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const isOverdue10Plus = (dueDate: string) => getDaysOverdue(dueDate) >= 10;

export default function BoardingPlaceDetail() {
  const navigate = useNavigate();
  const { placeId } = useParams<{ placeId: string }>();
  const [place, setPlace] = useState<BoardingHouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removedTenants, setRemovedTenants] = useState<Set<string>>(new Set());
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [confirmRemoveTenant, setConfirmRemoveTenant] = useState<Tenant | null>(null);
  const [remindedTenants, setRemindedTenants] = useState<Set<string>>(new Set());

  // Fetch boarding place data from API
  const fetchPlace = useCallback(async () => {
    if (!placeId) {
      setError('No boarding place ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch the boarding house details
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(
        `${apiUrl}/payment/boarding-places`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('bb_access_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch boarding places');
      
      const data = await response.json();
      
      // Find the specific place by ID
      const allPlaces = data.data || [];
      const foundPlace = allPlaces.find((p: any) => 
        p._id === placeId || p.id === placeId
      );

      if (!foundPlace) {
        setError('Boarding place not found');
        setPlace(null);
      } else {
        setPlace({
          ...foundPlace,
          id: foundPlace._id || foundPlace.id,
          rooms: foundPlace.rooms || []
        });
      }
    } catch (err: any) {
      console.error('Error fetching boarding place:', err);
      setError(err.message || 'Failed to load boarding place');
      setPlace(null);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    fetchPlace();
  }, [fetchPlace]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
        <div className="text-cyan-400 mb-3">Loading...</div>
        <p className="text-gray-400 text-sm">Fetching boarding place details</p>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
        <div className="text-center p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <div className="text-rose-400 font-bold mb-2">Error</div>
          <p className="text-gray-300 mb-4">{error || 'Boarding place not found'}</p>
          <button
            onClick={() => navigate('/payment-rental')}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-lg text-cyan-400 transition-all border border-cyan-500/30"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Continue with the rest of the component logic using the fetched 'place'


  const allTenants = (place.rooms ? place.rooms.flatMap(r => r.tenants) : []).filter(t => !removedTenants.has(t.id));
  const paidCount = allTenants.filter(t => t.paymentStatus === 'paid').length;
  const overdueCount = allTenants.filter(t => t.paymentStatus === 'overdue').length;
  const totalCollected = allTenants.filter(t => t.paymentStatus === 'paid').reduce((sum, t) => sum + t.monthlyRent, 0);

  const handleRemoveTenant = (tenantId: string) => {
    const newRemoved = new Set(removedTenants);
    newRemoved.add(tenantId);
    setRemovedTenants(newRemoved);
    setConfirmRemoveTenant(null);
  };

  const handleSendReminder = (tenant: Tenant) => {
    const updated = new Set(remindedTenants);
    updated.add(tenant.id);
    setRemindedTenants(updated);
  };

  const downloadReceipt = (tenant: Tenant, month: string, paidDate: string) => {
    const room = place.rooms?.find(r => r.id === tenant.roomId);
    const receiptHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - ${tenant.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f0f4f8; display: flex; justify-content: center; padding: 40px 20px; }
    .receipt { background: #fff; width: 520px; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
    .header { background: linear-gradient(135deg, #06b6d4, #3b82f6); padding: 32px 36px; color: white; }
    .header h1 { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
    .header p { font-size: 13px; opacity: 0.8; margin-top: 4px; }
    .badge { margin-top: 20px; display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 999px; padding: 6px 14px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; }
    .badge::before { content: '✓'; font-size: 14px; }
    .body { padding: 32px 36px; }
    .amount-block { text-align: center; padding: 24px; background: linear-gradient(135deg, #ecfdf5, #f0fdf4); border: 2px solid #d1fae5; border-radius: 12px; margin-bottom: 28px; }
    .amount-block .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600; }
    .amount-block .amount { font-size: 42px; font-weight: 900; color: #059669; margin: 4px 0; }
    .amount-block .status { font-size: 12px; color: #10b981; background: #d1fae5; border: 1px solid #a7f3d0; display: inline-block; padding: 4px 12px; border-radius: 999px; font-weight: 700; letter-spacing: 0.5px; }
    .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .row .key { color: #6b7280; }
    .row .val { font-weight: 600; color: #111827; text-align: right; }
    .approval { margin-top: 28px; padding: 20px; background: #fffbeb; border: 2px dashed #fbbf24; border-radius: 12px; display: flex; align-items: center; gap: 14px; }
    .stamp { width: 56px; height: 56px; border-radius: 50%; background: #10b981; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; flex-shrink: 0; }
    .approval-text h4 { font-size: 14px; font-weight: 700; color: #92400e; }
    .approval-text p { font-size: 12px; color: #b45309; margin-top: 2px; }
    .footer { text-align: center; padding: 20px 36px; background: #f9fafb; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 11px; color: #9ca3af; line-height: 1.6; }
    .receipt-id { font-size: 10px; color: #d1d5db; margin-top: 8px; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>${place.name}</h1>
      <p>${place.address}</p>
      <div class="badge">PAYMENT RECEIPT</div>
    </div>
    <div class="body">
      <div class="amount-block">
        <p class="label">Amount Paid</p>
        <p class="amount">Rs. ${tenant.monthlyRent.toLocaleString()}</p>
        <span class="status">✓ FULLY PAID</span>
      </div>
      <div class="row"><span class="key">Tenant Name</span><span class="val">${tenant.name}</span></div>
      <div class="row"><span class="key">Room Number</span><span class="val">Room ${room?.roomNumber}</span></div>
      <div class="row"><span class="key">Payment Month</span><span class="val">${month}</span></div>
      <div class="row"><span class="key">Payment Date</span><span class="val">${paidDate}</span></div>
      <div class="row"><span class="key">Monthly Rent</span><span class="val">Rs. ${tenant.monthlyRent.toLocaleString()}</span></div>
      <div class="row"><span class="key">Outstanding Balance</span><span class="val">Rs. 0</span></div>
      <div class="approval">
        <div class="stamp">✓</div>
        <div class="approval-text">
          <h4>Approved by Owner</h4>
          <p>This receipt has been verified and approved by <strong>${place.name}</strong> management.</p>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>This is an official payment receipt for your records.<br>For queries, contact the boarding house management.</p>
      <p class="receipt-id">Receipt ID: RCP-${tenant.id.toUpperCase()}-${Date.now()}</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${tenant.name.replace(' ', '_')}_${month.replace(' ', '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">

      {/* Hero Header with Blurred Background */}
      <div className="relative fixed top-12 left-0 right-0 z-40 overflow-hidden border-b border-white/10 shadow-2xl">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 blur-xl scale-110"
          style={{ backgroundImage: `url(${place.image})` }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/80"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/payment-rental')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all mb-6 text-sm backdrop-blur-md w-fit"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 tracking-tight">{place.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm shadow-inner">
                  <MapPin size={14} className="text-cyan-400" />
                  {place.address}
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm shadow-inner">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-gray-300 font-medium">{place.rating}</span> ({place.totalReviews} reviews)
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md shadow-lg">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <Home size={24} className="text-cyan-400" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-white leading-none">{place.occupiedRooms}<span className="text-base text-gray-500 font-normal">/{place.totalRooms}</span></p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-semibold">Rooms Filled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-[200px] pb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute -right-4 -bottom-4 bg-indigo-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 mb-1">Total Tenants</p>
                <p className="text-3xl font-black text-white">{allTenants.length}</p>
              </div>
              <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/20 shadow-inner">
                <UsersIcon size={20} className="text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 hover:bg-emerald-900/10 transition-all">
            <div className="absolute -right-4 -bottom-4 bg-emerald-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 mb-1">Paid Tenants</p>
                <p className="text-3xl font-black text-emerald-400">{paidCount}</p>
              </div>
              <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/20 shadow-inner">
                <CheckCircle size={20} className="text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-rose-500/30 hover:bg-rose-900/10 transition-all">
            <div className="absolute -right-4 -bottom-4 bg-rose-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 mb-1">Overdue</p>
                <p className="text-3xl font-black text-rose-400">{overdueCount}</p>
              </div>
              <div className="p-2.5 bg-rose-500/20 rounded-xl border border-rose-500/20 shadow-inner">
                <Clock size={20} className="text-rose-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 hover:bg-cyan-900/10 transition-all">
            <div className="absolute -right-4 -bottom-4 bg-cyan-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-all"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold text-cyan-500/80 mb-1">Total Collected</p>
                <p className="text-3xl font-black text-cyan-400 tracking-tight">Rs.{totalCollected.toLocaleString()}</p>
              </div>
              <div className="p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-500/30 shadow-inner">
                <TrendingUp size={20} className="text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/20 shadow-inner">
                <Home size={20} className="text-cyan-400" />
              </div>
              Rooms Overview
            </h2>
            <span className="text-xs font-semibold text-cyan-500/80 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 tracking-wider uppercase">
              {place.rooms?.length || 0} Total Rooms
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(place.rooms || []).map(room => {
              const activeTenantsInRoom = room.tenants.filter(t => !removedTenants.has(t.id));
              const isFull = activeTenantsInRoom.length >= room.bedCount;
              return (
                <div key={room.id} className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-5 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      Room {room.roomNumber}
                    </h3>
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border shadow-sm ${room.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      room.status === 'partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                      {room.status}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Occupancy</span>
                      <span className="text-white font-medium">
                        <span className={isFull ? 'text-emerald-400' : 'text-amber-400'}>{activeTenantsInRoom.length}</span> / {room.bedCount} beds
                      </span>
                    </div>

                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                      <div
                        className={`h-1.5 rounded-full ${isFull ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`}
                        style={{ width: `${(activeTenantsInRoom.length / room.bedCount) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-gray-400 text-sm">Monthly Rate</span>
                      <span className="text-cyan-400 font-bold">Rs.{room.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Calendar / Tenant Table */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 relative z-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-xl border border-cyan-500/20 shadow-inner">
                <CreditCard size={20} className="text-cyan-400" />
              </div>
              Tenant Payment Ledger
            </h2>
            <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
              Sorted by Due Date
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {allTenants
              .slice()
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map(tenant => {
                const daysOverdue = getDaysOverdue(tenant.dueDate);
                const isOverdue10 = isOverdue10Plus(tenant.dueDate);
                const room = place.rooms?.find(r => r.id === tenant.roomId);
                const dueDateObj = new Date(tenant.dueDate);
                const formattedDate = dueDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                // Dynamic Status Borders & Backgrounds
                let statusClasses = "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] border-l-4 border-l-gray-500";
                if (tenant.paymentStatus === 'paid') {
                  statusClasses = "bg-emerald-900/10 border-emerald-500/10 hover:bg-emerald-900/20 border-l-4 border-l-emerald-500";
                } else if (isOverdue10) {
                  statusClasses = "bg-rose-900/10 border-rose-500/10 hover:bg-rose-900/20 border-l-4 border-l-rose-500";
                } else if (daysOverdue > 0) {
                  statusClasses = "bg-amber-900/10 border-amber-500/10 hover:bg-amber-900/20 border-l-4 border-l-amber-500";
                }

                return (
                  <div
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant)}
                    className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between cursor-pointer transition-all group ${statusClasses}`}
                  >
                    {/* Column 1: Tenant Info */}
                    <div className="flex-1 min-w-[200px] mb-3 md:mb-0">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-white font-bold tracking-wide">{tenant.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {tenant.trustScore === 'high' && <span title="Excellent Trust Score" className="text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 w-fit"><CheckCircle size={8} />Reliable</span>}
                            {tenant.trustScore === 'medium' && <span title="Moderate Risk" className="text-[9px] uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1 w-fit"><AlertCircle size={8} />Watch</span>}
                            {tenant.trustScore === 'low' && <span title="High Risk" className="text-[9px] uppercase tracking-wider text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 flex items-center gap-1 w-fit"><ShieldAlert size={8} />High Risk</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Room & Contact */}
                    <div className="flex-1 min-w-[150px] mb-3 md:mb-0">
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-1"><Home size={12} /> Room {room?.roomNumber}</p>
                      {tenant.phone && <p className="text-xs text-gray-500 flex items-center gap-1.5"><Navigation size={12} /> {tenant.phone}</p>}
                    </div>

                    {/* Column 3: Financials */}
                    <div className="flex-1 text-left md:text-right mb-3 md:mb-0">
                      <p className="text-sm font-black text-white">Rs.{tenant.monthlyRent.toLocaleString()}</p>
                      {tenant.outstandingBalance !== undefined && tenant.outstandingBalance < tenant.monthlyRent && tenant.outstandingBalance > 0 ? (
                        <p className="text-[11px] font-bold text-amber-400 mt-0.5 bg-amber-500/10 inline-block px-1.5 rounded border border-amber-500/20">Owes Balance: Rs.{tenant.outstandingBalance.toLocaleString()}</p>
                      ) : (
                        <p className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider">Monthly Rent</p>
                      )}
                    </div>

                    {/* Column 4: Status & Actions */}
                    <div className="flex-1 flex items-center justify-between md:justify-end gap-4 border-t border-white/5 pt-3 md:pt-0 md:border-t-0 mt-3 md:mt-0">
                      <div className="text-right">
                        <p className={`text-xs font-bold uppercase tracking-wider ${tenant.paymentStatus === 'paid' ? 'text-emerald-400' : daysOverdue > 0 ? 'text-rose-400' : 'text-cyan-400'}`}>
                          {tenant.paymentStatus === 'paid' ? 'Paid' : 'Due ' + formattedDate}
                        </p>
                        {daysOverdue > 0 && (
                          <p className="text-[10px] text-rose-400 mt-0.5 flex items-center justify-end gap-1"><Clock size={10} /> {daysOverdue} days late</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isOverdue10 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmRemoveTenant(tenant); }}
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/80 rounded-lg transition-all border border-rose-500/20 hover:shadow-lg hover:shadow-rose-500/25 group-hover:opacity-100 opacity-70"
                            title="Remove tenant (10+ days overdue)"
                          >
                            <Trash2 size={16} className="text-rose-400 group-hover:text-white" />
                          </button>
                        )}
                        {daysOverdue > 0 && daysOverdue < 10 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSendReminder(tenant); }}
                            disabled={remindedTenants.has(tenant.id)}
                            className={`p-2 rounded-lg transition-all border group-hover:opacity-100 opacity-70 ${remindedTenants.has(tenant.id)
                                ? 'bg-gray-500/10 border-gray-500/20 cursor-not-allowed'
                                : 'bg-amber-500/10 hover:bg-amber-500/80 border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/25'
                              }`}
                            title={remindedTenants.has(tenant.id) ? 'Reminder already sent' : 'Send Reminder'}
                          >
                            <AlertCircle size={16} className={remindedTenants.has(tenant.id) ? 'text-gray-500' : 'text-amber-400 group-hover:text-white'} />
                          </button>
                        )}
                        <ChevronRight size={18} className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>

                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Tenant Details Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#131d3a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-bold text-white">Tenant Payment History</h3>
              <button onClick={() => setSelectedTenant(null)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-xl">
                  {selectedTenant.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{selectedTenant.name}</h4>
                  <p className="text-xs text-gray-400">Room {place.rooms?.find(r => r.id === selectedTenant.roomId)?.roomNumber} • Rent: Rs.{selectedTenant.monthlyRent.toLocaleString()}</p>
                </div>
              </div>

              <h5 className="text-sm font-semibold text-cyan-300 mb-4">Past Payments</h5>
              <div className="space-y-3">
                {/* Mock historical data based on check-in date */}
                {[...Array(3)].map((_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - (i + 1));
                  const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

                  const payDate = new Date(date);
                  payDate.setDate(15);
                  const paidDateStr = payDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

                  return (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-xl border border-emerald-500/20">
                          <CheckCircle size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{monthName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Paid on {paidDateStr}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-emerald-400">Rs.{selectedTenant.monthlyRent.toLocaleString()}</span>
                        <button
                          onClick={() => downloadReceipt(selectedTenant, monthName, paidDateStr)}
                          className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500 border border-cyan-500/30 hover:border-cyan-500 rounded-lg text-xs text-cyan-300 hover:text-white transition-all font-semibold shadow-sm hover:shadow-cyan-500/25"
                        >
                          <Download size={14} />
                          Receipt
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Remove Tenant Confirmation Modal */}
      {confirmRemoveTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 ring-1 ring-rose-500/20 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Remove Tenant?</h3>
              <p className="text-sm text-gray-400 mb-1">
                You are about to remove <span className="text-white font-semibold">{confirmRemoveTenant.name}</span> from the property.
              </p>
              <p className="text-xs text-rose-400/80 bg-rose-500/5 border border-rose-500/10 rounded-lg p-2 mt-3">
                ⚠ This tenant is <strong>{getDaysOverdue(confirmRemoveTenant.dueDate)} days overdue</strong> on their payment. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setConfirmRemoveTenant(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-gray-300 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveTenant(confirmRemoveTenant.id)}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold transition-all shadow-lg shadow-rose-500/30"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

