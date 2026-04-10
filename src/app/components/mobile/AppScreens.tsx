import React from 'react';
import { User, QrCode, Bell, Clock, MapPin, Plane } from 'lucide-react';

export const MobileDashboard = () => {
  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-700 min-h-screen text-white">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-indigo-200 text-sm font-medium">Good Morning,</p>
          <h1 className="text-3xl font-extrabold tracking-tight">John Doe</h1>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white shadow">
          <User className="w-8 h-8 text-indigo-200" />
        </div>
      </div>
      <div className="bg-white/90 rounded-3xl p-6 shadow-xl border border-indigo-200 space-y-6 relative overflow-hidden">
        <span className="bg-indigo-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider absolute top-4 left-4">Next Trip</span>
        <div className="flex justify-between items-start mt-8">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-indigo-900">NYC <span className="text-indigo-300">→</span> LDN</h2>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-indigo-400">FLIGHT</p>
            <p className="text-xl font-bold">BA-124</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-indigo-200">
          <div>
            <p className="text-xs font-bold text-indigo-400 uppercase">Date</p>
            <p className="font-semibold text-lg">May 15</p>
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-400 uppercase">Time</p>
            <p className="font-semibold text-lg">10:45 AM</p>
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-400 uppercase">Gate</p>
            <p className="font-semibold text-lg">B-14</p>
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-400 uppercase">Seat</p>
            <p className="font-semibold text-lg">4A</p>
          </div>
        </div>
        <button className="w-full bg-indigo-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-800 transition shadow-lg mt-6">
          <QrCode size={18} />
          View Boarding Pass
        </button>
      </div>
      <div className="flex gap-4 mt-8">
        <button className="flex-1 bg-white/90 text-indigo-700 font-bold py-4 rounded-xl shadow hover:bg-indigo-100 transition">Notifications <Bell className="inline ml-2" /></button>
        <button className="flex-1 bg-white/90 text-indigo-700 font-bold py-4 rounded-xl shadow hover:bg-indigo-100 transition">Boarding Status <Clock className="inline ml-2" /></button>
      </div>
    </div>
  );
};

export const MobileBoardingPass = () => {
  return (
    <div className="h-full flex flex-col p-6 bg-gray-900 text-white relative lg:bg-white lg:text-black lg:justify-center lg:items-center">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 z-10 lg:flex-row lg:space-y-0 lg:gap-16 lg:bg-gray-900 lg:text-white lg:p-16 lg:rounded-[40px] lg:shadow-2xl lg:min-w-[800px]">
        
        {/* Left Side (Desktop): Flight Info */}
        <div className="text-center space-y-1 lg:text-left lg:flex-1">
          <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest lg:mb-4">Boarding Pass</h2>
          <h1 className="text-3xl font-black lg:text-6xl">LHR <span className="text-gray-600 lg:text-gray-500">→</span> JFK</h1>
          <div className="hidden lg:grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-gray-800">
             <div>
                <p className="text-gray-500 font-bold uppercase text-sm">Passenger</p>
                <p className="text-2xl font-bold">John Doe</p>
             </div>
             <div>
                <p className="text-gray-500 font-bold uppercase text-sm">Flight</p>
                <p className="text-2xl font-bold">BA-124</p>
             </div>
             <div>
                <p className="text-gray-500 font-bold uppercase text-sm">Gate</p>
                <p className="text-2xl font-bold">B-14</p>
             </div>
             <div>
                <p className="text-gray-500 font-bold uppercase text-sm">Seat</p>
                <p className="text-2xl font-bold">4A</p>
             </div>
          </div>
        </div>

        {/* Right Side (Desktop): QR Card */}
        <div className="bg-white p-6 rounded-3xl w-full max-w-[300px] shadow-2xl relative overflow-hidden lg:max-w-[350px] lg:text-black">
          {/* Ticket notch effects */}
          <div className="absolute -left-4 top-1/2 w-8 h-8 bg-gray-900 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute -right-4 top-1/2 w-8 h-8 bg-gray-900 rounded-full transform -translate-y-1/2"></div>
          
          <div className="aspect-square bg-white border-4 border-black rounded-xl mb-6 flex items-center justify-center relative">
             <QrCode size={160} className="text-black lg:w-48 lg:h-48" />
             <div className="absolute inset-0 border-b-4 border-black animate-[scan_2s_ease-in-out_infinite] opacity-20"></div>
          </div>

          <div className="space-y-4 text-black border-t-2 border-dashed border-gray-200 pt-6">
            <div className="flex justify-between lg:hidden">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Passenger</p>
                <p className="font-bold">John Doe</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase">Group</p>
                <p className="font-black text-xl bg-black text-white px-2 rounded">3</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 lg:hidden">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Flt</p>
                <p className="font-bold">BA124</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Gate</p>
                <p className="font-bold">B14</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase">Seat</p>
                <p className="font-bold">4A</p>
              </div>
            </div>

            {/* Desktop Only Info in Card */}
            <div className="hidden lg:block text-center space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase">Group</p>
                <p className="font-black text-4xl">3</p>
            </div>
            
            <div className="bg-green-50 text-green-700 text-center py-2 rounded-lg font-bold text-sm border border-green-100">
              Boarding Now
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors lg:hidden">
          <AlertTriangle size={16} />
          Refresh QR Code
        </button>
      </div>
    </div>
  );
};

export const MobileStatus = () => {
  return (
    <div className="p-6 bg-white min-h-full flex flex-col lg:bg-transparent lg:p-0">
      <h1 className="text-2xl font-bold mb-8 lg:text-3xl lg:mb-12">Boarding Status</h1>

      <div className="flex-1 space-y-12 lg:flex lg:flex-row-reverse lg:space-y-0 lg:gap-16 lg:items-start">
        
        {/* Desktop: Right Column (Status Summary) */}
        <div className="text-center space-y-2 lg:flex-1 lg:bg-white lg:p-12 lg:rounded-3xl lg:shadow-sm lg:sticky lg:top-24">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Current Status</p>
          <div className="text-5xl font-black text-black lg:text-7xl lg:mb-4">GROUP 3</div>
          <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold animate-pulse lg:text-lg lg:px-6 lg:py-2">
            Boarding Now
          </div>

          <div className="bg-red-50 border-2 border-red-100 p-6 rounded-2xl text-center space-y-2 mt-8 lg:mt-12">
            <p className="text-red-800 font-bold uppercase text-xs tracking-wider">Gate Closing In</p>
            <p className="text-4xl font-black text-red-600 font-mono lg:text-5xl">14:20</p>
            <p className="text-red-700 text-sm font-medium">Please arrive at gate B-14 immediately</p>
          </div>
        </div>

        {/* Desktop: Left Column (Timeline) */}
        <div className="space-y-8 px-4 lg:flex-1 lg:max-w-xl">
          {[1, 2, 3, 4, 5].map((group, i) => (
            <div key={group} className="relative flex items-center gap-4 lg:gap-8">
              {/* Connector Line */}
              {i !== 4 && <div className={`absolute left-[19px] top-10 w-0.5 h-12 lg:left-[27px] lg:h-16 ${group < 3 ? 'bg-black' : 'bg-gray-200'}`}></div>}
              
              <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center font-bold border-2 z-10 ${
                group < 3 ? 'bg-black border-black text-white' : 
                group === 3 ? 'bg-white border-black text-black ring-4 ring-black/10' : 
                'bg-white border-gray-200 text-gray-300'
              }`}>
                {group < 3 ? <CheckCircle size={20} className="lg:w-6 lg:h-6" /> : group}
              </div>
              
              <div className="flex-1 bg-white p-4 rounded-xl lg:p-6 lg:shadow-sm">
                <p className={`font-bold ${group === 3 ? 'text-black text-lg lg:text-xl' : 'text-gray-400'}`}>
                  Group {group}
                </p>
                {group === 3 && <p className="text-xs text-gray-500 font-medium lg:text-sm lg:mt-1">Please proceed to gate</p>}
                {group < 3 && <p className="text-xs text-green-600 font-bold lg:text-sm lg:mt-1">Boarded</p>}
                {group > 3 && <p className="text-xs text-gray-400 lg:text-sm lg:mt-1">Waiting</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MobileNotifications = () => {
  const notifications = [
    { title: "Boarding Started", desc: "Group 1 is now boarding for flight BA-124", time: "10:30 AM", icon: <CheckCircle className="text-green-500" /> },
    { title: "Gate Changed", desc: "Flight BA-124 is now boarding at Gate B-14", time: "10:15 AM", icon: <MapPin className="text-blue-500" /> },
    { title: "Delay Notification", desc: "Flight BA-124 is delayed by 15 minutes", time: "09:45 AM", icon: <Clock className="text-orange-500" /> },
    { title: "Check-in Open", desc: "Online check-in is now open for your flight", time: "Yesterday", icon: <CheckCircle className="text-gray-400" /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-full lg:bg-transparent lg:p-0">
      <div className="flex justify-between items-center mb-8 lg:mb-12">
        <h1 className="text-2xl font-bold lg:text-3xl">Notifications</h1>
        <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full lg:text-sm lg:px-3 lg:py-1">4</span>
      </div>

      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {notifications.map((n, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow lg:p-6">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 lg:w-12 lg:h-12">
              {n.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-sm lg:text-base">{n.title}</h3>
                <span className="text-xs text-gray-400 font-medium lg:text-sm">{n.time}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed lg:text-sm">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MobileProfile = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 bg-white min-h-full lg:max-w-3xl lg:mx-auto lg:bg-transparent lg:p-0">
      <h1 className="text-2xl font-bold mb-8 lg:text-3xl lg:mb-12 lg:text-center">My Profile</h1>

      <div className="lg:bg-white lg:p-8 lg:rounded-3xl lg:shadow-sm">
        <div className="flex flex-col items-center mb-8 space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:gap-8 lg:mb-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-gray-50 flex items-center justify-center lg:w-32 lg:h-32">
            <User size={48} className="text-gray-300 lg:w-16 lg:h-16" />
            </div>
            <div className="text-center lg:text-left">
            <h2 className="text-xl font-bold lg:text-3xl">John Doe</h2>
            <p className="text-gray-500 text-sm lg:text-lg">john.doe@example.com</p>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mt-2">Frequent Flyer: Gold</p>
            </div>
            <div className="hidden lg:flex flex-1 justify-end">
                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                    Edit Details
                </button>
            </div>
        </div>

        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
            <ProfileButton label="Personal Information" />
            <ProfileButton label="Payment Methods" />
            <ProfileButton label="Travel Preferences" />
            <ProfileButton label="Security Settings" />
            <ProfileButton label="Support & Help" />
            <ProfileButton label="Legal & Privacy" />
        </div>

        <button 
            onClick={() => navigate('/mobile/login')}
            className="w-full mt-8 border-2 border-red-100 text-red-600 py-4 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors lg:w-auto lg:px-12 lg:mt-12 lg:block lg:mx-auto"
        >
            Logout
        </button>
      </div>
    </div>
  );
};

const ProfileButton = ({ label }: { label: string }) => (
    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group lg:p-6 lg:bg-gray-50/50">
        <span className="font-bold text-sm text-gray-700 lg:text-base">{label}</span>
        <ChevronRight size={18} className="text-gray-400 group-hover:text-black" />
    </button>
);
