import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, getFarmerProfile } from '../../services/profileService';
import { getFarmerCrops } from '../../services/cropService';
import { getFarmerNegotiations } from '../../services/negotiationService';
import { getUserConversations } from '../../services/chatService';

const CROP_CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Other'];
const FARMING_TYPES = ['Subsistence', 'Commercial', 'Mixed', 'Organic-focused'];
const FARMING_METHODS = ['Organic', 'Conventional'];

export default function FarmerProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [crops, setCrops] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [fp, cropList, convos] = await Promise.all([
        getFarmerProfile(user.uid),
        getFarmerCrops(user.uid),
        getUserConversations(user.uid),
      ]);
      reset({
        name: fp?.name || profile?.name || '',
        email: fp?.email || profile?.email || '',
        phone: fp?.phone || profile?.phone || '',
        village: fp?.village || '',
        district: fp?.district || '',
        state: fp?.state || '',
        farmName: fp?.farmName || '',
        primaryCropCategory: fp?.primaryCropCategory || '',
        farmingType: fp?.farmingType || '',
        farmingMethod: fp?.farmingMethod || fp?.organicConventional || '',
        bio: fp?.bio || '',
      });
      setPhotoPreview(fp?.photoURL || profile?.photoURL || profile?.profileImage || '');
      setCrops(cropList);
      setChats(convos);
    };
    if (user) load();
  }, [user, profile, reset]);

  const handlePhotoChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setPhotoFile(f);
      setPhotoPreview(URL.createObjectURL(f));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateUserProfile(user.uid, { ...data, email: profile?.email }, photoFile, 'farmer');
      await refreshProfile();
      toast.success('Profile updated!');
      setEditing(false);
      setPhotoFile(null);
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (disabled) =>
    `w-full mt-1 px-4 py-3 border rounded-xl text-sm transition-colors ${
      disabled ? 'bg-slate-50 text-slate-600 border-slate-200' : 'border-slate-200 focus:ring-2 focus:ring-green-500 focus:outline-none'
    }`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="bg-[#15803D] hover:bg-[#14532D] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-8 pb-6 border-b border-slate-100">
          {photoPreview ? (
            <img src={photoPreview} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-green-100 shadow-sm" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center text-4xl">🧑‍🌾</div>
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700 mb-2">Profile Picture</p>
            {editing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  id="photo-upload"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-block cursor-pointer bg-green-50 text-[#15803D] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-green-100 transition-colors"
                >
                  Change Photo
                </label>
              </>
            )}
            <p className="text-xs text-slate-400 mt-2">JPG or PNG. Uploaded securely via Cloudinary.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Full Name</label>
            <input {...register('name')} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Email</label>
            <input {...register('email')} disabled className={inputClass(true)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Phone</label>
            <input {...register('phone')} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Farm Name</label>
            <input {...register('farmName')} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Village</label>
            <input {...register('village')} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">District</label>
            <input {...register('district')} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">State</label>
            <input {...register('state')} disabled={!editing} className={inputClass(!editing)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Primary Crop Category</label>
            <select {...register('primaryCropCategory')} disabled={!editing} className={inputClass(!editing)}>
              <option value="">Select category</option>
              {CROP_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Farming Type</label>
            <select {...register('farmingType')} disabled={!editing} className={inputClass(!editing)}>
              <option value="">Select type</option>
              {FARMING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Organic / Conventional</label>
            <select {...register('farmingMethod')} disabled={!editing} className={inputClass(!editing)}>
              <option value="">Select method</option>
              {FARMING_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500">Bio</label>
            <textarea
              {...register('bio')}
              disabled={!editing}
              rows={4}
              placeholder="Tell buyers about your farm, crops, and experience..."
              className={inputClass(!editing)}
            />
          </div>
        </div>

        {editing && (
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#15803D] hover:bg-[#14532D] text-white font-bold px-6 py-3 rounded-xl disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setPhotoFile(null); }}
              className="border border-slate-200 text-slate-600 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{crops.length}</p>
          <p className="text-xs text-slate-500">My Crops</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{chats.length}</p>
          <p className="text-xs text-slate-500">Messages</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/farmer/crops" className="text-sm font-semibold text-[#15803D] hover:underline">My Crops →</Link>
        <Link to="/farmer/chats" className="text-sm font-semibold text-[#15803D] hover:underline">Messages →</Link>
        <Link to="/farmer/orders" className="text-sm font-semibold text-[#15803D] hover:underline">Orders →</Link>
      </div>
    </div>
  );
}
