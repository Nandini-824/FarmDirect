import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc, query, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { createNotification } from './notificationService';
export async function createOrder(orderData) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    status: orderData.status || 'pending',
    paymentStatus: orderData.paymentStatus || 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (orderData.farmerId) {
    await createNotification({
      userId: orderData.farmerId,
      type: 'new_order',
      title: 'New Order Received',
      message: `New order from ${orderData.consumerName || 'a customer'} — ₹${orderData.totalAmount}`,
      relatedId: docRef.id,
    });
  }

  return docRef.id;
}

export async function getFarmerOrders(farmerId) {
  const q = query(collection(db, 'orders'), where('farmerId', '==', farmerId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export async function getConsumerOrders(consumerId) {
  const q = query(collection(db, 'orders'), where('consumerId', '==', consumerId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export async function updateOrderStatus(orderId, status, notifyUserId, cropName) {
  await updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: serverTimestamp(),
  });

  if (notifyUserId) {
    const titles = {
      confirmed: 'Order Confirmed',
      accepted: 'Order Accepted',
      dispatched: 'Order Shipped',
      delivered: 'Order Delivered',
      completed: 'Order Completed',
      cancelled: 'Order Cancelled',
    };
    await createNotification({
      userId: notifyUserId,
      type: `order_${status}`,
      title: titles[status] || 'Order Updated',
      message: `Your order for ${cropName || 'crops'} is now ${status}`,
      relatedId: orderId,
    });
  }
}

export async function getFarmerEarnings(farmerId) {
  const orders = await getFarmerOrders(farmerId);
  const completed = orders.filter((o) => o.status === 'completed' || o.paymentStatus === 'paid');
  const total = completed.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const today = new Date().toDateString();
  const todayEarnings = completed
    .filter((o) => o.createdAt?.toDate?.()?.toDateString() === today)
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const month = new Date().getMonth();
  const monthly = completed
    .filter((o) => o.createdAt?.toDate?.()?.getMonth() === month)
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return { total, todayEarnings, monthly, orderCount: orders.length, pendingCount: orders.filter((o) => o.status === 'pending').length, completedCount: orders.filter((o) => o.status === 'completed' || o.status === 'delivered').length, todayOrders: orders.filter((o) => o.createdAt?.toDate?.()?.toDateString() === today).length };
}

export async function savePaymentRecord(paymentData) {
  const docRef = await addDoc(collection(db, 'payments'), {
    ...paymentData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOrderById(orderId) {
  const snap = await getDoc(doc(db, 'orders', orderId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
