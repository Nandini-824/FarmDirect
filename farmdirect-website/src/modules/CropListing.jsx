import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function CropListing() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    cropName: '', pricePerKg: '', quantityAvailable: '',
    harvestDate: '', category: 'Vegetables', description: '', imageUrl: ''
  });

  const cropCategories = ['Vegetables', 'Fruits', 'Grains', 'Organic'];

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'crops'));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCrops(list);
    } catch (err) {
      console.error("Error cataloging context streams from firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      pricePerKg: parseFloat(form.pricePerKg),
      quantityAvailable: parseFloat(form.quantityAvailable),
      farmerName: "Anand Patil (Self)",
      location: "Baramati, MH",
      imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400'
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'crops', editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'crops'), payload);
      }
      setForm({ cropName: '', pricePerKg: '', quantityAvailable: '', harvestDate: '', category: 'Vegetables', description: '', imageUrl: '' });
      fetchCrops();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (crop) => {
    setEditingId(crop.id);
    setForm({
      cropName: crop.cropName, pricePerKg: crop.pricePerKg,
      quantityAvailable: crop.quantityAvailable, harvestDate: crop.harvestDate,
      category: crop.category, description: crop.description, imageUrl: crop.imageUrl
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Purge selected inventory trace file?")) {
      try {
        await deleteDoc(doc(db, 'crops', id));
        fetchCrops();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entry Panel Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {editingId ? 'Modify Inventory Node' : 'List New Harvest Lot'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Crop Target Name</label>
              <input required type="text" value={form.cropName} onChange={e => setForm({...form, cropName: e.target.value})} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Russet Potatoes" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Price (₹ / Kg)</label>
                <input required type="number" value={form.pricePerKg} onChange={e => setForm({...form, pricePerKg: e.target.value})} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Volume (Kg)</label>
                <input required type="number" value={form.quantityAvailable} onChange={e => setForm({...form, quantityAvailable: e.target.value})} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Category Pool</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                {cropCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Harvest Timestamp Date</label>
              <input required type="date" value={form.harvestDate} onChange={e => setForm({...form, harvestDate: e.target.value})} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Visual Preview Web Address (URL Image)</label>
              <input type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://unsplash.com/..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Lot Descriptive Summary</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Organic fertilizer used..."></textarea>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-green-600 text-white font-semibold py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm shadow-sm">
                {editingId ? 'Push Update Changes' : 'Commit Listing to Pool'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ cropName: '', pricePerKg: '', quantityAvailable: '', harvestDate: '', category: 'Vegetables', description: '', imageUrl: '' }); }} className="bg-slate-100 text-slate-600 px-3 py-2.5 rounded-xl text-sm">Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* Display Grid Area */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Your Managed Active Market Lots</h2>
            <span className="text-xs bg-slate-200/80 px-2.5 py-1 rounded-md font-mono font-bold text-slate-600">Nodes Count: {crops.length}</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
          ) : crops.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl text-slate-400 font-medium">
              No crop listings logged to database clusters under this validation token.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {crops.map((crop) => (
                <div key={crop.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <img src={crop.imageUrl} alt={crop.cropName} className="h-40 w-full object-cover bg-slate-100" />
                  <div className="p-4 flex-grow">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-green-50 text-green-700 px-2 py-0.5 rounded-md">{crop.category}</span>
                    <h4 className="font-bold text-slate-800 text-base mt-1">{crop.cropName}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{crop.description}</p>
                    <div className="grid grid-cols-2 gap-2 mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Ask Price</span>
                        <span className="font-extrabold text-green-700 text-sm">₹{crop.pricePerKg}/Kg</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Stock Available</span>
                        <span className="font-bold text-slate-700 text-sm">{crop.quantityAvailable} Kg</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-1 flex gap-2 border-t border-slate-50 mt-auto">
                    <button onClick={() => handleEdit(crop)} className="flex-1 bg-slate-100 hover:bg-green-50 hover:text-green-700 text-slate-600 text-xs font-bold py-2 rounded-lg transition-colors">Edit</button>
                    <button onClick={() => handleDelete(crop.id)} className="flex-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-bold py-2 rounded-lg transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}