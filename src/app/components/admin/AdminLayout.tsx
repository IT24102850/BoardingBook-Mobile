import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShieldCheck, LifeBuoy, MessageSquare,
  LogOut, Menu, X, Building2, Settings, Sun, Moon,
} from 'lucide-react';

export default function AdminLayout() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLight, setIsLight] = useState(() => localStorage.getItem('adminTheme') === 'light');
  const isAuthenticated = !!localStorage.getItem('adminToken');

  useEffect(() => { setIsSidebarOpen(false); }, [location.pathname]);

  const toggleTheme = () => {
    setIsLight(prev => {
      const next = !prev;
      localStorage.setItem('adminTheme', next ? 'light' : 'dark');
      return next;
    });
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  return (
    <>
      <style>{`
        /* ── Theme colour tokens ───────────────────────────────────── */
        .admin-layout {
          --bb-base:       #181f36;
          --bb-card:       #1e2436;
          --bb-elevated:   #232b47;
          --bb-border:     rgba(129,140,248,0.15);
          --bb-border-md:  rgba(129,140,248,0.20);
          --bb-shadow:     rgba(0,0,0,0.30);
          --bb-glow:       rgba(129,140,248,0.20);
        }
        .admin-layout.admin-light {
          --bb-base:       #eef2ff;
          --bb-card:       #ffffff;
          --bb-elevated:   #f1f5f9;
          --bb-border:     rgba(99,102,241,0.12);
          --bb-border-md:  rgba(99,102,241,0.18);
          --bb-shadow:     rgba(99,102,241,0.10);
          --bb-glow:       rgba(99,102,241,0.10);
        }

        /* ── Smooth theme transitions ──────────────────────────────── */
        .admin-layout *, .admin-layout *::before, .admin-layout *::after {
          transition-property: background-color, border-color, color, box-shadow;
          transition-duration: 0.22s;
          transition-timing-function: ease;
        }
        /* Never transition animation-driven elements */
        .admin-layout .no-trans,
        .admin-layout [class*="animate-"],
        .admin-layout .recharts-wrapper * {
          transition: none !important;
        }

        /* ── Light-mode text overrides ─────────────────────────────── */
        .admin-layout.admin-light .text-white   { color: #1e293b !important; }
        .admin-layout.admin-light .text-slate-200 { color: #1e293b !important; }
        .admin-layout.admin-light .text-slate-300 { color: #334155 !important; }
        .admin-layout.admin-light .text-slate-400 { color: #64748b !important; }
        .admin-layout.admin-light .text-slate-500 { color: #94a3b8 !important; }
        /* Keep white on solid action buttons */
        .admin-layout.admin-light [class*="bg-green-"][class*="text-white"] { color: #fff !important; }
        .admin-layout.admin-light [class*="bg-red-5"][class*="text-white"]  { color: #fff !important; }
        /* keep-white utility for icons on gradient backgrounds */
        .admin-layout.admin-light .keep-white { color: #fff !important; }
        /* Active nav item always stays white regardless of theme */
        .admin-layout.admin-light .bb-nav-active,
        .admin-layout.admin-light .bb-nav-active svg,
        .admin-layout.admin-light .bb-nav-active span { color: #fff !important; }
        /* Inputs — readable in light */
        .admin-layout.admin-light input,
        .admin-layout.admin-light textarea,
        .admin-layout.admin-light select { color: #1e293b !important; }
        .admin-layout.admin-light input::placeholder,
        .admin-layout.admin-light textarea::placeholder { color: #94a3b8 !important; }

        /* ── Entrance animations ───────────────────────────────────── */
        @keyframes bb-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes bb-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bb-scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes bb-slide-right {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0);     }
        }

        .bb-fade-up   { animation: bb-fade-up   0.40s cubic-bezier(.22,.68,0,1.2) both; }
        .bb-fade-in   { animation: bb-fade-in   0.30s ease both; }
        .bb-scale-in  { animation: bb-scale-in  0.30s cubic-bezier(.22,.68,0,1.2) both; }

        /* ── Stagger grid ──────────────────────────────────────────── */
        .bb-stagger > * { animation: bb-fade-up 0.40s cubic-bezier(.22,.68,0,1.2) both; }
        .bb-stagger > *:nth-child(1) { animation-delay: 0.04s; }
        .bb-stagger > *:nth-child(2) { animation-delay: 0.09s; }
        .bb-stagger > *:nth-child(3) { animation-delay: 0.14s; }
        .bb-stagger > *:nth-child(4) { animation-delay: 0.19s; }
        .bb-stagger > *:nth-child(5) { animation-delay: 0.24s; }
        .bb-stagger > *:nth-child(6) { animation-delay: 0.29s; }

        /* ── List row stagger ──────────────────────────────────────── */
        .bb-rows > * { animation: bb-fade-up 0.35s cubic-bezier(.22,.68,0,1.2) both; }
        .bb-rows > *:nth-child(1)  { animation-delay: 0.03s; }
        .bb-rows > *:nth-child(2)  { animation-delay: 0.07s; }
        .bb-rows > *:nth-child(3)  { animation-delay: 0.11s; }
        .bb-rows > *:nth-child(4)  { animation-delay: 0.15s; }
        .bb-rows > *:nth-child(5)  { animation-delay: 0.18s; }
        .bb-rows > *:nth-child(6)  { animation-delay: 0.21s; }
        .bb-rows > *:nth-child(7)  { animation-delay: 0.24s; }
        .bb-rows > *:nth-child(8)  { animation-delay: 0.27s; }

        /* ── Card hover lift ───────────────────────────────────────── */
        .bb-hover {
          transition: transform 0.20s ease, box-shadow 0.20s ease,
                      background-color 0.22s ease, border-color 0.22s ease !important;
        }
        .bb-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px var(--bb-shadow);
        }

        /* ── Page section entrance ─────────────────────────────────── */
        .bb-page { animation: bb-fade-in 0.30s ease both; }

        /* ── Pulse dot (live indicator) ────────────────────────────── */
        @keyframes bb-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.8); opacity: 0;   }
          100% { transform: scale(1.8); opacity: 0;   }
        }
        .bb-pulse::before {
          content: '';
          position: absolute; inset: -3px;
          border-radius: 50%;
          background: currentColor;
          animation: bb-pulse-ring 2s ease-out infinite;
        }
        .bb-pulse { position: relative; }

        /* ── Toggle knob — use transform not transition shorthand ──── */
        .bb-knob {
          transition: transform 0.28s cubic-bezier(.22,.68,0,1.2) !important;
        }

        /* ── Sidebar nav hover background ──────────────────────────── */
        .admin-layout aside nav a:not(.active-nav):hover {
          background: var(--bb-elevated);
        }
      `}</style>

      <div className={`admin-layout flex h-screen font-sans overflow-hidden bg-[var(--bb-base)] ${isLight ? 'admin-light' : ''}`}>

        {/* ── Mobile header ───────────────────────────────────────── */}
        <header className="lg:hidden fixed top-0 w-full bg-[var(--bb-card)] border-b border-[var(--bb-border-md)] px-4 py-3 z-50 flex items-center justify-between shadow-sm">
          <a href="/" className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
            <Building2 size={20} className="text-[#a5b4fc]" />
            <span className="text-base font-bold tracking-tight">BoardingBook</span>
            <span className="text-[10px] font-semibold text-slate-400 bg-[var(--bb-elevated)] px-2 py-0.5 rounded-full">Admin</span>
          </a>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:bg-[var(--bb-elevated)] transition-colors"
              title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <Sun size={17} className={isLight ? 'text-amber-400' : 'text-slate-500'} />
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[var(--bb-elevated)] rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {/* ── Sidebar overlay (mobile) ─────────────────────────────── */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm no-trans"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-60
          bg-[var(--bb-card)] border-r border-[var(--bb-border)]
          flex flex-col shadow-xl lg:shadow-none
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Logo */}
          <a href="/" className="px-5 py-5 border-b border-[var(--bb-border)] hidden lg:flex items-center gap-2.5 no-underline hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-[#818cf8] to-[#22d3ee] rounded-lg flex items-center justify-center shadow-[0_0_14px_rgba(129,140,248,0.45)]">
              <Building2 size={16} className="keep-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">BoardingBook</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Admin Panel</p>
            </div>
          </a>

          <div className="h-14 lg:hidden" />

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pb-2 pt-1">Overview</p>
            <NavItem to="/admin/dashboard"  icon={<LayoutDashboard size={17} />} label="Dashboard" />

            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pb-2 pt-4">Management</p>
            <NavItem to="/admin/users"    icon={<Users size={17} />}       label="Users" />
            <NavItem to="/admin/kyc"      icon={<ShieldCheck size={17} />} label="KYC Verification" />
            <NavItem to="/admin/tickets"  icon={<LifeBuoy size={17} />}    label="Support Tickets" />
            <NavItem to="/admin/feedback" icon={<MessageSquare size={17} />} label="Feedback" />

            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pb-2 pt-4">Account</p>
            <NavItem to="/admin/settings" icon={<Settings size={17} />} label="Settings" />
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-[var(--bb-border)] space-y-1.5">
            {/* Admin info */}
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#818cf8] to-[#22d3ee] flex items-center justify-center text-xs font-bold keep-white flex-shrink-0">
                {(localStorage.getItem('adminName') ?? 'A').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{localStorage.getItem('adminName') ?? 'Super Admin'}</p>
                <p className="text-[10px] text-slate-500 truncate">{localStorage.getItem('adminEmail') ?? ''}</p>
              </div>
            </div>

            {/* Theme toggle — label always reads "Light mode"; toggle ON = light, OFF = dark */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--bb-elevated)] cursor-pointer select-none" onClick={toggleTheme}>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <Sun size={15} className={isLight ? 'text-amber-400' : 'text-slate-500'} />
                <span>Light mode</span>
              </div>
              {/* Toggle pill: OFF (left) = dark, ON (right) = light */}
              <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex-shrink-0 ${isLight ? 'bg-indigo-500' : 'bg-slate-600'}`}>
                <span className={`bb-knob absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md ${isLight ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/8 w-full px-3 py-2.5 rounded-lg text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-auto bg-[var(--bb-base)] w-full relative pt-14 lg:pt-0">
          <div className="p-5 lg:p-8 max-w-7xl mx-auto min-h-full bb-page">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

const NavItem = ({
  to, icon, label, badge,
}: {
  to: string; icon: React.ReactNode; label: string; badge?: number;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bb-nav-active bg-gradient-to-r from-[#818cf8] to-[#22d3ee] text-white shadow-[0_0_14px_rgba(129,140,248,0.30)]'
          : 'text-slate-400 hover:text-slate-200'
      }`
    }
  >
    {icon}
    <span className="flex-1">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="no-trans text-[10px] font-bold bg-red-500 keep-white rounded-full w-4 h-4 flex items-center justify-center">
        {badge}
      </span>
    )}
  </NavLink>
);
