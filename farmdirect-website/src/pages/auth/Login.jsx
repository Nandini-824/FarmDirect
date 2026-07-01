import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { loginUser, loginWithGoogle, resetPassword, getUserProfile, updateUserRole } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();

  React.useEffect(() => {
    if (profile?.role === 'farmer') navigate('/farmer/dashboard');
    if (profile?.role === 'consumer') navigate('/consumer/dashboard');
  }, [profile, navigate]);

  const redirectByRole = (role) => {
    navigate(role === 'farmer' ? '/farmer/dashboard' : '/consumer/dashboard');
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const firebaseUser = await loginUser(data.email, data.password);
      const prof = await getUserProfile(firebaseUser.uid);
      if (!prof?.role) {
        toast.error('Account role not set. Please contact support or re-register.');
        return;
      }
      toast.success('Welcome back!');
      redirectByRole(prof.role);
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' ? 'Invalid email or password' : err.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const user = await loginWithGoogle();
      const prof = await getUserProfile(user.uid);
      if (!prof?.role) {
        setShowRolePicker(true);
        return;
      }
      toast.success('Signed in with Google');
      redirectByRole(prof.role);
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
    }
  };

  const handleRoleSelect = async (role) => {
    try {
      const { auth } = await import('../../config/firebase');
      if (auth.currentUser) {
        await updateUserRole(auth.currentUser.uid, role);
        await refreshProfile();
        toast.success('Account setup complete');
        redirectByRole(role);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to set role');
    }
    setShowRolePicker(false);
  };

  const handleReset = async (email) => {
    if (!email) { toast.error('Enter your email first'); return; }
    try {
      await resetPassword(email);
      toast.success('Password reset email sent');
      setShowReset(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-emerald-800 px-6 py-8 text-white text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-green-100 text-sm mt-1">Sign in to your FarmDirect account</p>
        </div>

        {showRolePicker ? (
          <div className="p-6 sm:p-8 space-y-4">
            <p className="text-sm text-slate-600 text-center">Choose your account type to continue:</p>
            <button type="button" onClick={() => handleRoleSelect('farmer')} className="w-full p-4 rounded-xl border-2 border-green-600 bg-green-50 font-bold text-sm">🧑‍🌾 I'm a Farmer</button>
            <button type="button" onClick={() => handleRoleSelect('consumer')} className="w-full p-4 rounded-xl border-2 border-slate-200 font-bold text-sm">🛒 I'm a Consumer</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                placeholder="you@email.com"
              />
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="button" onClick={() => setShowReset(!showReset)} className="text-xs text-green-600 hover:underline">
              Forgot password?
            </button>

            {showReset && (
              <button type="button" onClick={() => handleReset(document.querySelector('[name=email]')?.value)} className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg">
                Send reset email
              </button>
            )}

            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-400">or</span></div>
            </div>

            <button type="button" onClick={handleGoogle} className="w-full border border-slate-200 hover:bg-slate-50 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
              <span>🔐</span> Continue with Google
            </button>

            <p className="text-center text-sm text-slate-500 pt-2">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-green-600 font-semibold hover:underline">Register</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
