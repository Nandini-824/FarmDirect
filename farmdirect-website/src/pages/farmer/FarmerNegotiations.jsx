import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getFarmerNegotiations, acceptOffer, rejectOffer, counterOffer } from '../../services/negotiationService';
import { getUserProfile } from '../../services/authService';

export default function FarmerNegotiations() {
  const { user } = useAuth();
  const [negotiations, setNegotiations] = useState([]);
  const [counterInputs, setCounterInputs] = useState({});

  const load = async () => {
    const data = await getFarmerNegotiations(user.uid);
    setNegotiations(data);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const handleAccept = async (neg) => {
    try {
      await acceptOffer(neg.id, user.uid, neg.consumerId, neg.cropName);
      toast.success('Offer accepted');
      load();
    } catch { toast.error('Failed'); }
  };

  const handleReject = async (neg) => {
    try {
      await rejectOffer(neg.id, neg.consumerId, neg.cropName);
      toast.success('Offer rejected');
      load();
    } catch { toast.error('Failed'); }
  };

  const handleCounter = async (neg) => {
    const price = counterInputs[neg.id];
    if (!price) { toast.error('Enter counter price'); return; }
    try {
      await counterOffer(neg.id, price, neg.consumerId, neg.cropName);
      toast.success('Counter offer sent');
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Price Negotiations</h1>
      {negotiations.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400">No negotiation requests yet</div>
      ) : (
        <div className="space-y-4">
          {negotiations.map((neg) => (
            <div key={neg.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-800">{neg.cropName}</p>
                  <p className="text-sm text-slate-500">{neg.consumerName} · Qty: {neg.quantity}</p>
                  <p className="text-sm mt-1">Offered: <strong className="text-green-700">₹{neg.offeredPrice}/kg</strong></p>
                  {neg.counterPrice && <p className="text-sm">Your counter: ₹{neg.counterPrice}/kg</p>}
                  {neg.message && <p className="text-xs text-slate-400 mt-1">"{neg.message}"</p>}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full h-fit capitalize ${neg.status === 'accepted' ? 'bg-green-100 text-green-700' : neg.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{neg.status}</span>
              </div>
              {neg.status === 'pending' && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={() => handleAccept(neg)} className="text-xs font-bold bg-green-600 text-white px-4 py-2 rounded-lg">Accept</button>
                  <button onClick={() => handleReject(neg)} className="text-xs font-bold bg-rose-100 text-rose-600 px-4 py-2 rounded-lg">Reject</button>
                  <input type="number" placeholder="Counter ₹/kg" value={counterInputs[neg.id] || ''} onChange={(e) => setCounterInputs({ ...counterInputs, [neg.id]: e.target.value })} className="text-xs px-3 py-2 border rounded-lg w-28" />
                  <button onClick={() => handleCounter(neg)} className="text-xs font-bold bg-amber-100 text-amber-700 px-4 py-2 rounded-lg">Counter</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
