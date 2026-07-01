import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { registerUser, loginWithGoogle } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'consumer' } });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const role = watch('role');

  React.useEffect(() => {
    if (profile?.role === 'farmer') navigate('/farmer/dashboard');
    if (profile?.role === 'consumer') navigate('/consumer/dashboard');
  }, [profile, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: data.role,
        location: data.location,
      });
      toast.success('Account created! Check your email for verification.');
      navigate(data.role === 'farmer' ? '/farmer/dashboard' : '/consumer/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle(role);
      toast.success('Signed up with Google');
      navigate(role === 'farmer' ? '/farmer/dashboard' : '/consumer/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-emerald-800 px-6 py-8 text-white text-center">
          <h1 className="text-2xl font-bold">Join FarmDirect</h1>
          <p className="text-green-100 text-sm mt-1">Create your farmer or consumer account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => document.querySelector('[name=role][value=farmer]')?.click()}
              className={`p-4 rounded-xl border-2 text-center transition-all ${role === 'farmer' ? 'border-green-600 bg-green-50' : 'border-slate-200'}`}
            >
              <span className="text-2xl">🧑‍🌾</span>
              <p className="font-bold text-sm mt-1">Farmer</p>
            </button>
            <button
              type="button"
              onClick={() => document.querySelector('[name=role][value=consumer]')?.click()}
              className={`p-4 rounded-xl border-2 text-center transition-all ${role === 'consumer' ? 'border-green-600 bg-green-50' : 'border-slate-200'}`}
            >
              <span className="text-2xl">🛒</span>
              <p className="font-bold text-sm mt-1">Consumer</p>
            </button>
          </div>
          <input type="radio" {...register('role')} value="farmer" className="sr-only" />
          <input type="radio" {...register('role')} value="consumer" className="sr-only" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
              <input {...register('name', { required: true })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
              <input {...register('email', { required: true })} type="email" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Phone</label>
              <input {...register('phone')} type="tel" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
              <input {...register('location')} placeholder="City, State" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
              <input {...register('password', { required: true, minLength: 6 })} type="password" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Confirm Password</label>
              <input {...register('confirmPassword', { validate: (v, f) => v === f.password || 'Passwords do not match' })} type="password" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-sm" />
              {errors.confirmPassword && <p className="text-rose-500 text-xs">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <button type="button" onClick={handleGoogle} className="w-full border border-slate-200 hover:bg-slate-50 font-semibold py-3 rounded-xl text-sm">
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-green-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
