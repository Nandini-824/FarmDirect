import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getWishlist, removeFromWishlist } from '../../services/wishlistService';
import { addToCart } from '../../services/cartService';

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlist(user.uid).then((data) => { setItems(data); setLoading(false); });
  }, [user]);

  const handleRemove = async (productId) => {
    await removeFromWishlist(user.uid, productId);
    setItems(items.filter((i) => i.productId !== productId));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = async (item) => {
    await addToCart(user.uid, { id: item.productId, ...item });
    toast.success('Added to cart');
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400">
          <p className="mb-4">No saved items yet</p>
          <Link to="/consumer/marketplace" className="text-green-600 font-semibold hover:underline">Explore marketplace →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <Link to={`/product/${item.productId}`}>
                <img src={item.imageUrl} alt={item.cropName} className="h-40 w-full object-cover" />
              </Link>
              <div className="p-4">
                <h3 className="font-bold text-slate-800">{item.cropName}</h3>
                <p className="text-green-700 font-bold mt-1">₹{item.sellingPrice}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleAddToCart(item)} className="flex-1 bg-green-600 text-white text-xs font-bold py-2 rounded-lg">Add to Cart</button>
                  <button onClick={() => handleRemove(item.productId)} className="text-xs text-rose-500 font-semibold px-2">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
