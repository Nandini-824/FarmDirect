import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getConsumerOrders } from '../../services/orderService';

export default function ConsumerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConsumerOrders(user.uid).then((data) => { setOrders(data); setLoading(false); });
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Order History</h1>
      {orders.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400">No orders yet</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-800">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {order.items?.map((i) => `${i.cropName} × ${i.quantity}`).join(', ')}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-bold text-green-700">₹{order.totalAmount?.toLocaleString()}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${order.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{order.paymentStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
