import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeroSection } from './HeroSection';
import { ListingsSection } from './ListingsSection';
import { Menu, X, Home, Search, Users, Building, Settings, LogIn, LogOut, Zap, CreditCard, Users as UsersIcon, FileText, Briefcase } from 'lucide-react';
import { BiBot, BiUser } from 'react-icons/bi';

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const activePath = location.pathname;

  // Close mobile menu when clicking a link
  const handleMobileLinkClick = () => {
    setMobileNavOpen(false);
  };


  // Handle Sign In click
  const handleSignIn = () => {
    setMobileNavOpen(false);
    navigate('/signin');
  };

  // Handle Sign Up click
  const handleSignUp = () => {
    setMobileNavOpen(false);
    navigate('/signup');
  };

  // Handle Settings click
  const handleSettings = () => {
    setMobileNavOpen(false);
    console.log('Settings clicked');
    // Add your settings logic
  };

  return (
    <div className="min-h-screen flex flex-col items-center w-full max-w-full overflow-x-hidden relative bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      {/* Global Styles */}
      <style>{`
        html, body {
          overflow-x: hidden;
          width: 100%;
          margin: 0;
          padding: 0;
          background: #0a1124;
        }
        
        /* Mobile styles (all screens below 768px) */
        @media (max-width: 768px) {
          /* Navbar */
          .navbar {
            height: 60px !important;
            min-height: 60px !important;
            padding: 0 !important;
            background: rgba(10,17,36,0.55) !important;
            backdrop-filter: saturate(180%) blur(28px) !important;
            -webkit-backdrop-filter: saturate(180%) blur(28px) !important;
            border-bottom: 1px solid rgba(255,255,255,0.06) !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 10000 !important;
          }
          
          .navbar-logo {
            font-size: 1.6rem !important;
          }
          
          /* Hide desktop elements on mobile */
          .desktop-nav {
            display: none !important;
          }
          
          .desktop-profile {
            display: none !important;
          }
          
          /* Show mobile nav */
          .mobile-nav {
            display: flex !important;
          }
          
          /* Hamburger button */
          .hamburger-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
            width: 44px !important;
            height: 44px !important;
            background: rgba(129, 140, 248, 0.15) !important;
            border: 1px solid rgba(129, 140, 248, 0.3) !important;
            border-radius: 12px !important;
            color: #a5b4fc !important;
            transition: all 0.2s;
            cursor: pointer;
          }
          
          .hamburger-btn:hover {
            background: rgba(129, 140, 248, 0.25) !important;
          }
          
          .hamburger-btn svg {
            width: 24px;
            height: 24px;
          }
          
          /* Mobile Menu Overlay */
          .mobile-menu-overlay {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: 9999;
            animation: fadeIn 0.2s ease;
          }
          
          .mobile-menu-drawer {
            position: fixed;
            top: 60px;
            left: 0;
            width: 85%;
            max-width: 320px;
            height: calc(100vh - 64px);
            background: #1e2436;
            border-right: 1px solid rgba(129, 140, 248, 0.2);
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            overflow-y: auto;
            padding-bottom: 40px;
          }
          
          .mobile-menu-header {
            padding: 24px 20px;
            border-bottom: 1px solid rgba(129, 140, 248, 0.2);
            background: #232b47;
            position: sticky;
            top: 0;
            z-index: 10;
          }
          
          .mobile-menu-user {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          
          .mobile-menu-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #818cf8, #22d3ee);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.4rem;
            box-shadow: 0 4px 12px rgba(129, 140, 248, 0.3);
          }
          
          .mobile-menu-user-info h4 {
            color: white;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .mobile-menu-user-info p {
            color: #94a3b8;
            font-size: 0.9rem;
          }
          
          .mobile-menu-items {
            padding: 20px 16px;
          }
          
          .mobile-menu-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
            color: #e2e8f0;
            font-size: 1.1rem;
            font-weight: 500;
            border-radius: 16px;
            margin-bottom: 8px;
            transition: all 0.2s;
            cursor: pointer;
            text-decoration: none;
            background: rgba(255, 255, 255, 0.02);
            border: none;
            width: 100%;
            text-align: left;
          }
          
          .mobile-menu-item:hover {
            background: rgba(129, 140, 248, 0.15);
          }
          
          .mobile-menu-item.active {
            background: linear-gradient(135deg, #818cf8, #22d3ee);
            color: white;
            box-shadow: 0 4px 12px rgba(129, 140, 248, 0.3);
          }
          
          .mobile-menu-item svg {
            width: 22px;
            height: 22px;
            color: #a5b4fc;
          }
          
          .mobile-menu-item.active svg {
            color: white;
          }
          
          .mobile-menu-divider {
            height: 1px;
            background: rgba(129, 140, 248, 0.15);
            margin: 20px 0;
          }
          
          /* Auth Section Styles */
          .mobile-menu-auth {
            padding: 0 16px 30px 16px;
            margin-top: 10px;
          }
          
          .mobile-menu-auth-title {
            color: #94a3b8;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            padding-left: 8px;
          }
          
          .mobile-menu-auth-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .mobile-menu-auth-button {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
            border-radius: 16px;
            font-size: 1.1rem;
            font-weight: 600;
            transition: all 0.2s;
            cursor: pointer;
            text-decoration: none;
            border: none;
            width: 100%;
            text-align: left;
          }
          
          .mobile-menu-auth-button.signin {
            background: linear-gradient(135deg, #818cf8, #22d3ee);
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(129, 140, 248, 0.3);
          }
          
          .mobile-menu-auth-button.signin svg {
            color: white;
          }
          
          .mobile-menu-auth-button.signup {
            background: transparent;
            color: #a5b4fc;
            border: 2px solid rgba(129, 140, 248, 0.3);
          }
          
          .mobile-menu-auth-button.signup svg {
            color: #a5b4fc;
          }
          
          .mobile-menu-auth-button:hover {
            transform: translateY(-2px);
          }
          
          .mobile-menu-auth-button.signin:active {
            transform: scale(0.98);
          }
          
          .mobile-menu-auth-button.signup:active {
            background: rgba(129, 140, 248, 0.1);
          }
          
          /* Main content container for mobile */
          .mobile-container {
            padding: 0 16px !important;
            width: 100% !important;
            margin-top: 80px !important;
            margin-bottom: 40px !important;
          }
          
          /* Hero section */
          .hero-section {
            width: 100% !important;
            margin-bottom: 32px !important;
          }
          
          .hero-card {
            padding: 28px 20px !important;
            border-radius: 28px !important;
            background: rgba(35, 43, 71, 0.9) !important;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(129, 140, 248, 0.2) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
            width: 100% !important;
          }
          
          .tag-pill {
            font-size: 0.85rem !important;
            padding: 8px 16px !important;
            background: rgba(34, 211, 238, 0.15) !important;
            border-radius: 40px !important;
            display: inline-block !important;
            margin-bottom: 20px !important;
            color: #22d3ee !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px !important;
            border: 1px solid rgba(34, 211, 238, 0.3) !important;
          }
          
          h1 {
            font-size: 2.2rem !important;
            line-height: 1.2 !important;
            margin-bottom: 24px !important;
            background: linear-gradient(135deg, #818cf8, #22d3ee) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            font-weight: 800 !important;
            letter-spacing: -0.5px !important;
          }
          
          /* CTA Buttons */
          .hero-cta-row {
            display: flex !important;
            flex-direction: column;
            gap: 12px;
            margin: 28px 0 24px 0;
          }
          
          .hero-cta-btn {
            width: 100%;
            padding: 18px !important;
            border-radius: 18px !important;
            font-size: 1.1rem !important;
            font-weight: 700 !important;
            text-align: center;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
          }
          
          .hero-cta-btn-primary {
            background: linear-gradient(135deg, #818cf8, #22d3ee) !important;
            color: white !important;
            box-shadow: 0 8px 20px rgba(129, 140, 248, 0.3) !important;
          }
          
          .hero-cta-btn-primary:active {
            transform: scale(0.98);
          }
          
          .hero-cta-btn-secondary {
            background: transparent !important;
            color: #a5b4fc !important;
            border: 2px solid rgba(129, 140, 248, 0.3) !important;
          }
          
          .hero-cta-btn-secondary:active {
            background: rgba(129, 140, 248, 0.1);
          }
          
          /* Benefits Row */
          .hero-benefits-row {
            display: flex !important;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin: 24px 0 20px 0;
          }
          
          .hero-benefit {
            background: rgba(129, 140, 248, 0.12) !important;
            color: #a5b4fc !important;
            padding: 10px 18px !important;
            border-radius: 40px !important;
            font-size: 0.95rem !important;
            font-weight: 600 !important;
            border: 1px solid rgba(129, 140, 248, 0.2) !important;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            backdrop-filter: blur(4px);
          }
          
          .hero-benefit::before {
            content: "✓";
            color: #22d3ee;
            font-weight: bold;
            font-size: 1.1rem;
          }
          
          /* Hero Description */
          .hero-description {
            color: #94a3b8 !important;
            font-size: 1rem !important;
            text-align: center;
            margin: 20px 0 8px 0 !important;
            line-height: 1.5 !important;
            max-width: 90% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          
          /* Mobile Hero Image */
          .hero-image-mobile {
            display: block !important;
            width: 100%;
            height: 220px !important;
            object-fit: cover !important;
            border-radius: 28px !important;
            margin: 24px 0 32px 0 !important;
            border: 2px solid rgba(129, 140, 248, 0.2) !important;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3) !important;
          }
          
          /* Features Grid */
          .features-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 0 !important;
            margin: 40px 0 !important;
            width: 100% !important;
          }
          
          .feature-card {
            padding: 24px !important;
            border-radius: 24px !important;
            background: rgba(35, 43, 71, 0.8) !important;
            border: 1px solid rgba(129, 140, 248, 0.15) !important;
            backdrop-filter: blur(10px);
            min-height: auto !important;
            transition: transform 0.2s;
            width: 100% !important;
          }
          
          .feature-card:active {
            transform: scale(0.98);
          }
          
          .feature-card h3 {
            font-size: 1.3rem !important;
            color: white !important;
            margin-bottom: 10px !important;
            font-weight: 700 !important;
            background: linear-gradient(135deg, #818cf8, #22d3ee) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            display: inline-block !important;
          }
          
          .feature-card p {
            color: #cbd5e1 !important;
            font-size: 1rem !important;
            line-height: 1.5 !important;
            display: block !important;
            -webkit-line-clamp: unset !important;
            max-height: none !important;
            margin: 0 !important;
          }
          
          /* Contact Section */
          .contact-section {
            margin: 40px 0 20px !important;
            padding: 40px 24px !important;
            border-radius: 32px !important;
            background: rgba(35, 43, 71, 0.9) !important;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            width: 100% !important;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2) !important;
          }
          
          .contact-section h2 {
            font-size: 2rem !important;
            color: white !important;
            margin-bottom: 16px !important;
            font-weight: 700 !important;
            text-align: center !important;
          }
          
          .contact-section p {
            color: #cbd5e1 !important;
            font-size: 1.1rem !important;
            margin-bottom: 32px !important;
            line-height: 1.6 !important;
            text-align: center !important;
            max-width: 90% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          
          .contact-section a {
            display: inline-block;
            padding: 18px 40px !important;
            background: linear-gradient(135deg, #818cf8, #22d3ee) !important;
            color: white !important;
            border-radius: 40px !important;
            font-weight: 700 !important;
            font-size: 1.2rem !important;
            text-decoration: none;
            box-shadow: 0 8px 20px rgba(129, 140, 248, 0.3) !important;
            width: 100% !important;
            text-align: center !important;
            border: none !important;
          }
          
          .contact-section a:active {
            transform: scale(0.98);
          }
          
          /* Hide desktop elements on mobile */
          .hero-image-desktop {
            display: none !important;
          }
          
          .hero-stats-row {
            display: none !important;
          }
          
          .desktop-features-grid {
            display: none !important;
          }
        }
        
        /* Desktop styles - IMPROVED based on feedback */
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }
          
          .hamburger-btn {
            display: none !important;
          }
          
          .mobile-menu-overlay {
            display: none !important;
          }
          
          .hero-image-mobile {
            display: none !important;
          }
          
          .hero-cta-row {
            display: none !important;
          }
          
          .hero-benefits-row {
            display: none !important;
          }
          
          .contact-section {
            display: none !important;
          }
          
          .features-grid {
            display: none !important;
          }
          
          /* Restore original desktop layout with improvements */
          .desktop-nav {
            display: flex !important;
          }
          
          .desktop-profile {
            display: flex !important;
          }
          
          .hero-image-desktop {
            display: flex !important;
            position: relative !important;
          }
          
          /* Add subtle glow to balance visual weight */
          .hero-image-desktop .surface-glass {
            box-shadow: 0 0 30px rgba(129, 140, 248, 0.2) !important;
            border: 1px solid rgba(129, 140, 248, 0.2) !important;
          }
          
          .desktop-features-grid {
            display: grid !important;
          }
          
          .original-contact-section {
            display: flex !important;
          }
          
          /* Improved hero section */
          .hero-content-wrapper {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 2rem !important;
          }
          
          /* CTA buttons for desktop */
          .desktop-cta-row {
            display: flex !important;
            gap: 1rem !important;
            margin-top: 2rem !important;
            margin-bottom: 2rem !important;
          }
          
          .desktop-cta-primary {
            background: linear-gradient(135deg, #818cf8, #22d3ee) !important;
            color: white !important;
            padding: 0.875rem 2rem !important;
            border-radius: 40px !important;
            font-weight: 600 !important;
            font-size: 1rem !important;
            border: none !important;
            box-shadow: 0 4px 14px rgba(129, 140, 248, 0.3) !important;
            transition: all 0.2s !important;
            cursor: pointer !important;
          }
          
          .desktop-cta-primary:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(129, 140, 248, 0.4) !important;
          }
          
          .desktop-cta-secondary {
            background: transparent !important;
            color: #a5b4fc !important;
            padding: 0.875rem 2rem !important;
            border-radius: 40px !important;
            font-weight: 600 !important;
            font-size: 1rem !important;
            border: 2px solid rgba(129, 140, 248, 0.3) !important;
            transition: all 0.2s !important;
            cursor: pointer !important;
          }
          
          .desktop-cta-secondary:hover {
            border-color: #818cf8 !important;
            background: rgba(129, 140, 248, 0.1) !important;
          }
          
          /* User benefits instead of stats */
          .user-benefits-row {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 1rem !important;
            margin-top: 1.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .user-benefit {
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            color: #cbd5e1 !important;
            font-size: 0.95rem !important;
          }
          
          .user-benefit svg {
            color: #22d3ee !important;
            width: 1.25rem !important;
            height: 1.25rem !important;
          }
          
          /* Improved feature cards */
          .desktop-feature-card {
            padding: 2rem 1.5rem !important;
            border-radius: 1.5rem !important;
            background: rgba(35, 43, 71, 0.8) !important;
            border: 1px solid rgba(129, 140, 248, 0.15) !important;
            backdrop-filter: blur(10px);
            min-height: 200px !important;
            transition: all 0.3s !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          
          .desktop-feature-card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 20px 30px -10px rgba(129, 140, 248, 0.3) !important;
            border-color: rgba(129, 140, 248, 0.3) !important;
          }
          
          .feature-icon {
            width: 3rem !important;
            height: 3rem !important;
            border-radius: 1rem !important;
            background: linear-gradient(135deg, rgba(129, 140, 248, 0.2), rgba(34, 211, 238, 0.2)) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-bottom: 1.5rem !important;
          }
          
          .feature-icon svg {
            width: 1.5rem !important;
            height: 1.5rem !important;
            color: #22d3ee !important;
          }
          
          .desktop-feature-card h3 {
            font-size: 1.25rem !important;
            font-weight: 700 !important;
            color: white !important;
            margin-bottom: 0.75rem !important;
          }
          
          .desktop-feature-card p {
            color: #94a3b8 !important;
            font-size: 0.95rem !important;
            line-height: 1.6 !important;
            margin: 0 !important;
          }
        }
        
        /* ── Apple-style Navbar ── */
        .nav-link-active {
          color: #22d3ee !important;
          position: relative;
        }
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #22d3ee;
        }

        .nav-link {
          transition: color 0.2s;
          position: relative;
        }

        .profile-icon {
          width: 36px !important;
          height: 36px !important;
        }

        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-up {
          animation: fade-up 0.7s cubic-bezier(.4,0,.2,1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        /* Navbar glass — transparent blur */
        .navbar-glass {
          background: rgba(10, 17, 36, 0.55);
          backdrop-filter: saturate(180%) blur(28px);
          -webkit-backdrop-filter: saturate(180%) blur(28px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* Nav pill hover */
        .nav-pill-item {
          color: rgba(203, 213, 225, 0.85);
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          transition: color 0.2s, background 0.2s;
          position: relative;
          letter-spacing: 0.01em;
        }
        .nav-pill-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.07);
        }
        .nav-pill-item.active {
          color: #22d3ee;
        }
        .nav-pill-item.active::after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #22d3ee;
        }
      `}</style>

      {/* Ambient background accents inspired by the search page */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-120px] left-[-80px] w-[280px] h-[280px] md:w-[420px] md:h-[420px] bg-cyan-500/12 rounded-full blur-[90px] md:blur-[120px]" />
        <div className="absolute bottom-[-160px] right-[-80px] w-[280px] h-[280px] md:w-[460px] md:h-[460px] bg-indigo-500/14 rounded-full blur-[90px] md:blur-[130px]" />
      </div>

      {/* ── Apple-style Frosted Glass Navbar ── */}
      <nav className="w-full fixed top-0 left-0 z-[10000] navbar-glass navbar"
        style={{ height: 60, minHeight: 60 }}>
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5 md:px-8">

          {/* Logo */}
          <div className="flex items-center gap-2 select-none">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <span className="text-white font-black text-xs">BB</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Boarding<span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Book</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="desktop-nav hidden md:flex items-center gap-1">
            <button type="button" onClick={() => navigate('/')} className={`nav-pill-item${activePath==='/'?' active':''}`}>Home</button>
            <button type="button" onClick={() => navigate('/find')} className={`nav-pill-item${activePath==='/find'?' active':''}`}>Find Rooms</button>
            <button type="button" onClick={() => navigate('/roommate-finder')} className={`nav-pill-item${activePath==='/roommate-finder'?' active':''}`}>Roommates</button>
            <button type="button" onClick={() => navigate('/chatbot')} className={`nav-pill-item flex items-center gap-1.5${activePath==='/chatbot'?' active':''}`}>
              <BiBot size={16} />AI Chat
            </button>
            <button type="button" onClick={() => navigate('/boarding-management')} className={`nav-pill-item${activePath==='/boarding-management'?' active':''}`}>List Property</button>
          </div>

          {/* Right: Auth + Profile + Hamburger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="hidden md:flex items-center px-4 py-1.5 rounded-full text-white/75 hover:text-white font-medium text-sm border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="hidden md:flex items-center px-4 py-1.5 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 shadow-md shadow-indigo-500/25 transition-all duration-200 hover:scale-105"
            >
              Sign Up
            </button>
            {/* Hamburger - Mobile Only */}
            <button
              className="hamburger-btn flex md:hidden"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>{/* end max-w inner */}
      </nav>

      {/* Mobile Menu Overlay - FIXED with working buttons */}
      {mobileNavOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileNavOpen(false)}>
          <div className="mobile-menu-drawer" onClick={e => e.stopPropagation()}>
            {/* Mobile Menu Header - Sticky */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-user">
                <div className="mobile-menu-avatar">
                  <BiUser size={28} />
                </div>
                <div className="mobile-menu-user-info">
                  <h4>Guest User</h4>
                  <p>Sign in to access your account</p>
                </div>
              </div>
            </div>

            {/* Mobile Menu Items - Navigation only */}
            <div className="mobile-menu-items">
              <button 
                className={`mobile-menu-item ${activePath === '/' ? 'active' : ''}`}
                onClick={() => { handleMobileLinkClick(); navigate('/'); }}
              >
                <Home size={22} />
                Home
              </button>
              
              <button 
                className={`mobile-menu-item ${activePath === '/find' ? 'active' : ''}`}
                onClick={() => { handleMobileLinkClick(); navigate('/find'); }}
              >
                <Search size={22} />
                Find Rooms
              </button>
              
              <button 
                className={`mobile-menu-item ${activePath === '/roommate-finder' ? 'active' : ''}`}
                onClick={() => { handleMobileLinkClick(); navigate('/roommate-finder'); }}
              >
                <Users size={22} />
                Roommate Finder
              </button>
              
              <button 
                className={`mobile-menu-item ${activePath === '/chatbot' ? 'active' : ''}`}
                onClick={() => { handleMobileLinkClick(); navigate('/chatbot'); }}
              >
                <BiBot size={22} />
                AI Chatbot
              </button>
              
              <button 
                className={`mobile-menu-item ${activePath === '/boarding-management' ? 'active' : ''}`}
                onClick={() => { handleMobileLinkClick(); navigate('/boarding-management'); }}
              >
                <Building size={22} />
                List Your Property
              </button>
              
              <div className="mobile-menu-divider"></div>
              
              <button 
                className="mobile-menu-item"
                onClick={handleSettings}
              >
                <Settings size={22} />
                Settings
              </button>
            </div>

            {/* Auth Section - Working Sign In & Sign Up buttons */}
            <div className="mobile-menu-auth">
              <div className="mobile-menu-auth-title">ACCOUNT</div>
              <div className="mobile-menu-auth-buttons">
                <button 
                  className="mobile-menu-auth-button signin"
                  onClick={handleSignIn}
                >
                  <LogIn size={22} />
                  Sign In
                </button>
                <button 
                  className="mobile-menu-auth-button signup"
                  onClick={handleSignUp}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Extra space at bottom for comfortable scrolling */}
            <div style={{ height: '20px' }}></div>
          </div>
        </div>
      )}

      {/* ── HERO SECTION (replaces both old mobile + desktop heroes) ── */}
      <div className="w-full" style={{ paddingTop: 60 }}>
        <HeroSection />
      </div>

      {/* ── LISTINGS SECTION ── */}
      <ListingsSection />

      {/* IMPROVED Desktop Features Section - with icons and better hover */}
      <section id="features" className="hidden md:grid w-full max-w-6xl mx-auto grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0 mb-20 mt-16 z-10 desktop-features-grid">
        <FeatureCardDesktopImproved 
          icon={<Zap />}
          title="Find Verified Rooms Fast" 
          desc="Browse and book student rooms near your campus in seconds. Only verified listings." 
        />
        <div onClick={() => navigate('/chatbot')} className="cursor-pointer">
          <FeatureCardDesktopImproved 
            icon={<BiBot size={24} />}
            title="AI Chatbot Assistant" 
            desc="Get instant help finding boarding places and roommates. Just chat naturally 24/7." 
          />
        </div>
        <FeatureCardDesktopImproved 
          icon={<CreditCard />}
          title="Pay Rent Securely" 
          desc="No cash, no awkward transfers. Pay rent and deposits online with full security." 
        />
        <FeatureCardDesktopImproved 
          icon={<UsersIcon />}
          title="Roommate Matchmaking" 
          desc="Match with roommates who fit your lifestyle and preferences. No more random pairings." 
        />
        <FeatureCardDesktopImproved 
          icon={<FileText />}
          title="Digital Agreements" 
          desc="Sign rental agreements online. Track your booking status and documents easily." 
        />
        <FeatureCardDesktopImproved 
          icon={<Briefcase />}
          title="Owner Tools" 
          desc="List your property, manage tenants, and collect payments—all in one place." 
        />
      </section>

      {/* Desktop Contact Section - unchanged */}
      <section id="contact" className="hidden md:flex surface-glass border border-white/10 py-12 px-4 md:px-0 flex-col items-center rounded-3xl shadow-lift mb-12 w-full max-w-2xl backdrop-blur-xl original-contact-section">
        <h2 className="text-2xl xs:text-3xl font-bold text-white mb-4 drop-shadow-lg">Contact & Support</h2>
        <p className="text-zinc-200 mb-8 text-center max-w-xl text-base xs:text-lg drop-shadow">
          Have questions or need help? <br className="hidden md:block" />Reach out to our support team for assistance with your boarding experience.
        </p>
        <a href="mailto:support@boardingbookingsystem.com" className="cta-primary px-6 py-2 text-lg font-bold shadow-lift bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl text-white">Email Support</a>
      </section>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => navigate('/chatbot')}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce"
        style={{ animationDuration: '2s', animationIterationCount: '3' }}
        title="Open AI Chatbot"
      >
        <BiBot size={28} className="text-white" />
      </button>
    </div>
  );
}

// Improved Desktop Feature Card with icon
function FeatureCardDesktopImproved({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="desktop-feature-card">
      <div className="feature-icon">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

// Mobile Feature Card (unchanged)
function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}