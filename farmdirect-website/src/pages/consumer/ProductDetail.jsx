import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCropById, getCropsByName } from '../../services/cropService';
import { getMarketPriceComparison } from '../../services/marketPriceService';
import { addToCart } from '../../services/cartService';
import { addToWishlist } from '../../services/wishlistService';
import { useAuth } from '../../context/AuthContext';
import { trackRecentlyViewed, saveFarmer, calcDeliveryCharge } from '../../services/profileService';
import { getFarmerProfile } from '../../services/profileService';
import PriceRecommendation from '../../components/PriceRecommendation';
import ChatPanel from '../../components/ChatPanel';
import NegotiateModal from '../../components/NegotiateModal';
import ReviewSection from '../../components/ReviewSection';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, isConsumer } = useAuth();
  const [product, setProduct] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [similarCrops, setSimilarCrops] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showNegotiate, setShowNegotiate] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCropById(id);
        if (!data) { setLoading(false); return; }
        setProduct(data);
        if (user) trackRecentlyViewed(user.uid, id);
        const [similar, fp] = await Promise.all([
          getCropsByName(data.cropName, data.id),
          data.farmerId ? getFarmerProfile(data.farmerId) : null,
        ]);
        setSimilarCrops(similar);
        setFarmerProfile(fp);
      } catch (err) {
        toast.error('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const price = product?.sellingPrice || product?.pricePerKg || product?.price;
  const subtotal = price * quantity;
  const delivery = calcDeliveryCharge(subtotal);

  const requireConsumer = (action) => {
    if (!user) { toast.error('Please login'); navigate('/login'); return false; }
    if (profile?.role === 'farmer') { toast.error('Consumers only — browse as a consumer account'); return false; }
    return true;
  };

  const handleCart = async () => {
    if (!requireConsumer()) return;
    await addToCart(user.uid, product, quantity);
    toast.success('Added to cart');
  };

  const handleBuyNow = async () => {
    if (!requireConsumer()) return;
    await addToCart(user.uid, product, quantity);
    navigate('/consumer/cart');
  };

  const handleWishlist = async () => {
    if (!requireConsumer()) return;
    await addToWishlist(user.uid, product);
    toast.success('Saved to wishlist');
  };

  const handleSaveFarmer = async () => {
    if (!requireConsumer()) return;
    await saveFarmer(user.uid, product.farmerId);
    toast.success('Farmer saved');
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>;
  if (!product) return <div className="text-center py-20 text-slate-400">Product not found</div>;

  const productPath = (cropId) => user && isConsumer ? `/consumer/product/${cropId}` : `/product/${cropId}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <img src={product.imageUrl || product.photoURL} alt={product.cropName} className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-lg" />
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">{product.category}</span>
            {product.organic && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Organic</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{product.cropName}</h1>
          <p className="text-3xl font-extrabold text-green-700 mt-3">₹{price}<span className="text-base font-normal text-slate-500">/{product.unit || 'kg'}</span></p>

          <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-4">
            {(product.farmerPhotoURL || farmerProfile?.photoURL) ? (
              <img src={product.farmerPhotoURL || farmerProfile?.photoURL} alt="" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center text-xl">🧑‍🌾</div>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-700">Farmer Information</p>
              <p className="text-sm text-slate-800 font-bold">{product.farmerName}</p>
              <p className="text-xs text-slate-500">{product.farmName || farmerProfile?.farmName || 'Farm'}</p>
              <p className="text-sm text-slate-600">📍 {product.location}</p>
              {farmerProfile?.phone && (
                <a href={`tel:${farmerProfile.phone}`} className="inline-block mt-2 text-sm text-green-600 font-semibold hover:underline">📞 Call Farmer</a>
              )}
              <p className="text-sm text-slate-600">📅 Harvest: {product.harvestDate}</p>
              <p className="text-sm text-slate-600">📦 Available: {product.availableQuantity || product.quantity || product.quantityAvailable} {product.unit || 'kg'}</p>
              <p className="text-sm text-slate-600">🚚 Delivery: ₹{product.deliveryCharges || 0} · {product.estimatedDeliveryTime || '2-3 days'}</p>
              {product.rating > 0 && <p className="text-sm text-amber-600">⭐ {product.rating}</p>}
            </div>
          </div>

          {(product.deliveryCharges > 0 || product.estimatedDeliveryTime) && (
            <p className="text-sm text-slate-600 mt-2">
              🚚 Delivery: {product.deliveryCharges ? `₹${product.deliveryCharges}` : 'Free'} · Est. {product.estimatedDeliveryTime || '2-3 days'}
            </p>
          )}

          <div className="mt-4"><PriceRecommendation cropName={product.cropName} sellingPrice={price} /></div>

          <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-700 mb-2">Order Summary</p>
            <div className="flex justify-between"><span className="text-slate-500">Subtotal ({quantity} {product.unit || 'kg'})</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between mt-1"><span className="text-slate-500">Delivery</span><span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span></div>
            <div className="flex justify-between mt-2 font-bold text-green-700"><span>Total</span><span>₹{(subtotal + delivery).toFixed(2)}</span></div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <label className="text-sm font-semibold text-slate-600">Qty:</label>
            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg bg-slate-100 font-bold">-</button>
            <span className="font-bold w-8 text-center">{quantity}</span>
            <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg bg-slate-100 font-bold">+</button>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleBuyNow} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md">Buy Now</button>
              <button onClick={handleCart} className="flex-1 border-2 border-green-600 text-green-700 font-bold py-3 rounded-xl hover:bg-green-50">Add to Cart</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => requireConsumer() && setShowNegotiate(true)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl">Negotiate Price</button>
              <button onClick={() => requireConsumer() && setShowChat(true)} className="flex-1 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Chat with Farmer</button>
            </div>
            <div className="flex gap-3">
              <button onClick={handleWishlist} className="flex-1 border border-slate-200 rounded-xl py-2 text-rose-500 font-bold text-sm">♥ Wishlist</button>
              <button onClick={handleSaveFarmer} className="flex-1 border border-slate-200 rounded-xl py-2 text-slate-600 font-bold text-sm">Save Farmer</button>
            </div>
          </div>
        </div>
      </div>

      {showChat && user && (
        <div className="mt-8">
          <ChatPanel
            currentUserId={user.uid}
            currentUserName={profile?.name}
            otherUserId={product.farmerId}
            otherUserName={product.farmerName}
            cropId={product.id}
            cropName={product.cropName}
            onClose={() => setShowChat(false)}
          />
        </div>
      )}

      {showNegotiate && user && (
        <NegotiateModal product={product} user={user} profile={profile} onClose={() => setShowNegotiate(false)} />
      )}

      <ReviewSection cropId={product.id} farmerId={product.farmerId} />

      {similarCrops.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Other Farmers Selling {product.cropName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarCrops.map((c) => (
              <Link key={c.id} to={productPath(c.id)} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  <img src={c.imageUrl || c.photoURL} alt={c.cropName} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">{c.farmerName}</p>
                    <p className="text-xs text-slate-500">{c.farmName || 'Farm'} · {c.location}</p>
                    <p className="text-green-700 font-bold text-sm mt-1">₹{c.sellingPrice || c.pricePerKg}/{c.unit || 'kg'}</p>
                    <p className="text-[10px] text-slate-400">{c.availableQuantity || c.quantity} {c.unit || 'kg'} available</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
