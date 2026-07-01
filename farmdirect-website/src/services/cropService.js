import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc,
  query, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadImage } from './cloudinary';

export const CROP_CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Oil Seeds', 'Cereals', 'Organic'];
export const UNITS = ['kg', 'quintal', 'ton', 'dozen', 'piece'];

export async function uploadCropImage(file) {
  if (!file) return "";

  const imageUrl = await uploadImage(file);

  return imageUrl;
}

export async function createCrop(farmerId, farmerName, data, imageFile, farmerPhotoURL = '') {
  let imageUrl = data.imageUrl || '';
  if (imageFile) {
    imageUrl = await uploadCropImage(imageFile);
  }

  const price = parseFloat(data.sellingPrice);
  const qty = parseFloat(data.quantity);

  const payload = {
    farmerId,
    farmerName,
    farmName: data.farmName || farmerName,
    cropName: data.cropName,
    category: data.category,
    description: data.description || '',
    quantity: qty,
    availableQuantity: qty,
    unit: data.unit || 'kg',
    sellingPrice: price,
    price: price,
    pricePerKg: price,
    quantityAvailable: qty,
    harvestDate: data.harvestDate,
    organic: data.organic === true || data.organic === 'true',
    location: data.location,
    deliveryOption: data.deliveryOption || 'Pickup',
    deliveryCharges: parseFloat(data.deliveryCharges) || 0,
    estimatedDeliveryTime: data.estimatedDeliveryTime || '2-3 days',
    availability: data.availability || 'active',
    status: 'active',
    imageUrl,
    photoURL: imageUrl,
    farmerPhotoURL: farmerPhotoURL || data.farmerPhotoURL || '',
    rating: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'crops'), payload);
  return { id: docRef.id, ...payload };
}

export async function updateCrop(cropId, data, imageFile, farmerId) {
  const updates = {
    cropName: data.cropName,
    farmName: data.farmName || data.farmerName,
    category: data.category,
    description: data.description || '',
    quantity: parseFloat(data.quantity),
    unit: data.unit || 'kg',
    sellingPrice: parseFloat(data.sellingPrice),
    pricePerKg: parseFloat(data.sellingPrice),
    quantityAvailable: parseFloat(data.quantity),
    harvestDate: data.harvestDate,
    organic: data.organic === true || data.organic === 'true',
    location: data.location,
    deliveryOption: data.deliveryOption || 'Pickup',
    deliveryCharges: parseFloat(data.deliveryCharges) || 0,
    estimatedDeliveryTime: data.estimatedDeliveryTime || '2-3 days',
    availability: data.availability || 'active',
    updatedAt: serverTimestamp(),
  };

  if (imageFile && farmerId) {
    updates.imageUrl = await uploadCropImage(imageFile);
    updates.photoURL = updates.imageUrl;
  }

  await updateDoc(doc(db, 'crops', cropId), updates);
}

export async function deleteCrop(cropId) {
  await deleteDoc(doc(db, 'crops', cropId));
}

export async function toggleCropStatus(cropId, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'paused' : 'active';
  await updateDoc(doc(db, 'crops', cropId), {
    availability: newStatus,
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
  return newStatus;
}

export async function getFarmerCrops(farmerId) {
  const q = query(collection(db, 'crops'), where('farmerId', '==', farmerId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export async function markSoldOut(cropId) {
  await updateDoc(doc(db, 'crops', cropId), {
    availability: 'sold_out',
    status: 'sold_out',
    availableQuantity: 0,
    quantityAvailable: 0,
    updatedAt: serverTimestamp(),
  });
}

export async function getActiveCrops() {
  const snap = await getDocs(collection(db, 'crops'));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((c) => {
      const s = c.availability || c.status || 'active';
      return s === 'active' && (c.availableQuantity ?? c.quantity ?? 1) > 0;
    });
}

export async function getCropById(cropId) {
  const snap = await getDoc(doc(db, 'crops', cropId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getCropsByName(cropName, excludeId = null) {
  const all = await getActiveCrops();
  const normalized = cropName?.toLowerCase().trim();
  return all.filter((c) => {
    if (excludeId && c.id === excludeId) return false;
    return c.cropName?.toLowerCase().includes(normalized) || normalized?.includes(c.cropName?.toLowerCase());
  });
}
