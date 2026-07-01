import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getConsumerNegotiations, acceptCounterOffer } from '../../services/negotiationService';
import { addToCart } from '../../services/cartService';
import { getCropById } from '../../services/cropService';

export default function ConsumerNegotiations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [negotiations, setNegotiations] = useState([]);

  const load = async () => {
    const data = await getConsumerNegotiations(user.uid);
    setNegotiations(data);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const handleAcceptCounter = async (neg) => {
    try {
      const finalPrice = await acceptCounterOffer(neg.id, neg.farmerId, neg.counterPrice, neg.cropName);
      toast.success(`Price locked at ₹${finalPrice}/kg`);
      load();
    } catch { toast.error('Failed'); }
  };

  const handleCheckout = async (neg) => {
    const crop = await getCropById(neg.cropId);
    if (!crop) { toast.error('Product not found'); return; }
    const lockedPrice = neg.finalPrice || neg.counterPrice || neg.offeredPrice;
    await addToCart(user.uid, { ...crop, sellingPrice: lockedPrice, negotiatedPrice: lockedPrice, negotiationId: neg.id }, neg.quantity);
    toast.success('Added to cart at negotiated price');
    navigate('/consumer/cart');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Negotiations</h1>
      {negotiations.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400">No negotiations yet</div>
      ) : (
        <div className="space-y-4">
          {negotiations.map((neg) => (
            <div key={neg.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-800">{neg.cropName}</p>
                  <p className="text-sm text-slate-500">Qty: {neg.quantity} · Your offer: ₹{neg.offeredPrice}/kg</p>
                  {neg.counterPrice && <p className="text-sm text-amber-700">Farmer counter: ₹{neg.counterPrice}/kg</p>}
                  {neg.finalPrice && <p className="text-sm text-green-700 font-bold">Final price: ₹{neg.finalPrice}/kg</p>}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full h-fit capitalize ${neg.status === 'accepted' ? 'bg-green-100 text-green-700' : neg.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{neg.status}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {neg.status === 'countered' && (
                  <button onClick={() => handleAcceptCounter(neg)} className="text-xs font-bold bg-green-600 text-white px-4 py-2 rounded-lg">Accept Counter</button>
                )}
                {neg.status === 'accepted' && (
                  <button onClick={() => handleCheckout(neg)} className="text-xs font-bold bg-green-600 text-white px-4 py-2 rounded-lg">Proceed to Checkout</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
