import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Home, Users, Zap, Wifi, DollarSign,
  School, Heart, Share2, ChevronLeft, Star,
  Calendar, Bed, Bath, Utensils, Check
} from 'lucide-react';
import { FaArrowLeft, FaPhone, FaEnvelope } from 'react-icons/fa';

interface BoardingPlace {
  id: string;
  name: string;
  price: number;
  location: string;
  distance: string;
  image: string;
  owner: string;
  ownerPhone: string;
  ownerEmail: string;
  rating: number;
  reviews: number;
  description: string;
  facilities: string[];
  roomTypes: string[];
  availableRooms: number;
  gender: string;
  academicYear: string;
  bills: string;
  deposit: number;
  availableFrom: string;
  images: string[];
}

const boardingPlaces: Record<string, BoardingPlace> = {
  '1': {
    id: '1',
    name: 'Modern Boarding House near SLIIT',
    price: 18000,
    location: 'Malabe, Colombo',
    distance: '2.5 km',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400',
    owner: 'Mr. Janaka Perera',
    ownerPhone: '+94 77 123 4567',
    ownerEmail: 'janaka@boarding.com',
    rating: 4.8,
    reviews: 45,
    description: 'A modern and spacious boarding house with excellent facilities for university students. Located just 2.5km from SLIIT campus. Features include AC rooms, high-speed WiFi, and 24/7 security.',
    facilities: ['WiFi', 'AC', 'Hot Water', 'Parking', 'Kitchen', 'Laundry', 'CCTV', '24/7 Security'],
    roomTypes: ['Single Room', 'Shared Room (2 beds)', 'Suite (3 beds)'],
    availableRooms: 3,
    gender: 'Any',
    academicYear: 'All Years',
    bills: 'Included',
    deposit: 36000,
    availableFrom: '2026-03-15',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600',
      'https://images.unsplash.com/photo-1505873242700-f289a29e7e0f?w=800&h=600'
    ]
  }
};

export default function BoardingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const boarding = boardingPlaces[id || '1'] || boardingPlaces['1'];

  const handleCreateGroup = () => {
    navigate('/roommate-group', { state: { boarding } });
  };

  const handleIndividualBooking = () => {
    navigate('/booking-agreement', { state: { booking: { boarding, type: 'individual' } } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#0a1124] to-[#131d3a] border-b border-white/10 p-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
        >
          <FaArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-bold text-white flex-1 ml-4 truncate">{boarding.name}</h1>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2 rounded-lg ${isSaved ? 'bg-red-500/20' : 'bg-white/10'} hover:bg-white/20`}
        >
          <Heart size={20} className={isSaved ? 'text-red-400 fill-red-400' : 'text-white'} />
        </button>
      </div>

      {/* Image Carousel */}
      <div className="relative w-full h-96 bg-black overflow-hidden">
        <img
          src={boarding.images[selectedImageIndex]}
          alt={boarding.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : boarding.images.length - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
        >
          ←
        </button>
        <button
          onClick={() => setSelectedImageIndex((prev) => (prev < boarding.images.length - 1 ? prev + 1 : 0))}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
        >
          →
        </button>
        {/* Thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {boarding.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === selectedImageIndex ? 'bg-cyan-400 w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Price and Rating */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-cyan-400">Rs. {boarding.price.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">per month</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={20} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white font-bold text-xl">{boarding.rating}</span>
            </div>
            <span className="text-gray-400">({boarding.reviews} reviews)</span>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-start gap-4">
            <MapPin className="text-cyan-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <div className="text-white font-semibold text-lg">{boarding.location}</div>
              <div className="text-gray-400">{boarding.distance} from campus</div>
              <div className="text-cyan-400 text-sm mt-2 cursor-pointer hover:underline">View on map →</div>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-bold text-lg mb-3">Owner Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 w-24">Owner:</span>
              <span className="text-white font-semibold">{boarding.owner}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhone className="text-cyan-400" />
              <a href={`tel:${boarding.ownerPhone}`} className="text-cyan-400 hover:underline">
                {boarding.ownerPhone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-cyan-400" />
              <a href={`mailto:${boarding.ownerEmail}`} className="text-cyan-400 hover:underline">
                {boarding.ownerEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-gray-400 text-sm mb-1">Room Type</div>
            <div className="text-white font-semibold">{boarding.roomTypes[0]}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-gray-400 text-sm mb-1">Available Rooms</div>
            <div className="text-white font-semibold">{boarding.availableRooms} rooms</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-gray-400 text-sm mb-1">Security Deposit</div>
            <div className="text-white font-semibold">Rs. {boarding.deposit.toLocaleString()}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-gray-400 text-sm mb-1">Available From</div>
            <div className="text-white font-semibold">{boarding.availableFrom}</div>
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-bold text-lg mb-4">Facilities & Amenities</h3>
          <div className="grid grid-cols-2 gap-3">
            {boarding.facilities.map((facility, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-300">
                <Check size={18} className="text-cyan-400" />
                <span>{facility}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-bold text-lg mb-3">About</h3>
          <p className="text-gray-300 leading-relaxed">{boarding.description}</p>
        </div>

        {/* Contact Owner */}
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-6 border border-pink-500/30">
          <h3 className="text-white font-bold text-lg mb-4">Communication</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/chat', { state: { boardingChat: { id: boarding.id, name: boarding.name, owner: boarding.owner, ownerPhone: boarding.ownerPhone, ownerEmail: boarding.ownerEmail }, chatType: 'boarding-owner' } })}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              💬 Message Owner
            </button>
            <button
              onClick={() => navigate('/chat', { state: { boardingChat: { id: boarding.id, name: boarding.name, owner: boarding.owner }, chatType: 'boarding-inquiry' } })}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              ❓ Ask Question
            </button>
          </div>
        </div>

        {/* Booking Options */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-6 border border-cyan-500/30">
          <h3 className="text-white font-bold text-lg mb-4">How do you want to book?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleCreateGroup}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Users size={20} />
              Create Roommate Group
            </button>
            <button
              onClick={handleIndividualBooking}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Book Individually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
