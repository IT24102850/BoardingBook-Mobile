import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { 
  FaUserCheck, FaUsers, FaShieldAlt, FaRegSmile, 
  FaCamera, FaChevronLeft, FaChevronRight, FaCheckCircle,
  FaMoneyBillWave, FaMapMarkerAlt, FaUser, FaGraduationCap,
  FaHome, FaRegCommentDots, FaArrowLeft, FaBars,
  FaQuestionCircle, FaSignOutAlt, FaBell, FaSearch, FaTimes,
  FaInfoCircle, FaTrash, FaEdit, FaEye, FaLock,
  FaCrosshairs, FaLocationArrow, FaMapPin, FaSearchLocation,
  FaWalking, FaBicycle, FaBus, FaCar, FaMotorcycle
} from 'react-icons/fa';
import { MdDashboard, MdSettings, MdHelp, MdDragHandle, MdMyLocation, MdOutlineLocationOn } from 'react-icons/md';
import { BiCurrentLocation } from 'react-icons/bi';
import './ProfileSetupAnimations.css';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

const academicYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const genders = ['Male', 'Female', 'Other'];
// Roommate preference options (expanded)
const roommatePrefs = [
  'Same Gender',
  'Any Gender',
  'Find a Boarding (Bodim)',
  'Find a Compatible Roommate',
];

type RoomType = { label: string; icon: string };
const roomTypes: RoomType[] = [
  { label: 'Single Room', icon: 'bed' },
  { label: 'Shared Room', icon: 'group' },
  { label: 'Studio/Annex', icon: 'home' },
  { label: 'Any', icon: 'any' },
];

type LifestyleOption = { key: string; label: string; icon: string };
const lifestyleOptions: LifestyleOption[] = [
  { key: 'smoking', label: 'Non-Smoker', icon: '🚭' },
  { key: 'drinking', label: 'Non-Drinker', icon: '🚱' },
  { key: 'vegetarian', label: 'Vegetarian', icon: '🥦' },
  { key: 'earlyBird', label: 'Early Bird', icon: '🌅' },
  { key: 'nightOwl', label: 'Night Owl', icon: '🌙' },
  { key: 'studyFocus', label: 'Study Focused', icon: '📚' },
  { key: 'petFriendly', label: 'Pet Friendly', icon: '🐾' },
  { key: 'musicLover', label: 'Music Lover', icon: '🎵' },
  { key: 'quiet', label: 'Quiet', icon: '🤫' },
  { key: 'social', label: 'Social', icon: '🗣️' },
];

// Step configuration with icons and colors
const steps = [
  { id: 1, icon: FaCamera, title: 'Photo', color: 'from-cyan-400 to-cyan-500', path: '/profile/photo' },
  { id: 2, icon: FaRegCommentDots, title: 'Bio', color: 'from-purple-400 to-purple-500', path: '/profile/bio' },
  { id: 3, icon: FaMoneyBillWave, title: 'Budget', color: 'from-indigo-400 to-indigo-500', path: '/profile/budget' },
  { id: 4, icon: FaUser, title: 'Details', color: 'from-pink-400 to-pink-500', path: '/profile/details' },
  { id: 5, icon: FaHome, title: 'Roommate', color: 'from-orange-400 to-orange-500', path: '/profile/roommate' },
];

// Location data for popular areas around SLIIT
const popularLocations = [
  { name: 'Malabe', distance: 0.5, icon: 'pin', color: 'cyan' },
  { name: 'Kaduwela', distance: 3.2, icon: 'pin', color: 'purple' },
  { name: 'Battaramulla', distance: 4.5, icon: 'pin', color: 'pink' },
  { name: 'Kotte', distance: 5.8, icon: 'pin', color: 'orange' },
  { name: 'Rajagiriya', distance: 7.2, icon: 'pin', color: 'green' },
  { name: 'Nugegoda', distance: 8.5, icon: 'pin', color: 'blue' },
];

// Interactive Map Component with location pins
const SLIITLocationMap = ({ 
  radius, 
  setRadius, 
  selectedLocation,
  setSelectedLocation 
}: { 
  radius: number; 
  setRadius: (r: number) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  
  // Draw map with pins
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background (map style)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines (streets/roads)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 0.5;
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    // Draw major roads (highlighted)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    
    // Main road horizontally
    ctx.beginPath();
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.stroke();
    
    // Main road vertically
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.stroke();
    
    // Draw SLIIT campus (center pin)
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(width/2, height/2, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw inner white dot
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(width/2, height/2, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw SLIIT label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.fillText('SLIIT', width/2 - 25, height/2 - 25);
    ctx.shadowBlur = 0;
    
    // Draw radius circle
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(width/2, height/2, radius * 15, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw radius handle (draggable)
    ctx.setLineDash([]);
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(width/2 + radius * 15, height/2, 10, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(width/2 + radius * 15, height/2, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw location pins for popular areas
    popularLocations.forEach((loc, index) => {
      // Calculate pin position based on distance and angle
      const angle = (index * 60) * Math.PI / 180; // Spread pins around
      const distance_from_center = loc.distance * 8;
      const pinX = width/2 + Math.cos(angle) * distance_from_center;
      const pinY = height/2 + Math.sin(angle) * distance_from_center;
      
      // Skip if outside canvas
      if (pinX < 20 || pinX > width - 20 || pinY < 20 || pinY > height - 20) return;
      
      // Draw pin
      const isHovered = hoveredPin === loc.name;
      const isSelected = selectedLocation === loc.name;
      
      // Pin shadow
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 8;
      
      // Pin color based on selection/hover
      if (isSelected) {
        ctx.fillStyle = '#f97316';
      } else if (isHovered) {
        ctx.fillStyle = '#f59e0b';
      } else {
        ctx.fillStyle = '#94a3b8';
      }
      
      // Draw pin
      ctx.beginPath();
      ctx.arc(pinX, pinY, isHovered || isSelected ? 8 : 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw inner dot
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(pinX, pinY, isHovered || isSelected ? 4 : 3, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw label if hovered or selected
      if (isHovered || isSelected) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText(loc.name, pinX - 20, pinY - 15);
        ctx.fillText(`${loc.distance}km`, pinX - 15, pinY + 25);
        ctx.shadowBlur = 0;
      }
    });
    
    // Draw distance markers
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Arial';
    ctx.fillText('1km', width/2 + 20, height/2 - 30);
    ctx.fillText('2km', width/2 + 40, height/2 - 50);
    ctx.fillText('3km', width/2 + 60, height/2 - 70);
    
  }, [radius, hoveredPin, selectedLocation]);
  
  // Handle mouse move to detect pin hover
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;
    
    // Check each pin for hover
    let pinHovered = false;
    popularLocations.forEach((loc, index) => {
      const angle = (index * 60) * Math.PI / 180;
      const distance_from_center = loc.distance * 8;
      const pinX = width/2 + Math.cos(angle) * distance_from_center;
      const pinY = height/2 + Math.sin(angle) * distance_from_center;
      
      const distance = Math.sqrt(Math.pow(mouseX - pinX, 2) + Math.pow(mouseY - pinY, 2));
      if (distance < 15) {
        setHoveredPin(loc.name);
        pinHovered = true;
      }
    });
    
    if (!pinHovered) {
      setHoveredPin(null);
    }
  };
  
  // Handle pin click
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;
    
    // Check each pin for click
    popularLocations.forEach((loc, index) => {
      const angle = (index * 60) * Math.PI / 180;
      const distance_from_center = loc.distance * 8;
      const pinX = width/2 + Math.cos(angle) * distance_from_center;
      const pinY = height/2 + Math.sin(angle) * distance_from_center;
      
      const distance = Math.sqrt(Math.pow(mouseX - pinX, 2) + Math.pow(mouseY - pinY, 2));
      if (distance < 15) {
        setSelectedLocation(loc.name);
        setRadius(loc.distance);
      }
    });
  };
  
  // Handle radius drag
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    // Check if click is near the radius handle
    const handleX = rect.width/2 + radius * 15;
    const handleY = rect.height/2;
    const distance = Math.sqrt(Math.pow(startX - handleX, 2) + Math.pow(startY - handleY, 2));
    
    if (distance < 20) {
      setIsDragging(true);
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const currentX = moveEvent.clientX - rect.left;
        const deltaX = currentX - (rect.width/2);
        const newRadius = Math.max(0.5, Math.min(10, deltaX / 15));
        setRadius(Number(newRadius.toFixed(1)));
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  return (
    <div className="relative w-full rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-lg">
      <canvas
        ref={canvasRef}
        width={500}
        height={350}
        className="w-full h-auto cursor-ew-resize"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
      />
      
      {/* Map Controls */}
      <div className="absolute top-3 left-3 flex gap-2">
        <button className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-black/80 transition-colors">
          <BiCurrentLocation className="text-cyan-400" />
          <span>My Location</span>
        </button>
        <button className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-black/80 transition-colors">
          <FaSearchLocation className="text-purple-400" />
          <span>Search</span>
        </button>
      </div>
      
      {/* Radius Display */}
      <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
        <span className="text-xs opacity-80">Radius</span>
        <div className="text-xl font-bold">{radius} km</div>
      </div>
      
      {/* Drag Instruction */}
      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-2">
        <MdDragHandle className="text-cyan-400 text-lg" />
        <span>Drag blue dot to adjust radius • Click pins to select area</span>
      </div>
    </div>
  );
};

// Price Range Slider Component with LKR
const PriceRangeSlider = ({ minPrice, maxPrice, setMinPrice, setMaxPrice }: {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (v: number) => void;
  setMaxPrice: (v: number) => void;
}) => {
  const min = 5000;
  const max = 200000;
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const handleMinDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const slider = sliderRef.current;
    if (!slider) return;
    
    const rect = slider.getBoundingClientRect();
    const startX = e.clientX;
    const startMin = minPrice;
    
    const handleMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / rect.width) * (max - min);
      let newMin = Math.min(
        Math.max(min, startMin + deltaPercent),
        maxPrice - 5000
      );
      newMin = Math.round(newMin / 1000) * 1000;
      setMinPrice(newMin);
    };
    
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };
  
  const handleMaxDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const slider = sliderRef.current;
    if (!slider) return;
    
    const rect = slider.getBoundingClientRect();
    const startX = e.clientX;
    const startMax = maxPrice;
    
    const handleMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / rect.width) * (max - min);
      let newMax = Math.min(
        max,
        Math.max(minPrice + 5000, startMax + deltaPercent)
      );
      newMax = Math.round(newMax / 1000) * 1000;
      setMaxPrice(newMax);
    };
    
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };
  
  const minPercent = ((minPrice - min) / (max - min)) * 100;
  const maxPercent = ((maxPrice - min) / (max - min)) * 100;
  
  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `Rs. ${(price/100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `Rs. ${(price/1000).toFixed(0)}k`;
    }
    return `Rs. ${price}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-cyan-900/20 to-purple-900/20 p-4 rounded-xl border border-white/10">
        <div className="text-center">
          <span className="text-xs text-cyan-300">MIN</span>
          <div className="text-2xl font-bold text-white">Rs. {(minPrice/1000).toFixed(0)}k</div>
          <span className="text-xs text-gray-400">Rs. {(minPrice/1000).toFixed(0)}k</span>
        </div>
        <div className="text-cyan-400 font-bold text-2xl">—</div>
        <div className="text-center">
          <span className="text-xs text-purple-300">MAX</span>
          <div className="text-2xl font-bold text-white">Rs. {(maxPrice/1000).toFixed(0)}k</div>
          <span className="text-xs text-gray-400">Rs. {(maxPrice/1000).toFixed(0)}k</span>
        </div>
      </div>
      
      <div 
        ref={sliderRef}
        className="relative h-2 bg-gray-700 rounded-full mx-2"
      >
        <div
          className="absolute h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        
        <div
          ref={minThumbRef}
          className="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 bg-white rounded-full shadow-lg cursor-ew-resize border-2 border-cyan-400 hover:scale-110 transition-transform group"
          style={{ left: `${minPercent}%` }}
          onMouseDown={handleMinDrag}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-cyan-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Rs. {(minPrice/1000).toFixed(0)}k
          </div>
        </div>
        
        <div
          ref={maxThumbRef}
          className="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 bg-white rounded-full shadow-lg cursor-ew-resize border-2 border-purple-400 hover:scale-110 transition-transform group"
          style={{ left: `${maxPercent}%` }}
          onMouseDown={handleMaxDrag}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-purple-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Rs. {(maxPrice/1000).toFixed(0)}k
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-400 px-2">
        <span>Rs. 5k</span>
        <span>Rs. 50k</span>
        <span>Rs. 100k</span>
        <span>Rs. 150k</span>
        <span>Rs. 200k+</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mt-4">
        {[
          { label: 'Budget', min: 5000, max: 30000, icon: '' },
          { label: 'Standard', min: 30000, max: 60000, icon: '' },
          { label: 'Premium', min: 60000, max: 100000, icon: '' },
          { label: 'Luxury', min: 100000, max: 150000, icon: '' },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setMinPrice(preset.min);
              setMaxPrice(preset.max);
            }}
            className={`
              flex flex-col items-center p-2 rounded-lg text-xs transition-all
              ${minPrice === preset.min && maxPrice === preset.max
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }
            `}
          >
            <span className="text-lg mb-1">{preset.icon}</span>
            <span>{preset.label}</span>
            <span className="text-[10px] opacity-80">
              {formatPrice(preset.min)} - {formatPrice(preset.max)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Simplified Navigation Bar
const NavigationBar = ({ isMobileMenuOpen, setIsMobileMenuOpen, isOnboardingComplete }: { 
  isMobileMenuOpen: boolean; 
  setIsMobileMenuOpen: (open: boolean) => void;
  isOnboardingComplete: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem('bb_access_token');
    localStorage.removeItem('bb_current_user');
    navigate('/signin');
  };

  return (
    <>
      <nav className="hidden md:flex items-center justify-between bg-white/50 backdrop-blur-xl rounded-xl px-3 py-1.5 mb-3 border border-white/10">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-gray-100/50 rounded-lg transition-colors"
            title="Go back"
          >
            <FaArrowLeft className="text-gray-500 text-sm" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="p-1.5 hover:bg-gray-100/50 rounded-lg transition-colors"
            title="Home"
          >
            <FaHome className="text-gray-500 text-sm" />
          </button>
        </div>

        {!isOnboardingComplete && (
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-50 rounded-full">
            <FaInfoCircle className="text-cyan-500 text-xs" />
            <span className="text-xs text-cyan-700 font-medium">Complete your profile to unlock all features</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          {[
            { icon: MdDashboard, label: 'Dashboard', path: '/dashboard' },
            { icon: FaSearch, label: 'Find', path: '/find' },
            { icon: FaBell, label: 'Notifications', path: '/notifications', badge: 3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => isOnboardingComplete ? navigate(item.path) : null}
                className={`
                  relative flex items-center gap-1 px-2 py-1 rounded-lg transition-all text-xs
                  ${isOnboardingComplete 
                    ? isActive 
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-sm' 
                      : 'hover:bg-gray-100/50 text-gray-500'
                    : 'opacity-40 cursor-not-allowed text-gray-400'
                  }
                `}
                disabled={!isOnboardingComplete}
                title={!isOnboardingComplete ? 'Complete onboarding first' : item.label}
              >
                <Icon className="text-sm" />
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge && isOnboardingComplete && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => isOnboardingComplete ? navigate('/profile') : null}
          className={`w-7 h-7 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 p-[2px] ${!isOnboardingComplete && 'opacity-40 cursor-not-allowed'}`}
          disabled={!isOnboardingComplete}
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <FaUser className="text-cyan-500 text-xs" />
          </div>
        </button>
        <button
          onClick={handleLogout}
          className="ml-1 p-1.5 rounded-lg bg-red-500/15 border border-red-400/30 text-red-600 hover:bg-red-500/25 transition-colors"
          title="Logout"
        >
          <FaSignOutAlt className="text-sm" />
        </button>
      </nav>

      <div className="md:hidden w-full mb-2">
        <div className="flex items-center justify-between bg-white/50 backdrop-blur-xl rounded-xl p-1.5 border border-white/10">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 hover:bg-gray-100/50 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-gray-500 text-sm" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="p-1.5 hover:bg-gray-100/50 rounded-lg transition-colors"
            >
              <FaHome className="text-gray-500 text-sm" />
            </button>
          </div>

          <span className="text-xs font-semibold text-cyan-600">Profile Setup</span>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 hover:bg-gray-100/50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <FaTimes className="text-gray-500 text-sm" /> : <FaBars className="text-gray-500 text-sm" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute left-2 right-2 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-2 z-50">
            {[
              { icon: MdDashboard, label: 'Dashboard', path: '/dashboard' },
              { icon: FaSearch, label: 'Find', path: '/find' },
              { icon: FaBell, label: 'Notifications', path: '/notifications', badge: 3 },
              { icon: MdSettings, label: 'Settings', path: '/settings' },
              { icon: MdHelp, label: 'Help', path: '/help' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    if (isOnboardingComplete) {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs
                    ${isOnboardingComplete 
                      ? isActive 
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                        : 'hover:bg-gray-100 text-gray-700'
                      : 'opacity-40 cursor-not-allowed text-gray-400'
                    }
                  `}
                  disabled={!isOnboardingComplete}
                >
                  <Icon className="text-sm" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && isOnboardingComplete && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {!isOnboardingComplete && (
                    <FaLock className="ml-auto text-gray-400 text-[10px]" />
                  )}
                </button>
              );
            })}
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs hover:bg-red-50 text-red-600"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [bio, setBio] = useState('');
  const [fullName, setFullName] = useState('');
  const [minBudget, setMinBudget] = useState(15000);
  const [maxBudget, setMaxBudget] = useState(50000);
  const [distance, setDistance] = useState(3);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [year, setYear] = useState('');
  const [roommate, setRoommate] = useState('');
  const [roomType, setRoomType] = useState<string>('');
  const [lifestylePrefs, setLifestylePrefs] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSkipOption, setShowSkipOption] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const totalSteps = 5;

  const isOnboardingComplete = Boolean(
    photo && 
    bio && 
    minBudget && 
    maxBudget && 
    distance && 
    gender && 
    Number(age) > 0 &&
    year && 
    roommate
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    try {
      const currentRaw = localStorage.getItem('bb_current_user');
      if (!currentRaw) return;
      const currentUser = JSON.parse(currentRaw);
      if (typeof currentUser?.fullName === 'string') {
        setFullName(currentUser.fullName);
      }
      if (currentUser?.age !== undefined && currentUser?.age !== null) {
        const parsedAge = Number(currentUser.age);
        if (Number.isFinite(parsedAge) && parsedAge > 0) {
          setAge(String(parsedAge));
        }
      }
    } catch {
      // Ignore parse errors for local cache
    }
  }, []);

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => setShowSkipOption(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowSkipOption(false);
    }
  }, [step]);

  const validatePhoto = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
      setPhotoError('Please upload JPG or PNG format');
      return false;
    }
    
    if (file.size > maxSize) {
      setPhotoError('Image size should be less than 5MB');
      return false;
    }
    
    setPhotoError('');
    return true;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validatePhoto(file)) {
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onload = ev => setPhoto(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoFile(null);
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  };

  const handleSkipPhoto = () => {
    setStep(2);
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < step) {
      setStep(stepId);
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return bio.trim().length > 0;
      case 3:
        return Boolean(minBudget && maxBudget && distance);
      case 4:
        return Boolean(gender && year && Number(age) >= 16 && Number(age) <= 60);
      case 5:
        return Boolean(roommate);
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('bb_access_token');

      if (!token) {
        setError('Your session has expired. Please sign in again.');
        setSubmitting(false);
        navigate('/signin');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          profilePicture: photo || '',
          bio: bio.trim(),
          minBudget,
          maxBudget,
          distance,
          selectedLocation: selectedLocation || '',
          gender,
          age: Number(age) || 0,
          academicYear: year,
          roommatePreference: roommate,
          roomType,
          lifestylePrefs,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not save profile');
      }

      const currentRaw = localStorage.getItem('bb_current_user');
      if (currentRaw) {
        try {
          const currentUser = JSON.parse(currentRaw);
          localStorage.setItem(
            'bb_current_user',
            JSON.stringify({
              ...currentUser,
              fullName: fullName.trim() || currentUser.fullName,
              profileCompleted: Boolean(result?.data?.profileCompleted),
            })
          );
        } catch {
          // Ignore local cache parse issues and continue.
        }
      }

      setSubmitting(false);
      setSuccess('Profile completed! You can now access all features');
      setTimeout(() => navigate('/find'), 2000);
    } catch (submitError) {
      setSubmitting(false);
      setError(submitError instanceof Error ? submitError.message : 'Failed to save profile');
    }
  };

  const getStepStatus = (stepNum: number) => {
    if (stepNum < step) return 'completed';
    if (stepNum === step) return 'current';
    return 'upcoming';
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `Rs. ${(price/100000).toFixed(1)}L`;
    }
    return `Rs. ${(price/1000).toFixed(0)}k`;
  };

  // Get transport icon based on distance
  const getTransportIcon = (dist: number) => {
    if (dist <= 1) return <FaWalking className="text-green-400" />;
    if (dist <= 2) return <FaBicycle className="text-blue-400" />;
    if (dist <= 3) return <FaMotorcycle className="text-yellow-400" />;
    if (dist <= 5) return <FaBus className="text-orange-400" />;
    return <FaCar className="text-red-400" />;
  };



  

  // Get transport text based on distance
  const getTransportText = (dist: number) => {
    if (dist <= 1) return 'Walking distance';
    if (dist <= 2) return 'Bike friendly';
    if (dist <= 3) return 'Short commute (tuk-tuk)';
    if (dist <= 5) return 'Bus ride';
    return 'Need vehicle';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a1124] via-[#1a1f35] to-[#0f172a] overflow-auto py-2 px-1 md:py-4 md:px-4 flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-[220px] h-[220px] bg-cyan-400/20 rounded-full blur-[80px] md:w-[320px] md:h-[320px] md:blur-[100px]" />
        <div className="absolute bottom-[-100px] right-[-60px] w-[160px] h-[160px] bg-purple-400/20 rounded-full blur-[60px] md:w-[260px] md:h-[260px] md:blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col">
        <NavigationBar 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isOnboardingComplete={isOnboardingComplete}
        />

        <div className="bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 md:p-6 w-full max-w-full md:max-w-2xl mx-auto">
          <div className="text-center mb-3">
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
            <p className="text-xs md:text-sm text-cyan-200/80 mt-1">
              Join thousands of students finding their perfect roommates
            </p>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs md:text-sm font-semibold text-cyan-300">
                Step {step} of {totalSteps}
              </span>
              <span className="text-xs md:text-sm text-cyan-400">
                {Math.round((step / totalSteps) * 100)}% complete
              </span>
            </div>
            
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 transition-all duration-500 rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-between mb-4">
            {steps.map((s) => {
              const status = getStepStatus(s.id);
              const Icon = s.icon;
              const isCurrent = status === 'current';
              const isCompleted = status === 'completed';
              
              return (
                <div key={s.id} className="flex flex-col items-center flex-1">
                  <button
                    type="button"
                    onClick={() => handleStepClick(s.id)}
                    disabled={s.id > step}
                    className={`
                      w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center
                      transition-all duration-300 cursor-pointer shadow-sm
                      ${s.id > step ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                      ${isCompleted ? `bg-gradient-to-r ${s.color} text-white` : ''}
                      ${isCurrent ? 'bg-white border-2 border-cyan-400 text-cyan-500' : ''}
                      ${status === 'upcoming' && s.id > step ? 'bg-gray-700 text-gray-400' : ''}
                    `}
                    title={s.id > step ? 'Complete previous steps first' : s.title}
                  >
                    {isCompleted ? <FaCheckCircle className="text-white text-sm" /> : <Icon className="text-base md:text-lg" />}
                  </button>
                  <span className={`
                    text-xs mt-1 font-medium
                    ${isCompleted ? 'text-cyan-300' : ''}
                    ${isCurrent ? 'text-cyan-400' : ''}
                    ${status === 'upcoming' ? 'text-gray-500' : ''}
                  `}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <SwitchTransition mode="out-in">
              <CSSTransition key={step} timeout={300} classNames="step-fade">
                <div className="min-h-[200px] md:min-h-[240px]">
                  {step === 1 && (
                    <div className="flex flex-col items-center justify-center py-2">
                      <div 
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden border-3 border-white/30 shadow-lg cursor-pointer hover:scale-105 transition-transform relative group"
                        onClick={() => fileInput.current?.click()}
                      >
                        {photo ? (
                          <>
                            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <FaEdit className="text-white text-lg" />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-cyan-300">
                            <FaCamera className="text-3xl md:text-4xl mb-1" />
                            <span className="text-xs">Upload</span>
                          </div>
                        )}
                      </div>
                      
                      {photo && (
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => fileInput.current?.click()}
                            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <FaEdit size={12} />
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                          >
                            <FaTrash size={12} />
                            Remove
                          </button>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        accept="image/jpeg,image/jpg,image/png" 
                        ref={fileInput} 
                        className="hidden" 
                        onChange={handlePhotoChange} 
                      />
                      
                      {photoError && (
                        <p className="text-red-400 text-xs mt-2">{photoError}</p>
                      )}
                      
                      <div className="mt-3 text-center max-w-xs">
                        <p className="text-xs text-cyan-300/70">
                          <FaInfoCircle className="inline mr-1 text-cyan-400" />
                          JPG/PNG, max 5MB. Clear face recommended.
                        </p>
                        <p className="text-xs text-cyan-300/50 mt-1">
                          <FaLock className="inline mr-1 text-cyan-400/60" />
                          Only visible to potential roommates. You control who sees your profile.
                        </p>
                        <p className="text-xs text-purple-300/70 mt-2 font-medium">
                          ✨ Profiles with photos get 3× more matches!
                        </p>
                      </div>

                      {showSkipOption && !photo && (
                        <button
                          type="button"
                          onClick={handleSkipPhoto}
                          className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 underline"
                        >
                          Skip for now (you can add photo later)
                        </button>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-cyan-200">Bio</label>
                      <textarea
                        className="w-full rounded-lg border border-cyan-500/30 bg-[#0a1124] text-cyan-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none min-h-[100px]"
                        maxLength={180}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="Tell us about yourself... (e.g., major, hobbies, lifestyle)"
                        required
                      />
                      <div className="flex justify-end">
                        <span className={`text-xs ${bio.length >= 180 ? 'text-red-400' : 'text-cyan-300/60'}`}>
                          {bio.length}/180
                        </span>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <FaMoneyBillWave className="text-green-400 text-lg" />
                          <h4 className="text-sm font-medium text-cyan-200">Monthly Budget (LKR)</h4>
                        </div>
                        
                        <PriceRangeSlider
                          minPrice={minBudget}
                          maxPrice={maxBudget}
                          setMinPrice={setMinBudget}
                          setMaxPrice={setMaxBudget}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-purple-400 text-lg" />
                            <h4 className="text-sm font-medium text-cyan-200">Distance from SLIIT</h4>
                          </div>
                          <div className="bg-purple-900/30 px-3 py-1 rounded-full flex items-center gap-1">
                            {getTransportIcon(distance)}
                            <span className="text-sm font-bold text-purple-300">{distance} km</span>
                          </div>
                        </div>
                        
                        <SLIITLocationMap 
                          radius={distance} 
                          setRadius={setDistance}
                          selectedLocation={selectedLocation}
                          setSelectedLocation={setSelectedLocation}
                        />
                        
                        {/* Popular Areas Grid */}
                        <div className="mt-3">
                          <h5 className="text-xs font-medium text-cyan-300 mb-2">Popular Areas</h5>
                          <div className="grid grid-cols-3 gap-2">
                            {popularLocations.slice(0, 6).map((loc) => (
                              <button
                                key={loc.name}
                                type="button"
                                onClick={() => {
                                  setSelectedLocation(loc.name);
                                  setDistance(loc.distance);
                                }}
                                className={`
                                  flex items-center gap-1 p-2 rounded-lg text-xs transition-all
                                  ${selectedLocation === loc.name
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                                  }
                                `}
                              >
                                <span>{loc.icon}</span>
                                <span className="font-medium">{loc.name}</span>
                                <span className="ml-auto text-[10px] opacity-70">{loc.distance}km</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Transport Info */}
                        <div className="flex items-center gap-2 text-xs bg-gray-800/50 p-3 rounded-lg">
                          {getTransportIcon(distance)}
                          <span className="text-gray-300">
                            {getTransportText(distance)} from SLIIT
                          </span>
                          {selectedLocation && (
                            <>
                              <span className="text-gray-500">•</span>
                              <span className="text-purple-400">{selectedLocation}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 p-4 rounded-xl border border-white/10">
                        <h5 className="text-xs font-medium text-cyan-300 mb-2">Your Selection</h5>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-400">Price Range</div>
                            <div className="text-lg font-bold text-white">
                              {formatPrice(minBudget)} — {formatPrice(maxBudget)}
                            </div>
                          </div>
                          <div className="w-px h-8 bg-gray-600" />
                          <div>
                            <div className="text-xs text-gray-400">Area</div>
                            <div className="text-lg font-bold text-white flex items-center gap-1">
                              <FaMapPin className="text-purple-400 text-sm" />
                              {selectedLocation || `${distance}km radius`}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
                          <FaCheckCircle />
                          <span>{Math.floor(Math.random() * 50 + 20)} rooms match your criteria</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-1">
                          <FaUser className="inline mr-1 text-cyan-400 text-sm" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border border-cyan-500/30 bg-[#0a1124] text-cyan-100 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-1">
                          <FaUser className="inline mr-1 text-pink-400 text-sm" />
                          Gender
                        </label>
                        <select
                          className="w-full rounded-lg border border-cyan-500/30 bg-[#0a1124] text-cyan-100 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          value={gender}
                          onChange={e => setGender(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select gender</option>
                          {genders.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-1">
                          <FaUser className="inline mr-1 text-orange-400 text-sm" />
                          Age
                        </label>
                        <input
                          type="number"
                          min={16}
                          max={60}
                          className="w-full rounded-lg border border-cyan-500/30 bg-[#0a1124] text-cyan-100 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          value={age}
                          onChange={e => setAge(e.target.value)}
                          placeholder="Enter your age"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-1">
                          <FaGraduationCap className="inline mr-1 text-indigo-400 text-sm" />
                          Academic Year
                        </label>
                        <select
                          className="w-full rounded-lg border border-cyan-500/30 bg-[#0a1124] text-cyan-100 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          value={year}
                          onChange={e => setYear(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select year</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-6">
                      <label className="block text-sm font-medium text-cyan-200 mb-1">Roommate Preferences</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                        {roommatePrefs.map((pref) => (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => setRoommate(pref)}
                            className={`
                              flex items-center gap-2 p-2 rounded-lg text-xs transition-all
                              ${roommate === pref
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                              }
                            `}
                          >
                            <span>{pref}</span>
                          </button>
                        ))}
                      </div>

                      {/* Room Type Selection */}
                      <div>
                        <label className="block text-xs font-medium text-purple-200 mb-1">Preferred Room Type</label>
                        <div className="flex flex-wrap gap-2">
                          {roomTypes.map((type) => (
                            <button
                              key={type.label}
                              type="button"
                              onClick={() => setRoomType(type.label)}
                              className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all
                                ${roomType === type.label
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                                }
                              `}
                            >
                              <span className="text-lg">{type.icon}</span>
                              <span>{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Lifestyle & Habits */}
                      <div>
                        <label className="block text-xs font-medium text-cyan-200 mb-1">Lifestyle & Habits</label>
                        <div className="flex flex-wrap gap-2">
                          {lifestyleOptions.map((opt) => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => {
                                setLifestylePrefs((prev) =>
                                  prev.includes(opt.key)
                                    ? prev.filter((k) => k !== opt.key)
                                    : [...prev, opt.key]
                                );
                              }}
                              className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all
                                ${lifestylePrefs.includes(opt.key)
                                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                                }
                              `}
                            >
                              <span className="text-lg">{opt.icon}</span>
                              <span>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-cyan-300/70">
                          Select all that apply. These help us match you with compatible roommates!
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CSSTransition>
            </SwitchTransition>

            <div className="flex flex-col md:flex-row justify-between items-center pt-2 gap-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full md:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-cyan-200 hover:bg-gray-600 transition-colors flex items-center gap-1"
                >
                  <FaChevronLeft className="text-xs" />
                  Back
                </button>
              ) : <div />}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep()}
                  className="w-full md:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next
                  <FaChevronRight className="text-xs" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting || !validateStep()}
                  className="w-full md:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-cyan-500 text-white hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-1"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              )}
            </div>

            {success && (
              <div className="p-3 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-xs text-center animate-fade-in">
                {success}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-xs text-center animate-fade-in">
                {error}
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-cyan-300/40 mt-3">
          Your information is secure and will only be used for matching
        </p>
      </div>
    </div>
  );
}

export default ProfileSetup;