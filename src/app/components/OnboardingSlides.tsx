import React, { useState } from 'react';

const slides = [
  {
    title: 'Find safe, verified boarding near campus',
    description: 'Browse trusted listings close to SLIIT with verified owners.'
  },
  {
    title: 'Match with roommates & book as a group',
    description: 'Form groups, match preferences, and book together.'
  },
  {
    title: 'Digital agreements & easy payments',
    description: 'Sign agreements and pay securely online.'
  }
];

export default function OnboardingSlides({ onFinish }: { onFinish?: () => void }) {
  const [index, setIndex] = useState(0);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] px-4">
      <div className="max-w-lg w-full bg-white/80 rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-cyan-700 mb-2">{slides[index].title}</h2>
        <p className="text-cyan-900 mb-6 text-center">{slides[index].description}</p>
        <div className="flex gap-2 mb-6">
          {slides.map((_, i) => (
            <span key={i} className={`w-3 h-3 rounded-full ${i === index ? 'bg-cyan-400' : 'bg-cyan-200'}`}></span>
          ))}
        </div>
        <div className="flex gap-4">
          {index < slides.length - 1 && (
            <button className="bg-cyan-400 text-white font-bold px-6 py-2 rounded-xl shadow-lg" onClick={() => setIndex(index + 1)}>Next</button>
          )}
          <button className="bg-purple-400 text-white font-bold px-6 py-2 rounded-xl shadow-lg" onClick={onFinish}>Get Started</button>
          <button className="text-cyan-700 underline font-medium" onClick={onFinish}>Skip</button>
        </div>
      </div>
    </div>
  );
}
