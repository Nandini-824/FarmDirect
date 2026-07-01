import { httpsCallable } from 'firebase/functions';
import { loadStripe } from '@stripe/stripe-js';
import { functions } from '../config/firebase';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise = null;
function getStripe() {
  if (!stripePublishableKey) return null;
  if (!stripePromise) stripePromise = loadStripe(stripePublishableKey);
  return stripePromise;
}

export async function createCheckoutSession({ items, consumerId, consumerEmail, successUrl, cancelUrl }) {
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.cropName,
        images: item.imageUrl ? [item.imageUrl] : [],
        metadata: { productId: item.productId, farmerId: item.farmerId },
      },
      unit_amount: Math.round((item.sellingPrice || item.pricePerKg) * 100),
    },
    quantity: item.quantity,
  }));

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.sellingPrice || item.pricePerKg) * item.quantity,
    0,
  );

  try {
    const createSession = httpsCallable(functions, 'createCheckoutSession');
    const result = await createSession({
      lineItems,
      consumerId,
      consumerEmail,
      successUrl,
      cancelUrl,
      metadata: {
        consumerId,
        items: JSON.stringify(items.map((i) => ({
          productId: i.productId,
          farmerId: i.farmerId,
          cropName: i.cropName,
          quantity: i.quantity,
          price: i.sellingPrice || i.pricePerKg,
        }))),
        totalAmount: totalAmount.toString(),
      },
    });

    const stripe = await getStripe();
    if (stripe && result.data?.sessionId) {
      const { error } = await stripe.redirectToCheckout({ sessionId: result.data.sessionId });
      if (error) throw error;
    } else if (result.data?.url) {
      window.location.href = result.data.url;
    }

    return result.data;
  } catch (err) {
    if (!stripePublishableKey) {
      throw new Error('Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to your .env file and deploy Firebase Functions.');
    }
    throw err;
  }
}

export async function createDemoOrder(items, consumerId, consumerName, consumerEmail) {
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.sellingPrice || item.pricePerKg) * item.quantity,
    0,
  );

  return {
    items,
    consumerId,
    consumerName,
    consumerEmail,
    totalAmount,
    deliveryFee: 0,
    tax: Math.round(totalAmount * 0.05),
    grandTotal: totalAmount + Math.round(totalAmount * 0.05),
  };
}
