import React from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Home, User, QrCode, Bell, LogOut, Settings } from 'lucide-react';

export default function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ['/mobile/login', '/mobile/signup', '/mobile'].includes(location.pathname);
  
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* Desktop Header */}
      {!isAuthPage && (
        <header className="hidden lg:flex w-full bg-white shadow-sm border-b border-gray-200 py-4 px-8 items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <Link to="/mobile/dashboard" className="text-xl font-bold tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <QrCode size={18} className="text-white" />
              </div>
              SmartBoarding<span className="text-gray-400 font-normal">.passenger</span>
            </Link>
            
            <nav className="flex items-center gap-6 ml-8">
              <DesktopNavLink to="/mobile/dashboard" icon={<Home size={18} />} label="Home" active={location.pathname === '/mobile/dashboard'} />
              <DesktopNavLink to="/mobile/boarding-pass" icon={<QrCode size={18} />} label="My Pass" active={location.pathname === '/mobile/boarding-pass'} />
              <DesktopNavLink to="/mobile/notifications" icon={<Bell size={18} />} label="Alerts" active={location.pathname === '/mobile/notifications'} />
              <DesktopNavLink to="/mobile/profile" icon={<User size={18} />} label="Profile" active={location.pathname === '/mobile/profile'} />
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <Settings size={20} />
            </button>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <button 
              onClick={() => navigate('/mobile/login')}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </header>
      )}

      {/* Main Content Container */}
      <div className={`w-full flex-1 relative flex flex-col ${!isAuthPage ? 'lg:max-w-7xl lg:px-8 lg:py-8' : 'justify-center py-12'}`}>
        
        {/* Mobile Container Wrapper */}
        <div className={`w-full ${!isAuthPage ? 'max-w-md mx-auto lg:max-w-none bg-white lg:bg-transparent min-h-screen lg:min-h-0 shadow-xl lg:shadow-none' : 'max-w-md mx-auto bg-white min-h-screen lg:min-h-0 lg:h-auto lg:rounded-2xl shadow-xl lg:shadow-2xl overflow-hidden'}`}>
          
          {/* Content Area */}
          <div className={`flex-1 overflow-y-auto relative scrollbar-hide ${!isAuthPage ? 'pb-24 lg:pb-0' : ''}`}>
            
            {/* Mobile Header / Back Button */}
            {!isAuthPage && location.pathname !== '/mobile/dashboard' && (
              <div className="lg:hidden absolute top-6 left-6 z-20">
                <button 
                  onClick={goBack}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
            )}

            <Outlet />
          </div>

          {/* Mobile Bottom Navigation (Fixed) */}
          {!isAuthPage && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around px-6 h-20 z-50 pb-4 max-w-md mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <MobileNavItem icon={<Home size={24} />} active={location.pathname === '/mobile/dashboard'} onClick={() => navigate('/mobile/dashboard')} label="Home" />
              <MobileNavItem icon={<QrCode size={24} />} active={location.pathname === '/mobile/boarding-pass'} onClick={() => navigate('/mobile/boarding-pass')} label="Pass" />
              <MobileNavItem icon={<Bell size={24} />} active={location.pathname === '/mobile/notifications'} onClick={() => navigate('/mobile/notifications')} label="Alerts" />
              <MobileNavItem icon={<User size={24} />} active={location.pathname === '/mobile/profile'} onClick={() => navigate('/mobile/profile')} label="Profile" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MobileNavItem = ({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${active ? 'text-black' : 'text-gray-400 hover:bg-gray-50'}`}
  >
    <div className={`${active ? 'bg-black text-white p-2 rounded-full shadow-md transform -translate-y-2' : ''} transition-all duration-300`}>
        {icon}
    </div>
    {!active && <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>}
  </button>
);

const DesktopNavLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${active ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-black'}`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);
