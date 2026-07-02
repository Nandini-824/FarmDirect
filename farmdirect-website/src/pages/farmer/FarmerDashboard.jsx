import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiPackage, FiShoppingBag, FiDollarSign, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getFarmerCrops, toggleCropStatus, deleteCrop } from '../../services/cropService';
import { getFarmerOrders, getFarmerEarnings } from '../../services/orderService';
import { seedMarketPricesToFirestore } from '../../services/marketPriceService';
import toast from 'react-hot-toast';

export default function FarmerDashboard() {
  const { user, profile } = useAuth();
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, todayEarnings: 0, monthly: 0, orderCount: 0, pendingCount: 0, completedCount: 0, todayOrders: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    try {
      const [cropList, orderList, stats] = await Promise.all([
        getFarmerCrops(user.uid),
        getFarmerOrders(user.uid),
        getFarmerEarnings(user.uid),
      ]);
      setCrops(cropList);
      setOrders(orderList.slice(0, 5));
      setEarnings(stats);
      await seedMarketPricesToFirestore();
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const handleToggle = async (crop) => {
    try {
      const newStatus = await toggleCropStatus(crop.id, crop.availability || crop.status);
      toast.success(newStatus === 'active' ? 'Product activated' : 'Product paused');
      loadData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await deleteCrop(id);
      toast.success('Product deleted');
      loadData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const stats = [
    { label: "Today's Earnings", value: `₹${earnings.todayEarnings.toLocaleString()}`, icon: FiDollarSign, color: 'bg-emerald-500' },
    { label: 'Monthly Revenue', value: `₹${earnings.monthly.toLocaleString()}`, icon: FiShoppingBag, color: 'bg-green-600' },
    { label: 'Total Orders', value: earnings.orderCount, icon: FiPackage, color: 'bg-teal-500' },
    { label: 'Pending Orders', value: earnings.pendingCount, icon: FiClock, color: 'bg-amber-500' },
  
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        {[1, 2, 3].map((n) => <div key={n} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700">Farmer Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {profile?.name || 'Farmer'}</p>
        </div>
        <Link to="/farmer/products/add" className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors">
          <FiPlus /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${s.color} text-white p-3 rounded-xl`}><s.icon size={22} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Your Products ({crops.length})</h2>
          </div>
          {crops.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400">
              <p className="mb-4">No products published yet</p>
              <Link to="/farmer/products/add" className="text-green-600 font-semibold hover:underline">Publish your first crop →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {crops.map((crop) => (
                <div key={crop.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src={crop.imageUrl} alt={crop.cropName} className="h-36 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-800">{crop.cropName}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(crop.availability || crop.status) === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {(crop.availability || crop.status) === 'active' ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <p className="text-green-700 font-bold mt-1">₹{crop.sellingPrice || crop.pricePerKg}/{crop.unit || 'kg'}</p>
                    <p className="text-xs text-slate-400 mt-1">{crop.quantity || crop.quantityAvailable} {crop.unit || 'kg'} · {crop.location}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Link to={`/farmer/products/edit/${crop.id}`} className="text-xs font-bold bg-slate-100 hover:bg-green-50 text-slate-600 hover:text-green-700 px-3 py-1.5 rounded-lg">Edit</Link>
                      <button onClick={() => handleToggle(crop)} className="text-xs font-bold bg-slate-100 hover:bg-amber-50 text-slate-600 px-3 py-1.5 rounded-lg">
                        {(crop.availability || crop.status) === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button onClick={() => handleDelete(crop.id)} className="text-xs font-bold bg-slate-100 hover:bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Orders</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {orders.length === 0 ? (
              <p className="p-6 text-sm text-slate-400 text-center">No orders yet</p>
            ) : orders.map((order) => (
              <div key={order.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{order.items?.[0]?.cropName || 'Order'}</p>
                    <p className="text-xs text-slate-400">{order.consumerName || 'Customer'}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                </div>
                <p className="text-sm font-bold text-green-700 mt-2">₹{order.totalAmount?.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <Link to="/farmer/orders" className="block text-center text-sm text-green-600 font-semibold mt-4 hover:underline">View all orders →</Link>
          <div className="mt-6 space-y-2">
            <Link to="/schemes" className="block bg-white border border-slate-200 rounded-xl p-4 text-sm font-semibold text-slate-700 hover:border-green-300 transition-colors">🏛️ Government Schemes</Link>
            <Link to="/decision" className="block bg-white border border-slate-200 rounded-xl p-4 text-sm font-semibold text-slate-700 hover:border-green-300 transition-colors">📊 Price Analytics</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
