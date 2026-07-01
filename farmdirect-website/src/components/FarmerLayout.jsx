import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';
import toast from 'react-hot-toast';

const links = [
  { to: '/farmer/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/farmer/crops', label: 'My Crops', icon: '🌾' },
  { to: '/farmer/products/add', label: 'Add Crop', icon: '➕' },
  { to: '/farmer/orders', label: 'Orders', icon: '📦' },
  { to: '/farmer/chats', label: 'Messages', icon: '💬' },
  { to: '/decision', label: 'Market Prices', icon: '📈' },
  { to: '/schemes', label: 'Government Schemes', icon: '🏛️' },
  { to: '/farmer/analytics', label: 'Analytics', icon: '📉' },
  { to: '/farmer/profile', label: 'Profile', icon: '👤' },
  { to: '/farmer/settings', label: 'Settings', icon: '⚙️' },
];

export default function FarmerLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    toast.success('Logged out');
    navigate('/');
  };

  const NavLinks = () => links.map((l) => (
    <Link
      key={l.to}
      to={l.to}
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        location.pathname === l.to || (l.to !== '/farmer/dashboard' && location.pathname.startsWith(l.to))
          ? 'bg-green-600 text-white'
          : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
      }`}
    >
      <span>{l.icon}</span> {l.label}
    </Link>
  ));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex gap-6 lg:gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-20 shadow-sm">
            <div className="flex items-center gap-3 p-3 mb-4 border-b border-slate-100">
              {profile?.photoURL || profile?.profileImage ? (
                <img src={profile.photoURL || profile.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">🧑‍🌾</div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-sm text-slate-800 truncate">{profile?.name}</p>
                <p className="text-[10px] text-green-600 font-semibold">Farmer</p>
              </div>
            </div>
            <nav className="space-y-1">{NavLinks()}</nav>
            <button onClick={handleLogout} className="w-full mt-4 flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl">
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        <div className="flex-grow min-w-0">
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button onClick={() => setOpen(!open)} className="p-2 border border-slate-200 rounded-lg bg-white">
              {open ? <FiX /> : <FiMenu />}
            </button>
            <span className="text-sm font-bold text-slate-700">Farmer Portal</span>
          </div>
          {open && (
            <div className="lg:hidden bg-white border border-slate-200 rounded-xl p-3 mb-4 space-y-1 shadow-lg">
              {NavLinks()}
              <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-rose-600">Logout</button>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
