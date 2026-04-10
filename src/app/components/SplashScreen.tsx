import React from 'react';

export default function SplashScreen() {
  // TODO: Add logo, animation, session check
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      <span className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg select-none">
        Boarding<span className="text-purple-300">Book</span>
      </span>
    </div>
  );
}
