import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Users, Calendar, DollarSign, ArrowRight } from 'lucide-react';

export default function ApprovalSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  const booking = location.state?.booking;

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">No booking data found</p>
          <button onClick={() => navigate('/')} className="text-cyan-400 hover:underline">
            Go to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] flex flex-col items-center justify-center p-6">
      {/* Success Animation */}
      <div className={`mb-8 transform transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 animate-pulse opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle className="w-24 h-24 text-green-400 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">
          Booking Approved!
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          Congratulations! Your {booking.type === 'group' ? 'group booking' : 'booking'} has been approved.
        </p>
        <p className="text-gray-400">
          The owner has confirmed your booking request. The next step is to review and sign the digital agreement.
        </p>
      </div>

      {/* Booking Details */}
      <div className="w-full max-w-2xl bg-white/5 rounded-lg p-6 border border-white/10 mb-8 space-y-4">
        <h2 className="text-white font-bold text-lg mb-4">Booking Details</h2>

        {/* Boarding Info */}
        <div className="flex items-start gap-4">
          <div className="bg-cyan-500/20 rounded-lg p-3">
            <Home className="text-cyan-400" size={24} />
          </div>
          <div className="flex-1">
            <div className="text-gray-400 text-sm">Boarding</div>
            <div className="text-white font-semibold">{booking.boarding.name}</div>
            <div className="text-cyan-400 text-sm">{booking.boarding.location}</div>
          </div>
        </div>

        {/* Group Info (if group booking) */}
        {booking.type === 'group' && (
          <div className="flex items-start gap-4">
            <div className="bg-purple-500/20 rounded-lg p-3">
              <Users className="text-purple-400" size={24} />
            </div>
            <div className="flex-1">
              <div className="text-gray-400 text-sm">Group Name</div>
              <div className="text-white font-semibold">{booking.groupName}</div>
              <div className="text-purple-400 text-sm">{booking.members?.length || 0} members</div>
            </div>
          </div>
        )}

        {/* Price Info */}
        <div className="flex items-start gap-4">
          <div className="bg-yellow-500/20 rounded-lg p-3">
            <DollarSign className="text-yellow-400" size={24} />
          </div>
          <div className="flex-1">
            <div className="text-gray-400 text-sm">Monthly Rent</div>
            <div className="text-white font-bold text-2xl">
              Rs. {booking.boarding.price.toLocaleString()}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              Deposit: Rs. {(booking.boarding.price * 2).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Move-in Date */}
        <div className="flex items-start gap-4">
          <div className="bg-green-500/20 rounded-lg p-3">
            <Calendar className="text-green-400" size={24} />
          </div>
          <div className="flex-1">
            <div className="text-gray-400 text-sm">Available From</div>
            <div className="text-white font-semibold">{booking.boarding.availableFrom}</div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="w-full max-w-2xl bg-white/5 rounded-lg p-6 border border-white/10 mb-8">
        <h2 className="text-white font-bold text-lg mb-4">What's Next?</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-cyan-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold">
              1
            </div>
            <div>
              <div className="text-white font-semibold">Review Digital Agreement</div>
              <div className="text-gray-400 text-sm">Read and understand all terms and conditions</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-purple-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
              2
            </div>
            <div>
              <div className="text-white font-semibold">Sign the Agreement</div>
              <div className="text-gray-400 text-sm">Digitally sign the boarding agreement document</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-green-400 font-bold">
              3
            </div>
            <div>
              <div className="text-white font-semibold">Make Payment</div>
              <div className="text-gray-400 text-sm">Pay the deposit and first month's rent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition border border-white/20"
        >
          View Dashboard
        </button>
        <button
          onClick={() => navigate('/booking-agreement', { state: { booking } })}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          Review Agreement
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
