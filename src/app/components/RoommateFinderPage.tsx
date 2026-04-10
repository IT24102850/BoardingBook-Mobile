import React, { useState } from "react";
import { FaHeart, FaRegTimesCircle, FaUndo, FaHistory, FaBookmark, FaUserFriends, FaMoneyBillWave, FaBed, FaBolt, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { BiCurrentLocation } from 'react-icons/bi';
import { RiUserSharedLine } from 'react-icons/ri';
import { Menu, X, Home, Search, Users, User, LogIn, Users as UsersIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const roommateProfiles = [
  {
    id: 1,
    name: "Ayesha",
    description: "Clean, quiet, loves to cook. Looking for female roommate.",
    budget: 12000,
    academicYear: "2nd Year",
    gender: "Female",
    preferences: "Early riser, non-smoker",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    roomType: "Single Room",
    billsIncluded: true,
    availableFrom: "2024-02-01",
    tags: ["Pet Friendly", "Vegetarian"]
  },
  {
    id: 2,
    name: "Nuwan",
    description: "Outgoing, enjoys music, prefers group study.",
    budget: 15000,
    academicYear: "3rd Year",
    gender: "Male",
    preferences: "Night owl, likes guests",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    roomType: "Shared Room",
    billsIncluded: false,
    availableFrom: "2024-01-15",
    tags: ["Group Study", "Music"]
  },
  {
    id: 3,
    name: "Sithara",
    description: "Pet friendly, vegetarian, likes quiet evenings.",
    budget: 11000,
    academicYear: "1st Year",
    gender: "Female",
    preferences: "No parties, early bedtime",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    roomType: "Single Room",
    billsIncluded: true,
    availableFrom: "2024-02-10",
    tags: ["Quiet", "Early Bedtime"]
  },
  {
    id: 4,
    name: "Kasun",
    description: "Sports lover, tidy, prefers shared room.",
    budget: 13000,
    academicYear: "4th Year",
    gender: "Male",
    preferences: "Likes group activities",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    roomType: "Shared Room",
    billsIncluded: false,
    availableFrom: "2024-01-20",
    tags: ["Sports", "Group Activities"]
  }
];

interface MiniProfileCardProps {
  profile: typeof roommateProfiles[number];
  type: 'passed' | 'liked';
}

function MiniProfileCard({ profile, type }: MiniProfileCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#181f36] to-[#0f172a] rounded-lg overflow-hidden border border-white/10 hover:shadow-cyan-500/10 transition-all mb-2">
      <div className="flex items-center gap-2 p-2">
        <img src={profile.image} alt={profile.name} className="w-12 h-12 rounded-lg object-cover border-2 border-cyan-400" />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white truncate">{profile.name}</h4>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <FaBed className="text-cyan-400" />
            <span>{profile.roomType}</span>
          </div>
          <div className="text-[10px] text-cyan-400 font-bold">Rs.{profile.budget}</div>
        </div>
        <div className={`ml-2 ${type === 'passed' ? 'bg-red-500/20' : 'bg-green-500/20'} rounded-full p-1`}>
          {type === 'passed' ? <FaRegTimesCircle className="text-red-400 text-xs" /> : <FaHeart className="text-green-400 text-xs" />}
        </div>
      </div>
    </div>
  );
}

interface SwipeCardProps {
  profile: typeof roommateProfiles[number];
  onSwipe: (dir: 'left' | 'right') => void;
  isAnimating: boolean;
  direction: 'left' | 'right' | null;
}

function SwipeCard({ profile, onSwipe, isAnimating, direction }: SwipeCardProps) {
  const [showFullBio, setShowFullBio] = React.useState(false);
  const shortBio = profile.description.length > 60 && !showFullBio
    ? profile.description.slice(0, 60) + '...'
    : profile.description;
  
  return (
    <div 
      className={`bg-white/10 rounded-xl p-6 border border-white/10 max-w-md mx-auto mb-8 shadow-lg flex flex-col items-center relative transition-all duration-300 ${
        direction === 'left' ? 'animate-swipe-left' : ''} ${
        direction === 'right' ? 'animate-swipe-right' : ''}`}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <img src={profile.image} alt={profile.name} className="w-24 h-24 rounded-full mb-4 border-2 border-cyan-400" />
      <h2 className="text-xl font-bold text-white mb-2">{profile.name}</h2>
      <div className="text-white mb-2 text-center">
        {shortBio}
        {profile.description.length > 60 && !showFullBio && (
          <button className="ml-1 text-cyan-300 underline text-xs" onClick={() => setShowFullBio(true)} type="button">Read more</button>
        )}
        {showFullBio && profile.description.length > 60 && (
          <button className="ml-1 text-cyan-300 underline text-xs" onClick={() => setShowFullBio(false)} type="button">Show less</button>
        )}
      </div>
      
      {/* Attribute Chips */}
      <div className="flex flex-wrap gap-2 mb-2 justify-center">
        <span className="bg-cyan-900/60 text-cyan-200 px-2 py-1 rounded-full text-xs font-semibold">Rs.{profile.budget} Budget</span>
        <span className="bg-cyan-900/60 text-cyan-200 px-2 py-1 rounded-full text-xs font-semibold">{profile.academicYear}</span>
        <span className="bg-cyan-900/60 text-cyan-200 px-2 py-1 rounded-full text-xs font-semibold">{profile.gender}</span>
        <span className="bg-cyan-900/60 text-cyan-200 px-2 py-1 rounded-full text-xs font-semibold">{profile.roomType}</span>
        {profile.billsIncluded && <span className="bg-green-900/60 text-green-300 px-2 py-1 rounded-full text-xs font-semibold">Bills Included</span>}
      </div>
      
      {/* Preferences as chips */}
      <div className="flex flex-wrap gap-2 mb-2 justify-center">
        {profile.preferences.split(',').map((pref, idx) => (
          <span key={idx} className="bg-white/10 px-2 py-1 rounded-full text-xs text-gray-300">{pref.trim()}</span>
        ))}
      </div>
      
      {/* Tags as chips */}
      <div className="flex flex-wrap gap-2 mb-2 justify-center">
        {profile.tags.map((tag, idx) => (
          <span key={idx} className="bg-purple-900/40 px-2 py-1 rounded-full text-xs text-purple-200">{tag}</span>
        ))}
      </div>
      
      {/* View Details Button */}
      <button className="mt-2 mb-1 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full text-xs font-semibold hover:shadow-lg transition-all" type="button">View Details</button>
      
      {/* Swipe Hint (only on mobile) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full md:hidden">
        ← Drag or tap buttons →
      </div>
    </div>
  );
}

function RoommateNavBar() {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    setMobileNavOpen(false);
    navigate(path);
  };
  
  return (
    <nav
      className="w-full fixed top-0 left-0 flex items-center justify-between h-14 md:h-16 px-6 md:px-24 bg-[#232b47] backdrop-blur-xl border-b-2 border-zinc-700/15 shadow-xl z-[10000] transition-all duration-300 navbar"
      style={{height: '64px',minHeight: '64px',borderBottomWidth: '2px',borderBottomColor: 'rgba(113,113,122,0.15)',borderImage: 'linear-gradient(to right, rgba(99,102,241,.18), rgba(34,211,238,.18)) 1',borderBottomStyle: 'solid'}}>
      {/* Logo */}
      <div className="flex items-center gap-1 md:gap-2 min-w-max h-full cursor-pointer" onClick={() => handleNav('/')}> 
        <span className="text-3xl font-extrabold tracking-tight text-zinc-100 drop-shadow-lg select-none flex items-center h-full navbar-logo">Boarding<span className="text-indigo-300">Book</span></span>
      </div>

      {/* Desktop Nav - perfectly centered, improved labels and CTAs */}
      <div className="desktop-nav hidden md:flex flex-1 justify-center">
        <div className="flex gap-8 items-center bg-zinc-800/60 px-8 py-2.5 rounded-full shadow border border-zinc-700/40">
          <button type="button" onClick={() => handleNav('/')} className={`text-zinc-200 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-zinc-700/30 transition nav-link${location.pathname==='/' ? ' nav-link-active' : ''}`}>Home</button>
          <button type="button" onClick={() => handleNav('/find')} className={`text-zinc-200 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-zinc-700/30 transition nav-link${location.pathname==='/find' ? ' nav-link-active' : ''}`}>Find Rooms</button>
          <button type="button" onClick={() => handleNav('/roommate-finder')} className={`text-zinc-200 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-zinc-700/30 transition nav-link${location.pathname==='/roommate-finder' ? ' nav-link-active' : ''}`}>Roommate Finder</button>
          <button type="button" onClick={() => handleNav('/chatbot')} className={`text-zinc-200 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-zinc-700/30 transition nav-link${location.pathname==='/chatbot' ? ' nav-link-active' : ''}`}>🤖 AI Chatbot</button>
          <button type="button" onClick={() => handleNav('/boarding-management')} className={`text-zinc-200 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-zinc-700/30 transition nav-link${location.pathname==='/boarding-management' ? ' nav-link-active' : ''}`}>List Your Property</button>
          <button type="button" onClick={() => handleNav('/find')} className="px-5 py-2.5 rounded-xl text-white font-bold text-base shadow-lg bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 hover:scale-105 transition-transform duration-200 border border-indigo-400 nav-link-cta">Find Rooms</button>
        </div>
      </div>

      {/* Desktop Profile */}
      <div className="desktop-profile hidden md:flex items-center min-w-max ml-6 profile-area">
        <span className="text-zinc-200 text-sm font-medium mr-2">Guest</span>
        <div className="profile-icon relative group flex items-center justify-center" tabIndex={0} title="Account">
          <User className="text-cyan-400" />
        </div>
      </div>

      {/* Hamburger Button - Mobile Only */}
      <div className="mobile-nav flex md:hidden">
        <button className="hamburger-btn" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
          {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileNavOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileNavOpen(false)}>
          <div className="mobile-menu-drawer" onClick={e => e.stopPropagation()}>
            {/* Mobile Menu Header - Sticky */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-user">
                <div className="mobile-menu-avatar">👤</div>
                <div className="mobile-menu-user-info">
                  <h4>Guest User</h4>
                  <p>Sign in to access your account</p>
                </div>
              </div>
            </div>
            {/* Mobile Menu Items - Navigation only */}
            <div className="mobile-menu-items">
              <button onClick={() => handleNav('/')} className="mobile-menu-item"><Home size={22} />Home</button>
              <button onClick={() => handleNav('/find')} className="mobile-menu-item"><Search size={22} />Find Rooms</button>
              <button onClick={() => handleNav('/roommate-finder')} className="mobile-menu-item"><Users size={22} />Roommate Finder</button>
              <button onClick={() => handleNav('/chatbot')} className="mobile-menu-item"><UsersIcon size={22} />AI Chatbot</button>
              <button onClick={() => handleNav('/boarding-management')} className="mobile-menu-item"><User size={22} />List Your Property</button>
              <div className="mobile-menu-divider"></div>
              <button onClick={() => handleNav('/signin')} className="mobile-menu-auth-button signin"><LogIn size={22} />Sign In</button>
              <button onClick={() => handleNav('/signup')} className="mobile-menu-auth-button signup"><User size={22} />Sign Up</button>
            </div>
            <div style={{ height: '20px' }}></div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function RoommateFinderPage() {
  const [index, setIndex] = useState<number>(0);
  const [liked, setLiked] = useState<typeof roommateProfiles>([]);
  const [passed, setPassed] = useState<typeof roommateProfiles>([]);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const filteredProfiles = roommateProfiles;

  const currentProfile = filteredProfiles[index];

  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentProfile) return;
    setIsAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      if (dir === "right") setLiked([...liked, currentProfile]);
      else setPassed([...passed, currentProfile]);
      setIndex(index + 1);
      setDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleUndo = () => {
    if (index > 0) {
      const lastPassed = passed[passed.length - 1];
      const lastLiked = liked[liked.length - 1];
      if (lastPassed && lastPassed.id === filteredProfiles[index - 1]?.id) setPassed(passed.slice(0, -1));
      else if (lastLiked && lastLiked.id === filteredProfiles[index - 1]?.id) setLiked(liked.slice(0, -1));
      setIndex(index - 1);
    }
  };

  // Mobile view - properly arranged filters
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
        <RoommateNavBar />
        <div className="flex-1 w-full px-4 pt-24 md:pt-28 pb-6">
          {/* Header */}
          {/* Removed Roommate Finder heading as requested */}

          {/* Tip */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaInfoCircle className="text-cyan-400 flex-shrink-0" />
            <span className="text-xs text-cyan-200 bg-cyan-900/60 px-3 py-1.5 rounded-full text-center">
              Drag cards left/right to pass or like • Click buttons to act
            </span>
          </div>

          {/* Main Card */}
          <div className="relative h-[500px] mb-4 perspective-1000 max-w-md mx-auto">
            {index < filteredProfiles.length - 1 && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#181f36] to-[#0f172a] rounded-3xl border border-white/10 shadow-xl transform translate-y-2 translate-x-1 scale-[0.98] opacity-30" />
            )}
            {currentProfile && (
              <SwipeCard 
                profile={currentProfile} 
                onSwipe={handleSwipe} 
                isAnimating={isAnimating} 
                direction={direction} 
              />
            )}
          </div>

          {/* Results Count & Undo */}
          <div className="flex justify-between items-center mb-4 max-w-md mx-auto">
            <span className="text-sm text-gray-400">
              {filteredProfiles.length - index} profiles remaining
            </span>
            <button 
              onClick={handleUndo} 
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1" 
              type="button"
            >
              <FaUndo /> Undo
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => handleSwipe("left")}
              disabled={isAnimating}
              className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              title="Not interested (swipe left)"
              type="button"
            >
              <FaRegTimesCircle />
            </button>
            <button
              onClick={() => handleSwipe("right")}
              disabled={isAnimating}
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              title="Like this roommate (swipe right)"
              type="button"
            >
              <FaHeart />
            </button>
          </div>

          {/* Action Labels */}
          <div className="flex justify-between px-8 mt-2 text-xs text-gray-500 max-w-md mx-auto">
            <span>Pass • Swipe Left</span>
            <span>Like • Swipe Right</span>
          </div>

        </div>

        {/* Global Animations */}
        <style>{`
          @keyframes swipe-left {
            0% { transform: translateX(0) rotate(0); opacity: 1; }
            100% { transform: translateX(-300px) rotate(-15deg); opacity: 0; }
          }
          @keyframes swipe-right {
            0% { transform: translateX(0) rotate(0); opacity: 1; }
            100% { transform: translateX(300px) rotate(15deg); opacity: 0; }
          }
          .animate-swipe-left { animation: swipe-left 0.3s ease-out forwards; }
          .animate-swipe-right { animation: swipe-right 0.3s ease-out forwards; }
          .perspective-1000 { perspective: 1000px; }
        `}</style>
      </div>
    );
  }

  // Desktop view - keep exactly as original
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      <RoommateNavBar />
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-6 md:pb-8">
        {/* Header */}
        {/* Removed Roommate Finder heading as requested */}
        
        {/* Tip */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <FaInfoCircle className="text-cyan-400" />
          <span className="text-xs text-cyan-200 bg-cyan-900/60 px-3 py-1.5 rounded-full">Drag cards left/right to pass or like • Click buttons to act</span>
        </div>
        
        {/* Main Content - Three Column Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {/* Left Column - Passed Profiles */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <FaHistory className="text-red-400" />
              <h3 className="text-sm font-bold text-white">Passed</h3>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full ml-auto">{passed.length}</span>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {passed.length > 0 ? (
                passed.map(profile => <MiniProfileCard key={profile.id} profile={profile} type="passed" />)
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-500">No passed profiles yet</p>
                  <p className="text-[10px] text-gray-600 mt-1">Swipe left to pass</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Center Column - Main Swipe Card */}
          <div>
            <div className="relative h-[500px] mb-4 perspective-1000">
              {index < filteredProfiles.length - 1 && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#181f36] to-[#0f172a] rounded-3xl border border-white/10 shadow-xl transform translate-y-2 translate-x-1 scale-[0.98] opacity-30" />
              )}
              {currentProfile && (
                <SwipeCard 
                  profile={currentProfile} 
                  onSwipe={handleSwipe} 
                  isAnimating={isAnimating} 
                  direction={direction} 
                />
              )}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-400">{filteredProfiles.length - index} profiles remaining</span>
              <button onClick={handleUndo} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1" type="button">
                <FaUndo /> Undo
              </button>
            </div>
            
            <div className="flex justify-center gap-4 mt-4">
              <button 
                onClick={() => handleSwipe("left")}
                disabled={isAnimating}
                className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                title="Not interested (swipe left)"
                type="button"
              >
                <FaRegTimesCircle />
              </button>
              <button 
                onClick={() => handleSwipe("right")}
                disabled={isAnimating}
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                title="Like this roommate (swipe right)"
                type="button"
              >
                <FaHeart />
              </button>
            </div>
            
            <div className="flex justify-between px-8 mt-2 text-xs text-gray-500">
              <span>Pass • Swipe Left</span>
              <span>Like • Swipe Right</span>
            </div>
          </div>
          
          {/* Right Column - Liked Profiles */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <FaBookmark className="text-green-400" />
              <h3 className="text-sm font-bold text-white">Favorites</h3>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full ml-auto">{liked.length}</span>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {liked.length > 0 ? (
                liked.map(profile => <MiniProfileCard key={profile.id} profile={profile} type="liked" />)
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-500">No favorites yet</p>
                  <p className="text-[10px] text-gray-600 mt-1">Swipe right to like</p>
                </div>
              )}
            </div>
            {liked.length > 0 && (
              <button className="w-full mt-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all" type="button">
                View All Favorites
              </button>
            )}
          </div>
        </div>
        
        {/* Global Animations */}
        <style>{`
          @keyframes swipe-left {
            0% { transform: translateX(0) rotate(0); opacity: 1; }
            100% { transform: translateX(-300px) rotate(-15deg); opacity: 0; }
          }
          @keyframes swipe-right {
            0% { transform: translateX(0) rotate(0); opacity: 1; }
            100% { transform: translateX(300px) rotate(15deg); opacity: 0; }
          }
          .animate-swipe-left { animation: swipe-left 0.3s ease-out forwards; }
          .animate-swipe-right { animation: swipe-right 0.3s ease-out forwards; }
          .perspective-1000 { perspective: 1000px; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.3); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.5); }
        `}</style>
      </div>
    </div>
  );
}