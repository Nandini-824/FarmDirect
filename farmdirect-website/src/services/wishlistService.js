import { collection, doc, setDoc, getDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function getWishlist(userId) {
  const q = query(collection(db, 'wishlist'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addToWishlist(userId, product) {
  const wishlistId = `${userId}_${product.id}`;
  const existing = await getDoc(doc(db, 'wishlist', wishlistId));
  if (existing.exists()) return false;

  await setDoc(doc(db, 'wishlist', wishlistId), {
    userId,
    productId: product.id,
    cropName: product.cropName,
    sellingPrice: product.sellingPrice || product.pricePerKg,
    imageUrl: product.imageUrl,
    farmerName: product.farmerName,
    location: product.location,
    addedAt: new Date().toISOString(),
  });
  return true;
}

export async function removeFromWishlist(userId, productId) {
  const wishlistId = `${userId}_${productId}`;
  await deleteDoc(doc(db, 'wishlist', wishlistId));
}

export async function isInWishlist(userId, productId) {
  const snap = await getDoc(doc(db, 'wishlist', `${userId}_${productId}`));
  return snap.exists();
}
