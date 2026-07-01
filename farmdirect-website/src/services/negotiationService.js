import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc, query, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { createNotification } from './notificationService';

export async function createNegotiation({
  consumerId, consumerName, farmerId, cropId, cropName,
  quantity, offeredPrice, message,
}) {
  const docRef = await addDoc(collection(db, 'negotiations'), {
    consumerId,
    consumerName: consumerName || '',
    farmerId,
    cropId,
    cropName: cropName || '',
    quantity: parseFloat(quantity),
    offeredPrice: parseFloat(offeredPrice),
    counterPrice: null,
    finalPrice: null,
    message: message || '',
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await createNotification({
    userId: farmerId,
    type: 'offer_received',
    title: 'New Price Offer',
    message: `${consumerName || 'A consumer'} offered ₹${offeredPrice}/kg for ${cropName}`,
    relatedId: docRef.id,
  });

  return docRef.id;
}

export async function getNegotiationById(id) {
  const snap = await getDoc(doc(db, 'negotiations', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getFarmerNegotiations(farmerId) {
  const q = query(collection(db, 'negotiations'), where('farmerId', '==', farmerId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export async function getConsumerNegotiations(consumerId) {
  const q = query(collection(db, 'negotiations'), where('consumerId', '==', consumerId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export async function acceptOffer(negotiationId, farmerId, consumerId, cropName) {
  const negSnap = await getDoc(doc(db, 'negotiations', negotiationId));
  const data = negSnap.data();
  const finalPrice = data.counterPrice || data.offeredPrice;

  await updateDoc(doc(db, 'negotiations', negotiationId), {
    status: 'accepted',
    finalPrice,
    updatedAt: serverTimestamp(),
  });

  await createNotification({
    userId: consumerId,
    type: 'offer_accepted',
    title: 'Offer Accepted',
    message: `Your offer for ${cropName} was accepted at ₹${finalPrice}/kg`,
    relatedId: negotiationId,
  });

  return finalPrice;
}

export async function rejectOffer(negotiationId, consumerId, cropName) {
  await updateDoc(doc(db, 'negotiations', negotiationId), {
    status: 'rejected',
    updatedAt: serverTimestamp(),
  });

  await createNotification({
    userId: consumerId,
    type: 'offer_rejected',
    title: 'Offer Rejected',
    message: `Your offer for ${cropName} was declined`,
    relatedId: negotiationId,
  });
}

export async function counterOffer(negotiationId, counterPrice, consumerId, cropName) {
  await updateDoc(doc(db, 'negotiations', negotiationId), {
    counterPrice: parseFloat(counterPrice),
    status: 'countered',
    updatedAt: serverTimestamp(),
  });

  await createNotification({
    userId: consumerId,
    type: 'counter_offer',
    title: 'Counter Offer Received',
    message: `Farmer countered with ₹${counterPrice}/kg for ${cropName}`,
    relatedId: negotiationId,
  });
}

export async function acceptCounterOffer(negotiationId, farmerId, counterPrice, cropName) {
  await updateDoc(doc(db, 'negotiations', negotiationId), {
    status: 'accepted',
    finalPrice: parseFloat(counterPrice),
    updatedAt: serverTimestamp(),
  });

  await createNotification({
    userId: farmerId,
    type: 'offer_accepted',
    title: 'Counter Offer Accepted',
    message: `Consumer accepted your counter offer of ₹${counterPrice}/kg for ${cropName}`,
    relatedId: negotiationId,
  });

  return parseFloat(counterPrice);
}
