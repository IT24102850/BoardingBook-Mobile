import React from 'react';
import { FaSlidersH, FaRedo } from 'react-icons/fa';
import { BiWifi, BiWind, BiRestaurant, BiShower, BiCar, BiLoaderCircle, BiShield, BiDumbbell, BiCheck } from 'react-icons/bi';

const FACILITIES: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'WiFi',     label: 'WiFi',         icon: <BiWifi size={15} /> },
  { key: 'AC',       label: 'Air-Cond',     icon: <BiWind size={15} /> },
  { key: 'Meals',    label: 'Meals',        icon: <BiRestaurant size={15} /> },
  { key: 'Bathroom', label: 'Private Bath', icon: <BiShower size={15} /> },
  { key: 'Parking',  label: 'Parking',      icon: <BiCar size={15} /> },
  { key: 'Laundry',  label: 'Laundry',      icon: <BiLoaderCircle size={15} /> },
  { key: 'Security', label: 'Security',     icon: <BiShield size={15} /> },
  { key: 'Gym',      label: 'Gym',          icon: <BiDumbbell size={15} /> },
];

interface FiltersPanelProps {
  filters: {
    priceMax: number;
    dist: string;
    room: string;
    avail: string;
    facs: string[];
    rating: number;
  };
  setters: {
    setPriceMax: (value: number) => void;
    setDist: (value: string) => void;
    setRoom: (value: string) => void;
    setAvail: (value: string) => void;
    setFacs: (value: string[]) => void;
    setRating: (value: number) => void;
  };
  onReset: () => void;
}

export default function FiltersPanel({ filters, setters, onReset }: FiltersPanelProps) {
  const { priceMax, dist, room, avail, facs, rating } = filters;
  const { setPriceMax, setDist, setRoom, setAvail, setFacs, setRating } = setters;

  function toggleFac(key: string) {
    setFacs(
      facs.includes(key) ? facs.filter((f) => f !== key) : [...facs, key]
    );
  }

  function starClick(v: number) {
    setRating(rating === v ? 0 : v);
  }

  return (
    <div className="bg-gradient-to-br from-[#181f36]/95 to-[#232b47]/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <FaSlidersH className="text-cyan-400" />
          Real-Time Filters
        </h3>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 font-semibold text-sm border border-red-400/30 transition-all duration-300"
        >
          <FaRedo className="text-xs" />
          Reset All
        </button>
      </div>

      {/* Row 1: Price | Distance | Room Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Price Range */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-cyan-300">
            Price Range (Rs./Month)
          </label>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Rs. 3,000</span>
            <span className="text-white font-bold">Rs. {priceMax.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="3000"
            max="50000"
            step="500"
            value={priceMax}
            onChange={(e) => setPriceMax(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Rs. 3,000</span>
            <span>Rs. 50,000</span>
          </div>
        </div>

        {/* Distance */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-cyan-300">
            Max Distance from Campus
          </label>
          <div className="flex flex-wrap gap-2">
            {['500m', '1km', '2km', '5km', 'any'].map((v) => (
              <button
                key={v}
                onClick={() => setDist(v)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  dist === v
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {v === 'any' ? 'Any' : v}
              </button>
            ))}
          </div>
        </div>

        {/* Room Type */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-cyan-300">
            Room Type
          </label>
          <div className="flex flex-wrap gap-2">
            {['All', 'Single', 'Master', 'Sharing', 'Annex'].map((v) => (
              <button
                key={v}
                onClick={() => setRoom(v)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  room === v
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10"></div>

      {/* Row 2: Availability | Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Availability */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-cyan-300">
            Availability
          </label>
          <div className="flex flex-wrap gap-2">
            {['all', 'available', 'occupied'].map((v) => (
              <button
                key={v}
                onClick={() => setAvail(v)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  avail === v
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-cyan-300">
            Minimum Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <span
                key={v}
                onClick={() => starClick(v)}
                className={`text-3xl cursor-pointer transition-all duration-300 ${
                  rating >= v
                    ? 'text-yellow-400 scale-110'
                    : 'text-gray-600 hover:text-yellow-500'
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-3 text-sm font-medium text-gray-300">
              {rating > 0 ? `${rating}+ Stars` : 'Any'}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10"></div>

      {/* Row 3: Facilities */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-cyan-300">
          Facilities
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {FACILITIES.map(({ key, label, icon }) => (
            <div
              key={key}
              onClick={() => toggleFac(key)}
              className={`relative px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 border ${
                facs.includes(key)
                  ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border-indigo-400/50 shadow-lg shadow-indigo-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div
                className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                  facs.includes(key) ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'
                }`}
              >
                {facs.includes(key) && <BiCheck size={13} />}
              </div>
              <span className="text-sm font-medium text-white flex items-center gap-2">
                {icon}{label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
