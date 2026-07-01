import React, { useState } from 'react';

export default function GovernmentSchemes() {
  const [inputs, setInputs] = useState({ state: '', landSize: '', cropType: '' });
  const [queried, setQueried] = useState(false);

  const policyMockDb = [
    { title: 'PM-KISAN Structural Direct Yield Allocation', scope: 'Direct cash asset transfer safety operations matching all standard holdings.', criteria: 'Universal smallholder registry access tracking.' },
    { title: 'Kisan Credit Card (KCC) Low Interest Credit Facility', scope: 'Access high volume capital operational liquidity loans at heavily capped 4% interest.', criteria: 'Valid local crop mapping files.' },
    { title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', scope: 'Comprehensive risk coverage framework protecting crop losses against climate anomalies.', criteria: 'Logged insurance premium share files.' },
    { title: 'National Organic Production Capital Subsidy Support', scope: 'Financial support structures tracking up to ₹50,000 per crop transformation node.', criteria: 'Certified non-synthetic soil tracking logs.' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">State Framework Policy Finder</h2>
        <p className="text-slate-500 text-sm mt-1">Audit statutory central and local agricultural subsidies corresponding to your farm blueprint.</p>
        
        <form onSubmit={e => { e.preventDefault(); setQueried(true); }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <input required type="text" placeholder="State Zone Region" value={inputs.state} onChange={e => setInputs({...inputs, state: e.target.value})} className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input required type="number" placeholder="Land Scale Area (Acres)" value={inputs.landSize} onChange={e => setInputs({...inputs, landSize: e.target.value})} className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input required type="text" placeholder="Crop Classification" value={inputs.cropType} onChange={e => setInputs({...inputs, cropType: e.target.value})} className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
          <button type="submit" className="sm:col-span-3 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm tracking-wide shadow-sm mt-2">
            Execute Programmatic Matching Logic
          </button>
        </form>
      </div>

      {queried && (
        <div className="mt-8 space-y-4 animate-fadeIn">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matched Eligible Policy Framework Pipelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policyMockDb.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border-l-4 border-l-green-600 border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-slate-800 text-base">{p.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{p.scope}</p>
                <div className="mt-3 text-[11px] font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-md w-fit">
                  📋 Req: {p.criteria}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}