import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import {
  Building, Home, Bed, Users, Star, Download, Edit, Trash2,
  Plus, Wifi, Coffee, Bath, Wind, Upload,
  Calendar, AlertCircle, DollarSign,
  Camera, Eye, Settings,
  BarChart, CreditCard, Award, TrendingUp, Menu, X,
  Search, Phone, Mail, MapPin, Bell, FileText, ArrowRight, LogOut,
  ChevronUp, ChevronDown, ShieldCheck, LifeBuoy, Send, CheckCircle, Loader2, Clock
} from 'lucide-react';
import BookingManagementSystem from './booking/BookingManagementSystem';
import { ownerDashboardApi, type OwnerHouseDto, type OwnerRoomDto } from '../api/ownerDashboardApi';

// ============================================
// TYPES
// ============================================

interface BoardingHouse {
  _id?: string;
  id: string;
  name: string;
  address: string;
  city?: string;
  totalRooms?: number;
  roomCount?: number;
  monthlyPrice?: number;
  roomType?: string;
  availableFrom?: string;
  deposit?: number;
  roommateCount?: string;
  description?: string;
  features?: string[];
  occupiedRooms?: number;
  rating: number;
  totalReviews?: number;
  image?: string;
  images?: string[];
  status?: 'active' | 'inactive';
  genderPreference?: 'any' | 'girls' | 'boys';
  totalTenants?: number;
  availableRooms?: number;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  rooms?: Room[];
}

interface Tenant {
  id: string;
  name: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  monthlyRent: number;
  phone?: string;
  email?: string;
}

interface Room {
  id: string;
  houseId: string;
  roomNumber: string;
  floor: number;
  bedCount: number;
  occupiedBeds: number;
  price: number;
  facilities: string[];
  status: 'available' | 'partial' | 'full';
  images: string[];
  tenants: Tenant[];
  location?: string;
  roomType?: string;
  genderPreference?: string;
  availableFrom?: string;
  deposit?: number;
  roommateCount?: string;
  description?: string;
}

interface Facility {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
  color: string;
}

interface MobileStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
  color: string;
}

interface HouseCardProps {
  house: BoardingHouse;
  onEdit: (house: BoardingHouse) => void;
  onDelete: (house: BoardingHouse) => void;
  onSelect: (house: BoardingHouse) => void;
}

interface MobileHouseCardProps {
  house: BoardingHouse;
  onEdit: (house: BoardingHouse) => void;
  onDelete: (house: BoardingHouse) => void;
  onSelect: (house: BoardingHouse) => void;
}

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  onViewTenants: (room: Room) => void;
}

interface MobileRoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  onViewTenants: (room: Room) => void;
}

interface TenantTableProps {
  tenants: Tenant[];
  rooms: Room[];
}

interface MobileTenantListProps {
  tenants: Tenant[];
  rooms: Room[];
}

interface OwnerProfile {
  id: string;
  email: string;
  role: 'student' | 'owner' | 'admin';
  fullName: string;
  phoneNumber: string;
  companyName: string;
  propertyCount: number;
  profileImage?: string;
}

interface SparklineProps {
  data: number[];
  color: string;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
  color: string;
}

interface MobileStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
  color: string;
}

interface HouseCardProps {
  house: BoardingHouse;
  onEdit: (house: BoardingHouse) => void;
  onDelete: (house: BoardingHouse) => void;
  onSelect: (house: BoardingHouse) => void;
}

interface MobileHouseCardProps {
  house: BoardingHouse;
  onEdit: (house: BoardingHouse) => void;
  onDelete: (house: BoardingHouse) => void;
  onSelect: (house: BoardingHouse) => void;
}

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  onViewTenants: (room: Room) => void;
}

interface MobileRoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  onViewTenants: (room: Room) => void;
}

interface TenantTableProps {
  tenants: Tenant[];
  rooms: Room[];
}

interface MobileTenantListProps {
  tenants: Tenant[];
  rooms: Room[];
}

// ============================================
// MOCK DATA
// ============================================


const facilitiesList: Facility[] = [
  { id: 'wifi', name: 'Wi-Fi', icon: <Wifi size={14} /> },
  { id: 'ac', name: 'AC', icon: <Wind size={14} /> },
  { id: 'bathroom', name: 'Attached Bathroom', icon: <Bath size={14} /> },
  { id: 'meals', name: 'Meals Included', icon: <Coffee size={14} /> },
  { id: 'parking', name: 'Parking', icon: <Building size={14} /> },
  { id: 'laundry', name: 'Laundry', icon: <Wind size={14} /> },
  { id: 'study', name: 'Study Table', icon: <Building size={14} /> },
  { id: 'furnished', name: 'Furnished', icon: <Home size={14} /> },
  { id: 'security', name: 'Security', icon: <Eye size={14} /> }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const getBookingStatus = (checkOutDate: string): { label: string; color: string } => {
  const today = new Date();
  const checkOut = new Date(checkOutDate);
  const daysLeft = Math.floor((checkOut.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysLeft < 0) return { label: 'Expired', color: 'bg-red-500/20 text-red-400' };
  if (daysLeft <= 14) return { label: 'Ending Soon', color: 'bg-yellow-500/20 text-yellow-400' };
  return { label: 'Active', color: 'bg-green-500/20 text-green-400' };
};

// Sparkline component
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const width = 100;
  const height = 30;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="100%" height="30" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================
// COMPONENTS
// ============================================

// Stats Card Component (Desktop)
const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-400/30 transition-all">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      <span className={`text-xs ${trend >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
        <TrendingUp size={12} className={trend >= 0 ? '' : 'rotate-180'} />
        {Math.abs(trend)}%
      </span>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs text-gray-400">{title}</p>
  </div>
);

// Mobile Stats Card Component
const MobileStatsCard: React.FC<MobileStatsCardProps> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white/5 rounded-xl p-3 border border-white/10 active:bg-white/10 transition-colors touch-manipulation">
    <div className="flex items-center justify-between mb-1">
      <div className={`p-1.5 rounded-lg ${color}`}>
        {icon}
      </div>
      <span className={`text-[10px] ${trend >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center gap-0.5`}>
        <TrendingUp size={10} className={trend >= 0 ? '' : 'rotate-180'} />
        {Math.abs(trend)}%
      </span>
    </div>
    <p className="text-lg font-bold text-white">{value}</p>
    <p className="text-[9px] text-gray-400 mt-0.5">{title}</p>
  </div>
);

// House Card Component (Desktop)
const HouseCard: React.FC<HouseCardProps> = ({ house, onEdit, onDelete, onSelect }) => (
  <div 
    className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer group"
    onClick={() => onSelect(house)}
  >
    <div className="relative aspect-square max-w-[180px] mx-auto mt-4 overflow-hidden rounded-lg shadow-md">
      <img src={house.image} alt={house.name} className="w-full h-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
        <span className="text-white font-bold text-sm">{house.name}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${house.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
          {house.status}
        </span>
      </div>
    </div>
    <div className="p-3">
      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
        <Building size={12} />
        {house.address}
      </p>
      <p className="text-[10px] text-purple-300 mb-2">
        {house.genderPreference === 'girls'
          ? 'Girls Only'
          : house.genderPreference === 'boys'
          ? 'Boys Only'
          : 'Any'}
      </p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-cyan-400">{house.occupiedRooms}/{house.totalRooms} rooms</span>
        <div className="flex items-center gap-1">
          <Star size={12} className="text-yellow-400" />
          <span className="text-white">{house.rating}</span>
          <span className="text-gray-400">({house.totalReviews})</span>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-white/10">
        <button onClick={(e) => { e.stopPropagation(); onEdit(house); }} className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1">
          <Edit size={12} /> Edit
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(house); }} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1">
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  </div>
);

// Mobile House Card Component
const MobileHouseCard: React.FC<MobileHouseCardProps> = ({ house, onEdit, onDelete, onSelect }) => (
  <div 
    className="bg-white/5 rounded-xl overflow-hidden border border-white/10 active:border-cyan-400/30 transition-colors touch-manipulation"
    onClick={() => onSelect(house)}
  >
    <div className="relative aspect-square max-w-[120px] mx-auto mt-2 overflow-hidden rounded-lg shadow-md">
      <img src={house.image} alt={house.name} className="w-full h-full aspect-square object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
        <span className="text-white font-bold text-xs truncate max-w-[60%]">{house.name}</span>
        <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${house.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
          {house.status}
        </span>
      </div>
    </div>
    <div className="p-2">
      <p className="text-[9px] text-gray-400 mb-1 flex items-center gap-1 truncate">
        <MapPin size={8} />
        {house.address}
      </p>
      <p className="text-[8px] text-purple-300 mb-1">
        {house.genderPreference === 'girls'
          ? 'Girls Only'
          : house.genderPreference === 'boys'
          ? 'Boys Only'
          : 'Any'}
      </p>
      <div className="flex items-center justify-between text-[9px]">
        <span className="text-cyan-400">{house.occupiedRooms}/{house.totalRooms} rooms</span>
        <div className="flex items-center gap-1">
          <Star size={8} className="text-yellow-400" />
          <span className="text-white">{house.rating}</span>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-1.5 pt-1.5 border-t border-white/10">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(house); }} 
          className="text-cyan-400 active:text-cyan-300 text-[8px] flex items-center gap-0.5 px-2 py-1 min-h-[32px]"
          title="Edit House"
        >
          <Edit size={10} /> Edit
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(house); }} 
          className="text-red-400 active:text-red-300 text-[8px] flex items-center gap-0.5 px-2 py-1 min-h-[32px]"
          title="Delete House"
        >
          <Trash2 size={10} /> Delete
        </button>
      </div>
    </div>
  </div>
);

// Room Card Component (Desktop)
const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete, onViewTenants }) => {
  const statusColors = {
    available: 'text-green-400 bg-green-500/20',
    partial: 'text-yellow-400 bg-yellow-500/20',
    full: 'text-red-400 bg-red-500/20'
  };

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [localStatus, setLocalStatus] = useState(room.status);

  // Helper to map status to occupancy
  const getOccupancyForStatus = (status: 'available' | 'partial' | 'full') => {
    if (status === 'available') return 0;
    if (status === 'partial') return Math.max(1, Math.floor(room.bedCount / 2));
    if (status === 'full') return room.bedCount;
    return 0;
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'available' | 'partial' | 'full';
    setUpdatingStatus(true);
    try {
      // Update occupancy in backend
      const newOccupancy = getOccupancyForStatus(newStatus);
      await ownerDashboardApi.updateRoom(room.id, { occupancy: newOccupancy });
      setLocalStatus(newStatus);
      // Optionally: trigger a reload of rooms in parent if needed
      // (parent should update room.occupiedBeds and status from backend)
    } catch (err) {
      alert('Failed to update room status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-purple-400/30 transition-all">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-white font-medium text-sm">Room {room.roomNumber}</h4>
          <p className="text-xs text-gray-400">Floor {room.floor}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[localStatus]}`}> 
          {localStatus === 'available' ? 'Available' : localStatus === 'partial' ? 'Partial' : 'Full'}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Bed size={12} className="text-cyan-400" />
        <span className="text-xs text-white">{room.occupiedBeds}/{room.bedCount} beds</span>
        <DollarSign size={12} className="text-green-400 ml-2" />
        <span className="text-xs text-white">Rs.{room.price.toLocaleString()}</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        {room.facilities.map((fac: string) => {
          const facility = facilitiesList.find(f => f.id === fac);
          return facility ? (
            <span key={fac} className="bg-cyan-900/30 text-cyan-300 px-1.5 py-0.5 rounded-full text-[8px] flex items-center gap-1">
              {facility.icon}
              {facility.name}
            </span>
          ) : null;
        })}
      </div>

      {/* Availability Dropdown */}
      <div className="flex items-center gap-2 mb-2">
        <label className="text-xs text-gray-300">Set Availability:</label>
        <select
          value={localStatus}
          onChange={handleStatusChange}
          disabled={updatingStatus}
          className="px-2 py-1 rounded bg-white/10 text-xs text-white border border-white/10 focus:outline-none"
        >
          <option value="available">Available</option>
          <option value="partial">Partial</option>
          <option value="full">Full</option>
        </select>
        {updatingStatus && <span className="text-xs text-cyan-400 ml-1">Updating...</span>}
      </div>

      <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-white/10">
        <button 
          onClick={() => onViewTenants(room)} 
          className="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-1"
          title="View Tenants"
        >
          <Users size={10} /> Tenants ({room.tenants.length})
        </button>
        <button 
          onClick={() => onEdit(room)} 
          className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1"
          title="Edit Room"
        >
          <Edit size={10} /> Edit
        </button>
        <button 
          onClick={() => onDelete(room)} 
          className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-1"
          title="Delete Room"
        >
          <Trash2 size={10} /> Delete
        </button>
      </div>
    </div>
  );
};

// Mobile Room Card Component
const MobileRoomCard: React.FC<MobileRoomCardProps> = ({ room, onEdit, onDelete, onViewTenants }) => {
  const statusColors = {
    available: 'text-green-400 bg-green-500/20',
    partial: 'text-yellow-400 bg-yellow-500/20',
    full: 'text-red-400 bg-red-500/20'
  };

  return (
    <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 active:border-purple-400/30 transition-colors touch-manipulation">
      <div className="flex justify-between items-start mb-1.5">
        <div>
          <h4 className="text-white font-medium text-xs">Room {room.roomNumber}</h4>
          <p className="text-[9px] text-gray-400">Floor {room.floor}</p>
        </div>
        <span className={`text-[9px] px-2 py-1 rounded-full ${statusColors[room.status]}`}>
          {room.status === 'available' ? 'Available' : room.status === 'partial' ? 'Partial' : 'Full'}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-1.5">
        <Bed size={10} className="text-cyan-400" />
        <span className="text-[9px] text-white">{room.occupiedBeds}/{room.bedCount} beds</span>
        <DollarSign size={10} className="text-green-400 ml-1" />
        <span className="text-[9px] text-white">Rs.{room.price.toLocaleString()}</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-1.5">
        {room.facilities.slice(0, 3).map((fac: string) => {
          const facility = facilitiesList.find(f => f.id === fac);
          return facility ? (
            <span key={fac} className="bg-cyan-900/30 text-cyan-300 px-1 py-0.5 rounded-full text-[6px] flex items-center gap-0.5">
              {facility.icon}
              {facility.name}
            </span>
          ) : null;
        })}
        {room.facilities.length > 3 && (
          <span className="bg-white/10 text-gray-400 px-1 py-0.5 rounded-full text-[6px]">
            +{room.facilities.length - 3}
          </span>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-1.5 pt-1.5 border-t border-white/10">
        <button 
          onClick={() => onViewTenants(room)} 
          className="text-blue-400 active:text-blue-300 text-[8px] flex items-center gap-0.5 px-2 py-1 min-h-[32px]"
          title="View Tenants"
        >
          <Users size={10} /> {room.tenants.length}
        </button>
        <button 
          onClick={() => onEdit(room)} 
          className="text-cyan-400 active:text-cyan-300 text-[8px] flex items-center gap-0.5 px-2 py-1 min-h-[32px]"
          title="Edit Room"
        >
          <Edit size={10} /> Edit
        </button>
        <button 
          onClick={() => onDelete(room)} 
          className="text-red-400 active:text-red-300 text-[8px] flex items-center gap-0.5 px-2 py-1 min-h-[32px]"
          title="Delete Room"
        >
          <Trash2 size={10} /> Del
        </button>
      </div>
    </div>
  );
};

// Tenant Table Component (Desktop)
const TenantTable: React.FC<TenantTableProps> = ({ tenants, rooms }) => {
  const getRoomNumber = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.roomNumber : 'N/A';
  };

  const paymentColors = {
    paid: 'text-green-400 bg-green-500/20',
    pending: 'text-yellow-400 bg-yellow-500/20',
    overdue: 'text-red-400 bg-red-500/20'
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-cyan-900/30 border-b border-white/10">
            <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Room</th>
            <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Tenant Name</th>
            <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Check In</th>
            <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Check Out</th>
            <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Monthly Rent</th>
            <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Booking</th>
            <th className="px-4 py-3 text-left text-cyan-300 font-semibold">Payment</th>
            <th className="px-4 py-3 text-center text-cyan-300 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => {
            const bookingStatus = getBookingStatus(tenant.checkOutDate);
            return (
              <tr key={tenant.id} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                <td className="px-4 py-3 text-white font-medium">#{getRoomNumber(tenant.roomId)}</td>
                <td className="px-4 py-3 text-white">{tenant.name}</td>
                <td className="px-4 py-3 text-gray-300">{new Date(tenant.checkInDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-300">{new Date(tenant.checkOutDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-white font-semibold">Rs.{tenant.monthlyRent.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${bookingStatus.color}`}>
                    {bookingStatus.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${paymentColors[tenant.paymentStatus]}`}>
                    {tenant.paymentStatus.charAt(0).toUpperCase() + tenant.paymentStatus.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button 
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 p-1.5 rounded transition-colors"
                      title="View Tenant"
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/10 p-1.5 rounded transition-colors"
                      title="Download Receipt"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Mobile Tenant List Component
const MobileTenantList: React.FC<MobileTenantListProps> = ({ tenants, rooms }) => {
  const getRoomNumber = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.roomNumber : 'N/A';
  };

  const paymentColors = {
    paid: 'text-green-400 bg-green-500/20',
    pending: 'text-yellow-400 bg-yellow-500/20',
    overdue: 'text-red-400 bg-red-500/20'
  };

  const bookingStatus = getBookingStatus;

  return (
    <div className="space-y-2">
      {tenants.map((tenant) => {
        const status = bookingStatus(tenant.checkOutDate);
        return (
          <div key={tenant.id} className="bg-white/5 rounded-lg p-2.5 border border-white/10">
            <div className="flex justify-between items-start mb-1">
              <div>
                <p className="text-xs font-medium text-white">{tenant.name}</p>
                <p className="text-[8px] text-gray-400">Room {getRoomNumber(tenant.roomId)}</p>
              </div>
              <span className={`text-[7px] px-1.5 py-0.5 rounded-full ${paymentColors[tenant.paymentStatus]}`}>
                {tenant.paymentStatus}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-[8px] text-gray-400 mb-1.5">
              <Calendar size={8} />
              <span>{new Date(tenant.checkInDate).toLocaleDateString()} - {new Date(tenant.checkOutDate).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[7px] px-1.5 py-0.5 rounded-full ${status.color}`}>
                  {status.label}
                </span>
                <span className="text-[9px] text-white">Rs.{tenant.monthlyRent.toLocaleString()}/mo</span>
              </div>
              <div className="flex gap-2">
                {tenant.phone && (
                  <a href={`tel:${tenant.phone}`} className="text-cyan-400 active:text-cyan-300 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center">
                    <Phone size={12} />
                  </a>
                )}
                {tenant.email && (
                  <a href={`mailto:${tenant.email}`} className="text-purple-400 active:text-purple-300 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center">
                    <Mail size={12} />
                  </a>
                )}
                <button className="text-green-400 active:text-green-300 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center">
                  <Download size={12} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function OwnerDashboard() {
      // ================= Signed Agreements State & Helpers =================
      // Mock agreement instance data (replace with API integration as needed)
      type AgreementTenant = {
        studentId: string;
        name: string;
        signatureStatus: 'SIGNED' | 'PENDING';
        signedDate?: string;
        meta?: string;
      };

      type AgreementInstance = {
        id: string;
        bookingType: 'SINGLE' | 'GROUP';
        status: 'SIGNED' | 'PENDING' | 'EXPIRED';
        room: string;
        tenants: AgreementTenant[];
        duration: number; // in months
        signedDate?: string;
      };

      // Example mock data for demonstration
      const [agreementInstances] = useState<AgreementInstance[]>([
        {
          id: 'AG-2024-001',
          bookingType: 'SINGLE',
          status: 'SIGNED',
          room: '101',
          tenants: [
            { studentId: 'S1', name: 'John Doe', signatureStatus: 'SIGNED', signedDate: '2024-05-01' }
          ],
          duration: 12,
          signedDate: '2024-05-01',
        },
        {
          id: 'AG-2024-002',
          bookingType: 'GROUP',
          status: 'PENDING',
          room: '202',
          tenants: [
            { studentId: 'S2', name: 'Jane Smith', signatureStatus: 'SIGNED', signedDate: '2024-05-02' },
            { studentId: 'S3', name: 'Alice Lee', signatureStatus: 'PENDING' }
          ],
          duration: 6,
        },
        {
          id: 'AG-2024-003',
          bookingType: 'SINGLE',
          status: 'EXPIRED',
          room: '303',
          tenants: [
            { studentId: 'S4', name: 'Bob Brown', signatureStatus: 'SIGNED', signedDate: '2023-01-01' }
          ],
          duration: 3,
          signedDate: '2023-01-01',
        },
      ]);

      // Filtering and sorting logic
      const [agreementSearch, setAgreementSearch] = useState('');
      const filteredAgreementInstances = agreementInstances.filter((a: AgreementInstance) =>
        a.id.toLowerCase().includes(agreementSearch.toLowerCase()) ||
        a.room.toLowerCase().includes(agreementSearch.toLowerCase()) ||
        a.tenants.some((t: AgreementTenant) => t.name.toLowerCase().includes(agreementSearch.toLowerCase()))
      );
      const sortedFilteredAgreementInstances = [...filteredAgreementInstances].sort((a: AgreementInstance, b: AgreementInstance) => {
        // Sort by signedDate descending, then by id
        const dateA = a.signedDate ? new Date(a.signedDate).getTime() : 0;
        const dateB = b.signedDate ? new Date(b.signedDate).getTime() : 0;
        return dateB - dateA || b.id.localeCompare(a.id);
      });

      // Expanded group agreement state
      const [expandedGroupAgreementId, setExpandedGroupAgreementId] = useState<string | null>(null);
      const toggleGroupAgreementExpansion = (agreement: AgreementInstance) => {
        if (agreement.bookingType !== 'GROUP') return;
        setExpandedGroupAgreementId(prev => (prev === agreement.id ? null : agreement.id));
      };

      // Helper functions for agreement display
      const formatAgreementId = (id: string) => id;
      const getAgreementStatusClass = (agreement: AgreementInstance) => {
        switch (agreement.status) {
          case 'SIGNED': return 'bg-green-500/20 text-green-400';
          case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
          case 'EXPIRED': return 'bg-red-500/20 text-red-400';
          default: return 'bg-gray-500/20 text-gray-400';
        }
      };
      const getAgreementStatusLabel = (agreement: AgreementInstance) => {
        switch (agreement.status) {
          case 'SIGNED': return 'Signed';
          case 'PENDING': return 'Pending';
          case 'EXPIRED': return 'Expired';
          default: return 'Unknown';
        }
      };
      const getAgreementTypeClass = (type: 'SINGLE' | 'GROUP') =>
        type === 'GROUP' ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300';
      const getAgreementTypeLabel = (type: 'SINGLE' | 'GROUP') =>
        type === 'GROUP' ? 'Group' : 'Single';
      const getAgreementStudentsTooltip = (agreement: AgreementInstance) =>
        agreement.tenants.map((t: AgreementTenant) => t.name).join(', ');
      const getAgreementStudentSummary = (agreement: AgreementInstance) =>
        agreement.tenants.map((t: AgreementTenant) => t.name).join(', ');
      const getAgreementDurationLabel = (months: number) => `${months} month${months === 1 ? '' : 's'}`;
      const getTenantSignatureStatusClass = (tenant: AgreementTenant) =>
        tenant.signatureStatus === 'SIGNED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400';
      const getTenantSignatureStatusLabel = (tenant: AgreementTenant) =>
        tenant.signatureStatus === 'SIGNED' ? 'Signed' : 'Pending';
      const getTenantMetaLine = (tenant: AgreementTenant) => tenant.meta || '';
      const canOwnerDownloadAgreement = (agreement: AgreementInstance) => agreement.status === 'SIGNED';
      const handleDownloadAgreementPdf = (agreement: AgreementInstance) => {
        alert(`Download PDF for agreement ${agreement.id}`);
      };
    // Agreement tab state
    const [agreementTitle, setAgreementTitle] = useState('');
    const [agreementContent, setAgreementContent] = useState('');
    const [agreementError, setAgreementError] = useState('');
    const [agreementTemplates, setAgreementTemplates] = useState<Array<{id: string, title: string, content: string, version: number, updatedAt: string}>>([]);

    // Quill editor formats
    const agreementEditorFormats = [
      'header', 'bold', 'italic', 'list', 'bullet', 'indent', 'link', 'underline', 'strike', 'blockquote', 'code-block',
    ];

    // Sync editor content
    const syncAgreementEditorContent = (content: string) => {
      setAgreementContent(content);
    };

    // Handle create template
    const handleCreateAgreementTemplate = () => {
      if (!agreementTitle.trim()) {
        setAgreementError('Template title is required.');
        return;
      }
      if (!agreementContent.trim() || agreementContent === '<p><br></p>') {
        setAgreementError('Agreement content cannot be empty.');
        return;
      }
      setAgreementError('');
      const newTemplate = {
        id: Date.now().toString(),
        title: agreementTitle.trim(),
        content: agreementContent,
        version: agreementTemplates.length + 1,
        updatedAt: new Date().toISOString(),
      };
      setAgreementTemplates(prev => [...prev, newTemplate]);
      setAgreementTitle('');
      setAgreementContent('');
    };
  const navigate = useNavigate();
  const [houses, setHouses] = useState<BoardingHouse[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<BoardingHouse | null>(null);
  const [showAddHouse, setShowAddHouse] = useState(false);
  const [editingHouse, setEditingHouse] = useState<BoardingHouse | null>(null);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedRoomForTenants, setSelectedRoomForTenants] = useState<Room | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'houses' | 'rooms' | 'tenants' | 'payments' | 'bookings' | 'agreements' | 'notifications' | 'notices' | 'profile' | 'kyc' | 'support'>('overview');

  // ── KYC state ─────────────────────────────────────────────────
  const [kycStatus, setKycStatus] = useState<'not_submitted' | 'pending' | 'approved' | 'rejected' | null>(null);
  const [kycRejectionReason, setKycRejectionReason] = useState('');
  const [kycFiles, setKycFiles] = useState<{ nicFront: File | null; nicBack: File | null; selfie: File | null }>({ nicFront: null, nicBack: null, selfie: null });
  const [kycUploading, setKycUploading] = useState(false);
  const [kycError, setKycError] = useState('');
  const [kycSuccess, setKycSuccess] = useState('');

  // ── Support Ticket state ───────────────────────────────────────
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('other');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHouse, setFilterHouse] = useState('all');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [uploadedRoomImages, setUploadedRoomImages] = useState<string[]>([]);
  const [uploadedHouseImages, setUploadedHouseImages] = useState<string[]>([]);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>({
    id: '',
    email: 'owner@boardingbook.com',
    role: 'owner',
    fullName: 'Owner',
    phoneNumber: '',
    companyName: '',
    propertyCount: 0,
  });
  const [profileMessage, setProfileMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const houseFileInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  
  // Form state for new room
  const [newRoom, setNewRoom] = useState({
    listingTitle: '',
    houseId: '',
    roomNumber: '',
    floor: 1,
    bedCount: 1,
    price: 0,
    facilities: [] as string[],
    location: '',
    roomType: 'Single Room',
    genderPreference: 'Any',
    availableFrom: '',
    deposit: 0,
    roommateCount: 'None',
    description: ''
  });
  
  // Form state for new house
  const [newHouse, setNewHouse] = useState({
    name: '',
    address: '',
    totalRooms: 0,
    monthlyPrice: 0,
    roomType: 'Single Room',
    availableFrom: '',
    deposit: 0,
    roommateCount: 'None (Private)',
    description: '',
    features: [] as string[],
    genderPreference: 'any' as 'any' | 'girls' | 'boys'
  });

  // Notice states
  const [notices, setNotices] = useState<{id:string; type:string; message:string; date:string; recipients:string;}[]>([
    {
      id: '1',
      type: 'general',
      message: 'powercut from 8 - 5',
      date: '3/4/2026, 11:21:46 PM',
      recipients: 'All Tenants'
    }
  ]);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [noticeType, setNoticeType] = useState('general');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeRecipients, setNoticeRecipients] = useState('all');

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('bb_current_user');
      if (!rawUser) {
        return;
      }

      const parsedUser = JSON.parse(rawUser) as Partial<OwnerProfile>;
      setOwnerProfile((prev) => ({
        ...prev,
        id: parsedUser.id || prev.id,
        email: parsedUser.email || prev.email,
        role: (parsedUser.role as OwnerProfile['role']) || prev.role,
        fullName: parsedUser.fullName || prev.fullName,
        phoneNumber: parsedUser.phoneNumber || prev.phoneNumber,
        companyName: parsedUser.companyName || prev.companyName,
        propertyCount: typeof parsedUser.propertyCount === 'number' ? parsedUser.propertyCount : prev.propertyCount,
        profileImage: parsedUser.profileImage || prev.profileImage,
      }));
    } catch (error) {
      console.error('Failed to load owner profile:', error);
    }
  }, []);

  // Redmi Note 13 specific (360-400px width)
  const isRedmiNote13 = windowWidth >= 360 && windowWidth <= 400;
  const isMobile = windowWidth < 768;

  const ownerInitials = ownerProfile.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('') || 'OW';

  const handleLogout = () => {
    localStorage.removeItem('bb_access_token');
    localStorage.removeItem('bb_current_user');
    navigate('/signin');
  };

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('bb_access_token')}` });

  // ── KYC handlers ───────────────────────────────────────────────
  const fetchKycStatus = async () => {
    try {
      const res = await fetch(`${API}/api/kyc/status`, { headers: authHeader() });
      const data = await res.json();
      if (data.success) { setKycStatus(data.data.kycStatus); setKycRejectionReason(data.data.kycRejectionReason || ''); }
    } catch { /* silent */ }
  };

  const handleKycSubmit = async () => {
    if (!kycFiles.nicFront || !kycFiles.nicBack || !kycFiles.selfie) {
      setKycError('Please upload all 3 documents'); return;
    }
    setKycUploading(true); setKycError(''); setKycSuccess('');
    try {
      const form = new FormData();
      form.append('nicFront', kycFiles.nicFront);
      form.append('nicBack', kycFiles.nicBack);
      form.append('selfie', kycFiles.selfie);
      const res = await fetch(`${API}/api/kyc/submit`, { method: 'POST', headers: authHeader(), body: form });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      setKycSuccess('Documents submitted! Admin will review within 1-2 business days.');
      setKycStatus('pending');
    } catch (err: any) {
      setKycError(err.message || 'Upload failed');
    } finally { setKycUploading(false); }
  };

  // ── Support Ticket handlers ────────────────────────────────────
  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API}/api/tickets/my`, { headers: authHeader() });
      const data = await res.json();
      if (data.success) setTickets(data.data);
    } catch { /* silent */ }
  };

  const handleTicketSubmit = async () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      setTicketError('Subject and description are required'); return;
    }
    setTicketLoading(true); setTicketError(''); setTicketSuccess('');
    try {
      const res = await fetch(`${API}/api/tickets`, {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: ticketSubject, category: ticketCategory, description: ticketDescription }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      setTicketSuccess('Ticket submitted! Our team will respond shortly.');
      setTicketSubject(''); setTicketDescription(''); setTicketCategory('other');
      fetchTickets();
    } catch (err: any) {
      setTicketError(err.message || 'Failed to submit ticket');
    } finally { setTicketLoading(false); }
  };

  const mapHouseDtoToUi = (house: OwnerHouseDto): BoardingHouse => ({
    id: house._id,
    name: house.name,
    address: house.address,
    totalRooms: house.totalRooms,
    monthlyPrice: house.monthlyPrice,
    roomType: house.roomType,
    availableFrom: house.availableFrom,
    deposit: house.deposit,
    roommateCount: house.roommateCount,
    description: house.description,
    features: house.features || [],
    occupiedRooms: house.occupiedRooms,
    rating: house.rating,
    totalReviews: house.totalReviews,
    image: house.image || house.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: house.images || (house.image ? [house.image] : []),
    status: house.status,
    genderPreference: house.genderPreference || 'any',
  });

  const mapRoomDtoToUi = (room: OwnerRoomDto): Room => {
    const bedCount = room.bedCount || room.totalSpots || 1;
    const occupiedBeds = room.occupancy || 0;

    return {
      id: room._id,
      houseId: room.houseId || '',
      roomNumber: room.roomNumber || room._id.slice(-4),
      floor: room.floor || 1,
      bedCount,
      occupiedBeds,
      price: room.price,
      facilities: room.facilities || [],
      status: occupiedBeds <= 0 ? 'available' : occupiedBeds < bedCount ? 'partial' : 'full',
      images: room.images?.length ? room.images : ['https://images.unsplash.com/photo-1598928506911-5c200b0e2f4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      tenants: [],
      location: room.location,
      roomType: room.roomType,
      genderPreference: room.genderPreference,
      availableFrom: room.availableFrom,
      deposit: room.deposit,
      roommateCount: room.roommateCount,
      description: room.description,
    };
  };

  useEffect(() => {
    const loadOwnerData = async () => {
      const token = localStorage.getItem('bb_access_token');
      if (!token) {
        return;
      }

      try {
        const [houseData, roomData] = await Promise.all([
          ownerDashboardApi.getHouses(),
          ownerDashboardApi.getRooms(),
        ]);

        setHouses(houseData.map(mapHouseDtoToUi));
        setRooms(roomData.map(mapRoomDtoToUi));
      } catch (error) {
        console.error('Failed to load owner dashboard data:', error);
      }
    };

    loadOwnerData();
  }, []);

  // ============================================
  // STATS CALCULATIONS
  // ============================================

  const totalHouses = houses.length;
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((acc, room) => acc + room.bedCount, 0);
  const occupiedBeds = rooms.reduce((acc, room) => acc + room.occupiedBeds, 0);
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100) || 0;
  const vacantBeds = totalBeds - occupiedBeds;
  const vacantRoomsCount = rooms.filter(r => r.occupiedBeds < r.bedCount).length;
  const totalTenants = rooms.reduce((acc, room) => acc + room.tenants.length, 0);
  const monthlyRevenue = rooms.reduce((acc, room) => {
    return acc + room.tenants.reduce((sum, tenant) => sum + tenant.monthlyRent, 0);
  }, 0);
  
  // Payment calculations
  const pendingPayments = rooms.reduce((acc, room) => {
    return acc + room.tenants.filter(t => t.paymentStatus === 'pending').length;
  }, 0);
  
  const overdueCount = rooms.reduce((acc, room) => {
    return acc + room.tenants.filter(t => t.paymentStatus === 'overdue').length;
  }, 0);
  
  const pendingAmount = rooms.reduce((acc, room) => {
    return acc + room.tenants
      .filter(t => t.paymentStatus !== 'paid')
      .reduce((sum, tenant) => sum + tenant.monthlyRent, 0);
  }, 0);
  
  const overdueAmount = rooms.reduce((acc, room) => {
    return acc + room.tenants
      .filter(t => t.paymentStatus === 'overdue')
      .reduce((sum, tenant) => sum + tenant.monthlyRent, 0);
  }, 0);

  // Booking ending soon count
  const endingSoonCount = rooms.reduce((acc, room) => {
    return acc + room.tenants.filter(t => {
      const status = getBookingStatus(t.checkOutDate);
      return status.label === 'Ending Soon';
    }).length;
  }, 0);

  // Get all tenants
  const allTenants = rooms.flatMap(room => room.tenants);

  // Filter rooms by house
  const filteredRooms = filterHouse === 'all' 
    ? rooms 
    : rooms.filter(room => room.houseId === filterHouse);

  // Filter tenants by search
  const filteredTenants = allTenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rooms.find(r => r.id === tenant.roomId)?.roomNumber.includes(searchQuery)
  );

  // ============================================
  // HANDLERS
  // ============================================

  const handleViewTenants = (room: Room) => {
    setSelectedRoomForTenants(room);
    setShowTenantModal(true);
  };

  const handleEditHouse = (house: BoardingHouse) => {
    setEditingHouse(house);
    setNewHouse({
      name: house.name || '',
      address: house.address || '',
      totalRooms: house.totalRooms || 0,
      monthlyPrice: house.monthlyPrice || 0,
      roomType: house.roomType || 'Single Room',
      availableFrom: house.availableFrom || '',
      deposit: house.deposit || 0,
      roommateCount: house.roommateCount || 'None (Private)',
      description: house.description || '',
      features: house.features || [],
      genderPreference: house.genderPreference || 'any',
    });
    setUploadedHouseImages(house.images || (house.image ? [house.image] : []));
    setShowAddHouse(true);
  };

  const handleDeleteHouse = async (house: BoardingHouse) => {
    if (!window.confirm(`Delete ${house.name}? This will also remove its rooms.`)) {
      return;
    }

    try {
      await ownerDashboardApi.deleteHouse(house.id);
      setHouses((prev) => prev.filter((h) => h.id !== house.id));
      setRooms((prev) => prev.filter((room) => room.houseId !== house.id));
    } catch (error) {
      alert((error as Error).message || 'Failed to delete house');
    }
  };

  const handleEditRoom = async (room: Room) => {
    const nextPriceRaw = window.prompt('Update monthly price (Rs.)', String(room.price));
    if (!nextPriceRaw) {
      return;
    }
    const nextPrice = Number(nextPriceRaw);
    if (Number.isNaN(nextPrice) || nextPrice <= 0) {
      alert('Invalid price value');
      return;
    }

    try {
      const updated = await ownerDashboardApi.updateRoom(room.id, { price: nextPrice });
      setRooms((prev) => prev.map((r) => (r.id === room.id ? mapRoomDtoToUi(updated) : r)));
    } catch (error) {
      alert((error as Error).message || 'Failed to update room');
    }
  };

  const handleDeleteRoom = async (room: Room) => {
    if (!window.confirm(`Delete Room ${room.roomNumber}?`)) {
      return;
    }

    try {
      await ownerDashboardApi.deleteRoom(room.id);
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
    } catch (error) {
      alert((error as Error).message || 'Failed to delete room');
    }
  };

  // Handle file upload for room photos
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const imageUrls: string[] = [];
      
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          imageUrls.push(reader.result as string);
          if (imageUrls.length === fileArray.length) {
            setUploadedRoomImages(prev => [...prev, ...imageUrls]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle file upload for house photos
  const handleHouseFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const imageUrls: string[] = [];
      
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          imageUrls.push(reader.result as string);
          if (imageUrls.length === fileArray.length) {
            setUploadedHouseImages(prev => [...prev, ...imageUrls]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedRoomImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeHouseImage = (index: number) => {
    setUploadedHouseImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle send notice
  const handleSendNotice = () => {
    if (!noticeMessage.trim()) { 
      alert('Please enter a message'); 
      return; 
    }

    const recipientText =
      noticeRecipients === 'all' ? 'All Tenants'
      : noticeRecipients === 'unpaid' ? 'Unpaid Tenants'
      : 'Paid Tenants';

    setNotices(prev => [{
      id: Date.now().toString(),
      type: noticeType,
      message: noticeMessage.trim(),
      date: new Date().toLocaleString(),
      recipients: recipientText
    }, ...prev]);

    alert('Notice sent successfully!');
    setShowNoticeForm(false);
    setNoticeMessage('');
    setNoticeType('general');
    setNoticeRecipients('all');
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleOpenHouseFileDialog = () => {
    houseFileInputRef.current?.click();
  };

  const handleOpenProfileImageDialog = () => {
    profileImageInputRef.current?.click();
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('Profile image must be less than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result as string;
      setOwnerProfile((prev) => ({ ...prev, profileImage: imageData }));
      setProfileMessage('Profile image updated. Click Save Changes to persist.');
      setTimeout(() => setProfileMessage(''), 2500);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleRemoveProfileImage = () => {
    setOwnerProfile((prev) => ({ ...prev, profileImage: undefined }));
    setProfileMessage('Profile image removed. Click Save Changes to persist.');
    setTimeout(() => setProfileMessage(''), 2500);
  };

  const handleSaveProfileSettings = () => {
    if (!ownerProfile.fullName.trim()) {
      alert('Owner name is required');
      return;
    }

    const normalizedProfile = {
      ...ownerProfile,
      fullName: ownerProfile.fullName.trim(),
      phoneNumber: ownerProfile.phoneNumber.trim(),
      companyName: ownerProfile.companyName.trim(),
      propertyCount: Number(ownerProfile.propertyCount) || 0,
    };

    setOwnerProfile(normalizedProfile);

    try {
      const existingRaw = localStorage.getItem('bb_current_user');
      const existingUser = existingRaw ? JSON.parse(existingRaw) : {};
      const updatedUser = {
        ...existingUser,
        ...normalizedProfile,
      };

      localStorage.setItem('bb_current_user', JSON.stringify(updatedUser));
      setProfileMessage('Profile settings saved successfully.');
      setTimeout(() => setProfileMessage(''), 2500);
    } catch (error) {
      console.error('Failed to save owner profile:', error);
      alert('Could not save profile settings. Please try again.');
    }
  };

  // Handle facility toggle
  const handleFacilityToggle = (facilityId: string) => {
    setNewRoom(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter(f => f !== facilityId)
        : [...prev.facilities, facilityId]
    }));
  };

  const handleHouseFeatureToggle = (featureId: string) => {
    setNewHouse((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((f) => f !== featureId)
        : [...prev.features, featureId],
    }));
  };

  // Handle save room
  const handleSaveRoom = async () => {
    if (!newRoom.roomNumber || !newRoom.houseId || !newRoom.location) {
      alert('Please fill in all required fields (Room Number, House, Location)');
      return;
    }

    try {
      const created = await ownerDashboardApi.createRoom({
        name: newRoom.listingTitle,
        houseId: newRoom.houseId,
        roomNumber: newRoom.roomNumber,
        floor: newRoom.floor,
        bedCount: newRoom.bedCount,
        price: newRoom.price,
        facilities: newRoom.facilities,
        images: uploadedRoomImages,
        location: newRoom.location,
        roomType: newRoom.roomType,
        genderPreference: newRoom.genderPreference,
        availableFrom: newRoom.availableFrom,
        deposit: newRoom.deposit,
        roommateCount: newRoom.roommateCount,
        description: newRoom.description,
        owner: ownerProfile.fullName,
        ownerPhone: ownerProfile.phoneNumber,
        ownerEmail: ownerProfile.email,
      });

      setRooms((prev) => [...prev, mapRoomDtoToUi(created)]);
      setShowAddRoom(false);

      setNewRoom({
        listingTitle: '',
        houseId: '',
        roomNumber: '',
        floor: 1,
        bedCount: 1,
        price: 0,
        facilities: [],
        location: '',
        roomType: 'Single Room',
        genderPreference: 'Any',
        availableFrom: '',
        deposit: 0,
        roommateCount: 'None',
        description: '',
      });
      setUploadedRoomImages([]);

      alert(`Room ${created.roomNumber || newRoom.roomNumber} added successfully!`);
    } catch (error) {
      alert((error as Error).message || 'Failed to add room');
    }
  };

  // Handle save house
  const handleSaveHouse = async () => {
    if (!newHouse.name || !newHouse.address) {
      alert('Please fill in House Name and Distance from SLIIT');
      return;
    }

    try {
      if (editingHouse) {
        // Update existing house
        const updated = await ownerDashboardApi.updateHouse(editingHouse.id, {
          name: newHouse.name,
          address: newHouse.address,
          totalRooms: newHouse.totalRooms,
          monthlyPrice: newHouse.monthlyPrice,
          roomType: newHouse.roomType,
          availableFrom: newHouse.availableFrom,
          deposit: newHouse.deposit,
          roommateCount: newHouse.roommateCount,
          description: newHouse.description,
          features: newHouse.features,
          image: uploadedHouseImages[0],
          images: uploadedHouseImages,
          status: 'active',
          genderPreference: newHouse.genderPreference,
        });
        setHouses((prev) => prev.map((h) => (h.id === editingHouse.id ? mapHouseDtoToUi(updated) : h)));
        setShowAddHouse(false);
        setEditingHouse(null);
        setNewHouse({
          name: '',
          address: '',
          totalRooms: 0,
          monthlyPrice: 0,
          roomType: 'Single Room',
          availableFrom: '',
          deposit: 0,
          roommateCount: 'None (Private)',
          description: '',
          features: [],
          genderPreference: 'any',
        });
        setUploadedHouseImages([]);
        alert(`Boarding House "${updated.name}" updated successfully!`);
      } else {
        // Create new house
        const created = await ownerDashboardApi.createHouse({
          name: newHouse.name,
          address: newHouse.address,
          totalRooms: newHouse.totalRooms,
          monthlyPrice: newHouse.monthlyPrice,
          roomType: newHouse.roomType,
          availableFrom: newHouse.availableFrom,
          deposit: newHouse.deposit,
          roommateCount: newHouse.roommateCount,
          description: newHouse.description,
          features: newHouse.features,
          image: uploadedHouseImages[0],
          images: uploadedHouseImages,
          status: 'active',
          genderPreference: newHouse.genderPreference,
        });
        setHouses((prev) => [...prev, mapHouseDtoToUi(created)]);
        setShowAddHouse(false);
        setNewHouse({
          name: '',
          address: '',
          totalRooms: 0,
          monthlyPrice: 0,
          roomType: 'Single Room',
          availableFrom: '',
          deposit: 0,
          roommateCount: 'None (Private)',
          description: '',
          features: [],
          genderPreference: 'any',
        });
        setUploadedHouseImages([]);
        alert(`Boarding House "${created.name}" added successfully!`);
      }
    } catch (error) {
      alert((error as Error).message || (editingHouse ? 'Failed to update boarding house' : 'Failed to add boarding house'));
    }
  };

  // ============================================
  // DESKTOP VIEW
  // ============================================

  if (!isMobile) {
    return (
      <>
      <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
        {/* Header - Desktop */}
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Building className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    Owner Dashboard
                  </h1>
                  <p className="text-xs text-gray-400">Manage your boarding houses</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
                  <Bell className="text-gray-400 hover:text-white transition-colors" size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-400/30 text-red-200 hover:bg-red-500/20 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
                <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                  <div className="text-right">
                    <p className="text-sm text-white font-medium">{ownerProfile.fullName}</p>
                    <p className="text-xs text-gray-400">Owner • {ownerProfile.email}</p>
                  </div>
                  {ownerProfile.profileImage ? (
                    <img
                      src={ownerProfile.profileImage}
                      alt={ownerProfile.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-cyan-400/50 shadow-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {ownerInitials}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs - Desktop */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 pt-1 px-1 scrollbar-hide">
              {[
                { id: 'overview', label: 'Dashboard', icon: <BarChart size={16} /> },
                { id: 'houses', label: 'Houses', icon: <Building size={16} /> },
                { id: 'rooms', label: 'Rooms', icon: <Bed size={16} /> },
                { id: 'tenants', label: 'Tenants', icon: <Users size={16} /> },
                { id: 'bookings', label: 'Bookings', icon: <FileText size={16} /> },
                { id: 'kyc', label: 'KYC', icon: <ShieldCheck size={16} /> },
                { id: 'support', label: 'Support', icon: <LifeBuoy size={16} /> },
                { id: 'notices', label: 'Notices', icon: <Mail size={16} /> },
                { id: 'profile', label: 'Profile', icon: <Settings size={16} /> },
                { id: 'notifications', label: 'Alerts', icon: <Bell size={16} />, badge: unreadNotifications },
                { id: 'payment-btn', label: 'Payment', icon: <DollarSign size={16} />, isButton: true }
              ].map((tab) => (
                tab.isButton ? (
                  <button
                    key={tab.id}
                    onClick={() => navigate('/payment-rental')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg shadow-purple-500/25"
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ) : (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      if (tab.id === 'kyc') fetchKycStatus();
                      if (tab.id === 'support') fetchTickets();
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge && tab.badge > 0 && (
                      <span className="ml-1.5 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Dashboard Tab - Desktop */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-xl p-4 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Welcome back, {ownerProfile.fullName}</h3>
                  <p className="text-xs text-gray-300 mt-1">
                    {ownerProfile.companyName ? `${ownerProfile.companyName} • ` : ''}
                    {ownerProfile.email}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-cyan-300 rounded-lg text-xs font-medium transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button 
                  onClick={() => setShowAddHouse(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Add Boarding House
                </button>
                <button 
                  onClick={() => setShowAddRoom(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Add Room
                </button>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FileText size={16} /> View Bookings
                </button>
                <button 
                  onClick={() => setShowNoticeForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Mail size={16} /> Send Notice
                </button>
              </div>

              {/* Alerts Section */}
              {(overdueCount > 0 || vacantBeds > 0 || endingSoonCount > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {overdueCount > 0 && (
                    <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <AlertCircle size={18} className="text-red-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Overdue Payments</h4>
                          <p className="text-xs text-gray-400">{overdueCount} tenants • Rs.{overdueAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => navigate('/payment-rental')}
                          className="flex-1 py-1.5 bg-red-500/40 text-red-300 rounded-lg text-xs font-medium hover:bg-red-500/50 transition-colors flex items-center justify-center gap-1"
                        >
                          <DollarSign size={14} />
                          Payment Portal
                        </button>
                      </div>
                    </div>
                  )}

                  {vacantBeds > 0 && (
                    <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Bed size={18} className="text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Vacant Beds</h4>
                          <p className="text-xs text-gray-400">{vacantBeds} beds available • {vacantRoomsCount} rooms</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('rooms')}
                        className="w-full mt-2 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition-colors"
                      >
                        View Rooms
                      </button>
                    </div>
                  )}

                  {endingSoonCount > 0 && (
                    <div className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <Calendar size={18} className="text-yellow-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Leases Ending Soon</h4>
                          <p className="text-xs text-gray-400">{endingSoonCount} tenants • Next 14 days</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('tenants')}
                        className="w-full mt-2 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-medium hover:bg-yellow-500/30 transition-colors"
                      >
                        View Tenants
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard 
                  title="Boarding Houses" 
                  value={totalHouses} 
                  icon={<Building size={18} />} 
                  trend={12}
                  color="bg-cyan-500/20 text-cyan-400"
                />
                <StatsCard 
                  title="Total Rooms" 
                  value={totalRooms} 
                  icon={<Bed size={18} />} 
                  trend={8}
                  color="bg-purple-500/20 text-purple-400"
                />
                <StatsCard 
                  title="Total Tenants" 
                  value={totalTenants} 
                  icon={<Users size={18} />} 
                  trend={15}
                  color="bg-green-500/20 text-green-400"
                />
                <StatsCard 
                  title="Occupancy Rate" 
                  value={`${occupancyRate}%`} 
                  icon={<TrendingUp size={18} />} 
                  trend={5}
                  color="bg-yellow-500/20 text-yellow-400"
                />
                <StatsCard 
                  title="Vacant Beds" 
                  value={vacantBeds} 
                  icon={<Bed size={18} />} 
                  trend={-3}
                  color="bg-indigo-500/20 text-indigo-400"
                />
                <StatsCard 
                  title="Pending Amount" 
                  value={`Rs.${(pendingAmount / 1000).toFixed(0)}K`} 
                  icon={<AlertCircle size={18} />} 
                  trend={-2}
                  color="bg-orange-500/20 text-orange-400"
                />
                <StatsCard 
                  title="Vacant Rooms" 
                  value={vacantRoomsCount} 
                  icon={<Home size={18} />} 
                  trend={-3}
                  color="bg-red-500/20 text-red-400"
                />
                <StatsCard 
                  title="Pending Rent" 
                  value={`Rs.${(pendingAmount / 1000).toFixed(0)}K`} 
                  icon={<DollarSign size={18} />} 
                  trend={-2}
                  color="bg-orange-500/20 text-orange-400"
                />
              </div>

              {/* Revenue & Payments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Month Revenue */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-sm font-medium text-cyan-300 mb-3 flex items-center gap-2">
                    <DollarSign size={16} />
                    Current Month Revenue
                  </h3>
                  <p className="text-3xl font-bold text-white">Rs.{monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-2">From {totalTenants} paying tenants</p>
                  
                  {/* Sparkline */}
                  <div className="mt-4 mb-2">
                    <Sparkline data={[45, 52, 48, 60, 66, 58, 72]} color="#22d3ee" />
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Collections Progress</span>
                      <span className="text-cyan-400 font-semibold">85%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="text-[10px] px-2 py-1 bg-green-500/20 text-green-400 rounded">↑ 12% vs last month</span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-sm font-medium text-cyan-300 mb-3 flex items-center gap-2">
                    <CreditCard size={16} />
                    Payment Status
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                        <span className="text-xs text-gray-300 block">Pending</span>
                        <span className="text-lg font-bold text-yellow-400">{pendingPayments}</span>
                      </div>
                      <div className="p-2.5 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                        <span className="text-xs text-gray-300 block">Amount</span>
                        <span className="text-sm font-bold text-yellow-400">Rs.{pendingAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 bg-red-900/20 rounded-lg border border-red-500/20">
                        <span className="text-xs text-gray-300 block">Overdue</span>
                        <span className="text-lg font-bold text-red-400">{overdueCount}</span>
                      </div>
                      <div className="p-2.5 bg-red-900/20 rounded-lg border border-red-500/20">
                        <span className="text-xs text-gray-300 block">Amount</span>
                        <span className="text-sm font-bold text-red-400">Rs.{overdueAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-[11px] font-medium hover:shadow-lg transition-all">
                      Download Payment Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Tenants */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-medium text-cyan-300 mb-3 flex items-center gap-2">
                  <Users size={16} />
                  Recent Tenants
                </h3>
                <TenantTable tenants={allTenants.slice(0, 5)} rooms={rooms} />
              </div>

              {/* Top Rated Boarding Houses */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-medium text-cyan-300 mb-3 flex items-center gap-2">
                  <Award size={16} />
                  Top Rated Boarding Houses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {houses.sort((a, b) => b.rating - a.rating).slice(0, 2).map(house => (
                    <div key={house.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                      <img src={house.image} alt={house.name} className="w-12 h-12 aspect-square rounded-lg object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{house.name}</h4>
                        <div className="flex items-center gap-2 text-xs">
                          <Star size={10} className="text-yellow-400" />
                          <span className="text-white">{house.rating}</span>
                          <span className="text-gray-400">({house.totalReviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Houses Tab - Desktop */}
          {activeTab === 'houses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">My Boarding Houses</h2>
                <button 
                  onClick={() => setShowAddHouse(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add House
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {houses.map(house => (
                  <HouseCard 
                    key={house.id}
                    house={house}
                    onSelect={setSelectedHouse}
                    onEdit={handleEditHouse}
                    onDelete={handleDeleteHouse}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rooms Tab - Desktop */}
          {activeTab === 'rooms' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Rooms Management</h2>
                <div className="flex gap-2">
                  <select 
                    value={filterHouse}
                    onChange={(e) => setFilterHouse(e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                  >
                    <option value="all">All Houses</option>
                    {houses.map(house => (
                      <option key={house.id} value={house.id}>{house.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setShowAddRoom(true)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Room
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredRooms.map(room => (
                  <RoomCard 
                    key={room.id}
                    room={room}
                    onEdit={handleEditRoom}
                    onDelete={handleDeleteRoom}
                    onViewTenants={handleViewTenants}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tenants Tab - Desktop */}
          {activeTab === 'tenants' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Tenant Overview</h2>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <TenantTable tenants={allTenants} rooms={rooms} />
              </div>
            </div>
          )}

          {/* Payments Tab - Desktop */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Payments & Receipts</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 col-span-2">
                  <h3 className="text-sm font-medium text-cyan-300 mb-3">Recent Payments</h3>
                  <div className="space-y-2">
                    {allTenants.filter(t => t.paymentStatus === 'paid').slice(0, 5).map(tenant => (
                      <div key={tenant.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-xs text-white">{tenant.name}</p>
                          <p className="text-[10px] text-gray-400">Room {rooms.find(r => r.id === tenant.roomId)?.roomNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white">Rs.{tenant.monthlyRent.toLocaleString()}</p>
                          <p className="text-[10px] text-green-400">Paid</p>
                        </div>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Download size={14} className="text-cyan-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-sm font-medium text-cyan-300 mb-3">Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Total Collected</p>
                      <p className="text-lg font-bold text-white">Rs.{monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Pending</p>
                      <p className="text-sm text-yellow-400">Rs.{pendingAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Overdue</p>
                      <p className="text-sm text-red-400">Rs.{overdueAmount.toLocaleString()}</p>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all">
                        Download All Receipts
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Bookings & Agreements Tabs - Desktop */}

          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'bookings' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'agreements' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'}`}
              onClick={() => setActiveTab('agreements')}
            >
              Agreements
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'notices' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'}`}
              onClick={() => setActiveTab('notices')}
            >
              Notices
            </button>
          </div>

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">Booking Requests Management</h2>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FileText size={14} />
                  <span>Manage student booking requests</span>
                </div>
              </div>
              <BookingManagementSystem />
            </div>
          )}

          {/* Agreement Templates Tab - Desktop */}
          {activeTab === 'agreements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Agreement Templates</h2>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                <h3 className="text-sm font-medium text-cyan-300">Create Agreement</h3>

                <div>
                  <label className="text-xs text-cyan-300 block mb-1">Template Title</label>
                  <input
                    type="text"
                    value={agreementTitle}
                    onChange={(e) => setAgreementTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    placeholder="Standard Student Boarding Agreement"
                  />
                </div>

                <div>
                  <label className="text-xs text-cyan-300 block mb-1">Agreement Content</label>
                  <div className="space-y-2">
                    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden [&_.ql-toolbar]:hidden [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[160px] [&_.ql-editor]:text-white [&_.ql-editor]:text-sm [&_.ql-editor]:px-3 [&_.ql-editor]:py-2 [&_.ql-editor.ql-blank::before]:text-gray-400">
                      <ReactQuill
                        theme="snow"
                        value={agreementContent}
                        onChange={syncAgreementEditorContent}
                        modules={{ toolbar: { container: '#agreement-toolbar-desktop' } }}
                        formats={agreementEditorFormats}
                        placeholder="Write agreement conditions here..."
                      />
                    </div>

                    <div id="agreement-toolbar-desktop" className="flex items-center gap-2 flex-wrap">
                      <select className="ql-header px-2 py-1 bg-white/5 border border-transparent rounded text-xs text-cyan-200 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-colors">
                        <option value="1">H1</option>
                        <option value="2">Heading</option>
                        <option value="3">Subheading</option>
                        <option value="">Body</option>
                      </select>
                      <button
                        type="button"
                        className="ql-bold px-2 py-1 bg-white/5 border border-transparent rounded text-xs text-cyan-300 hover:bg-white/10 active:bg-cyan-500/10 active:border-cyan-400/30 transition-colors"
                      >
                        <span className="font-bold">B</span>
                      </button>
                      <button
                        type="button"
                        className="ql-italic px-2 py-1 bg-white/5 border border-transparent rounded text-xs text-cyan-300 hover:bg-white/10 active:bg-cyan-500/10 active:border-cyan-400/30 transition-colors"
                      >
                        <span className="italic">I</span>
                      </button>
                      <button
                        type="button"
                        value="bullet"
                        className="ql-list px-2 py-1 bg-white/5 border border-transparent rounded text-xs text-cyan-300 hover:bg-white/10 active:bg-cyan-500/10 active:border-cyan-400/30 transition-colors"
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        value="ordered"
                        className="ql-list px-2 py-1 bg-white/5 border border-transparent rounded text-xs text-cyan-300 hover:bg-white/10 active:bg-cyan-500/10 active:border-cyan-400/30 transition-colors"
                      >
                        1. List
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">Use the buttons below to style selected agreement text.</p>
                  </div>
                </div>

                {agreementError && (
                  <div className="text-xs text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
                    {agreementError}
                  </div>
                )}

                <button
                  onClick={handleCreateAgreementTemplate}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                >
                  Create Template
                </button>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-medium text-cyan-300 mb-3">Template Versions</h3>
                <div className="space-y-3">
                  {[...agreementTemplates]
                    .sort((a, b) => b.version - a.version)
                    .map(template => (
                      <div key={template.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-white">v{template.version} • {template.title}</p>
                            <p className="text-[10px] text-gray-400">Updated: {new Date(template.updatedAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 line-clamp-2" dangerouslySetInnerHTML={{ __html: template.content }} />
                      </div>
                    ))}
                </div>
              </div>

              {/* Signed Agreements Tab - Mobile (now main content for Agreements tab) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">Signed Agreements</h2>
                  <span className="text-[9px] text-gray-400">{filteredAgreementInstances.length} records</span>
                </div>

                <div className="space-y-2">
                  {sortedFilteredAgreementInstances.map(agreement => (
                    <div key={agreement.id} className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <button
                        type="button"
                        onClick={() => toggleGroupAgreementExpansion(agreement)}
                        className={`w-full text-left ${agreement.bookingType === 'GROUP' ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        <div className="flex items-center justify-between mb-1.5 gap-2">
                          <p className="text-xs font-semibold text-white truncate">{formatAgreementId(agreement.id)}</p>
                          <span className={`text-[8px] px-2 py-0.5 rounded-full whitespace-nowrap ${getAgreementStatusClass(agreement)}`}>
                            {getAgreementStatusLabel(agreement)}
                          </span>
                        </div>
                        <div className="mb-1.5">
                          <span className={`text-[8px] px-2 py-0.5 rounded-full ${getAgreementTypeClass(agreement.bookingType)}`}>
                            {getAgreementTypeLabel(agreement.bookingType)}
                          </span>
                        </div>
                        <p className="text-[10px] text-white">{agreement.room}</p>
                        <p className="text-[9px] text-gray-300" title={getAgreementStudentsTooltip(agreement)}>
                          Students: {getAgreementStudentSummary(agreement)}
                          {agreement.bookingType === 'GROUP' && (
                            <span className="inline-flex align-middle ml-1">
                              {expandedGroupAgreementId === agreement.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                            </span>
                          )}
                        </p>
                        <p className="text-[9px] text-gray-400">Duration: {getAgreementDurationLabel(agreement.duration)}</p>
                      </button>

                      {agreement.bookingType === 'GROUP' && expandedGroupAgreementId === agreement.id && (
                        <div className="mt-2 space-y-1.5 rounded-lg border border-white/10 bg-[#0f172a]/40 p-2">
                          {agreement.tenants.map((tenant) => (
                            <div key={`${agreement.id}-mobile-${tenant.studentId}-${tenant.name}`} className="rounded-md border border-white/10 bg-white/5 px-2 py-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[10px] text-white font-medium truncate">{tenant.name}</p>
                                <span className={`text-[8px] px-2 py-0.5 rounded-full ${getTenantSignatureStatusClass(tenant)}`}>
                                  {getTenantSignatureStatusLabel(tenant)}
                                </span>
                              </div>
                              {getTenantMetaLine(tenant) && (
                                <p className="text-[8px] text-gray-400 truncate">{getTenantMetaLine(tenant)}</p>
                              )}
                              <p className="text-[8px] text-gray-400">{tenant.signedDate ? `Signed on ${new Date(tenant.signedDate).toLocaleDateString()}` : 'Awaiting sign'}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {canOwnerDownloadAgreement(agreement) ? (
                        <button
                          onClick={() => handleDownloadAgreementPdf(agreement)}
                          className="mt-2 text-[10px] text-cyan-300 active:text-cyan-200 inline-flex items-center gap-1 min-h-[36px]"
                        >
                          <Download size={11} /> PDF
                        </button>
                      ) : (
                        <p className="mt-2 inline-flex items-center px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] text-gray-400">After signing</p>
                      )}
                    </div>
                  ))}

                  {filteredAgreementInstances.length === 0 && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center text-xs text-gray-400">
                      No signed agreement records yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notices Tab - Desktop */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">Notices</h2>
                <button
                  onClick={() => setShowNoticeForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Notice
                </button>
              </div>
              <span className="text-xs text-gray-400">Sent: {notices.length}</span>
              
              {notices.length === 0 ? (
                <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
                  <Mail size={40} className="mx-auto text-gray-500 mb-3" />
                  <p className="text-gray-400">No notices have been sent yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notices.map(notice => (
                    <div key={notice.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-400/30 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-sm text-gray-300 mb-1">{notice.date}</p>
                          <p className="text-white font-medium text-base">{notice.message}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button className="text-purple-400 hover:text-purple-300 p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users size={14} />
                        <span>{notice.recipients}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab - Desktop */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Owner Profile Settings</h2>
                <button
                  onClick={handleSaveProfileSettings}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>

              {profileMessage && (
                <div className="bg-green-900/20 rounded-xl p-3 border border-green-500/30 text-green-300 text-sm">
                  {profileMessage}
                </div>
              )}

              <div className="bg-white/5 rounded-xl p-5 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-300 mb-2">Profile Picture</label>
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                    {ownerProfile.profileImage ? (
                      <img
                        src={ownerProfile.profileImage}
                        alt={ownerProfile.fullName}
                        className="w-20 h-20 rounded-full object-cover border border-cyan-400/50"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                        {ownerInitials}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleOpenProfileImageDialog}
                        className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors"
                      >
                        <Camera size={14} /> Upload Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveProfileImage}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-medium transition-colors"
                      >
                        Remove Photo
                      </button>
                      <p className="w-full text-[11px] text-gray-400">Accepted: JPG/PNG/WebP up to 3MB</p>
                    </div>
                  </div>
                  <input
                    ref={profileImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageUpload}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={ownerProfile.fullName}
                    onChange={(e) => setOwnerProfile((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={ownerProfile.email}
                    disabled
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={ownerProfile.phoneNumber}
                    onChange={(e) => setOwnerProfile((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={ownerProfile.companyName}
                    onChange={(e) => setOwnerProfile((prev) => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Property Count</label>
                  <input
                    type="number"
                    min={0}
                    value={ownerProfile.propertyCount}
                    onChange={(e) => setOwnerProfile((prev) => ({ ...prev, propertyCount: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab - Desktop */}
          {/* KYC Verification Tab */}
          {activeTab === 'kyc' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShieldCheck size={20} className="text-cyan-400" /> Identity Verification (KYC)</h2>

              {/* Status badge */}
              {kycStatus && (
                <div className={`rounded-xl p-4 border flex items-center gap-3 ${
                  kycStatus === 'approved' ? 'bg-green-900/20 border-green-500/30' :
                  kycStatus === 'pending'  ? 'bg-amber-900/20 border-amber-500/30' :
                  kycStatus === 'rejected' ? 'bg-red-900/20 border-red-500/30' :
                                            'bg-white/5 border-white/10'
                }`}>
                  {kycStatus === 'approved' && <CheckCircle size={20} className="text-green-400 flex-shrink-0" />}
                  {kycStatus === 'pending'  && <Clock size={20} className="text-amber-400 flex-shrink-0" />}
                  {kycStatus === 'rejected' && <AlertCircle size={20} className="text-red-400 flex-shrink-0" />}
                  {kycStatus === 'not_submitted' && <ShieldCheck size={20} className="text-gray-400 flex-shrink-0" />}
                  <div>
                    <p className="text-sm font-semibold text-white capitalize">{kycStatus.replace('_', ' ')}</p>
                    {kycStatus === 'approved' && <p className="text-xs text-green-300 mt-0.5">Your identity is verified. You can list properties.</p>}
                    {kycStatus === 'pending'  && <p className="text-xs text-amber-300 mt-0.5">Your documents are under review. This takes 1–2 business days.</p>}
                    {kycStatus === 'rejected' && <p className="text-xs text-red-300 mt-0.5">Reason: {kycRejectionReason || 'Documents were unclear. Please resubmit.'}</p>}
                    {kycStatus === 'not_submitted' && <p className="text-xs text-gray-400 mt-0.5">Upload your documents to get verified.</p>}
                  </div>
                </div>
              )}

              {/* Upload form — show if not approved */}
              {kycStatus !== 'approved' && (
                <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-4">
                  <p className="text-sm text-gray-300">Upload clear photos of the following documents:</p>
                  {(['nicFront', 'nicBack', 'selfie'] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        {field === 'nicFront' ? 'NIC Front' : field === 'nicBack' ? 'NIC Back' : 'Selfie with NIC'}
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-cyan-400/40 rounded-lg text-xs text-gray-300 transition-colors">
                          <Upload size={14} />
                          {kycFiles[field] ? kycFiles[field]!.name : 'Choose file'}
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => setKycFiles(prev => ({ ...prev, [field]: e.target.files?.[0] || null }))} />
                        </label>
                        {kycFiles[field] && <CheckCircle size={14} className="text-green-400" />}
                      </div>
                    </div>
                  ))}

                  {kycError   && <p className="text-xs text-red-400 flex items-center gap-1.5"><AlertCircle size={13} />{kycError}</p>}
                  {kycSuccess && <p className="text-xs text-green-400 flex items-center gap-1.5"><CheckCircle size={13} />{kycSuccess}</p>}

                  <button onClick={handleKycSubmit} disabled={kycUploading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity">
                    {kycUploading ? <><Loader2 size={14} className="animate-spin" />Uploading…</> : <><Upload size={14} />Submit Documents</>}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === 'support' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><LifeBuoy size={20} className="text-cyan-400" /> Support Tickets</h2>

              {/* New ticket form */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-4">
                <h3 className="text-sm font-semibold text-white">Open a New Ticket</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Subject</label>
                  <input value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} maxLength={120}
                    placeholder="Brief description of your issue"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                  <select value={ticketCategory} onChange={e => setTicketCategory(e.target.value)}
                    className="w-full bg-[#131a30] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/50 [color-scheme:dark]">
                    <option value="account">Account</option>
                    <option value="payment">Payment</option>
                    <option value="listing">Listing</option>
                    <option value="booking">Booking</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                  <textarea value={ticketDescription} onChange={e => setTicketDescription(e.target.value)}
                    rows={4} placeholder="Describe your issue in detail…"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 resize-none" />
                </div>
                {ticketError   && <p className="text-xs text-red-400 flex items-center gap-1.5"><AlertCircle size={13} />{ticketError}</p>}
                {ticketSuccess && <p className="text-xs text-green-400 flex items-center gap-1.5"><CheckCircle size={13} />{ticketSuccess}</p>}
                <button onClick={handleTicketSubmit} disabled={ticketLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity">
                  {ticketLoading ? <><Loader2 size={14} className="animate-spin" />Submitting…</> : <><Send size={14} />Submit Ticket</>}
                </button>
              </div>

              {/* Ticket history */}
              {tickets.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Your Tickets</h3>
                  {tickets.map((t: any) => (
                    <div key={t._id} className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">{t.subject}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'open'        ? 'bg-cyan-500/20 text-cyan-300' :
                          t.status === 'in_progress' ? 'bg-amber-500/20 text-amber-300' :
                          t.status === 'resolved'    ? 'bg-green-500/20 text-green-300' :
                                                       'bg-gray-500/20 text-gray-400'
                        }`}>{t.status.replace('_', ' ')}</span>
                      </div>
                      <p className="text-xs text-gray-400 capitalize">{t.category} · {new Date(t.createdAt).toLocaleDateString()}</p>
                      {t.messages?.length > 0 && (
                        <p className="text-xs text-cyan-300 mt-1">Admin replied: {t.messages[t.messages.length - 1].content}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Notifications</h2>
                <button 
                  onClick={() => setUnreadNotifications(0)}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Mark all as read
                </button>
              </div>

              <div className="space-y-3">
                {/* New Booking Notifications */}
                <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-xl p-4 border border-cyan-500/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-white">New Booking Request</h4>
                        <span className="text-xs text-gray-400">2 hours ago</span>
                      </div>
                      <p className="text-xs text-gray-300">
                        Kasun Perera submitted a booking request for "Modern Boarding House near SLIIT"
                      </p>
                      <button 
                        onClick={() => setActiveTab('bookings')}
                        className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        View Request <ArrowRight size={12} />
                      </button>
                    </div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Payment Uploaded Notification */}
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Upload size={20} className="text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-white">Payment Slip Uploaded</h4>
                        <span className="text-xs text-gray-400">5 hours ago</span>
                      </div>
                      <p className="text-xs text-gray-300">
                        Nimal Fernando uploaded payment slip for booking #BK003
                      </p>
                      <button 
                        onClick={() => setActiveTab('bookings')}
                        className="mt-2 text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
                      >
                        <span>Verify Payment</span> <ArrowRight size={12} />
                      </button>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Payment Reminder Notification */}
                <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-4 border border-amber-500/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle size={20} className="text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-white">Payment Reminder</h4>
                        <span className="text-xs text-gray-400">1 day ago</span>
                      </div>
                      <p className="text-xs text-gray-300">
                        {overdueCount} tenants have overdue payments totaling Rs.{overdueAmount.toLocaleString()}
                      </p>
                      <button 
                        onClick={() => setActiveTab('payments')}
                        className="mt-2 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        <span>View Payments</span> <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Review Notification */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star size={20} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-white">New Review</h4>
                        <span className="text-xs text-gray-400">2 days ago</span>
                      </div>
                      <p className="text-xs text-gray-300">
                        Alice Perera left a 5-star review for Sunrise Boarding House
                      </p>
                      <div className="mt-2 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Notification */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings size={20} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-white">System Update</h4>
                        <span className="text-xs text-gray-400">3 days ago</span>
                      </div>
                      <p className="text-xs text-gray-300">
                        New features added: Automated receipt generation and payment tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add House Modal - Desktop */}
      {showAddHouse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-[#131d3a] to-[#0b132b] rounded-xl border border-white/10 max-w-5xl w-full my-8 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {editingHouse ? (
                  <>
                    <span className="inline-flex items-center gap-2"><Plus size={22} className="text-cyan-400" /> Edit Boarding House</span>
                  </>
                ) : (
                  <><Plus size={22} className="text-cyan-400" /> Add Boarding House</>
                )}
              </h2>
              <button
                onClick={() => {
                  setShowAddHouse(false);
                  setEditingHouse(null);
                  setNewHouse({
                    name: '',
                    address: '',
                    totalRooms: 0,
                    monthlyPrice: 0,
                    roomType: 'Single Room',
                    availableFrom: '',
                    deposit: 0,
                    roommateCount: 'None (Private)',
                    description: '',
                    features: [],
                    genderPreference: 'any',
                  });
                  setUploadedHouseImages([]);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="text-gray-400 hover:text-white" size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-300 mb-1">House Name *</label>
                      <input
                        type="text"
                        value={newHouse.name}
                        onChange={(e) => setNewHouse((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                        placeholder="e.g., Lake View Boarding House"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-300 mb-1">Distance from SLIIT *</label>
                      <input
                        type="text"
                        value={newHouse.address}
                        onChange={(e) => setNewHouse((prev) => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                        placeholder="e.g., 0.8 km from SLIIT"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Total Rooms</label>
                      <input
                        type="number"
                        min={0}
                        value={newHouse.totalRooms}
                        onChange={(e) => setNewHouse((prev) => ({ ...prev, totalRooms: Number(e.target.value) || 0 }))}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Price (Rs./month)</label>
                      <input
                        type="number"
                        min={0}
                        value={newHouse.monthlyPrice}
                        onChange={(e) => setNewHouse((prev) => ({ ...prev, monthlyPrice: Number(e.target.value) || 0 }))}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                        placeholder="18000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Room Type</label>
                      <select
                        value={newHouse.roomType}
                        onChange={(e) => setNewHouse((prev) => ({ ...prev, roomType: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option>Single Room</option>
                        <option>Shared Room</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Available From</label>
                      <input
                        type="date"
                        value={newHouse.availableFrom}
                        onChange={(e) => setNewHouse((prev) => ({ ...prev, availableFrom: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Bodim Price (Rs.)</label>
                      <input
                        type="number"
                        min={0}
                        value={newHouse.deposit}
                        onChange={(e) => setNewHouse((prev) => ({ ...prev, deposit: Number(e.target.value) || 0 }))}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                        placeholder="e.g., 18000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Roommates</label>
                      <select
                        value={newHouse.roommateCount}
                        onChange={(e) => setNewHouse((prev) => ({ ...prev, roommateCount: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option>None (Private)</option>
                        <option>1 Roommate</option>
                        <option>2 Roommates</option>
                        <option>3+ Roommates</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-300 mb-2">Gender Preference</label>
                      <div className="grid grid-cols-3 gap-2">
                        <label className={`px-3 py-2 rounded-lg border text-xs text-center cursor-pointer transition-colors ${newHouse.genderPreference === 'any' ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200' : 'border-white/10 bg-white/5 text-gray-300'}`}>
                          <input
                            type="radio"
                            name="boarding-house-gender"
                            value="any"
                            checked={newHouse.genderPreference === 'any'}
                            onChange={(e) => setNewHouse((prev) => ({ ...prev, genderPreference: e.target.value as 'any' | 'girls' | 'boys' }))}
                            className="hidden"
                          />
                          Any
                        </label>
                        <label className={`px-3 py-2 rounded-lg border text-xs text-center cursor-pointer transition-colors ${newHouse.genderPreference === 'girls' ? 'border-pink-400 bg-pink-500/20 text-pink-200' : 'border-white/10 bg-white/5 text-gray-300'}`}>
                          <input
                            type="radio"
                            name="boarding-house-gender"
                            value="girls"
                            checked={newHouse.genderPreference === 'girls'}
                            onChange={(e) => setNewHouse((prev) => ({ ...prev, genderPreference: e.target.value as 'any' | 'girls' | 'boys' }))}
                            className="hidden"
                          />
                          Girls
                        </label>
                        <label className={`px-3 py-2 rounded-lg border text-xs text-center cursor-pointer transition-colors ${newHouse.genderPreference === 'boys' ? 'border-blue-400 bg-blue-500/20 text-blue-200' : 'border-white/10 bg-white/5 text-gray-300'}`}>
                          <input
                            type="radio"
                            name="boarding-house-gender"
                            value="boys"
                            checked={newHouse.genderPreference === 'boys'}
                            onChange={(e) => setNewHouse((prev) => ({ ...prev, genderPreference: e.target.value as 'any' | 'girls' | 'boys' }))}
                            className="hidden"
                          />
                          Boys
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-300 mb-1">Description</label>
                      <textarea
                        value={newHouse.description}
                        onChange={(e) => setNewHouse((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none h-24"
                        placeholder="Spacious, fully furnished room with attached bathroom. Walking distance to SLIIT campus. Includes WiFi, AC, and study table."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-300 mb-2">Features</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {facilitiesList.map((facility) => (
                          <label key={`house-feature-${facility.id}`} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:border-cyan-400/50 transition-colors">
                            <input
                              type="checkbox"
                              checked={newHouse.features.includes(facility.id)}
                              onChange={() => handleHouseFeatureToggle(facility.id)}
                              className="cursor-pointer"
                            />
                            <span className="text-xs text-gray-300 flex items-center gap-1">
                              {facility.icon}
                              {facility.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-3">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <label className="block text-sm font-medium text-cyan-300 mb-2">Boarding House Images</label>
                    <button
                      onClick={handleOpenHouseFileDialog}
                      className="w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Upload size={16} /> Upload Images
                    </button>
                    <input
                      ref={houseFileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleHouseFileUpload}
                    />

                    {uploadedHouseImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {uploadedHouseImages.map((image, index) => (
                          <div key={`house-preview-${index}`} className="relative group">
                            <img
                              src={image}
                              alt={`Boarding house preview ${index + 1}`}
                              className="w-full h-20 aspect-square object-cover rounded-lg border border-white/10"
                            />
                            <button
                              onClick={() => removeHouseImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-400 mt-2">No images selected yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-white/10 sticky bottom-0 bg-gradient-to-r from-[#131d3a]/95 to-[#0b132b]/95">
                <button
                  onClick={() => {
                    setShowAddHouse(false);
                    setEditingHouse(null);
                    setNewHouse({
                      name: '',
                      address: '',
                      totalRooms: 0,
                      monthlyPrice: 0,
                      roomType: 'Single Room',
                      availableFrom: '',
                      deposit: 0,
                      roommateCount: 'None (Private)',
                      description: '',
                      features: [],
                      genderPreference: 'any',
                    });
                    setUploadedHouseImages([]);
                  }}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveHouse}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                >
                  {editingHouse ? 'Update Boarding House' : 'Save Boarding House'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Room Modal - Desktop */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-[#131d3a] to-[#0b132b] rounded-xl border border-white/10 max-w-2xl w-full my-8 p-6 shadow-2xl" >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus size={24} className="text-cyan-400" /> Add New Room
              </h2>
              <button
                onClick={() => setShowAddRoom(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="text-gray-400 hover:text-white" size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Room Images Upload */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <label className="block text-sm font-medium text-cyan-300 mb-2">Room Images</label>
                <div className="space-y-2">
                  <button
                    onClick={handleOpenFileDialog}
                    className="w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload size={16} /> Upload Images (Multiple)
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {uploadedRoomImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {uploadedRoomImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Room ${idx}`} className="w-full h-20 aspect-square rounded-lg object-cover border border-white/10" />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-300 mb-1">Listing Title</label>
                  <input
                    type="text"
                    value={newRoom.listingTitle}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, listingTitle: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g., Modern Boarding House near SLIIT"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">House *</label>
                  <select
                    value={newRoom.houseId}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, houseId: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Select House</option>
                    {houses.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Room Number *</label>
                  <input
                    type="text"
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, roomNumber: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g., 101"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Location *</label>
                  <input
                    type="text"
                    value={newRoom.location}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g., Malabe (0.8km from SLIIT)"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Tip: Add distance from campus, e.g. 0.8km from SLIIT</p>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Room Type</label>
                  <select
                    value={newRoom.roomType}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, roomType: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option>Single Room</option>
                    <option>Shared Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Monthly Price (Rs.)</label>
                  <input
                    type="number"
                    value={newRoom.price}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="18000"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Bodim Price (Rs.)</label>
                  <input
                    type="number"
                    value={newRoom.deposit}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, deposit: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g., 18000"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Bed Count</label>
                  <input
                    type="number"
                    min={1}
                    value={newRoom.bedCount}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, bedCount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Available From</label>
                  <input
                    type="date"
                    value={newRoom.availableFrom}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, availableFrom: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Gender Preference</label>
                  <select
                    value={newRoom.genderPreference}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, genderPreference: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option>Any</option>
                    <option>Female Only</option>
                    <option>Male Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Roommate Count</label>
                  <select
                    value={newRoom.roommateCount}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, roommateCount: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option>None (Private)</option>
                    <option>1 Roommate</option>
                    <option>2 Roommates</option>
                    <option>3+ Roommates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Floor</label>
                  <input
                    type="number"
                    min={1}
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom((prev) => ({ ...prev, floor: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-gray-300 mb-1">Description</label>
                <textarea
                  value={newRoom.description}
                  onChange={(e) => setNewRoom((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none h-24"
                  placeholder="Spacious, fully furnished room with attached bathroom. Walking distance to SLIIT campus. Includes WiFi, AC, and study table."
                />
              </div>

              {/* Facilities */}
              <div>
                <label className="block text-xs text-gray-300 mb-2">Features</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {facilitiesList.map((facility) => (
                    <label key={facility.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:border-cyan-400/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={newRoom.facilities.includes(facility.id)}
                        onChange={() => handleFacilityToggle(facility.id)}
                        className="cursor-pointer"
                      />
                      <span className="text-xs text-gray-300 flex items-center gap-1">
                        {facility.icon}
                        {facility.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowAddRoom(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRoom}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                >
                  Save Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  // Mobile view continues from here  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      <div className="text-center py-20 text-white">
        <p>Mobile view - Work in progress</p>
      </div>
    </div>
  );
}