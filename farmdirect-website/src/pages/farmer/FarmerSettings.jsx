import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function FarmerSettings() {
  const { profile } = useAuth();

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
        <div className="p-4">
          <p className="text-xs text-slate-500">Account Email</p>
          <p className="font-semibold text-sm">{profile?.email}</p>
        </div>
        <Link to="/farmer/profile" className="block p-4 hover:bg-slate-50 text-sm font-semibold text-green-700">Edit Profile →</Link>
        <Link to="/decision" className="block p-4 hover:bg-slate-50 text-sm font-semibold text-slate-700">Market Price Alerts →</Link>
        <Link to="/schemes" className="block p-4 hover:bg-slate-50 text-sm font-semibold text-slate-700">Government Schemes →</Link>
      </div>
    </div>
  );
}
