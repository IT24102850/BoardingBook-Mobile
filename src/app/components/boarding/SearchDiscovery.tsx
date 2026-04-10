import React, { useState } from 'react';
import SearchSection from './SearchSection';
import { ROOMS } from '../../data/rooms';
import { FaTimes, FaMapMarkerAlt, FaStar, FaHeart, FaShare } from 'react-icons/fa';
import { BiCheck, BiX } from 'react-icons/bi';

export default function SearchDiscovery() {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const selectedRoom = selectedRoomId ? ROOMS.find((r) => r.id === selectedRoomId) : null;

  const closeModal = () => setSelectedRoomId(null);

  const handleOpenModal = (roomId: number) => {
    setSelectedRoomId(roomId);
  };

  return (
    <>
      <SearchSection onOpenModal={handleOpenModal} />

      {/* Room Details Modal */}
      {selectedRoom && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-[#181f36] to-[#232b47] rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 z-10"
            >
              <FaTimes />
            </button>

            {/* Image Section */}
            <div className="relative h-80 overflow-hidden rounded-t-3xl">
              <img
                src={selectedRoom.img}
                alt={selectedRoom.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Status Badge */}
              <div className="absolute top-6 left-6">
                {selectedRoom.available ? (
                  <span className="px-4 py-2 rounded-full bg-green-500/90 backdrop-blur-sm text-white font-semibold flex items-center gap-2">
                    <BiCheck size={16} /> Available
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-full bg-red-500/90 backdrop-blur-sm text-white font-semibold flex items-center gap-2">
                    <BiX size={16} /> Occupied
                  </span>
                )}
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedRoom.name}</h2>
                <div className="flex items-center gap-2 text-cyan-200">
                  <FaMapMarkerAlt />
                  <span>{selectedRoom.location} · {selectedRoom.distKm}km from {selectedRoom.campus}</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-6">
              {/* Price and Rating */}
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Rs. {selectedRoom.price.toLocaleString()}/month
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-2xl">
                    {'★'.repeat(Math.floor(selectedRoom.rating))}
                    {selectedRoom.rating % 1 >= 0.5 ? '½' : ''}
                  </span>
                  <span className="text-white font-semibold text-xl">{selectedRoom.rating}</span>
                  <span className="text-gray-400">({selectedRoom.reviews} reviews)</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-cyan-300 mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">{selectedRoom.desc}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-cyan-400 text-sm mb-1">Room Type</div>
                  <div className="text-white font-semibold">{selectedRoom.roomType}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-cyan-400 text-sm mb-1">Distance</div>
                  <div className="text-white font-semibold">{selectedRoom.distKm}km</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-cyan-400 text-sm mb-1">Owner</div>
                  <div className="text-white font-semibold">{selectedRoom.owner}</div>
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h3 className="text-lg font-bold text-cyan-300 mb-3">Facilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedRoom.facilities.map((facility) => (
                    <div
                      key={facility}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 text-white"
                    >
                      <span className="text-lg">✓</span>
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50">
                  Book Now
                </button>
                <button className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300">
                  <FaHeart className="text-xl" />
                </button>
                <button className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300">
                  <FaShare className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

