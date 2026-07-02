import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiPackage, FiSearch, FiMessageCircle, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getActiveCrops } from '../../services/cropService';
import { getCart } from '../../services/cartService';
import { getWishlist } from '../../services/wishlistService';
import { getConsumerOrders } from '../../services/orderService';

export default function ConsumerDashboard() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [crops, cart, wishlist, orders] = await Promise.all([
        getActiveCrops(),
        getCart(user.uid),
        getWishlist(user.uid),
        getConsumerOrders(user.uid),
      ]);
      setProducts(crops.slice(0, 6));
      setCartCount(cart.length);
      setWishlistCount(wishlist.length);
      setOrderCount(orders.length);
      setLoading(false);
    };
    if (user) load();
  }, [user]);

  const quickLinks = [
    { to: '/consumer/marketplace', label: 'Browse Marketplace', icon: FiSearch, desc: 'Shop fresh crops' },
    { to: '/consumer/cart', label: 'My Cart', icon: FiShoppingCart, desc: `${cartCount} items` },
    { to: '/consumer/wishlist', label: 'Wishlist', icon: FiHeart, desc: `${wishlistCount} saved` },
    { to: '/consumer/orders', label: 'My Orders', icon: FiPackage, desc: `${orderCount} orders` },
    { to: '/consumer/negotiations', label: 'Negotiations', icon: FiPackage, desc: 'Price offers' },
    { to: '/consumer/chats', label: 'Chats', icon: FiMessageCircle, desc: 'Message farmers' },
    { to: '/consumer/profile', label: 'My Profile', icon: FiUser, desc: 'Edit profile' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">Consumer Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">Hello, {profile?.name || 'there'}! Shop directly from farmers.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-green-200 transition-all group">
            <link.icon className="text-green-600 mb-3" size={24} />
            <p className="font-bold text-slate-800 group-hover:text-green-700">{link.label}</p>
            <p className="text-xs text-slate-400 mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">Recommended Products</h2>
        <Link to="/consumer/marketplace" className="text-sm text-green-600 font-semibold hover:underline">View all →</Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => <div key={n} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400">
          No products available yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
              <img src={p.imageUrl} alt={p.cropName} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-slate-800">{p.cropName}</h3>
                <p className="text-xs text-slate-500 mt-1">🧑‍🌾 {p.farmerName} · 📍 {p.location}</p>
                <p className="text-green-700 font-bold mt-2">₹{p.sellingPrice || p.pricePerKg}/{p.unit || 'kg'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
