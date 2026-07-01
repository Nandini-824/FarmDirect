import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ConsumerMarketplace() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const snap = await getDocs(collection(db, 'crops'));
        const array = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(array);
        setFiltered(array);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  useEffect(() => {
    let result = items.filter(i => i.cropName.toLowerCase().includes(search.toLowerCase()));
    if (activeCat !== 'All') {
      result = result.filter(i => i.category === activeCat);
    }
    setFiltered(result);
  }, [search, activeCat, items]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Structural Filter Hub Banner */}
      <div className="bg-linear-to-r from-emerald-800 to-green-700 p-8 rounded-3xl shadow-md text-white mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Direct Consumer Sourcing Exchange</h2>
        <p className="text-green-100 text-xs mt-1">Acquire physical inventory contracts verified straight from rural growers.</p>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search crop types, farmers, varietals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="grow px-4 py-3 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <div className="flex bg-white/10 p-1 rounded-xl overflow-x-auto gap-1">
            {['All', 'Vegetables', 'Fruits', 'Grains', 'Organic'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeCat === cat ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Flow Layout Container */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white rounded-2xl h-80 border border-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl text-slate-400">
          No matches coordinate with your filter expressions.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div className="relative">
                <img src={item.imageUrl} alt={item.cropName} className="h-44 w-full object-cover bg-slate-50 group-hover:scale-102 transition-transform duration-300" />
                <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-green-700 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm border border-green-100">✓ Verified Grower</span>
              </div>
              <div className="p-4 grow">
                <h4 className="font-bold text-slate-800 text-base">{item.cropName}</h4>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center">
                  <span>🧑‍🌾 {item.farmerName || 'Independent Farmer'}</span>
                  <span className="mx-1.5 text-slate-300">•</span>
                  <span>📍 {item.location || 'Local Hub'}</span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Consumer Direct Price</span>
                    <span className="text-xl font-extrabold text-slate-900">₹{item.pricePerKg}<span className="text-xs font-normal text-slate-500">/Kg</span></span>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded-md">Stock: {item.quantityAvailable}kg</span>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-2.5 rounded-xl transition-all text-sm shadow-sm">
                  Initiate Secure Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}