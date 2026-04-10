import React from 'react';

export const WireframeButton = ({ children, onClick, variant = 'primary', className = '' }: { children: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'danger', className?: string }) => {
  const baseStyle = "px-4 py-2 rounded-md font-medium border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black";
  const variants = {
    primary: "bg-black text-white border-black hover:bg-gray-800",
    secondary: "bg-white text-black border-black hover:bg-gray-100",
    danger: "bg-white text-red-600 border-red-600 hover:bg-red-50"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const WireframeInput = ({ label, type = "text", placeholder, className = "" }: { label?: string, type?: string, placeholder?: string, className?: string }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="font-bold text-sm uppercase tracking-wide">{label}</label>}
      <input 
        type={type} 
        placeholder={placeholder} 
        className="px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-black transition-colors"
      />
    </div>
  );
};

export const WireframeCard = ({ children, title, className = "", onClick }: { children: React.ReactNode, title?: string, className?: string, onClick?: () => void }) => {
  return (
    <div onClick={onClick} className={`bg-white border-2 border-gray-200 p-4 rounded-lg shadow-sm ${onClick ? 'cursor-pointer hover:border-gray-400 transition-colors' : ''} ${className}`}>
      {title && <h3 className="font-bold text-lg mb-3 border-b-2 border-gray-100 pb-2">{title}</h3>}
      {children}
    </div>
  );
};
