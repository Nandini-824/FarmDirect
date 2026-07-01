import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentCancel() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 sm:p-12 text-center max-w-md w-full">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Cancelled</h1>
        <p className="text-slate-500 text-sm mt-2">Your payment was not completed. Items remain in your cart.</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link to="/consumer/cart" className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700">Return to Cart</Link>
          <Link to="/consumer/marketplace" className="flex-1 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Browse Marketplace</Link>
        </div>
      </div>
    </div>
  );
}
