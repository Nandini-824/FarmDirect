import React from 'react';

export default function VendorComparison() {
  const vendorRows = [
    { name: 'Reliance Retail Agri Logistics', offer: '₹42 / Kg', rating: '4.8 ★', distance: '12.4 Km', premium: true },
    { name: 'BigBasket Fulfillment Hub Center', offer: '₹39 / Kg', rating: '4.6 ★', distance: '8.1 Km', premium: false },
    { name: 'Nafed Procurement Regional Station', offer: '₹38.5 / Kg', rating: '4.9 ★', distance: '4.0 Km', premium: false },
    { name: 'FreshToHome Sourcing Warehouse', offer: '₹41 / Kg', rating: '4.2 ★', distance: '22.0 Km', premium: false }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Inter-Entity Vendor Sourcing Grid</h2>
        <p className="text-slate-500 text-sm mt-1">Audit active procurement offer sheets submitted by certified institutional bulk buyers.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Enterprise Entity Corporate Name</th>
                <th className="p-4">Direct Contract Price Sheet</th>
                <th className="p-4">Quality Service Metric</th>
                <th className="p-4">Logistics Distance Radius</th>
                <th className="p-4 text-right">Action Interface</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {vendorRows.map((v, i) => (
                <tr key={i} className={`hover:bg-slate-50/80 transition-colors ${v.premium ? 'bg-amber-50/40 font-medium' : ''}`}>
                  <td className="p-4 flex items-center gap-2">
                    <span className="font-bold text-slate-800">{v.name}</span>
                    {v.premium && <span className="bg-amber-400 text-slate-900 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">Best Clearing Deal</span>}
                  </td>
                  <td className="p-4 text-green-700 font-extrabold text-base">{v.offer}</td>
                  <td className="p-4 text-slate-600 font-semibold">{v.rating}</td>
                  <td className="p-4 text-slate-400 font-mono">{v.distance}</td>
                  <td className="p-4 text-right">
                    <button className="bg-white hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-300 font-bold px-4 py-1.5 rounded-xl text-xs transition-all shadow-sm">
                      Lock Escrow Agreement
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}