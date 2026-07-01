import {
  collection, addDoc, getDocs, query, where, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { createNotification } from './notificationService';

export function getConversationId(userId1, userId2, cropId = '') {
  const sorted = [userId1, userId2].sort();
  return cropId ? `${sorted[0]}_${sorted[1]}_${cropId}` : `${sorted[0]}_${sorted[1]}`;
}

export async function sendMessage({ senderId, senderName, receiverId, cropId, cropName, text }) {
  const conversationId = getConversationId(senderId, receiverId, cropId);

  await addDoc(collection(db, 'messages'), {
    conversationId,
    senderId,
    senderName: senderName || 'User',
    receiverId,
    cropId: cropId || '',
    cropName: cropName || '',
    text,
    createdAt: serverTimestamp(),
  });

  await createNotification({
    userId: receiverId,
    type: 'new_message',
    title: 'New Message',
    message: `${senderName}: ${text.slice(0, 60)}${text.length > 60 ? '...' : ''}`,
    relatedId: conversationId,
  });
}

export async function getMessages(conversationId) {
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId),
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
}

export function subscribeToMessages(conversationId, callback) {
  const q = query(collection(db, 'messages'), where('conversationId', '==', conversationId));
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    callback(msgs);
  }, (err) => console.error('Chat listener error:', err));
}

export async function getUserConversations(userId) {
  const sentQ = query(collection(db, 'messages'), where('senderId', '==', userId));
  const recvQ = query(collection(db, 'messages'), where('receiverId', '==', userId));
  const [sent, recv] = await Promise.all([getDocs(sentQ), getDocs(recvQ)]);

  const map = new Map();
  [...sent.docs, ...recv.docs].forEach((d) => {
    const data = d.data();
    if (!map.has(data.conversationId)) {
      const otherId = data.senderId === userId ? data.receiverId : data.senderId;
      map.set(data.conversationId, {
        conversationId: data.conversationId,
        otherUserId: otherId,
        cropId: data.cropId,
        cropName: data.cropName,
        lastMessage: data.text,
        updatedAt: data.createdAt,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
}
