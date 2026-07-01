import {
  collection, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc, query, where,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export async function getCart(userId) {
  const cartRef = doc(db, 'cart', userId);
  const snap = await getDoc(cartRef);
  return snap.exists() ? snap.data().items || [] : [];
}

export async function saveCart(userId, items) {
  await setDoc(doc(db, 'cart', userId), { items, updatedAt: new Date().toISOString() });
}

export async function addToCart(userId, product, quantity = 1) {
  const items = await getCart(userId);
  const existing = items.find((i) => i.productId === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      productId: product.id,
      cropName: product.cropName,
      sellingPrice: product.sellingPrice || product.pricePerKg,
      imageUrl: product.imageUrl,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      location: product.location,
      unit: product.unit || 'kg',
      quantity,
    });
  }
  await saveCart(userId, items);
  return items;
}

export async function removeFromCart(userId, productId) {
  const items = (await getCart(userId)).filter((i) => i.productId !== productId);
  await saveCart(userId, items);
  return items;
}

export async function updateCartQuantity(userId, productId, quantity) {
  const items = await getCart(userId);
  const item = items.find((i) => i.productId === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  await saveCart(userId, items);
  return items;
}

export async function clearCart(userId) {
  await saveCart(userId, []);
}
