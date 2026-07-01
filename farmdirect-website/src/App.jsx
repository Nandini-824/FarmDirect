import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import FarmerLayout from './components/FarmerLayout';
import ConsumerLayout from './components/ConsumerLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './modules/LandingPage';
import GovernmentSchemes from './modules/GovernmentSchemes';
import VendorComparison from './modules/VendorComparison';
import SmartSellingDecision from './modules/SmartSellingDecision';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerCrops from './pages/farmer/FarmerCrops';
import FarmerAnalytics from './pages/farmer/FarmerAnalytics';
import AddProduct from './pages/farmer/AddProduct';
import FarmerOrders from './pages/farmer/FarmerOrders';
import FarmerProfile from './pages/farmer/FarmerProfile';
import FarmerNegotiations from './pages/farmer/FarmerNegotiations';
import FarmerSettings from './pages/farmer/FarmerSettings';
import ConsumerDashboard from './pages/consumer/ConsumerDashboard';
import ConsumerMarketplace from './pages/consumer/ConsumerMarketplace';
import ProductDetail from './pages/consumer/ProductDetail';
import Cart from './pages/consumer/Cart';
import Wishlist from './pages/consumer/Wishlist';
import ConsumerOrders from './pages/consumer/ConsumerOrders';
import ConsumerProfile from './pages/consumer/ConsumerProfile';
import ConsumerNegotiations from './pages/consumer/ConsumerNegotiations';
import ConsumerSettings from './pages/consumer/ConsumerSettings';
import ChatsPage from './pages/shared/ChatsPage';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentCancel from './pages/payment/PaymentCancel';

function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#334155] flex flex-col font-sans selection:bg-green-200">
      <Navbar />
      <main className="grow pt-16">
        <Outlet />
      </main>
      {!isLanding && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="schemes" element={<GovernmentSchemes />} />
            <Route path="vendors" element={<VendorComparison />} />
            <Route path="decision" element={<SmartSellingDecision />} />
            <Route path="marketplace" element={<ConsumerMarketplace />} />
            <Route path="product/:id" element={<ProductDetail />} />

            <Route path="farmer" element={<ProtectedRoute role="farmer"><FarmerLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<FarmerDashboard />} />
              <Route path="crops" element={<FarmerCrops />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<AddProduct />} />
              <Route path="orders" element={<FarmerOrders />} />
              <Route path="chats" element={<ChatsPage />} />
              <Route path="negotiations" element={<FarmerNegotiations />} />
              <Route path="analytics" element={<FarmerAnalytics />} />
              <Route path="profile" element={<FarmerProfile />} />
              <Route path="settings" element={<FarmerSettings />} />
            </Route>

            <Route path="consumer" element={<ProtectedRoute role="consumer"><ConsumerLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<ConsumerDashboard />} />
              <Route path="marketplace" element={<ConsumerMarketplace />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="orders" element={<ConsumerOrders />} />
              <Route path="chats" element={<ChatsPage />} />
              <Route path="negotiations" element={<ConsumerNegotiations />} />
              <Route path="profile" element={<ConsumerProfile />} />
              <Route path="settings" element={<ConsumerSettings />} />
            </Route>

            <Route path="payment/success" element={<PaymentSuccess />} />
            <Route path="payment/cancel" element={<PaymentCancel />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
