import {
  collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export async function createNotification({ userId, type, title, message, relatedId }) {
  await addDoc(collection(db, 'notifications'), {
    userId,
    type,
    title,
    message,
    relatedId: relatedId || '',
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function getUserNotifications(userId) {
  const q = query(collection(db, 'notifications'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export async function getUnreadCount(userId) {
  const all = await getUserNotifications(userId);
  return all.filter((n) => !n.read).length;
}

export async function markAsRead(notificationId) {
  await updateDoc(doc(db, 'notifications', notificationId), { read: true });
}

export async function markAllRead(userId) {
  const all = await getUserNotifications(userId);
  await Promise.all(all.filter((n) => !n.read).map((n) => markAsRead(n.id)));
}
