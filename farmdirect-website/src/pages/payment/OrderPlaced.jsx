import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderPlaced() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center max-w-md w-full">
        <div className="text-5xl mb-4">📦</div>

        <h1 className="text-2xl font-bold text-slate-900">
          Order Placed Successfully!
        </h1>

        <p className="text-slate-500 mt-2">
          Your order has been placed successfully.
          Please pay the farmer when your order is delivered.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/consumer/orders"
            className="bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
          >
            View My Orders
          </Link>

          <Link
            to="/consumer/marketplace"
            className="border border-slate-300 py-3 rounded-xl font-bold hover:bg-slate-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}