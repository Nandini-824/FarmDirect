import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { createCrop, updateCrop, getCropById, CROP_CATEGORIES, UNITS } from '../../services/cropService';
import PriceRecommendation from '../../components/PriceRecommendation';



export default function AddProduct() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: { category: 'Vegetables', unit: 'kg', organic: false, availability: 'active', deliveryOption: 'Pickup' },
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const cropName = watch('cropName');
  const sellingPrice = watch('sellingPrice');

  useEffect(() => {
    if (!isEdit) return;
    getCropById(id).then((crop) => {
      if (!crop || crop.farmerId !== user?.uid) {
        toast.error('Product not found');
        navigate('/farmer/dashboard');
        return;
      }
      reset({
        cropName: crop.cropName,
        category: crop.category,
        description: crop.description,
        quantity: crop.quantity || crop.quantityAvailable,
        unit: crop.unit || 'kg',
        sellingPrice: crop.sellingPrice || crop.pricePerKg,
        harvestDate: crop.harvestDate,
        organic: crop.organic,
        farmName: crop.farmName || '',
        location: crop.location,
        deliveryOption: crop.deliveryOption,
        availability: crop.availability || 'active',
      });
      setImagePreview(crop.imageUrl);
      setFetching(false);
    });
  }, [id, isEdit, user, navigate, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    if (!imagePreview && !imageFile) {
      toast.error('Please upload a crop image');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await updateCrop(id, data, imageFile, user.uid);
        toast.success('Product updated successfully');
      } else {
        await createCrop(user.uid, profile?.name || 'Farmer', data, imageFile, profile?.photoURL || profile?.profileImage);
        toast.success('Product published to marketplace!');
      }
      navigate('/farmer/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{isEdit ? 'Edit Product' : 'Add New Crop'}</h1>
      <p className="text-slate-500 text-sm mb-8">Fill in details and publish to the consumer marketplace</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Crop Image</label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full sm:w-48 h-48 object-cover rounded-xl border border-slate-200" />
            ) : (
              <div className="w-full sm:w-48 h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">No image</div>
            )}
            <div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
              <p className="text-xs text-slate-400 mt-2">JPG, PNG up to 5MB. Preview before publishing.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Crop Name *</label>
            <input {...register('cropName', { required: true })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-sm" placeholder="e.g. Tomato" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Category *</label>
            <select {...register('category')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white text-sm">
              {CROP_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Organic</label>
            <select {...register('organic')} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm">
              <option value={false}>Non-Organic</option>
              <option value={true}>Organic</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Quantity *</label>
            <input {...register('quantity', { required: true, min: 1 })} type="number" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Unit *</label>
            <select {...register('unit')} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm">
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Selling Price (₹/kg) *</label>
            <input {...register('sellingPrice', { required: true, min: 0 })} type="number" step="0.01" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Harvest Date *</label>
            <input {...register('harvestDate', { required: true })} type="date" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Farm Name</label>
            <input {...register('farmName')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 text-sm" placeholder="e.g. Green Valley Farm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Location *</label>
            <input {...register('location', { required: true })} defaultValue={profile?.location} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 text-sm" placeholder="Village, District, State" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Delivery Option</label>
            <select {...register('deliveryOption')} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm">
              <option value="Pickup">Pickup</option>
              <option value="Delivery">Delivery</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Availability</label>
            <select {...register('availability')} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Delivery Charges (₹)</label>
            <input {...register('deliveryCharges')} type="number" step="0.01" defaultValue={0} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Est. Delivery Time</label>
            <input {...register('estimatedDeliveryTime')} defaultValue="2-3 days" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" placeholder="e.g. 2-3 days" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 text-sm" placeholder="Describe your crop quality, farming methods..." />
          </div>
        </div>

        <PriceRecommendation cropName={cropName} sellingPrice={sellingPrice} />

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" onClick={() => navigate('/farmer/dashboard')} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md disabled:opacity-50">
            {loading ? 'Publishing...' : isEdit ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
