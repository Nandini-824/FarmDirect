import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getFarmerCrops, toggleCropStatus, deleteCrop, markSoldOut } from '../../services/cropService';

export default function FarmerCrops() {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const list = await getFarmerCrops(user.uid);
      setCrops(list);
    } catch {
      toast.error('Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) load(); }, [user]);

  const handleToggle = async (crop) => {
    try {
      const s = await toggleCropStatus(crop.id, crop.availability || crop.status);
      toast.success(s === 'active' ? 'Activated' : 'Paused');
      load();
    } catch { toast.error('Failed'); }
  };

  const handleSoldOut = async (id) => {
    try {
      await markSoldOut(id);
      toast.success('Marked as sold out');
      load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete permanently?')) return;
    try {
      await deleteCrop(id);
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-green-700">My Crops</h1>
        <Link to="/farmer/products/add" className="bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm text-center">+ Add Crop</Link>
      </div>

      {crops.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400">
          No crops published yet. <Link to="/farmer/products/add" className="text-green-600 font-semibold">Add your first crop →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {crops.map((crop) => {
            const status = crop.availability || crop.status || 'active';
            return (
              <div key={crop.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <img src={crop.imageUrl || crop.photoURL} alt={crop.cropName} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-800">{crop.cropName}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${status === 'active' ? 'bg-green-100 text-green-700' : status === 'sold_out' ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>{status.replace('_', ' ')}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{crop.category}</p>
                  <p className="text-green-700 font-bold mt-2">₹{crop.sellingPrice || crop.price}/{crop.unit || 'kg'}</p>
                  <p className="text-xs text-slate-400">Stock: {crop.availableQuantity || crop.quantity} {crop.unit || 'kg'}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link to={`/product/${crop.id}`} className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg">View</Link>
                    <Link to={`/farmer/products/edit/${crop.id}`} className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg">Edit</Link>
                    <button onClick={() => handleToggle(crop)} className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg">{status === 'active' ? 'Pause' : 'Activate'}</button>
                    <button onClick={() => handleSoldOut(crop.id)} className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg">Sold Out</button>
                    <button onClick={() => handleDelete(crop.id)} className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
