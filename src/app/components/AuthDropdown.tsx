import React from 'react';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './ui/dropdown-menu';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group p-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-[#232b47]/90 backdrop-blur-xl border border-white/10"
          aria-label="Account"
        >
          <User className="w-7 h-7 text-cyan-300 group-hover:text-purple-300 transition-colors duration-200" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={12}
        className="min-w-[180px] bg-[#232b47]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-3 animate-fade-in flex flex-col items-center"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          animation: 'fadeDown 0.25s cubic-bezier(.4,0,.2,1)'
        }}
      >
        <DropdownMenuItem asChild className="w-full justify-center font-semibold text-cyan-200 hover:bg-cyan-900/30 rounded-xl transition text-base py-2">
          <Link to="/signin">Sign In</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2 bg-white/10" />
        <DropdownMenuItem asChild className="w-full justify-center font-bold text-white bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 hover:from-indigo-500 hover:to-cyan-500 rounded-xl transition text-base py-2 shadow-lg focus:bg-gradient-to-r focus:from-indigo-500 focus:to-cyan-500">
          <Link to="/signup">Sign Up</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <style>{`
        @keyframes fadeDown {
          0% { opacity: 0; transform: translateY(-12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DropdownMenu>
  );
}
