import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getCropReviews, addReview } from '../services/reviewService';

export default function ReviewSection({ cropId, farmerId }) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [farmerRating, setFarmerRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => getCropReviews(cropId).then(setReviews);

  useEffect(() => { if (cropId) load(); }, [cropId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to leave a review'); return; }
    setLoading(true);
    try {
      await addReview({
        cropId,
        farmerId,
        consumerId: user.uid,
        consumerName: profile?.name,
        rating,
        farmerRating,
        comment,
      });
      toast.success('Review submitted');
      setComment('');
      load();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Reviews {avg && <span className="text-amber-500 text-base">★ {avg} ({reviews.length})</span>}</h2>
      {profile?.role === 'consumer' && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-4 mb-4 space-y-3">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-xs text-slate-500">Product Rating</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="block mt-1 px-3 py-2 border rounded-lg text-sm">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Farmer Rating</label>
              <select value={farmerRating} onChange={(e) => setFarmerRating(Number(e.target.value))} className="block mt-1 px-3 py-2 border rounded-lg text-sm">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} placeholder="Share your experience..." className="w-full px-3 py-2 border rounded-xl text-sm" required />
          <button type="submit" disabled={loading} className="bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-50">Submit Review</button>
        </form>
      )}
      {reviews.length === 0 ? (
        <p className="text-sm text-slate-400">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-slate-100 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-sm">{r.consumerName}</p>
                <span className="text-amber-500 text-sm">★ {r.rating}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
