import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getActiveCrops } from '../../services/cropService';
import { getMarketPriceComparison } from '../../services/marketPriceService';
import { addToCart } from '../../services/cartService';
import { addToWishlist } from '../../services/wishlistService';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Oil Seeds', 'Cereals', 'Organic'];

export default function ConsumerMarketplace() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveCrops().then((data) => {
      setItems(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...items];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) =>
        i.cropName?.toLowerCase().includes(q) ||
        i.farmerName?.toLowerCase().includes(q) ||
        i.location?.toLowerCase().includes(q),
      );
    }
    if (activeCat !== 'All') result = result.filter((i) => i.category === activeCat);
    if (locationFilter) result = result.filter((i) => i.location?.toLowerCase().includes(locationFilter.toLowerCase()));
    if (maxPrice) result = result.filter((i) => (i.sellingPrice || i.pricePerKg) <= parseFloat(maxPrice));
    setFiltered(result);
  }, [search, activeCat, locationFilter, maxPrice, items]);

  const handleAddToCart = async (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please login to add to cart'); return; }
    await addToCart(user.uid, item);
    toast.success('Added to cart');
  };

  const handleWishlist = async (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please login to save wishlist'); return; }
    const added = await addToWishlist(user.uid, item);
    toast.success(added ? 'Added to wishlist' : 'Already in wishlist');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-md text-white mb-8">
        <h2 className="text-xl sm:text-2xl font-bold">Consumer Marketplace</h2>
        <p className="text-green-100 text-xs sm:text-sm mt-1">Fresh crops directly from verified farmers</p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search crops, farmers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="text"
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="number"
            placeholder="Max price (₹/kg)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCat === cat ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl text-slate-400">No products match your filters</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((item) => {
            const priceInfo = getMarketPriceComparison(item.cropName, item.sellingPrice || item.pricePerKg);
            return (
              <Link key={item.id} to={`/product/${item.id}`} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col">
                <div className="relative">
                  <img src={item.imageUrl} alt={item.cropName} className="h-44 w-full object-cover" />
                  {item.organic && <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Organic</span>}
                </div>
                <div className="p-4 flex-grow">
                  <h4 className="font-bold text-slate-800">{item.cropName}</h4>
                  <p className="text-xs text-slate-500 mt-1">🧑‍🌾 {item.farmerName} · 📍 {item.location}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-slate-900">₹{item.sellingPrice || item.pricePerKg}</span>
                      <span className="text-xs text-slate-500">/{item.unit || 'kg'}</span>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded-md">{item.quantity || item.quantityAvailable} {item.unit || 'kg'}</span>
                  </div>
                  {priceInfo.found && (
                    <p className="text-[10px] text-slate-400 mt-2">Market: ₹{priceInfo.marketPricePerKg}/kg {priceInfo.emoji}</p>
                  )}
                </div>
                <div className="p-4 pt-0 flex gap-2">
                  <button onClick={(e) => handleAddToCart(item, e)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1">
                    <FiShoppingCart size={14} /> Cart
                  </button>
                  <button onClick={(e) => handleWishlist(item, e)} className="p-2 border border-slate-200 rounded-xl hover:bg-rose-50 text-rose-500">
                    <FiHeart size={16} />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
