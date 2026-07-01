import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFarmerOrders, getFarmerEarnings } from '../../services/orderService';
import { getFarmerCrops } from '../../services/cropService';

export default function FarmerAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [bestCrop, setBestCrop] = useState('-');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [earnings, orders, crops] = await Promise.all([
        getFarmerEarnings(user.uid),
        getFarmerOrders(user.uid),
        getFarmerCrops(user.uid),
      ]);

      const cancelled = orders.filter((o) => o.status === 'cancelled').length;
      const cropSales = {};
      orders.forEach((o) => {
        o.items?.forEach((i) => {
          cropSales[i.cropName] = (cropSales[i.cropName] || 0) + i.quantity;
        });
      });
      const top = Object.entries(cropSales).sort((a, b) => b[1] - a[1])[0];

      setStats({ ...earnings, cancelled, totalCrops: crops.length });
      setBestCrop(top ? top[0] : '-');
      setLoading(false);
    };
    if (user) load();
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>;

  const cards = [
    { label: "Today's Revenue", value: `₹${stats.todayEarnings}`, color: 'bg-emerald-500' },
    { label: 'Monthly Revenue', value: `₹${stats.monthly}`, color: 'bg-green-600' },
    { label: 'Total Revenue', value: `₹${stats.total}`, color: 'bg-teal-500' },
    { label: 'Completed Orders', value: stats.completedCount, color: 'bg-blue-500' },
    { label: 'Cancelled Orders', value: stats.cancelled, color: 'bg-rose-500' },
    { label: 'Best Selling Crop', value: bestCrop, color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className={`${c.color} w-10 h-10 rounded-xl mb-3`} />
            <p className="text-xs text-slate-500">{c.label}</p>
            <p className="text-xl font-bold text-slate-900 mt-1 truncate">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">Revenue Overview</h2>
        <div className="flex items-end gap-2 h-32">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
            <div key={d} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-green-200 rounded-t-lg" style={{ height: `${30 + (i * 8) % 70}%` }} />
              <span className="text-[10px] text-slate-400">{d}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">Weekly revenue trend (sample visualization)</p>
      </div>
    </div>
  );
}
