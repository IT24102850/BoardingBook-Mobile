import React from 'react';
import { fi } from '../../data/rooms';
import { BiMapPin, BiBed, BiUser, BiRuler, BiCheck, BiX } from 'react-icons/bi';

interface Room {
  id: number;
  name: string;
  location: string;
  campus: string;
  distKm: number;
  price: number;
  roomType: string;
  facilities: string[];
  available: boolean;
  rating: number;
  reviews: number;
  owner: string;
  img: string;
  desc: string;
}

interface RoomCardProps {
  room: Room;
  onOpen: (id: number) => void;
}

export default function RoomCard({ room: r, onOpen }: RoomCardProps) {
  const halfStar = r.rating % 1 >= 0.5 ? '½' : '';
  const starsStr = '★'.repeat(Math.floor(r.rating)) + halfStar;

  return (
    <div
      className="group relative bg-gradient-to-br from-[#181f36]/95 to-[#232b47]/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20"
      onClick={() => onOpen(r.id)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={r.img}
          alt={r.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Availability Badge */}
        {r.available ? (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1">
            <BiCheck size={14} /> Available
          </span>
        ) : (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1">
            <BiX size={14} /> Occupied
          </span>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/95 to-indigo-600/95 backdrop-blur-sm text-white font-bold text-lg shadow-lg">
          Rs. {r.price.toLocaleString()}/mo
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Room Name */}
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
          {r.name}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-cyan-200/80">
          <BiMapPin size={16} className="flex-shrink-0 mt-0.5" />
          <span className="flex-1 line-clamp-1">
            {r.location} · {r.distKm}km from {r.campus}
          </span>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1">
            <BiBed size={13} /> {r.roomType}
          </span>
          <span className="px-2 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1">
            <BiRuler size={13} /> {r.distKm}km
          </span>
          <span className="px-2 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1">
            <BiUser size={13} /> {r.owner}
          </span>
        </div>

        {/* Facilities Tags */}
        <div className="flex flex-wrap gap-2">
          {r.facilities.slice(0, 3).map((f) => (
            <span
              key={f}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-200 text-xs font-medium border border-indigo-400/30"
            >
              {fi(f)}
            </span>
          ))}
          {r.facilities.length > 3 && (
            <span className="px-3 py-1 rounded-lg bg-white/10 text-gray-300 text-xs font-medium">
              +{r.facilities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer: Rating + Button */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg">{starsStr}</span>
            <span className="text-white font-semibold">{r.rating}</span>
            <span className="text-xs text-gray-400">({r.reviews} reviews)</span>
          </div>

          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(r.id);
            }}
          >
            View Room
          </button>
        </div>
      </div>
    </div>
  );
}
