import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, getConsumerProfile, getRecentlyViewed } from '../../services/profileService';
import { getCropById } from '../../services/cropService';
import { getConsumerOrders } from '../../services/orderService';
import { getUserConversations } from '../../services/chatService';

export default function ConsumerProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [cp, orderList, convos] = await Promise.all([
        getConsumerProfile(user.uid),
        getConsumerOrders(user.uid),
        getUserConversations(user.uid),
      ]);
      reset({
        name: cp?.name || profile?.name,
        phone: cp?.phone || profile?.phone,
        location: cp?.location || profile?.location,
      });
      setPhotoPreview(cp?.photoURL || profile?.photoURL || '');
      setOrders(orderList);
      setChats(convos);

      const recentIds = getRecentlyViewed(user.uid);
      const products = await Promise.all(recentIds.slice(0, 5).map((id) => getCropById(id)));
      setRecentProducts(products.filter(Boolean));
    };
    if (user) load();
  }, [user, profile, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateUserProfile(user.uid, { ...data, email: profile?.email }, photoFile, 'consumer');
      await refreshProfile();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Consumer Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
          {photoPreview ? (
            <img src={photoPreview} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-green-200" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-3xl">🛒</div>
          )}
          <div>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); } }} className="text-sm" />
            <p className="text-xs text-slate-400 mt-1">Upload profile photo</p>
            <p className="text-xs text-slate-500 mt-2">{profile?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-xs font-semibold text-slate-500">Name</label><input {...register('name')} className="w-full mt-1 px-4 py-3 border rounded-xl text-sm" /></div>
          <div><label className="text-xs font-semibold text-slate-500">Phone</label><input {...register('phone')} className="w-full mt-1 px-4 py-3 border rounded-xl text-sm" /></div>
          <div className="sm:col-span-2"><label className="text-xs font-semibold text-slate-500">Location</label><input {...register('location')} className="w-full mt-1 px-4 py-3 border rounded-xl text-sm" /></div>
        </div>
        <button type="submit" disabled={loading} className="mt-6 bg-green-600 text-white font-bold px-6 py-3 rounded-xl disabled:opacity-50">{loading ? 'Saving...' : 'Save Profile'}</button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-4 text-center"><p className="text-2xl font-bold text-green-700">{orders.length}</p><p className="text-xs text-slate-500">Orders</p></div>
        <div className="bg-white rounded-xl border p-4 text-center"><p className="text-2xl font-bold text-rose-500">{profile?.savedFarmers?.length || 0}</p><p className="text-xs text-slate-500">Saved Farmers</p></div>
        <div className="bg-white rounded-xl border p-4 text-center"><p className="text-2xl font-bold text-blue-600">{chats.length}</p><p className="text-xs text-slate-500">Chats</p></div>
      </div>

      {recentProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-slate-800 mb-3">Recently Viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {recentProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="bg-white border rounded-xl p-3 hover:shadow-md transition-shadow">
                <img src={p.imageUrl || p.photoURL} alt={p.cropName} className="h-20 w-full object-cover rounded-lg" />
                <p className="text-sm font-semibold mt-2">{p.cropName}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link to="/consumer/negotiations" className="text-sm font-semibold text-green-600 hover:underline">My Negotiations →</Link>
        <Link to="/consumer/chats" className="text-sm font-semibold text-green-600 hover:underline">View Chats →</Link>
        <Link to="/consumer/orders" className="text-sm font-semibold text-green-600 hover:underline">Order History →</Link>
      </div>
    </div>
  );
}
