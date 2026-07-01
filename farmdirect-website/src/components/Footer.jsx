import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-[#14532D] text-green-100 text-sm border-t border-green-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="FarmDirect" className="w-8 h-8" />
            <span className="text-white font-extrabold">FarmDirect</span>
          </div>
          <p className="text-green-200/80 leading-relaxed text-xs">
            Connecting farmers directly with consumers. Fair pricing, transparent markets, zero middlemen.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
            <li><Link to="/schemes" className="hover:text-white transition-colors">Government Schemes</Link></li>
            <li><Link to="/decision" className="hover:text-white transition-colors">Price Analytics</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Support</h4>
          <p className="text-green-200/80 text-xs leading-relaxed">
            Government schemes, MSP data, and secure payments for a modern farm-to-table experience.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-5 text-xs text-green-200/60">
        &copy; {new Date().getFullYear()} FarmDirect. All rights reserved.
      </div>
    </footer>
  );
}
