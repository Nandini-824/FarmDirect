import React from 'react';
import { Link } from 'react-router-dom';
import { getAllMarketPrices, getPricePerKg } from '../services/marketPriceService';

export default function SmartSellingDecision() {
  const prices = getAllMarketPrices().slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full">Official Market Data</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">Smart Selling Decision Desk</h2>
        <p className="text-slate-500 text-sm mt-1">Market prices from your uploaded dataset (27 Jun 2026 report). Prices shown per kg.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {prices.map((data, idx) => {
          const marketKg = getPricePerKg(data.priceToday);
          const mspKg = data.msp ? getPricePerKg(data.msp) : null;
          const prevKg = getPricePerKg(data.pricePrevious[0]);
          const trend = marketKg > prevKg ? 'UP' : marketKg < prevKg ? 'DOWN' : 'STABLE';
          const advice = trend === 'DOWN' ? 'SELL NOW' : trend === 'UP' ? 'HOLD' : 'FAIR PRICE';

          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-800">{data.commodity}</h3>
                <span className={`text-[10px] font-black tracking-wider px-2 py-1 rounded-full whitespace-nowrap ${
                  advice === 'SELL NOW' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {advice}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{data.commodityGroup}</p>

              <div className="grid grid-cols-3 gap-2 my-4 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Market</span>
                  <span className="text-sm font-extrabold text-slate-800">₹{marketKg?.toFixed(2)}/kg</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">MSP</span>
                  <span className="text-sm font-extrabold text-slate-600">{mspKg ? `₹${mspKg.toFixed(2)}/kg` : 'N/A'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Trend</span>
                  <span className={`text-xs font-black ${trend === 'DOWN' ? 'text-rose-600' : 'text-green-600'}`}>{trend}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500">Arrival today: {data.arrivalToday?.toLocaleString()} MT</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link to="/register" className="inline-block bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700">
          Start Selling with Price Guidance →
        </Link>
      </div>
    </div>
  );
}
