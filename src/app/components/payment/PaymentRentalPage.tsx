import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PaymentManager from './PaymentManager';

export default function PaymentRentalPage() {
  const navigate = useNavigate();

  // Handle Escape key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all font-medium text-sm"
          title="Go back (ESC)"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
            Payment & Rental Management
          </h1>
          <p className="text-gray-400 mb-8">Owner dashboard showing payment status for all boarding locations. Press <span className="font-semibold">ESC</span> to go back.</p>

          <PaymentManager />
        </div>
      </div>
    </div>
  );
}
