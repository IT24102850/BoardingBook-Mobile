import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, CheckSquare, ShieldCheck, Star, Search,
  TrendingUp, AlertCircle, X, Check, Clock, Eye, EyeOff, Ban, RotateCcw,
  Flag, Trash2, Send, Filter, ChevronDown, LifeBuoy, MessageSquare, Loader2,
  Settings, Lock, KeyRound
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import * as api from './api';

// ─────────────────────────────────────────────
//  ADMIN LOGIN
// ─────────────────────────────────────────────
export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@boardingbook.com');
  const [password, setPassword] = useState('Admin@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.loginAdmin(email, password);
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminName', res.data.admin.name);
      localStorage.setItem('adminEmail', res.data.admin.email);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f1629', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes float-slow  { 0%,100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-30px) scale(1.04); } }
        @keyframes float-med   { 0%,100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-18px) scale(1.06); } }
        @keyframes drift       { 0%,100% { transform: translate(0,0); } 33% { transform: translate(18px,-12px); } 66% { transform: translate(-10px,14px); } }
        @keyframes spin-slow   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-up-in  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer     { 0%,100% { opacity:.5; } 50% { opacity:1; } }
        @keyframes pulse-glow  { 0%,100% { box-shadow: 0 0 0 0 rgba(129,140,248,0.4); } 50% { box-shadow: 0 0 0 10px rgba(129,140,248,0); } }

        .al-orb1 { animation: float-slow 9s ease-in-out infinite; }
        .al-orb2 { animation: float-med  7s ease-in-out infinite 1s; }
        .al-orb3 { animation: drift      11s ease-in-out infinite 2s; }
        .al-ring { animation: spin-slow  18s linear infinite; }
        .al-form { animation: fade-up-in 0.55s cubic-bezier(.22,.68,0,1.2) both; }
        .al-badge { animation: shimmer   3s ease-in-out infinite; }

        .al-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(129,140,248,0.18);
          border-radius: 14px;
          padding: 13px 44px 13px 44px;
          font-size: 14px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .al-input::placeholder { color: rgba(148,163,184,0.5); }
        .al-input:focus {
          border-color: rgba(129,140,248,0.7);
          background: rgba(129,140,248,0.06);
          box-shadow: 0 0 0 4px rgba(129,140,248,0.10);
        }
        .al-input.has-value { border-color: rgba(34,211,238,0.4); }
        .al-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #22d3ee 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 24px rgba(99,102,241,0.35);
          position: relative; overflow: hidden;
        }
        .al-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(99,102,241,0.45); }
        .al-btn:active:not(:disabled) { transform: translateY(0); }
        .al-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .al-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .al-feature { display: flex; align-items: center; gap: 12px; padding: 10px 0; }
        .al-feature-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      `}</style>

      {/* ── Animated background orbs ─────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="al-orb1" style={{ position: 'absolute', top: '-10%', left: '-8%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />
        <div className="al-orb2" style={{ position: 'absolute', bottom: '-12%', right: '-6%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.14) 0%, transparent 70%)' }} />
        <div className="al-orb3" style={{ position: 'absolute', top: '40%', left: '50%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)' }} />
        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(129,140,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      </div>

      {/* ── Left panel — branding ─────────────────────────────────── */}
      <div style={{ flex: 1, display: 'none', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px', position: 'relative' }} className="lg-flex">
        <style>{`.lg-flex { display: none; } @media(min-width:1024px){ .lg-flex { display:flex !important; } }`}</style>

        {/* Rotating ring decoration */}
        <div className="al-ring" style={{ position: 'absolute', top: '12%', right: '-80px', width: 320, height: 320, border: '1px solid rgba(129,140,248,0.12)', borderRadius: '50%', borderTopColor: 'rgba(129,140,248,0.4)' }} />
        <div style={{ position: 'absolute', top: '18%', right: '-44px', width: 220, height: 220, border: '1px solid rgba(34,211,238,0.08)', borderRadius: '50%', borderRightColor: 'rgba(34,211,238,0.3)' }} className="al-ring" />

        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48, textDecoration: 'none', opacity: 1, transition: 'opacity .2s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#818cf8,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(129,140,248,0.5)' }}>
            <Building2 size={22} color="#fff" />
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1 }}>BoardingBook</p>
            <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 11, marginTop: 2, fontWeight: 500 }}>Administration Suite</p>
          </div>
        </a>

        <h2 style={{ fontSize: 38, fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 16 }}>
          Manage your<br />
          <span style={{ background: 'linear-gradient(135deg,#818cf8,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>boarding platform</span>
        </h2>
        <p style={{ color: 'rgba(148,163,184,0.65)', fontSize: 15, lineHeight: 1.65, marginBottom: 48, maxWidth: 380 }}>
          Full control over users, KYC verification, support tickets, and platform reviews — all in one place.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { icon: <Users size={16} color="#818cf8" />, bg: 'rgba(129,140,248,0.12)', label: 'User & KYC Management', sub: 'Ban, verify, and monitor all accounts' },
            { icon: <ShieldCheck size={16} color="#22d3ee" />, bg: 'rgba(34,211,238,0.1)', label: 'Security Controls', sub: 'JWT-protected admin access' },
            { icon: <LifeBuoy size={16} color="#a78bfa" />, bg: 'rgba(167,139,250,0.1)', label: 'Support & Feedback', sub: 'Respond to tickets and reviews' },
          ].map(f => (
            <div key={f.label} className="al-feature">
              <div className="al-feature-icon" style={{ background: f.bg }}>{f.icon}</div>
              <div>
                <p style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, lineHeight: 1 }}>{f.label}</p>
                <p style={{ color: 'rgba(148,163,184,0.55)', fontSize: 11.5, marginTop: 3 }}>{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — login form ──────────────────────────────── */}
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', position: 'relative', zIndex: 10 }} className="login-panel">
        <style>{`@media(min-width:1024px){ .login-panel { width:480px !important; margin:0 !important; border-left:1px solid rgba(129,140,248,0.07); background:rgba(15,22,41,0.6); backdrop-filter:blur(24px); } }`}</style>

        <div className="al-form" style={{ width: '100%', maxWidth: 380 }}>

          {/* Mobile logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }} className="mobile-logo">
            <style>{`@media(min-width:1024px){ .mobile-logo { display:none; } }`}</style>
            <a href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#818cf8,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 0 28px rgba(129,140,248,0.45)', animation: 'pulse-glow 3s ease-in-out infinite' }}>
                <Building2 size={26} color="#fff" />
              </div>
              <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>BoardingBook</h1>
              <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: 13, marginTop: 4 }}>Administration Suite</p>
            </a>
          </div>

          {/* Card heading */}
          <div style={{ marginBottom: 28 }}>
            <div className="al-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 99, padding: '5px 12px', marginBottom: 16 }}>
              <Lock size={11} color="#818cf8" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#a5b4fc', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Secure Admin Access</span>
            </div>
            <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>Welcome back</h2>
            <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: 13.5, marginTop: 6 }}>Sign in to your admin portal</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(203,213,225,0.9)', marginBottom: 8, letterSpacing: '0.01em' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'color 0.2s', color: emailFocused ? '#818cf8' : 'rgba(148,163,184,0.5)' }}>
                  <Users size={15} />
                </div>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="admin@boardingbook.com"
                  className={`al-input${email ? ' has-value' : ''}`}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  style={{ paddingLeft: 44, paddingRight: 14 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(203,213,225,0.9)', marginBottom: 8, letterSpacing: '0.01em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'color 0.2s', color: passFocused ? '#818cf8' : 'rgba(148,163,184,0.5)' }}>
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className={`al-input${password ? ' has-value' : ''}`}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(148,163,184,0.5)', padding: 0, display: 'flex', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#cbd5e1')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.5)')}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px' }}>
                <AlertCircle size={14} color="#f87171" style={{ flexShrink: 0 }} />
                <span style={{ color: '#f87171', fontSize: 13 }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="al-btn" style={{ marginTop: 4 }}>
              {loading
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Signing in…</>
                : <><KeyRound size={16} />Sign in to Dashboard</>}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <ShieldCheck size={13} color="rgba(129,140,248,0.5)" />
            <span style={{ fontSize: 11.5, color: 'rgba(148,163,184,0.4)', textAlign: 'center' }}>
              Protected access · BoardingBook Admin v1.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  ADMIN DASHBOARD
// ─────────────────────────────────────────────
export const AdminDashboard = () => {
  const adminName = localStorage.getItem('adminName') ?? 'Super Admin';
  const [stats, setStats] = useState({ totalStudents: 0, totalOwners: 0, pendingKyc: 0, bannedUsers: 0 });
  const [ticketStats, setTicketStats] = useState({ open: 0, in_progress: 0, resolved: 0, closed: 0 });
  const [reviewStats, setReviewStats] = useState({ total: 0, flagged: 0, hidden: 0 });
  const [loading, setLoading] = useState(true);
  const [chartDays, setChartDays] = useState(30);
  const [chartData, setChartData] = useState<{ date: string; students: number; owners: number }[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStats(), api.getTicketStats(), api.getReviewStats()])
      .then(([s, t, r]) => {
        setStats(s.data);
        setTicketStats(t.data);
        setReviewStats(r.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setChartLoading(true);
    api.getSignupChart(chartDays)
      .then(res => setChartData(res.data))
      .catch(console.error)
      .finally(() => setChartLoading(false));
  }, [chartDays]);

  // Format x-axis dates: show "Mar 26" style, skip some labels to avoid overlap
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[var(--bb-card)] border border-[rgba(129,140,248,0.25)] rounded-xl px-4 py-3 shadow-xl text-xs">
        <p className="text-slate-400 mb-2 font-medium">{formatDate(label)}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">
            {p.name.charAt(0).toUpperCase() + p.name.slice(1)}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  const statCards = [
    { label: 'Total Students', value: String(stats.totalStudents), delta: 'registered students', icon: <Users size={18} />, color: 'bg-purple-900/30 text-purple-400' },
    { label: 'Total Owners', value: String(stats.totalOwners), delta: 'registered owners', icon: <Building2 size={18} />, color: 'bg-blue-900/30 text-blue-400' },
    { label: 'Pending KYC', value: String(stats.pendingKyc), delta: 'awaiting review', icon: <ShieldCheck size={18} />, color: 'bg-amber-900/30 text-amber-400' },
    { label: 'Open Tickets', value: String(ticketStats.open), delta: `${ticketStats.in_progress} in progress`, icon: <LifeBuoy size={18} />, color: 'bg-red-900/30 text-red-400' },
    { label: 'Total Reviews', value: String(reviewStats.total), delta: `${reviewStats.flagged} flagged`, icon: <Star size={18} />, color: 'bg-orange-900/30 text-orange-400' },
    { label: 'Banned Users', value: String(stats.bannedUsers), delta: 'currently banned', icon: <Ban size={18} />, color: 'bg-slate-700/50 text-slate-400' },
  ];

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Welcome back, {adminName}</p>
        </div>
        <span className="text-xs text-slate-400 bg-[var(--bb-card)] border border-[var(--bb-border)] px-3 py-1.5 rounded-lg font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
          <Loader2 size={18} className="animate-spin" /> Loading stats…
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 bb-stagger">
          {statCards.map((s) => (
            <div key={s.label} className="bb-hover bg-[var(--bb-card)] border border-[var(--bb-border)] rounded-2xl p-5 shadow-sm cursor-default">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
                  <p className="text-3xl font-black text-white mt-1.5">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <TrendingUp size={11} />{s.delta}
                  </p>
                </div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Signup Traffic Chart ── */}
      <div className="bb-hover bb-fade-up bg-[var(--bb-card)] border border-[var(--bb-border)] rounded-2xl p-5 shadow-sm" style={{ animationDelay: '0.10s' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-200">User Signups</h3>
            <p className="text-xs text-slate-500 mt-0.5">New registrations over time</p>
          </div>
          <div className="flex gap-1 bg-[var(--bb-elevated)] p-1 rounded-lg">
            {([7, 30, 90] as const).map(d => (
              <button
                key={d}
                onClick={() => setChartDays(d)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${chartDays === d ? 'bg-[var(--bb-card)] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {chartLoading ? (
          <div className="flex items-center justify-center h-48 text-slate-500 gap-2">
            <Loader2 size={15} className="animate-spin" /> Loading chart…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#818cf8" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradOwners" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={chartDays === 7 ? 0 : chartDays === 30 ? 4 : 13}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: '#94a3b8', paddingTop: 12 }}
                formatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
              />
              <Area type="monotone" dataKey="students" stroke="#818cf8" strokeWidth={2} fill="url(#gradStudents)" dot={false} activeDot={{ r: 4, fill: '#818cf8' }} />
              <Area type="monotone" dataKey="owners"   stroke="#22d3ee" strokeWidth={2} fill="url(#gradOwners)"   dot={false} activeDot={{ r: 4, fill: '#22d3ee' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 bb-fade-up" style={{ animationDelay: '0.18s' }}>
        <div className="bb-hover lg:col-span-3 bg-[var(--bb-card)] border border-[var(--bb-border)] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200">Ticket Overview</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Open', value: ticketStats.open, color: 'text-blue-400 bg-blue-900/30' },
              { label: 'In Progress', value: ticketStats.in_progress, color: 'text-purple-400 bg-purple-900/30' },
              { label: 'Resolved', value: ticketStats.resolved, color: 'text-green-400 bg-green-900/30' },
              { label: 'Closed', value: ticketStats.closed, color: 'text-slate-400 bg-slate-700/30' },
            ].map(t => (
              <div key={t.label} className={`rounded-xl px-4 py-3 ${t.color}`}>
                <p className="text-2xl font-black">{t.value}</p>
                <p className="text-xs font-semibold mt-0.5 opacity-80">{t.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bb-hover lg:col-span-2 bg-[var(--bb-card)] border border-[var(--bb-border)] rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Platform Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Users', value: stats.totalStudents + stats.totalOwners, dot: 'bg-blue-400' },
              { label: 'Students', value: stats.totalStudents, dot: 'bg-purple-400' },
              { label: 'Owners', value: stats.totalOwners, dot: 'bg-blue-400' },
              { label: 'KYC Pending', value: stats.pendingKyc, dot: 'bg-amber-400' },
              { label: 'Flagged Reviews', value: reviewStats.flagged, dot: 'bg-red-400' },
              { label: 'Banned Users', value: stats.bannedUsers, dot: 'bg-slate-500' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.dot}`} />
                <p className="text-xs text-slate-300 flex-1">{a.label}</p>
                <p className="text-xs font-bold text-slate-200">{a.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  USER MANAGEMENT
// ─────────────────────────────────────────────
export const UserManagement = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<api.User[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activity, setActivity] = useState<{ lastLogin: string | null; loginHistory: { loginAt: string }[] } | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers({ search: search || undefined });
      setUsers(res.data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleBan = async (user: api.User) => {
    setActionLoading(user._id);
    try {
      if (user.isBanned) await api.unbanUser(user._id);
      else await api.banUser(user._id);
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isBanned: !u.isBanned } : u));
      setSelected(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const removeUser = async (user: api.User) => {
    if (!window.confirm(`Delete ${api.displayName(user)} permanently? This cannot be undone.`)) return;
    setActionLoading(user._id);
    try {
      await api.deleteUser(user._id);
      setUsers(prev => prev.filter(u => u._id !== user._id));
      setSelected(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const students = users.filter(u => u.role === 'student');
  const owners   = users.filter(u => u.role === 'owner');
  const detailUser = users.find(u => u._id === selected);

  const kycStyle: Record<string, string> = {
    not_submitted: 'bg-slate-700/50 text-slate-400',
    pending:       'bg-amber-900/30 text-amber-400',
    approved:      'bg-green-900/30 text-green-400',
    rejected:      'bg-red-900/30 text-red-400',
  };
  const kycLabel: Record<string, string> = {
    not_submitted: 'KYC Not Submitted',
    pending:       'KYC Pending',
    approved:      'KYC Approved',
    rejected:      'KYC Rejected',
  };

  const UserRow = ({ u }: { u: api.User }) => {
    const name = api.displayName(u);
    return (
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-[rgba(129,140,248,0.05)] transition-colors border-b border-[rgba(129,140,248,0.08)] last:border-0">
        <div className="w-8 h-8 rounded-full bg-[rgba(129,140,248,0.15)] flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0">
          {api.initials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          <p className="text-xs text-slate-500 truncate">{u.email}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {u.role === 'owner' && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${kycStyle[u.kycStatus ?? 'not_submitted']}`}>
              {kycLabel[u.kycStatus ?? 'not_submitted']}
            </span>
          )}
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${u.isBanned ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
            {u.isBanned ? 'Banned' : 'Active'}
          </span>
          <button onClick={async () => {
            setSelected(u._id);
            setActivity(null);
            setActivityLoading(true);
            try { const r = await api.getUserActivity(u._id); setActivity(r.data); } catch {}
            finally { setActivityLoading(false); }
          }} className="p-1.5 rounded-lg hover:bg-[rgba(129,140,248,0.1)] text-slate-400 hover:text-white transition-colors" title="View">
            <Eye size={13} />
          </button>
          <button
            onClick={() => toggleBan(u)}
            disabled={actionLoading === u._id}
            className={`p-1.5 rounded-lg transition-colors ${u.isBanned ? 'hover:bg-green-900/20 text-slate-400 hover:text-green-400' : 'hover:bg-red-900/20 text-slate-400 hover:text-red-400'}`}
            title={u.isBanned ? 'Unban' : 'Ban'}
          >
            {actionLoading === u._id ? <Loader2 size={13} className="animate-spin" /> : u.isBanned ? <RotateCcw size={13} /> : <Ban size={13} />}
          </button>
          <button
            onClick={() => removeUser(u)}
            disabled={actionLoading === u._id}
            className="p-1.5 rounded-lg transition-colors hover:bg-red-900/20 text-slate-400 hover:text-red-400"
            title="Delete account"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">User Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">{students.length} students · {owners.length} owners</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 px-3 py-2 rounded-lg">
          <AlertCircle size={14} />{error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
          className="w-full pl-9 pr-4 py-2.5 text-sm text-white bg-[var(--bb-elevated)] border border-[var(--bb-border-md)] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
          <Loader2 size={16} className="animate-spin" /> Loading users…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── Students panel ── */}
          <div className="bg-[var(--bb-card)] rounded-2xl border border-[var(--bb-border)] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--bb-elevated)] border-b border-[var(--bb-border)]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Students</span>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-[rgba(129,140,248,0.1)] px-2 py-0.5 rounded-full">{students.length}</span>
            </div>
            <div className="divide-y divide-[rgba(129,140,248,0.08)]">
              {students.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-500">No students found</p>
              ) : (
                students.map(u => <UserRow key={u._id} u={u} />)
              )}
            </div>
          </div>

          {/* ── Owners panel ── */}
          <div className="bg-[var(--bb-card)] rounded-2xl border border-[var(--bb-border)] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--bb-elevated)] border-b border-[var(--bb-border)]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Owners</span>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-[rgba(129,140,248,0.1)] px-2 py-0.5 rounded-full">{owners.length}</span>
            </div>
            <div className="divide-y divide-[rgba(129,140,248,0.08)]">
              {owners.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-500">No owners found</p>
              ) : (
                owners.map(u => <UserRow key={u._id} u={u} />)
              )}
            </div>
          </div>

        </div>
      )}

      {/* Detail modal */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-[var(--bb-card)] rounded-2xl shadow-2xl border border-[var(--bb-border-md)] w-full max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">User Details</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-[rgba(129,140,248,0.1)] rounded-lg text-slate-400"><X size={16} /></button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(129,140,248,0.15)] flex items-center justify-center text-lg font-bold text-indigo-300">
                {api.initials(api.displayName(detailUser))}
              </div>
              <div>
                <p className="font-semibold text-white">{api.displayName(detailUser)}</p>
                <p className="text-xs text-slate-400">{detailUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Role',     detailUser.role === 'owner' ? 'Owner' : 'Student'],
                ['Status',   detailUser.isBanned ? 'Banned' : 'Active'],
                ['Verified', detailUser.isVerified ? 'Yes' : 'No'],
                ['Joined',   api.formatDate(detailUser.createdAt)],
              ].map(([k, v]) => (
                <div key={String(k)} className="bg-[var(--bb-elevated)] rounded-xl px-3 py-2">
                  <p className="text-xs text-slate-500 font-medium">{k}</p>
                  <p className="font-semibold text-slate-200 mt-0.5">{String(v)}</p>
                </div>
              ))}
              {detailUser.role === 'owner' && (() => {
                const status = detailUser.kycStatus ?? 'not_submitted';
                const kycColor: Record<string, string> = {
                  not_submitted: 'text-slate-400', pending: 'text-amber-400',
                  approved: 'text-green-400', rejected: 'text-red-400',
                };
                return (
                  <div className="col-span-2 bg-[var(--bb-elevated)] rounded-xl px-3 py-2">
                    <p className="text-xs text-slate-500 font-medium">KYC Status</p>
                    <p className={`font-semibold mt-0.5 ${kycColor[status]}`}>{kycLabel[status]}</p>
                  </div>
                );
              })()}
            </div>
            {/* Activity timeline */}
            <div className="bg-[var(--bb-elevated)] rounded-xl px-3 py-2.5">
              <p className="text-xs text-slate-500 font-medium mb-2">Login Activity</p>
              {activityLoading ? (
                <div className="flex items-center gap-2 text-slate-500 text-xs py-1">
                  <Loader2 size={12} className="animate-spin" /> Loading…
                </div>
              ) : !activity || activity.loginHistory.length === 0 ? (
                <p className="text-xs text-slate-600 italic">No logins recorded yet</p>
              ) : (
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {activity.loginHistory.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 flex-shrink-0" />
                      <span>{new Date(entry.loginAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      {i === 0 && <span className="ml-auto text-[10px] text-green-400 font-medium">latest</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => toggleBan(detailUser)}
              disabled={actionLoading === detailUser._id}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${detailUser.isBanned ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'}`}
            >
              {actionLoading === detailUser._id ? <Loader2 size={14} className="animate-spin" /> : null}
              {detailUser.isBanned ? 'Unban this user' : 'Ban this user'}
            </button>
            <button
              onClick={() => removeUser(detailUser)}
              disabled={actionLoading === detailUser._id}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 bg-red-950/40 text-red-500 hover:bg-red-950/70 border border-red-900/30 mt-1"
            >
              <Trash2 size={14} />
              Delete account permanently
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
//  KYC VERIFICATION
// ─────────────────────────────────────────────
export const KYCVerification = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'not_submitted'>('pending');
  const [owners, setOwners] = useState<api.User[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchKyc = async (status: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getKyc(status);
      setOwners(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKyc(activeTab); }, [activeTab]);

  const take = async (id: string, action: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      if (action === 'approved') await api.approveKyc(id);
      else await api.rejectKyc(id);
      setOwners(prev => prev.filter(o => o._id !== id));
      setExpanded(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const statusStyle: Record<string, string> = {
    pending: 'bg-amber-900/30 text-amber-400',
    approved: 'bg-green-900/30 text-green-400',
    rejected: 'bg-red-900/30 text-red-400',
    not_submitted: 'bg-slate-700/50 text-slate-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">KYC Verification</h1>
        <p className="text-sm text-slate-400 mt-0.5">Review boarding owner identity documents</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 px-3 py-2 rounded-lg">
          <AlertCircle size={14} />{error}
        </div>
      )}

      <div className="flex gap-1 bg-[var(--bb-elevated)] p-1 rounded-xl w-fit flex-wrap">
        {(['pending', 'approved', 'rejected', 'not_submitted'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? 'bg-[var(--bb-card)] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
            {tab === 'not_submitted' ? 'Not Submitted' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="space-y-3 bb-rows">
          {owners.length === 0 && (
            <div className="bg-[var(--bb-card)] rounded-2xl border border-[var(--bb-border)] p-10 text-center text-sm text-slate-500">
              No {activeTab === 'not_submitted' ? 'owners without KYC documents' : `${activeTab} submissions`}
            </div>
          )}
          {owners.map(owner => {
            const name = api.displayName(owner);
            const docs = owner.kycDocuments;
            const UPLOADS = 'http://localhost:5001/uploads/kyc/';
            const docList = [
              docs?.nicFront && { label: 'NIC Front', file: docs.nicFront },
              docs?.nicBack  && { label: 'NIC Back',  file: docs.nicBack  },
              docs?.selfie   && { label: 'Selfie',    file: docs.selfie   },
            ].filter(Boolean) as { label: string; file: string }[];

            return (
              <div key={owner._id} className="bg-[var(--bb-card)] rounded-2xl border border-[var(--bb-border)] shadow-sm overflow-hidden">
                <button className="w-full text-left px-5 py-4 flex items-center gap-4" onClick={() => setExpanded(expanded === owner._id ? null : owner._id)}>
                  <div className="w-9 h-9 rounded-full bg-[rgba(129,140,248,0.15)] flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0">
                    {api.initials(name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-slate-500">{owner.email}{owner.kycStatus !== 'not_submitted' ? ` · Submitted ${owner.kycSubmittedAt ? api.formatDate(owner.kycSubmittedAt) : '—'}` : ' · No documents submitted'}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusStyle[owner.kycStatus ?? 'not_submitted']}`}>
                    {owner.kycStatus === 'not_submitted' ? 'Not Submitted' : owner.kycStatus === 'pending' ? 'Pending' : owner.kycStatus === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                  <ChevronDown size={16} className={`text-slate-500 transition-transform flex-shrink-0 ${expanded === owner._id ? 'rotate-180' : ''}`} />
                </button>

                {expanded === owner._id && (
                  <div className="border-t border-[var(--bb-border)] px-5 py-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-2">Submitted Documents</p>
                      {docList.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {docList.map(({ label, file }) => {
                            const url = UPLOADS + file;
                            const isPdf = file.toLowerCase().endsWith('.pdf');
                            return (
                              <a
                                key={label}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-[var(--bb-elevated)] border border-[var(--bb-border-md)] hover:border-indigo-400/50 hover:bg-[#2a3360] rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-all group"
                              >
                                <Check size={12} className="text-green-400" />
                                {label}
                                <span className="text-[10px] text-slate-500 group-hover:text-indigo-400 ml-0.5">
                                  {isPdf ? '(PDF)' : '(Image)'} ↗
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">No documents uploaded</p>
                      )}
                    </div>
                    {activeTab === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => take(owner._id, 'approved')}
                          disabled={actionLoading === owner._id}
                          className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
                        >
                          {actionLoading === owner._id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Approve
                        </button>
                        <button
                          onClick={() => take(owner._id, 'rejected')}
                          disabled={actionLoading === owner._id}
                          className="flex items-center gap-1.5 bg-[var(--bb-elevated)] border border-red-900/30 text-red-400 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-900/20 transition-colors disabled:opacity-60"
                        >
                          <X size={13} />Reject
                        </button>
                      </div>
                    )}
                    {activeTab === 'approved' && (
                      <p className="text-xs font-semibold text-green-400">✓ Approved — owner verified</p>
                    )}
                    {activeTab === 'rejected' && (
                      <p className="text-xs font-semibold text-red-400">✕ Rejected — awaiting resubmission</p>
                    )}
                    {activeTab === 'not_submitted' && (
                      <p className="text-xs text-slate-500">⏳ This owner has not submitted their KYC documents yet.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
//  SUPPORT TICKETS
// ─────────────────────────────────────────────
export const SupportTickets = () => {
  const [filter, setFilter] = useState('All');
  const [tickets, setTickets] = useState<api.Ticket[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getTickets(filter);
      setTickets(res.data.tickets);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [filter]);

  const detail = tickets.find(t => t._id === selected);

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      const res = await api.replyToTicket(selected, reply.trim());
      setTickets(prev => prev.map(t => t._id === selected ? res.data : t));
      setReply('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const resolve = async (id: string) => {
    try {
      const res = await api.updateTicketStatus(id, 'resolved');
      setTickets(prev => prev.map(t => t._id === id ? res.data : t));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const statusStyle: Record<string, string> = {
    open: 'bg-blue-900/30 text-blue-400',
    in_progress: 'bg-purple-900/30 text-purple-400',
    resolved: 'bg-green-900/30 text-green-400',
    closed: 'bg-slate-700/50 text-slate-400',
  };

  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Support Tickets</h1>
        <p className="text-sm text-slate-400 mt-0.5">{openCount} open · {tickets.length} total</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 px-3 py-2 rounded-lg">
          <AlertCircle size={14} />{error}
        </div>
      )}

      <div className="flex gap-1 bg-[var(--bb-elevated)] p-1 rounded-xl w-fit">
        {['All', 'Open', 'In Progress', 'Resolved'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${filter === f ? 'bg-[var(--bb-card)] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
          <Loader2 size={16} className="animate-spin" /> Loading tickets…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-2.5">
            {tickets.length === 0 && (
              <div className="bg-[var(--bb-card)] rounded-2xl border border-[var(--bb-border)] p-8 text-center text-sm text-slate-500">No tickets found</div>
            )}
            {tickets.map(t => {
              const userName = api.displayName(t.userId);
              return (
                <button key={t._id} onClick={() => setSelected(t._id)}
                  className={`w-full text-left bg-[var(--bb-card)] border rounded-2xl p-4 transition-all hover:shadow-sm ${selected === t._id ? 'border-[#818cf8] ring-1 ring-[rgba(129,140,248,0.2)] shadow-sm' : 'border-[var(--bb-border)]'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-white truncate">{t.subject}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{userName} · {t.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[t.status]}`}>{api.statusLabel[t.status]}</span>
                    <span className="text-[10px] text-slate-500">{api.formatDate(t.createdAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            {detail ? (
              <div className="bg-[var(--bb-card)] border border-[var(--bb-border)] rounded-2xl shadow-sm flex flex-col" style={{ minHeight: 300 }}>
                <div className="px-5 py-4 border-b border-[var(--bb-border)] flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{detail.subject}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{api.displayName(detail.userId)} · {detail.userId?.email ?? '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {detail.status !== 'resolved' && detail.status !== 'closed' && (
                      <button onClick={() => resolve(detail._id)}
                        className="flex items-center gap-1 text-xs text-green-400 bg-green-900/30 border border-green-900/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-green-900/50 transition-colors">
                        <Check size={12} />Resolve
                      </button>
                    )}
                    <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-[rgba(129,140,248,0.1)] rounded-lg text-slate-400"><X size={15} /></button>
                  </div>
                </div>
                <div className="flex-1 p-5 space-y-3 overflow-y-auto max-h-64">
                  {detail.messages.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">{detail.description}</p>
                  )}
                  {detail.messages.map((m) => (
                    <div key={m._id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-3.5 py-2.5 rounded-2xl text-sm ${m.sender === 'admin' ? 'bg-gradient-to-r from-[#818cf8] to-[#22d3ee] text-white rounded-br-sm' : 'bg-[var(--bb-elevated)] text-slate-200 rounded-bl-sm'}`}>
                        <p>{m.content}</p>
                        <p className={`text-[10px] mt-1 ${m.sender === 'admin' ? 'text-indigo-200' : 'text-slate-500'}`}>
                          {m.sender === 'admin' ? 'You' : api.displayName(detail.userId)} · {api.formatDate(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {detail.status !== 'resolved' && detail.status !== 'closed' && (
                  <div className="px-5 py-4 border-t border-[var(--bb-border)] flex gap-2">
                    <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Type a reply…"
                      className="flex-1 px-3.5 py-2.5 text-sm text-white bg-[var(--bb-elevated)] border border-[var(--bb-border-md)] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors placeholder:text-slate-500"
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendReply()} />
                    <button onClick={sendReply} disabled={sending}
                      className="bg-gradient-to-r from-[#818cf8] to-[#22d3ee] text-white p-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
                      {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[var(--bb-card)] border border-[var(--bb-border)] rounded-2xl shadow-sm flex items-center justify-center text-sm text-slate-500" style={{ minHeight: 200 }}>
                Select a ticket to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
//  FEEDBACK MANAGEMENT
// ─────────────────────────────────────────────
export const FeedbackManagement = () => {
  const [filterTab, setFilterTab] = useState('All');
  const [search, setSearch] = useState('');
  const [reviews, setReviews] = useState<api.Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const isFlagged = filterTab === 'Flagged' ? true : undefined;
      const res = await api.getReviews(isFlagged);
      setReviews(res.data.reviews);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [filterTab]);

  const toggleFlag = async (review: api.Review) => {
    try {
      if (review.isFlagged) await api.unflagReview(review._id);
      else await api.flagReview(review._id);
      setReviews(prev => prev.map(r => r._id === review._id ? { ...r, isFlagged: !r.isFlagged } : r));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const removeReview = async (id: string) => {
    try {
      await api.deleteReview(id);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filtered = reviews.filter(r => {
    const matchRating = !['5','4','3','2','1'].includes(filterTab) || r.rating === parseInt(filterTab);
    const matchSearch = !search || api.displayName(r.userId).toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
    return matchRating && matchSearch;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Feedback Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">{reviews.length} total reviews · Avg. {avgRating}★</p>
        </div>
        {reviews.length > 0 && (
          <div className="text-right">
            <p className="text-3xl font-black text-white">{avgRating}</p>
            <div className="flex items-center gap-0.5 justify-end mt-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= Math.round(parseFloat(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-slate-600 fill-slate-600'} />)}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 px-3 py-2 rounded-lg">
          <AlertCircle size={14} />{error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search feedback…"
            className="w-full pl-9 pr-4 py-2.5 text-sm text-white bg-[var(--bb-elevated)] border border-[var(--bb-border-md)] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors" />
        </div>
        <div className="flex gap-1 bg-[var(--bb-elevated)] p-1 rounded-xl w-fit self-start flex-wrap">
          {['All', 'Flagged', '5', '4', '3', '2', '1'].map(f => (
            <button key={f} onClick={() => setFilterTab(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterTab === f ? 'bg-[var(--bb-card)] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
              {f === 'Flagged' ? '🚩 Flagged' : ['5','4','3','2','1'].includes(f) ? `${f}★` : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
          <Loader2 size={16} className="animate-spin" /> Loading reviews…
        </div>
      ) : (
        <div className="space-y-3 bb-rows">
          {filtered.length === 0 && (
            <div className="bg-[var(--bb-card)] rounded-2xl border border-[var(--bb-border)] p-10 text-center text-sm text-slate-500">No reviews found</div>
          )}
          {filtered.map(fb => {
            const name = api.displayName(fb.userId);
            return (
              <div key={fb._id} className={`bg-[var(--bb-card)] rounded-2xl border shadow-sm p-5 ${fb.isFlagged ? 'border-red-900/40 bg-red-900/5' : 'border-[var(--bb-border)]'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[rgba(129,140,248,0.15)] flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0">
                      {api.initials(name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white">{name}</p>
                        <span className="text-xs text-slate-400">·</span>
                        <p className="text-xs text-slate-400">{fb.userId?.email ?? '—'}</p>
                        {fb.isFlagged && <span className="text-[10px] font-bold bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full">Flagged</span>}
                        {!fb.isVisible && <span className="text-[10px] font-bold bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded-full">Hidden</span>}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={12} className={s <= fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600 fill-slate-600'} />
                        ))}
                        <span className="text-xs text-slate-500 ml-1">{api.formatDate(fb.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">{fb.comment}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => toggleFlag(fb)}
                      className={`p-1.5 rounded-lg transition-colors ${fb.isFlagged ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'hover:bg-[rgba(129,140,248,0.1)] text-slate-400 hover:text-amber-400'}`}
                      title={fb.isFlagged ? 'Unflag' : 'Flag'}>
                      <Flag size={14} />
                    </button>
                    <button onClick={() => removeReview(fb._id)}
                      className="p-1.5 rounded-lg hover:bg-red-900/20 text-slate-400 hover:text-red-400 transition-colors" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
//  ADMIN SETTINGS
// ─────────────────────────────────────────────
export const AdminSettings = () => {
  const [current, setCurrent]   = useState('');
  const [next, setNext]         = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (next.length < 8) { setError('New password must be at least 8 characters'); return; }
    if (next !== confirm) { setError('New passwords do not match'); return; }
    setLoading(true);
    try {
      await api.changeAdminPassword(current, next);
      setSuccess('Password updated successfully.');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const adminName  = localStorage.getItem('adminName')  ?? 'Super Admin';
  const adminEmail = localStorage.getItem('adminEmail') ?? '';

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your admin account</p>
      </div>

      <div className="bg-[var(--bb-card)] rounded-2xl border border-[var(--bb-border)] p-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#818cf8] to-[#22d3ee] flex items-center justify-center text-white font-bold text-base shadow-[0_0_12px_rgba(129,140,248,0.4)]">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{adminName}</p>
            <p className="text-xs text-slate-400">{adminEmail}</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bb-card)] rounded-2xl border border-[var(--bb-border)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={16} className="text-indigo-400" />
          <h2 className="text-sm font-bold text-white">Change Password</h2>
        </div>
        <form onSubmit={handleChange} className="space-y-4">
          {[
            { label: 'Current password', value: current, show: showCurrent, toggle: () => setShowCurrent(p => !p), set: setCurrent, ph: 'Enter current password' },
            { label: 'New password',     value: next,    show: showNext,    toggle: () => setShowNext(p => !p),    set: setNext,    ph: 'Min 8 characters' },
            { label: 'Confirm new',      value: confirm, show: showConfirm, toggle: () => setShowConfirm(p => !p), set: setConfirm, ph: 'Repeat new password' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{f.label}</label>
              <div className="relative">
                <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type={f.show ? 'text' : 'password'} value={f.value}
                  onChange={e => f.set(e.target.value)} placeholder={f.ph}
                  className="w-full pl-9 pr-10 py-2.5 border border-[var(--bb-border-md)] bg-[var(--bb-elevated)] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors placeholder:text-slate-500" />
                <button type="button" onClick={f.toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  <Eye size={14} className={f.show ? 'opacity-40' : ''} />
                </button>
              </div>
            </div>
          ))}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 px-3 py-2 rounded-lg">
              <AlertCircle size={13} />{error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-400 text-xs bg-green-900/20 px-3 py-2 rounded-lg">
              <Check size={13} />{success}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-[#818cf8] to-[#22d3ee] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
            {loading ? <><Loader2 size={14} className="animate-spin" />Updating…</> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
