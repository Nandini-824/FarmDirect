import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const featureStrip = [
  { icon: '🌾', title: 'No Middlemen', desc: 'Direct farmer-to-consumer trade.' },
  { icon: '₹', title: 'Fair Pricing', desc: 'MSP comparisons and market rates.' },
  { icon: '💬', title: 'Direct Chat', desc: 'Real-time messaging between parties.' },
  { icon: '🤝', title: 'Negotiate', desc: 'Offer, counter-offer, and lock prices.' },
  { icon: '🛡', title: 'Verified Farmers', desc: 'Trust badges for verified growers.' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Farm-to-door logistics.' },
];

const farmerSteps = [
  'Register', 'Complete Profile', 'Add Crop', 'Publish Crop',
  'Chat with Consumers', 'Accept Order', 'Receive Cash on Delivery Payment',
];

const consumerSteps = [
  'Register', 'Browse Marketplace', 'View Crop Details',
  'Chat with Farmer', 'Negotiate Price', 'Place Order',
  'Pay Cash on Delivery',
];

const features = [
  { icon: '🌾', title: 'No Middlemen', desc: 'Sell and buy directly without commission-heavy intermediaries.' },
  { icon: '₹', title: 'Fair Pricing', desc: 'Compare your price with government MSP and mandi rates.' },
  { icon: '💬', title: 'Direct Chat', desc: 'Talk to farmers or buyers before you commit.' },
  { icon: '🤝', title: 'Negotiation', desc: 'Offer, counter-offer, and agree on a fair deal.' },
  { icon: '🛡', title: 'Verified Farmers', desc: 'Profiles and ratings help you buy with confidence.' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Track orders from farm to your doorstep.' },
  { icon: '🌿', title: 'Organic Filter', desc: 'Find organic and conventional produce easily.' },
  { icon: '🏛️', title: 'Government Schemes', desc: 'PM-KISAN, PMFBY, KCC and more in one place.' },
];

const schemes = [
  { badge: 'Income support', title: 'PM-KISAN', desc: 'Direct income support of ₹6,000 per year in three equal instalments for eligible farmer families.' },
  { badge: 'Crop insurance', title: 'PMFBY', desc: 'Affordable crop insurance to protect farmers against natural calamities and yield losses.' },
  { badge: 'Credit', title: 'KCC', desc: 'Kisan Credit Card offers flexible credit for crop production and farm-related expenses.' },
];


export default function LandingPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile?.role) {
      navigate(profile.role === 'farmer' ? '/farmer/dashboard' : '/consumer/dashboard', { replace: true });
    }
  }, [user, profile, loading, navigate]);

  if (loading || (user && profile?.role)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#15803D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn bg-[#F8FAF7]">
      {/* Hero */}
      <section 
       id="hero"
       className="relative bg-gradient-to-br from-[#14532D] via-[#15803D] to-[#14532D] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-100 bg-[url('https://static.vecteezy.com/system/resources/previews/069/816/663/non_2x/tractor-plowing-field-rural-hills-background-sunset-free-photo.jpg')] bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="z-10">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-green-100 border border-white/20 mb-6">
                🌱 FarmDirect — Smart Farmer to Consumer Marketplace
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                Fresh Crops.
                <br />
                Fair Prices.
                <br />
                <span className="text-[#FBBF24]">Direct from the Farm.</span>
              </h1>
              <p className="text-base sm:text-lg text-green-100/90 max-w-lg mb-8 leading-relaxed">
                A digital marketplace connecting farmers directly with consumers.
                No middlemen. Transparent pricing. Government market price comparison.
                Direct farmer chat. Simple cash-on-delivery ordering.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#14532D] font-bold px-7 py-3.5 rounded-xl hover:bg-green-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  🧑‍🌾 I&apos;m a Farmer
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/80 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all"
                >
                  🛒 I&apos;m a Consumer
                </Link>
              </div>
            </div>
            <div className="relative z-10 flex justify-center lg:justify-end">
              <div className="w-full max-w-md lg:max-w-lg group">
              
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* About */}
      <section   
      id="about"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
        <p className="text-xs font-bold tracking-widest text-[#15803D] uppercase mb-3">About FarmDirect</p>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#14532D] mb-6">
          A fairer marketplace, rooted in trust
        </h2>
        <p className="text-[#334155] leading-relaxed text-base sm:text-lg">
          FarmDirect exists because Indian farmers deserve better prices and consumers deserve fresher produce.
          We remove middlemen so farmers keep more of what they earn and buyers pay less for quality crops.
          Our platform compares your listing with government market prices, enables direct communication,
          and supports simple cash-on-delivery ordering — built for how agriculture really works in India.
        </p>
      </section>

      {/* How it works */}
      <section 
       id="how-it-works"
       className="bg-white py-20 sm:py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-[#15803D] uppercase mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#082412]">
  A Simple Path for Both Sides of the Field
</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#F8FAF7] rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🧑‍🌾</span>
                <h3 className="text-xl font-bold text-[rgb(4, 61, 26)]">For Farmers</h3>
              </div>
              <ol className="space-y-3">
                {farmerSteps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-[#15803D] text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-[#334155] text-sm pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-[#F8FAF7] rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🛒</span>
                <h3 className="text-xl font-bold text-[#14532D]">For Consumers</h3>
              </div>
              <ol className="space-y-3">
                {consumerSteps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-[#15803D] text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-[#334155] text-sm pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section
  id="features"
  className="py-20 sm:py-24"
>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-[#15803D] uppercase mb-3">Everything You Need</p>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#14532D]">
              Built for Real Indian Agriculture
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h4 className="font-bold text-[#14532D] mb-2">{f.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government schemes */}
      <section
  id="schemes"
  className="bg-white py-20 sm:py-24 border-y border-slate-100"
>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#14532D] mb-3">
              Every benefit, one screen away
            </h2>
            <p className="text-[#334155] max-w-2xl mx-auto">
              Surface eligibility, benefits, and scheme details so farmers never miss support they deserve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schemes.map((s) => (
              <div key={s.title} className="bg-[#F8FAF7] rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-green-100 text-[#15803D] px-2.5 py-1 rounded-full mb-3">
                  {s.badge}
                </span>
                <h3 className="text-xl font-bold text-[#14532D] mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">{s.desc}</p>
                <Link to="/schemes" className="text-sm font-semibold text-[#15803D] hover:underline">
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

     
     

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-[#14532D] to-[#15803D] rounded-3xl p-10 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Ready to change how India trades produce?
            </h2>
            <p className="text-green-100 max-w-lg">
              Join thousands of farmers and consumers building a fairer food supply chain.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              to="/register"
              className="bg-white text-[#14532D] font-bold px-8 py-3.5 rounded-xl hover:bg-green-50 transition-all text-center shadow-lg"
            >
              I&apos;m a Farmer →
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all text-center"
            >
              I&apos;m a Consumer →
            </Link>
          </div>
        </div>
      </section>

      {/* Landing footer */}
      <footer
  id="footer"
  className="bg-[#14532D] text-green-100"
>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="FarmDirect" className="w-9 h-9" />
              <span className="text-white font-extrabold text-lg">FarmDirect</span>
            </div>
            <p className="text-sm text-green-200/80 leading-relaxed max-w-sm">
              Connecting farmers directly with consumers. Fair pricing, transparent markets, zero middlemen.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/schemes" className="hover:text-white transition-colors">Government Schemes</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Follow Us</h4>
            <div className="flex gap-3">
              {['f', 't', 'in'].map((s) => (
                <span
                  key={s}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 text-center py-6 text-xs text-green-200/60">
          &copy; {new Date().getFullYear()} FarmDirect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
