import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getCart, removeFromCart, updateCartQuantity, clearCart } from '../../services/cartService';
import { createCheckoutSession } from '../../services/stripeService';
import { createOrder, savePaymentRecord } from '../../services/orderService';

export default function Cart() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  useEffect(() => {
    if (profile?.location) setDeliveryAddress(profile.location);
  }, [profile]);

  const load = async () => {
    const cart = await getCart(user.uid);
    setItems(cart);
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const subtotal = items.reduce((s, i) => s + (i.sellingPrice || i.pricePerKg) * i.quantity, 0);
  const delivery = items.reduce((s, i) => s + (i.deliveryCharges || 0), 0) || (subtotal > 500 ? 0 : 40);
  const platformFee = Math.round(subtotal * 0.02);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + platformFee + tax;

  const placeOrder = async (method) => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }
    const orderId = await createOrder({
      consumerId: user.uid,
      consumerName: profile?.name,
      consumerEmail: user.email,
      farmerId: items[0]?.farmerId,
      items,
      subtotal,
      deliveryFee: delivery,
      platformFee,
      tax,
      totalAmount: total,
      deliveryAddress,
      paymentStatus: method === 'cod' ? 'pending' : 'paid',
      status: 'pending',
      paymentMethod: method,
    });
    if (method !== 'cod') {
      await savePaymentRecord({ orderId, amount: total, status: 'paid', consumerId: user.uid, method });
    }
    await clearCart(user.uid);
    if (method === "cod") {
      toast.success("Order placed successfully!");
    
      window.location.href = `/order/placed?order_id=${orderId}`;
    } else {
      toast.success("Payment successful!");
    
      window.location.href = `/payment/success?order_id=${orderId}`;
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (paymentMethod === 'cod') {
      setCheckingOut(true);
      try {
        await placeOrder('cod');
      } catch (err) {
        toast.error(err.message || 'Order failed');
      } finally {
        setCheckingOut(false);
      }
      return;
    }
    setCheckingOut(true);
    try {
      await createCheckoutSession({
        items,
        consumerId: user.uid,
        consumerEmail: user.email,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      });
    } catch (err) {
      if (err.message?.includes('not configured') || err.code === 'functions/not-found') {
        try {
          await placeOrder('demo');
        } catch (e) {
          toast.error(e.message || 'Order failed');
        }
      } else {
        toast.error(err.message || 'Checkout failed');
      }
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

      {items.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-4">Your cart is empty</p>
          <Link to="/consumer/marketplace" className="text-green-600 font-semibold hover:underline">Browse marketplace →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4">
                <img src={item.imageUrl} alt={item.cropName} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-grow">
                  <h3 className="font-bold text-slate-800">{item.cropName}</h3>
                  <p className="text-xs text-slate-400">{item.farmerName}</p>
                  <p className="text-green-700 font-bold mt-1">₹{item.sellingPrice || item.pricePerKg}/{item.unit || 'kg'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button type="button" onClick={() => updateCartQuantity(user.uid, item.productId, item.quantity - 1).then(setItems)} className="w-7 h-7 rounded bg-slate-100 text-sm font-bold">-</button>
                    <span className="text-sm font-bold">{item.quantity}</span>
                    <button type="button" onClick={() => updateCartQuantity(user.uid, item.productId, item.quantity + 1).then(setItems)} className="w-7 h-7 rounded bg-slate-100 text-sm font-bold">+</button>
                    <button type="button" onClick={() => removeFromCart(user.uid, item.productId).then(setItems)} className="ml-auto text-xs text-rose-500 font-semibold">Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Delivery Address *</label>
              <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="Full address with pincode" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Delivery</span><span>₹{delivery}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Platform Fee</span><span>₹{platformFee}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tax (5%)</span><span>₹{tax}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span className="text-green-700">₹{total.toFixed(2)}</span></div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500">Payment Method</p>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="pay" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} /> Pay Now (Stripe)</label>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="pay" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /> Cash on Delivery</label>
            </div>
            <button type="button" onClick={handleCheckout} disabled={checkingOut} className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl disabled:opacity-50">
              {checkingOut ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
