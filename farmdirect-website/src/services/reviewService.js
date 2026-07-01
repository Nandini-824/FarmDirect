import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { createNotification } from './notificationService';

export async function addReview({ cropId, farmerId, consumerId, consumerName, rating, comment, farmerRating }) {
  await addDoc(collection(db, 'reviews'), {
    cropId,
    farmerId,
    consumerId,
    consumerName: consumerName || 'Consumer',
    rating: parseInt(rating, 10),
    farmerRating: farmerRating ? parseInt(farmerRating, 10) : null,
    comment: comment || '',
    createdAt: serverTimestamp(),
  });

  await createNotification({
    userId: farmerId,
    type: 'review_received',
    title: 'New Review',
    message: `${consumerName} rated your product ${rating}★`,
    relatedId: cropId,
  });
}

export async function getCropReviews(cropId) {
  const q = query(collection(db, 'reviews'), where('cropId', '==', cropId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export async function getFarmerReviews(farmerId) {
  const q = query(collection(db, 'reviews'), where('farmerId', '==', farmerId));
  const snap = await getDocs(q);
  const reviews = snap.docs.map((d) => d.data());
  const avg = reviews.length ? reviews.reduce((s, r) => s + (r.farmerRating || r.rating), 0) / reviews.length : 0;
  return { reviews, average: avg.toFixed(1), count: reviews.length };
}
