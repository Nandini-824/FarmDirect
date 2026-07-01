import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createNegotiation } from '../services/negotiationService';

export default function NegotiateModal({ product, user, profile, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState(1);
  const [offeredPrice, setOfferedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offeredPrice || parseFloat(offeredPrice) <= 0) {
      toast.error('Enter a valid offered price');
      return;
    }
    setLoading(true);
    try {
      await createNegotiation({
        consumerId: user.uid,
        consumerName: profile?.name,
        farmerId: product.farmerId,
        cropId: product.id,
        cropName: product.cropName,
        quantity,
        offeredPrice,
        message,
      });
      toast.success('Negotiation offer sent to farmer!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to send offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Negotiate Price</h3>
        <p className="text-sm text-slate-500 mb-4">{product.cropName} · Listed at ₹{product.sellingPrice || product.pricePerKg}/{product.unit || 'kg'}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Quantity Required</label>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Your Offered Price (₹/kg)</label>
            <input type="number" step="0.01" value={offeredPrice} onChange={(e) => setOfferedPrice(e.target.value)} placeholder="e.g. 25" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Message (optional)</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} placeholder="Bulk order, need delivery..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
