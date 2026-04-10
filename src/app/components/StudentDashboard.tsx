import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Users, CreditCard, MessageSquare, Bell, LogOut,
  FileText, Download, Phone, Mail, MapPin, Search,
  Star, Heart, X, Check, ChevronRight, Clock,
  LifeBuoy, Send, CheckCircle, Loader2, AlertCircle,
  User, Edit3, Camera, BookOpen, Calendar, TrendingUp,
  Shield, Inbox, UserCheck, RefreshCw, ArrowRight
} from 'lucide-react';

// ============================================
// CONFIG
// ============================================
const API = 'http://localhost:5001/api';
const getToken = () => localStorage.getItem('bb_access_token') || '';
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' });

// ============================================
// TYPES
// ============================================
type Tab = 'overview' | 'bookings' | 'agreements' | 'payments' | 'roommates' | 'notifications' | 'profile' | 'support';

interface UserProfile {
  _id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  studentId?: string;
  nic?: string;
  birthday?: string;
  academicYear?: string;
  bio?: string;
  profilePicture?: string;
  isVerified?: boolean;
  createdAt?: string;
}

interface BookingRequest {
  _id: string;
  roomId?: { name?: string; price?: number; location?: string; _id?: string };
  houseId?: { name?: string; address?: string };
  status: 'pending' | 'approved' | 'rejected';
  moveInDate?: string;
  duration?: number;
  bookingType?: string;
  createdAt: string;
}

interface Agreement {
  _id: string;
  roomId?: { name?: string; price?: number };
  houseId?: { name?: string; address?: string };
  ownerId?: { fullName?: string; email?: string; phoneNumber?: string };
  status: 'pending' | 'accepted' | 'rejected' | 'active';
  startDate?: string;
  endDate?: string;
  monthlyRent?: number;
  deposit?: number;
  terms?: string;
  createdAt: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
}

interface Ticket {
  _id: string;
  subject: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  adminReply?: string;
  createdAt: string;
}

interface RoommateProfile {
  _id: string;
  userId: { _id: string; fullName?: string; email?: string; profilePicture?: string };
  academicYear?: string;
  budget?: number;
  preferences?: string[];
  bio?: string;
  gender?: string;
}

interface ConnectionRequest {
  _id: string;
  fromUserId?: { _id: string; fullName?: string; email?: string; profilePicture?: string };
  toUserId?: { _id: string; fullName?: string; email?: string; profilePicture?: string };
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// ============================================
// SMALL COMPONENTS
// ============================================

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}> = ({ icon, label, value, color, bg }) => (
  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
    <div className="flex items-center gap-3">
      <div className={`${bg} rounded-xl p-3 flex-shrink-0`}>
        <div className={color}>{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-gray-400 text-xs truncate">{label}</p>
        <p className="text-white font-bold text-lg leading-tight">{value}</p>
      </div>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    resolved: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    open: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; sub?: string; action?: React.ReactNode }> = ({ icon, title, sub, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="bg-white/5 rounded-2xl p-6 mb-4 text-gray-500">{icon}</div>
    <p className="text-white font-semibold text-lg mb-1">{title}</p>
    {sub && <p className="text-gray-400 text-sm mb-4 max-w-xs">{sub}</p>}
    {action}
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Bookings
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  // Agreements
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [agreeLoading, setAgreeLoading] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Support tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('general');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Roommates
  const [roommateProfiles, setRoommateProfiles] = useState<RoommateProfile[]>([]);
  const [mutualMatches, setMutualMatches] = useState<RoommateProfile[]>([]);
  const [inboxRequests, setInboxRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [rmTab, setRmTab] = useState<'browse' | 'matches' | 'inbox' | 'sent'>('browse');
  const [rmLoading, setRmLoading] = useState(false);

  // Profile editing
  const [profileEdit, setProfileEdit] = useState<Partial<UserProfile>>({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Review
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchUser = useCallback(async () => {
    setLoadingUser(true);
    try {
      const res = await fetch(`${API}/auth/me`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setProfileEdit(data.user);
      }
    } catch { /* ignore */ }
    setLoadingUser(false);
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${API}/roommates/booking-requests`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setBookings(data.data || []);
    } catch { /* ignore */ }
  }, []);

  const fetchAgreements = useCallback(async () => {
    setAgreeLoading(true);
    try {
      const res = await fetch(`${API}/roommates/agreements`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setAgreements(data.data || []);
    } catch { /* ignore */ }
    setAgreeLoading(false);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API}/notifications`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        const notifs: Notification[] = data.data || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.isRead).length);
      }
    } catch { /* ignore */ }
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`${API}/tickets/my`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setTickets(data.data || []);
    } catch { /* ignore */ }
  }, []);

  const fetchRoommates = useCallback(async () => {
    setRmLoading(true);
    try {
      const [browseRes, matchRes, inboxRes, sentRes] = await Promise.all([
        fetch(`${API}/roommates/browse`, { headers: authHeaders() }),
        fetch(`${API}/roommates/mutual`, { headers: authHeaders() }),
        fetch(`${API}/roommates/request/inbox`, { headers: authHeaders() }),
        fetch(`${API}/roommates/request/sent`, { headers: authHeaders() }),
      ]);
      const [browse, match, inbox, sent] = await Promise.all([
        browseRes.json(), matchRes.json(), inboxRes.json(), sentRes.json(),
      ]);
      if (browse.success) setRoommateProfiles(browse.data || []);
      if (match.success) setMutualMatches(match.data || []);
      if (inbox.success) setInboxRequests(inbox.data || []);
      if (sent.success) setSentRequests(sent.data || []);
    } catch { /* ignore */ }
    setRmLoading(false);
  }, []);

  useEffect(() => { fetchUser(); fetchBookings(); fetchNotifications(); }, [fetchUser, fetchBookings, fetchNotifications]);

  useEffect(() => {
    if (activeTab === 'agreements') fetchAgreements();
    if (activeTab === 'notifications') fetchNotifications();
    if (activeTab === 'support') fetchTickets();
    if (activeTab === 'roommates') fetchRoommates();
  }, [activeTab, fetchAgreements, fetchNotifications, fetchTickets, fetchRoommates]);

  // ============================================
  // ACTIONS
  // ============================================

  const handleLogout = () => {
    localStorage.removeItem('bb_access_token');
    localStorage.removeItem('bb_current_user');
    navigate('/signin');
  };

  const handleRespondAgreement = async (id: string, action: 'accept' | 'reject') => {
    try {
      await fetch(`${API}/roommates/agreements/${id}/respond`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ action }),
      });
      fetchAgreements();
    } catch { /* ignore */ }
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      await fetch(`${API}/notifications/${id}/read`, { method: 'PATCH', headers: authHeaders() });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API}/notifications/read-all`, { method: 'PATCH', headers: authHeaders() });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketError(''); setTicketSuccess(false);
    if (!ticketSubject || !ticketDescription) { setTicketError('Subject and description are required.'); return; }
    setTicketLoading(true);
    try {
      const res = await fetch(`${API}/tickets`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ subject: ticketSubject, description: ticketDescription, category: ticketCategory }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketSuccess(true);
        setTicketSubject(''); setTicketDescription(''); setTicketCategory('general');
        fetchTickets();
      } else setTicketError(data.message || 'Failed to submit.');
    } catch { setTicketError('Network error.'); }
    setTicketLoading(false);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(''); setProfileSuccess(false); setProfileSaving(true);
    try {
      const res = await fetch(`${API}/auth/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(profileEdit),
      });
      const data = await res.json();
      if (data.success) { setProfileSuccess(true); fetchUser(); }
      else setProfileError(data.message || 'Failed to save.');
    } catch { setProfileError('Network error.'); }
    setProfileSaving(false);
  };

  const handleSwipe = async (userId: string, action: 'like' | 'pass') => {
    try {
      await fetch(`${API}/roommates/swipe`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ targetUserId: userId, action }),
      });
      setRoommateProfiles(prev => prev.filter(p => p.userId._id !== userId));
    } catch { /* ignore */ }
  };

  const handleRespondRequest = async (id: string, action: 'accept' | 'reject') => {
    try {
      await fetch(`${API}/roommates/request/${id}/${action}`, { method: 'PATCH', headers: authHeaders() });
      fetchRoommates();
    } catch { /* ignore */ }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      const res = await fetch(`${API}/reviews`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      const data = await res.json();
      if (data.success) { setReviewSuccess(true); setReviewComment(''); }
    } catch { /* ignore */ }
    setReviewLoading(false);
  };

  // ============================================
  // TABS CONFIG
  // ============================================

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview',       label: 'Overview',       icon: <Home size={18} /> },
    { id: 'bookings',       label: 'Bookings',        icon: <BookOpen size={18} />, badge: bookings.filter(b => b.status === 'pending').length || undefined },
    { id: 'agreements',     label: 'Agreements',      icon: <FileText size={18} />, badge: agreements.filter(a => a.status === 'pending').length || undefined },
    { id: 'payments',       label: 'Payments',        icon: <CreditCard size={18} /> },
    { id: 'roommates',      label: 'Roommates',       icon: <Users size={18} />, badge: inboxRequests.filter(r => r.status === 'pending').length || undefined },
    { id: 'notifications',  label: 'Notifications',   icon: <Bell size={18} />, badge: unreadCount || undefined },
    { id: 'profile',        label: 'Profile',         icon: <User size={18} /> },
    { id: 'support',        label: 'Support',         icon: <LifeBuoy size={18} /> },
  ];

  const displayName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Student';
  const initials = displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  // ============================================
  // RENDER
  // ============================================

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-[#0a1124]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo + name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">BB</span>
            </div>
            <span className="text-white font-semibold hidden sm:block">BoardingBook</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={displayName} className="w-8 h-8 rounded-full object-cover border border-white/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
              )}
              <span className="text-white text-sm font-medium hidden md:block">{displayName}</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ── TAB NAV ── */}
      <div className="sticky top-16 z-40 bg-[#0a1124]/80 backdrop-blur-xl border-b border-white/10 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 py-1">
          {tabs.map(({ id, label, icon, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                activeTab === id
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {icon}
              <span className="hidden sm:block">{label}</span>
              {badge ? (
                <span className="bg-cyan-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ===== OVERVIEW ===== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6">
              <div className="relative z-10">
                <p className="text-gray-400 text-sm mb-1">Welcome back</p>
                <h1 className="text-white font-bold text-2xl mb-2">{displayName}</h1>
                <p className="text-gray-400 text-sm">
                  {user?.academicYear ? `Year ${user.academicYear} student` : 'Student'} · {user?.email}
                </p>
              </div>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
                <BookOpen size={100} className="text-cyan-400" />
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<BookOpen size={20} />} label="Active Bookings" value={bookings.filter(b => b.status === 'approved').length} color="text-cyan-400" bg="bg-cyan-500/20" />
              <StatCard icon={<FileText size={20} />} label="Agreements" value={agreements.length} color="text-purple-400" bg="bg-purple-500/20" />
              <StatCard icon={<Bell size={20} />} label="Unread Alerts" value={unreadCount} color="text-yellow-400" bg="bg-yellow-500/20" />
              <StatCard icon={<Users size={20} />} label="Mutual Matches" value={mutualMatches.length} color="text-green-400" bg="bg-green-500/20" />
            </div>

            {/* Quick actions */}
            <div>
              <h2 className="text-white font-bold text-lg mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Find a Room', icon: <Search size={20} />, color: 'from-cyan-500 to-blue-600', action: () => navigate('/find') },
                  { label: 'Find Roommates', icon: <Users size={20} />, color: 'from-purple-500 to-pink-500', action: () => setActiveTab('roommates') },
                  { label: 'Open Chat', icon: <MessageSquare size={20} />, color: 'from-green-500 to-teal-600', action: () => navigate('/chat') },
                  { label: 'Get Support', icon: <LifeBuoy size={20} />, color: 'from-orange-500 to-red-500', action: () => setActiveTab('support') },
                ].map(({ label, icon, color, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className={`bg-gradient-to-br ${color} p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-white font-semibold text-sm hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent notifications */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Recent Notifications</h3>
                  <button onClick={() => setActiveTab('notifications')} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
                    View all <ChevronRight size={14} />
                  </button>
                </div>
                {notifications.slice(0, 4).length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">No notifications yet</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 4).map(n => (
                      <div key={n._id} className={`flex items-start gap-3 p-3 rounded-lg transition ${n.isRead ? 'bg-white/3' : 'bg-cyan-500/10 border border-cyan-500/20'}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? 'bg-gray-600' : 'bg-cyan-400'}`} />
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">{n.title}</p>
                          <p className="text-gray-400 text-xs truncate">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent bookings */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Recent Bookings</h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
                    View all <ChevronRight size={14} />
                  </button>
                </div>
                {bookings.slice(0, 3).length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm mb-3">No bookings yet</p>
                    <button onClick={() => navigate('/find')} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 mx-auto">
                      Find a room <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 3).map(b => (
                      <div key={b._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">{b.roomId?.name || 'Room'}</p>
                          <p className="text-gray-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</p>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Leave a review */}
            <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-1">Share Your Experience</h3>
              <p className="text-gray-400 text-sm mb-5">Help other students by leaving a review</p>
              {reviewSuccess ? (
                <div className="flex items-center gap-3 text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <CheckCircle size={20} /> <span className="font-semibold">Review submitted! Thank you.</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button type="button" key={star} onClick={() => setReviewRating(star)}>
                        <Star size={28} className={`transition ${star <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      </button>
                    ))}
                    <span className="text-gray-400 text-sm ml-2">{reviewRating}/5</span>
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Share your experience with the platform…"
                    rows={3}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 resize-none text-sm"
                  />
                  <button
                    type="submit"
                    disabled={reviewLoading || !reviewComment}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 text-white font-semibold py-2.5 px-6 rounded-xl transition"
                  >
                    {reviewLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ===== BOOKINGS ===== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-xl">My Bookings</h2>
                <p className="text-gray-400 text-sm mt-0.5">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>
              </div>
              <button onClick={() => navigate('/find')} className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-xl transition">
                <Search size={16} /> Find Room
              </button>
            </div>

            {bookings.length === 0 ? (
              <EmptyState
                icon={<BookOpen size={40} />}
                title="No bookings yet"
                sub="Find a boarding room and submit your first booking request"
                action={<button onClick={() => navigate('/find')} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-xl text-sm">Browse Rooms</button>}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-2 space-y-3">
                  {bookings.map(b => (
                    <div
                      key={b._id}
                      onClick={() => setSelectedBooking(selectedBooking?._id === b._id ? null : b)}
                      className={`bg-white/5 rounded-xl p-5 border-2 cursor-pointer transition-all ${
                        selectedBooking?._id === b._id
                          ? 'border-cyan-400/60 bg-cyan-500/5'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <h3 className="text-white font-semibold truncate">{b.roomId?.name || 'Room'}</h3>
                          <p className="text-gray-400 text-sm">{b.houseId?.name || b.houseId?.address || '—'}</p>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Move-in</p>
                          <p className="text-white text-sm">{b.moveInDate ? new Date(b.moveInDate).toLocaleDateString() : '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Duration</p>
                          <p className="text-white text-sm">{b.duration ? `${b.duration} mo` : '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Rent/mo</p>
                          <p className="text-cyan-400 font-semibold text-sm">{b.roomId?.price ? `Rs. ${b.roomId.price.toLocaleString()}` : '—'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detail panel */}
                {selectedBooking && (
                  <div className="bg-white/5 rounded-xl border border-white/10 p-5 h-fit sticky top-32">
                    <h3 className="text-white font-bold mb-4">Booking Details</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-0.5">Room</p>
                        <p className="text-white font-medium">{selectedBooking.roomId?.name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Property</p>
                        <p className="text-white font-medium">{selectedBooking.houseId?.name || selectedBooking.houseId?.address || '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Monthly Rent</p>
                        <p className="text-cyan-400 font-bold text-lg">{selectedBooking.roomId?.price ? `Rs. ${selectedBooking.roomId.price.toLocaleString()}` : '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Status</p>
                        <StatusBadge status={selectedBooking.status} />
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Submitted</p>
                        <p className="text-white">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="pt-2 space-y-2">
                        <button onClick={() => navigate('/chat')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                          <MessageSquare size={16} /> Message Owner
                        </button>
                        <button onClick={() => setActiveTab('agreements')} className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 border border-white/15">
                          <FileText size={16} /> View Agreements
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== AGREEMENTS ===== */}
        {activeTab === 'agreements' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-xl">Agreements</h2>
              <p className="text-gray-400 text-sm mt-0.5">Review and respond to rental agreements</p>
            </div>

            {agreeLoading ? (
              <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-cyan-400" /></div>
            ) : agreements.length === 0 ? (
              <EmptyState icon={<FileText size={40} />} title="No agreements yet" sub="Agreements will appear here once your booking is approved" />
            ) : (
              <div className="space-y-4">
                {agreements.map(a => (
                  <div key={a._id} className="bg-white/5 rounded-xl border border-white/10 p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-white font-semibold">{a.roomId?.name || 'Room'}</h3>
                        <p className="text-gray-400 text-sm">{a.houseId?.name || a.houseId?.address || ''}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-xs mb-0.5">Monthly Rent</p>
                        <p className="text-cyan-400 font-bold">{a.monthlyRent ? `Rs. ${a.monthlyRent.toLocaleString()}` : '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-0.5">Deposit</p>
                        <p className="text-white font-medium">{a.deposit ? `Rs. ${a.deposit.toLocaleString()}` : '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-0.5">Start Date</p>
                        <p className="text-white text-sm">{a.startDate ? new Date(a.startDate).toLocaleDateString() : '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-0.5">End Date</p>
                        <p className="text-white text-sm">{a.endDate ? new Date(a.endDate).toLocaleDateString() : '—'}</p>
                      </div>
                    </div>
                    {a.ownerId && (
                      <div className="flex flex-wrap gap-4 text-sm mb-4 text-gray-400">
                        <span className="flex items-center gap-1"><User size={14} /> {a.ownerId.fullName || '—'}</span>
                        {a.ownerId.email && <span className="flex items-center gap-1"><Mail size={14} /> {a.ownerId.email}</span>}
                        {a.ownerId.phoneNumber && <span className="flex items-center gap-1"><Phone size={14} /> {a.ownerId.phoneNumber}</span>}
                      </div>
                    )}
                    {a.terms && (
                      <div className="bg-white/5 rounded-lg p-3 mb-4 text-gray-300 text-sm leading-relaxed max-h-24 overflow-y-auto border border-white/10">
                        {a.terms}
                      </div>
                    )}
                    {a.status === 'pending' && (
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleRespondAgreement(a._id, 'accept')}
                          className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-semibold py-2 px-5 rounded-xl transition text-sm"
                        >
                          <Check size={16} /> Accept
                        </button>
                        <button
                          onClick={() => handleRespondAgreement(a._id, 'reject')}
                          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-semibold py-2 px-5 rounded-xl transition text-sm"
                        >
                          <X size={16} /> Reject
                        </button>
                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold py-2 px-5 rounded-xl transition text-sm ml-auto border border-white/15">
                          <Download size={16} /> Download
                        </button>
                      </div>
                    )}
                    {a.status !== 'pending' && (
                      <div className="flex gap-3 pt-2">
                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold py-2 px-5 rounded-xl transition text-sm border border-white/15">
                          <Download size={16} /> Download PDF
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== PAYMENTS ===== */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-xl">Payments</h2>
              <p className="text-gray-400 text-sm mt-0.5">Track your rental payments and history</p>
            </div>
            <EmptyState
              icon={<CreditCard size={40} />}
              title="No payment records"
              sub="Your payment history will appear here once you have an active lease"
            />
          </div>
        )}

        {/* ===== ROOMMATES ===== */}
        {activeTab === 'roommates' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-xl">Find Roommates</h2>
              <p className="text-gray-400 text-sm mt-0.5">Browse, match, and connect with other students</p>
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'browse' as const, label: 'Browse', icon: <Search size={15} /> },
                { id: 'matches' as const, label: `Matches (${mutualMatches.length})`, icon: <Heart size={15} /> },
                { id: 'inbox' as const, label: `Inbox (${inboxRequests.filter(r => r.status === 'pending').length})`, icon: <Inbox size={15} /> },
                { id: 'sent' as const, label: 'Sent', icon: <Send size={15} /> },
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setRmTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    rmTab === id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
              <button onClick={fetchRoommates} className="ml-auto p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition">
                <RefreshCw size={16} className={rmLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {rmLoading ? (
              <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-cyan-400" /></div>
            ) : (
              <>
                {/* BROWSE */}
                {rmTab === 'browse' && (
                  roommateProfiles.length === 0 ? (
                    <EmptyState icon={<Users size={40} />} title="No profiles to browse" sub="Check back soon for new roommate profiles" />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roommateProfiles.map(p => (
                        <div key={p._id} className="bg-white/5 rounded-xl border border-white/10 p-5 flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                            {p.userId.profilePicture ? (
                              <img src={p.userId.profilePicture} alt="" className="w-12 h-12 rounded-full object-cover border border-white/20" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold">{(p.userId.fullName || '?')[0].toUpperCase()}</span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-white font-semibold truncate">{p.userId.fullName || 'Student'}</p>
                              <p className="text-gray-400 text-xs">{p.academicYear ? `Year ${p.academicYear}` : 'Student'}</p>
                            </div>
                          </div>
                          {p.bio && <p className="text-gray-400 text-sm line-clamp-2">{p.bio}</p>}
                          <div className="flex flex-wrap gap-2">
                            {p.budget && <span className="bg-cyan-500/10 text-cyan-400 text-xs px-2 py-1 rounded-lg">Rs. {p.budget.toLocaleString()}/mo</span>}
                            {(p.preferences || []).slice(0, 2).map(pref => (
                              <span key={pref} className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-lg">{pref}</span>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-auto">
                            <button
                              onClick={() => handleSwipe(p.userId._id, 'like')}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 py-2 rounded-xl transition text-sm font-medium"
                            >
                              <Heart size={15} /> Like
                            </button>
                            <button
                              onClick={() => handleSwipe(p.userId._id, 'pass')}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-gray-400 border border-white/15 py-2 rounded-xl transition text-sm"
                            >
                              <X size={15} /> Pass
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* MATCHES */}
                {rmTab === 'matches' && (
                  mutualMatches.length === 0 ? (
                    <EmptyState icon={<Heart size={40} />} title="No mutual matches yet" sub="Like profiles to get mutual matches and start chatting" />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mutualMatches.map(m => (
                        <div key={m._id} className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-5 flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                            {m.userId.profilePicture ? (
                              <img src={m.userId.profilePicture} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-pink-500/40" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold">{(m.userId.fullName || '?')[0].toUpperCase()}</span>
                              </div>
                            )}
                            <div>
                              <p className="text-white font-semibold">{m.userId.fullName || 'Student'}</p>
                              <p className="text-pink-400 text-xs font-medium flex items-center gap-1"><Heart size={11} fill="currentColor" /> Mutual Match</p>
                            </div>
                          </div>
                          <button onClick={() => navigate('/chat')} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-sm">
                            <MessageSquare size={15} /> Start Chat
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* INBOX */}
                {rmTab === 'inbox' && (
                  inboxRequests.length === 0 ? (
                    <EmptyState icon={<Inbox size={40} />} title="No connection requests" sub="When others send you a request, it will appear here" />
                  ) : (
                    <div className="space-y-3">
                      {inboxRequests.map(r => (
                        <div key={r._id} className="bg-white/5 rounded-xl border border-white/10 p-5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-bold">{(r.fromUserId?.fullName || '?')[0].toUpperCase()}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-medium truncate">{r.fromUserId?.fullName || 'Student'}</p>
                              {r.message && <p className="text-gray-400 text-sm truncate">{r.message}</p>}
                              <p className="text-gray-600 text-xs">{new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {r.status === 'pending' ? (
                            <div className="flex gap-2 flex-shrink-0">
                              <button onClick={() => handleRespondRequest(r._id, 'accept')} className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 p-2 rounded-lg transition">
                                <Check size={16} />
                              </button>
                              <button onClick={() => handleRespondRequest(r._id, 'reject')} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 p-2 rounded-lg transition">
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <StatusBadge status={r.status} />
                          )}
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* SENT */}
                {rmTab === 'sent' && (
                  sentRequests.length === 0 ? (
                    <EmptyState icon={<Send size={40} />} title="No sent requests" sub="Connect with students you like from the Browse tab" />
                  ) : (
                    <div className="space-y-3">
                      {sentRequests.map(r => (
                        <div key={r._id} className="bg-white/5 rounded-xl border border-white/10 p-5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-bold">{(r.toUserId?.fullName || '?')[0].toUpperCase()}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-medium truncate">{r.toUserId?.fullName || 'Student'}</p>
                              <p className="text-gray-600 text-xs">{new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <StatusBadge status={r.status} />
                        </div>
                      ))}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        )}

        {/* ===== NOTIFICATIONS ===== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-xl">Notifications</h2>
                <p className="text-gray-400 text-sm mt-0.5">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl transition">
                  <CheckCircle size={15} /> Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <EmptyState icon={<Bell size={40} />} title="No notifications" sub="You're all caught up!" />
            ) : (
              <div className="space-y-2">
                {notifications.map(n => (
                  <div
                    key={n._id}
                    onClick={() => !n.isRead && handleMarkNotifRead(n._id)}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition cursor-pointer ${
                      n.isRead
                        ? 'bg-white/3 border-white/8 hover:bg-white/5'
                        : 'bg-cyan-500/8 border-cyan-500/20 hover:bg-cyan-500/12'
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? 'bg-gray-600' : 'bg-cyan-400'}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium text-sm ${n.isRead ? 'text-gray-300' : 'text-white'}`}>{n.title}</p>
                      <p className="text-gray-400 text-sm mt-0.5">{n.message}</p>
                      <p className="text-gray-600 text-xs mt-1 flex items-center gap-1">
                        <Clock size={11} /> {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!n.isRead && (
                      <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full border border-cyan-500/30 flex-shrink-0">New</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== PROFILE ===== */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-white font-bold text-xl">My Profile</h2>
              <p className="text-gray-400 text-sm mt-0.5">Update your personal information</p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={displayName} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{initials}</span>
                  </div>
                )}
                <button className="absolute -bottom-2 -right-2 bg-[#131d3a] border border-white/20 p-1.5 rounded-lg text-gray-400 hover:text-white transition">
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <p className="text-white font-bold text-lg">{displayName}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {user?.isVerified ? (
                    <span className="flex items-center gap-1 text-green-400 text-xs"><Shield size={12} /> Verified</span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-400 text-xs"><AlertCircle size={12} /> Unverified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Edit form */}
            <form onSubmit={handleProfileSave} className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', key: 'firstName', type: 'text' },
                  { label: 'Last Name', key: 'lastName', type: 'text' },
                  { label: 'Phone Number', key: 'phoneNumber', type: 'tel' },
                  { label: 'Student ID', key: 'studentId', type: 'text' },
                  { label: 'NIC Number', key: 'nic', type: 'text' },
                  { label: 'Academic Year', key: 'academicYear', type: 'text', placeholder: 'e.g. 2nd' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder || label}
                      value={(profileEdit as Record<string, string>)[key] || ''}
                      onChange={e => setProfileEdit(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 text-sm transition"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Bio</label>
                <textarea
                  placeholder="Tell others about yourself…"
                  value={profileEdit.bio || ''}
                  onChange={e => setProfileEdit(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 text-sm resize-none transition"
                />
              </div>

              {profileError && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm">
                  <AlertCircle size={16} /> {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-sm">
                  <CheckCircle size={16} /> Profile saved successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={profileSaving}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 text-white font-semibold py-2.5 px-6 rounded-xl transition"
              >
                {profileSaving ? <Loader2 size={16} className="animate-spin" /> : <Edit3 size={16} />}
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* ===== SUPPORT ===== */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-xl">Support</h2>
              <p className="text-gray-400 text-sm mt-0.5">Get help from our admin team</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* New ticket */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                  <Send size={18} className="text-cyan-400" /> New Support Ticket
                </h3>

                {ticketSuccess ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <CheckCircle size={48} className="text-green-400 mb-3" />
                    <p className="text-white font-semibold mb-1">Ticket Submitted!</p>
                    <p className="text-gray-400 text-sm mb-4">Our team will respond as soon as possible.</p>
                    <button onClick={() => setTicketSuccess(false)} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                      Submit another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-xs font-medium mb-1.5">Category</label>
                      <select
                        value={ticketCategory}
                        onChange={e => setTicketCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50 text-sm"
                      >
                        {['general', 'booking', 'payment', 'account', 'technical', 'other'].map(c => (
                          <option key={c} value={c} className="bg-[#131d3a]">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-medium mb-1.5">Subject</label>
                      <input
                        type="text"
                        placeholder="Brief summary of your issue"
                        value={ticketSubject}
                        onChange={e => setTicketSubject(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-medium mb-1.5">Description</label>
                      <textarea
                        placeholder="Describe your issue in detail…"
                        value={ticketDescription}
                        onChange={e => setTicketDescription(e.target.value)}
                        rows={5}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 text-sm resize-none"
                      />
                    </div>
                    {ticketError && (
                      <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm">
                        <AlertCircle size={16} /> {ticketError}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={ticketLoading}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
                    >
                      {ticketLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      Submit Ticket
                    </button>
                  </form>
                )}
              </div>

              {/* Ticket history */}
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-gray-400" /> Ticket History
                </h3>
                {tickets.length === 0 ? (
                  <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center">
                    <LifeBuoy size={32} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No tickets submitted yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map(t => (
                      <div key={t._id} className="bg-white/5 rounded-xl border border-white/10 p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-white font-medium text-sm">{t.subject}</p>
                          <StatusBadge status={t.status} />
                        </div>
                        <p className="text-gray-400 text-xs mb-2">{t.description.slice(0, 100)}{t.description.length > 100 ? '…' : ''}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-xs flex items-center gap-1"><Clock size={11} /> {new Date(t.createdAt).toLocaleDateString()}</span>
                          <span className="text-gray-500 text-xs bg-white/5 px-2 py-0.5 rounded-lg">{t.category}</span>
                        </div>
                        {t.adminReply && (
                          <div className="mt-3 pt-3 border-t border-white/10 bg-cyan-500/5 rounded-lg p-3">
                            <p className="text-cyan-400 text-xs font-semibold mb-1 flex items-center gap-1">
                              <UserCheck size={12} /> Admin Reply
                            </p>
                            <p className="text-gray-300 text-sm">{t.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
