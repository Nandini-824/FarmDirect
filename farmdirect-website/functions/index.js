const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');

admin.initializeApp();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || functions.config().stripe?.secret_key, {
  apiVersion: '2023-10-16',
});

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const { lineItems, successUrl, cancelUrl, metadata } = data;

  if (!lineItems || !successUrl || !cancelUrl) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: data.consumerEmail,
      metadata: metadata || {},
    });

    const items = metadata?.items ? JSON.parse(metadata.items) : [];
    const totalAmount = parseFloat(metadata?.totalAmount || '0');

    await admin.firestore().collection('orders').add({
      consumerId: metadata?.consumerId || context.auth.uid,
      consumerEmail: data.consumerEmail,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      stripeSessionId: session.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    console.error('Stripe error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || functions.config().stripe?.webhook_secret;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const ordersRef = admin.firestore().collection('orders');
    const snapshot = await ordersRef.where('stripeSessionId', '==', session.id).get();

    snapshot.forEach(async (doc) => {
      await doc.ref.update({
        paymentStatus: 'paid',
        status: 'accepted',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await admin.firestore().collection('payments').add({
      stripeSessionId: session.id,
      amount: session.amount_total / 100,
      currency: session.currency,
      status: 'paid',
      consumerId: session.metadata?.consumerId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  res.json({ received: true });
});
