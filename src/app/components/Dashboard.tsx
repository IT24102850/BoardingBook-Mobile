import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiChat } from 'react-icons/bi';
import {
  Home, Users, CreditCard, MessageSquare, Calendar, FileText,
  LogOut, Settings, Bell, Download, Phone, Mail, Edit3
} from 'lucide-react';

interface Booking {
  id: string;
  boardingName: string;
  location: string;
  checkInDate: string;
  rent: number;
  deposit: number;
  status: 'active' | 'pending' | 'completed';
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  groupName?: string;
  members?: number;
}

const mockBookings: Booking[] = [
  {
    id: 'BK001',
    boardingName: 'Modern Boarding House near SLIIT',
    location: 'Malabe, Colombo',
    checkInDate: '2026-03-15',
    rent: 18000,
    deposit: 36000,
    status: 'active',
    ownerName: 'Mr. Janaka Perera',
    ownerPhone: '+94 77 123 4567',
    ownerEmail: 'janaka@boarding.com',
    groupName: 'SLIIT Friends',
    members: 3
  }
];

const mockPayments = [
  { id: 'P001', date: '2026-02-01', amount: 18000, type: 'Deposit', status: 'Completed' },
  { id: 'P002', date: '2026-03-01', amount: 18000, type: 'March Rent', status: 'Completed' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, payments, messages, settings
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(mockBookings[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#0a1124] to-[#131d3a] border-b border-white/10 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">My Dashboard</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <Bell size={20} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/20 rounded-lg p-3">
                <Home className="text-cyan-400" size={24} />
              </div>
              <div>
                <div className="text-gray-400 text-sm">Active Bookings</div>
                <div className="text-white font-bold text-2xl">{mockBookings.length}</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 rounded-lg p-3">
                <CreditCard className="text-green-400" size={24} />
              </div>
              <div>
                <div className="text-gray-400 text-sm">Total Payments</div>
                <div className="text-white font-bold text-2xl">Rs. {(mockBookings[0]?.deposit || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 rounded-lg p-3">
                <Users className="text-purple-400" size={24} />
              </div>
              <div>
                <div className="text-gray-400 text-sm">Roommates</div>
                <div className="text-white font-bold text-2xl">{mockBookings[0]?.members || 0}</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/20 rounded-lg p-3">
                <Calendar className="text-yellow-400" size={24} />
              </div>
              <div>
                <div className="text-gray-400 text-sm">Check-in</div>
                <div className="text-white font-bold text-sm">{mockBookings[0]?.checkInDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-6 border-b border-white/10">
          {[
            { id: 'bookings', label: 'Bookings', icon: Home },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 transition ${
                activeTab === id
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Booking List */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-white font-bold text-lg mb-4">My Bookings</h2>
                  {mockBookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className={`bg-white/5 rounded-lg p-4 border-2 cursor-pointer transition ${
                        selectedBooking?.id === booking.id
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-bold text-lg">{booking.boardingName}</h3>
                          <p className="text-gray-400 text-sm">{booking.location}</p>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            booking.status === 'active'
                              ? 'bg-green-500/30 text-green-300'
                              : booking.status === 'pending'
                              ? 'bg-yellow-500/30 text-yellow-300'
                              : 'bg-gray-500/30 text-gray-300'
                          }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400 text-xs">Check-in Date</span>
                          <p className="text-white font-semibold">{booking.checkInDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs">Monthly Rent</span>
                          <p className="text-cyan-400 font-bold">Rs. {booking.rent.toLocaleString()}</p>
                        </div>
                      </div>
                      {booking.groupName && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-gray-400 text-xs mb-1">Group</p>
                          <p className="text-white font-semibold flex items-center gap-2">
                            <Users size={16} />
                            {booking.groupName} ({booking.members} members)
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Booking Details */}
                {selectedBooking && (
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 h-fit sticky top-20">
                    <h3 className="text-white font-bold text-lg mb-4">Details</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-400 text-sm">Owner</span>
                        <p className="text-white font-semibold">{selectedBooking.ownerName}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Contact</span>
                        <a href={`tel:${selectedBooking.ownerPhone}`} className="text-cyan-400 hover:underline block">
                          {selectedBooking.ownerPhone}
                        </a>
                        <a href={`mailto:${selectedBooking.ownerEmail}`} className="text-cyan-400 hover:underline text-sm">
                          {selectedBooking.ownerEmail}
                        </a>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Monthly Rent</span>
                        <p className="text-white font-bold text-lg">Rs. {selectedBooking.rent.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Security Deposit</span>
                        <p className="text-white font-bold">Rs. {selectedBooking.deposit.toLocaleString()}</p>
                      </div>
                      <div className="pt-4 space-y-2">
                        <button onClick={() => navigate('/chat', { state: { ownerChat: selectedBooking, chatType: 'owner-message' } })} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
                          <MessageSquare size={18} />
                          Message Owner
                        </button>
                        <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg transition border border-white/20 flex items-center justify-center gap-2">
                          <FileText size={18} />
                          View Agreement
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <h2 className="text-white font-bold text-lg mb-4">Payment History</h2>
              <div className="space-y-3">
                {mockPayments.map((payment) => (
                  <div key={payment.id} className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{payment.type}</p>
                      <p className="text-gray-400 text-sm">{payment.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-cyan-400 font-bold">Rs. {payment.amount.toLocaleString()}</p>
                        <p className={`text-xs font-bold ${payment.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {payment.status}
                        </p>
                      </div>
                      <button className="text-cyan-400 hover:text-cyan-300">
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
              <MessageSquare className="mx-auto text-gray-500 mb-3" size={40} />
              <p className="text-gray-400 mb-2">No active conversations yet</p>
              <p className="text-gray-500 text-sm mb-6">Start a conversation with your boarding owner or roommates</p>
              <button onClick={() => navigate('/chat')} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg transition inline-flex items-center gap-2">
                <BiChat size={18} /> Open Chat
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h2 className="text-white font-bold text-lg mb-4">Account Settings</h2>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Your Name"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="your@email.com"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+94 77 123 4567"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="pt-4">
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg transition">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
