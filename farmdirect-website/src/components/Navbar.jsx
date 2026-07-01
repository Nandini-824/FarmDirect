import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';
import NotificationBell from './NotificationBell';
import toast from 'react-hot-toast';

const guestNav = [
  { path: '#how-it-works', label: 'How it works' },
  { path: '#features', label: 'Features' },
  { path: '#schemes', label: 'Schemes' },
];

const farmerNav = [
  { path: '/farmer/dashboard', label: 'Dashboard' },
  { path: '/marketplace', label: 'Marketplace' },
  { path: '/decision', label: 'Market Prices' },
  { path: '/schemes', label: 'Government Schemes' },
];

const consumerNav = [
  { path: '/consumer/dashboard', label: 'Dashboard' },
  { path: '/marketplace', label: 'Marketplace' },
  { path: '/consumer/orders', label: 'Orders' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path.endsWith('/dashboard')) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = async () => {
    await logoutUser();
    toast.success('Logged out');
    navigate('/');
  };

  const profilePath = profile?.role === 'farmer' ? '/farmer/profile' : '/consumer/profile';
  const homePath = profile?.role === 'farmer' ? '/farmer/dashboard' : profile?.role === 'consumer' ? '/consumer/dashboard' : '/';

  const navItems = !user || !profile
    ? guestNav
    : profile.role === 'farmer'
      ? farmerNav
      : consumerNav;

      const NavLink = ({ item }) => {
        const isSection = item.path.startsWith('#');
      
        if (isSection) {
          return (
            <a
              href={item.path}
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-[#334155] hover:text-[#15803D] transition"
            >
              {item.label}
            </a>
          );
        }
      
        return (
          <Link
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive(item.path)
                ? 'bg-green-50 text-[#15803D] border border-green-200'
                : 'text-[#334155] hover:bg-slate-50 hover:text-[#15803D]'
            }`}
          >
            {item.label}
          </Link>
        );
      };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={homePath} className="flex items-center gap-2">
            <img src={logo} alt="FarmDirect" className="w-9 h-9 object-contain" />
            <span className="text-xl font-extrabold tracking-tight text-[#14532D]">
              FarmDirect
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {!loading && navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {user && profile ? (
              <>
                <NotificationBell />
                <Link
                  to={profilePath}
                  className="text-sm text-[#334155] flex items-center gap-1.5 hover:text-[#15803D] px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <FiUser size={15} /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-[#334155] hover:text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <FiLogOut size={15} /> Logout
                </button>
              </>
            ) : (
              !loading && (
                <>
                  <Link to="/login" className="text-sm font-semibold text-[#334155] hover:text-[#15803D] px-4 py-2">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#15803D] hover:bg-[#14532D] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-[#334155] p-2" aria-label="Menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {!loading && navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-base font-medium text-[#334155] hover:bg-green-50"
            >
              {item.label}
            </Link>
          ))}
          {user && profile ? (
            <>
              <div className="px-4 py-2">
                <NotificationBell />
              </div>
              <Link to={profilePath} onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-lg font-medium text-[#15803D]">
                Profile
              </Link>
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="block w-full text-left px-4 py-2.5 text-rose-600"
              >
                Logout
              </button>
            </>
          ) : (
            !loading && (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-lg font-medium text-[#334155]">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block mx-4 mt-2 bg-[#15803D] text-white text-center py-2.5 rounded-lg font-semibold"
                >
                  Get Started
                </Link>
              </>
            )
          )}
        </div>
      )}
    </nav>
  );
}
