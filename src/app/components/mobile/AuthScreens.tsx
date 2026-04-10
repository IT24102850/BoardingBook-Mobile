import React from 'react';
import { Mail, Lock, User } from 'lucide-react';

export const MobileLogin = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-700 text-white">
      <div className="w-16 h-16 bg-indigo-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <User className="text-white w-8 h-8" />
      </div>
      <h1 className="text-2xl font-extrabold mb-8">Smart Boarding</h1>
      <div className="w-full space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-indigo-300 w-5 h-5" />
          <input type="email" placeholder="Email or Phone" className="w-full pl-10 pr-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-700 outline-none transition-colors bg-white text-indigo-900" />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-indigo-300 w-5 h-5" />
          <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-700 outline-none transition-colors bg-white text-indigo-900" />
        </div>
        <div className="text-right">
          <button className="text-xs text-indigo-200 hover:text-white font-medium">Forgot Password?</button>
        </div>
        <button className="w-full bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition shadow-lg active:scale-95 transform">Login</button>
        <div className="text-center mt-6">
          <button className="text-sm font-medium text-indigo-200 hover:text-white">Create Account</button>
        </div>
      </div>
    </div>
  );
};

export const MobileSignUp = () => {
  return (
    <div className="flex flex-col h-full p-8 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-700 text-white pt-20">
      <h1 className="text-3xl font-extrabold mb-8">Create Account</h1>
      <div className="space-y-4 flex-1">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-indigo-200 tracking-wider">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-indigo-300 w-5 h-5" />
            <input type="text" className="w-full pl-10 pr-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-700 outline-none bg-white text-indigo-900" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-indigo-200 tracking-wider">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-indigo-300 w-5 h-5" />
            <input type="email" className="w-full pl-10 pr-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-700 outline-none bg-white text-indigo-900" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-indigo-200 tracking-wider">Phone Number</label>
          <input type="tel" className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-700 outline-none bg-white text-indigo-900" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-indigo-200 tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-indigo-300 w-5 h-5" />
            <input type="password" className="w-full pl-10 pr-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-700 outline-none bg-white text-indigo-900" />
          </div>
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <button className="w-full bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition shadow-lg active:scale-95 transform">Sign Up</button>
        <div className="text-center">
          <button className="text-sm font-medium text-indigo-200 hover:text-white">Already have an account? Login</button>
        </div>
      </div>
    </div>
  );
};
