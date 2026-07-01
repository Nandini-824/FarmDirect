import React, { useMemo } from 'react';
import { getMarketPriceComparison } from '../services/marketPriceService';

export default function PriceRecommendation({ cropName, sellingPrice }) {
  const comparison = useMemo(
    () => getMarketPriceComparison(cropName, sellingPrice),
    [cropName, sellingPrice],
  );

  if (!cropName?.trim()) return null;

  if (!comparison.found) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
        <span className="font-semibold">📊 Market Price:</span> {comparison.message}
      </div>
    );
  }

  const statusColors = {
    good: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    fair: 'bg-amber-50 border-amber-200 text-amber-800',
    low: 'bg-rose-50 border-rose-200 text-rose-800',
  };

  return (
    <div className={`border rounded-xl p-4 sm:p-5 ${statusColors[comparison.status]}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{comparison.emoji}</span>
        <span className="font-bold text-sm sm:text-base">{comparison.recommendation}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
        <div>
          <span className="block opacity-70 font-medium">Market Price</span>
          <span className="font-bold">₹{comparison.marketPricePerKg}/kg</span>
        </div>
        <div>
          <span className="block opacity-70 font-medium">MSP</span>
          <span className="font-bold">{comparison.mspPerKg === 'N/A' ? 'N/A' : `₹${comparison.mspPerKg}/kg`}</span>
        </div>
        <div>
          <span className="block opacity-70 font-medium">Your Price</span>
          <span className="font-bold">₹{comparison.farmerPrice || '0'}/kg</span>
        </div>
        <div>
          <span className="block opacity-70 font-medium">Difference</span>
          <span className="font-bold">{parseFloat(comparison.difference) >= 0 ? '+' : ''}₹{comparison.difference}/kg</span>
        </div>
      </div>
      <p className="mt-3 text-xs opacity-80">
        Suggested price: <strong>₹{comparison.suggestedPrice}/kg</strong> · Data from {comparison.date} market report
      </p>
    </div>
  );
}
