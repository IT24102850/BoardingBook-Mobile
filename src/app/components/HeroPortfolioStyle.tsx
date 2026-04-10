import React from 'react';

export default function HeroPortfolioStyle() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] px-4">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center py-6 px-4 md:px-16">
        <span className="text-2xl font-bold text-white tracking-tight">BoardingBook</span>
        <div className="flex gap-8">
          <a href="#home" className="text-zinc-100 hover:text-cyan-300 border-b-2 border-cyan-400 pb-1">Home</a>
          <a href="#features" className="text-zinc-100 hover:text-cyan-300">Features</a>
          <a href="#contact" className="cta-primary ml-4">Get Started</a>
        </div>
      </nav>
      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center gap-12 mt-12 w-full max-w-6xl">
        <div className="flex-1">
          <div className="surface-card p-8 mb-6">
            <span className="tag-pill mb-4 inline-block">UNIVERSITY BOARDING · PLATFORM</span>
            <h1 className="text-5xl font-extrabold mb-4">Smart, Secure <span className="text-cyan-300">Boarding</span> System</h1>
            <p className="muted text-lg mb-6">Find, book, and manage university boarding with a premium, secure, and modern experience. For students, owners, and admins.</p>
            <a href="#features" className="cta-primary">Explore Features</a>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="surface-glass shadow-luxe p-2 rounded-3xl">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Boarding" className="rounded-3xl w-64 h-80 object-cover" />
          </div>
          <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
            <div className="surface-card flex items-center gap-3 p-3 shadow-lift">
              <span className="tag-pill bg-green-500/20 text-green-300">Verified</span>
              <span className="muted text-xs">University Only</span>
            </div>
            <div className="surface-card flex items-center gap-3 p-3 shadow-lift">
              <span className="tag-pill bg-cyan-500/20 text-cyan-300">Secure</span>
              <span className="muted text-xs">Payments & Agreements</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
