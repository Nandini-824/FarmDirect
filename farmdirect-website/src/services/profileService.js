import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadImage } from './cloudinary';

export async function uploadProfilePhoto(file) {
  if (!file) return "";

  try {
    const imageUrl = await uploadImage(file);
    return imageUrl;
  } catch (error) {
    console.error("Profile upload failed:", error);
    throw error;
  }
}

export async function updateUserProfile(uid, data, photoFile, role) {
  let photoURL = data.photoURL || data.profileImage || '';
  if (photoFile) {
    photoURL = await uploadProfilePhoto(photoFile);
  }

  const userUpdate = {
    name: data.name,
    phone: data.phone || '',
    location: data.location || [data.village, data.district, data.state].filter(Boolean).join(', '),
    photoURL,
    profileImage: photoURL,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, 'users', uid), userUpdate);

  if (role === 'farmer') {
    await setDoc(doc(db, 'farmerProfiles', uid), {
      uid,
      farmName: data.farmName || '',
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      village: data.village || '',
      district: data.district || '',
      state: data.state || '',
      location: userUpdate.location,
      primaryCropCategory: data.primaryCropCategory || '',
      farmingType: data.farmingType || '',
      farmingMethod: data.farmingMethod || data.organicConventional || '',
      organicConventional: data.farmingMethod || data.organicConventional || '',
      bio: data.bio || '',
      photoURL,
      rating: data.rating || 0,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } else {
    await setDoc(doc(db, 'consumerProfiles', uid), {
      uid,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      location: data.location || '',
      photoURL,
      savedFarmers: data.savedFarmers || [],
      recentlyViewed: data.recentlyViewed || [],
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  return { ...userUpdate, photoURL };
}

export async function getFarmerProfile(uid) {
  const snap = await getDoc(doc(db, 'farmerProfiles', uid));
  if (snap.exists()) return snap.data();
  const userSnap = await getDoc(doc(db, 'users', uid));
  return userSnap.exists() ? userSnap.data() : null;
}

export async function getConsumerProfile(uid) {
  const snap = await getDoc(doc(db, 'consumerProfiles', uid));
  if (snap.exists()) return snap.data();
  const userSnap = await getDoc(doc(db, 'users', uid));
  return userSnap.exists() ? userSnap.data() : null;
}

export async function saveFarmer(uid, farmerId) {
  const profile = await getConsumerProfile(uid);
  const saved = profile?.savedFarmers || [];
  if (!saved.includes(farmerId)) {
    saved.push(farmerId);
    await setDoc(doc(db, 'consumerProfiles', uid), { savedFarmers: saved }, { merge: true });
  }
}

export function trackRecentlyViewed(userId, productId) {
  if (!userId) return;
  const key = `farmdirect_recent_${userId}`;
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = [productId, ...existing.filter((id) => id !== productId)].slice(0, 10);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch { /* ignore */ }
}

export function getRecentlyViewed(userId) {
  if (!userId) return [];
  try {
    return JSON.parse(localStorage.getItem(`farmdirect_recent_${userId}`) || '[]');
  } catch {
    return [];
  }
}

export function calcDeliveryCharge(subtotal, distance = 'local') {
  if (subtotal >= 1000) return 0;
  if (distance === 'local') return 40;
  return 80;
}
