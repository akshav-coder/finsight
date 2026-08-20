import crypto from 'crypto';
import { verifyFirebaseTokenAdmin, getAdminFirestore } from './_lib/firebaseAdmin.js';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST instead.' });
  }

  let user;
  try {
    user = await verifyFirebaseTokenAdmin(req);
  } catch (err) {
    return res.status(401).json({ error: `Unauthorized: ${err.message}` });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification fields.' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(500).json({ error: 'Server Misconfiguration: RAZORPAY_KEY_SECRET is not configured.' });
  }

  // This is the actual proof of payment: Razorpay signs order_id|payment_id
  // with the secret only Razorpay and this server know. If it doesn't match,
  // the "payment" was never real — this is what the old client-only flow lacked.
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed. Signature mismatch.' });
  }

  try {
    const db = getAdminFirestore();

    // Idempotency: a given payment_id can only ever grant Pro once.
    const paymentRef = db.collection('payments').doc(razorpay_payment_id);
    const paymentSnap = await paymentRef.get();
    if (paymentSnap.exists) {
      return res.status(200).json({ success: true, alreadyProcessed: true });
    }

    await db.runTransaction(async (tx) => {
      tx.set(paymentRef, {
        uid: user.uid,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        verifiedAt: new Date().toISOString(),
      });
      tx.set(db.collection('users').doc(user.uid), { isPro: true }, { merge: true });
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('verify-payment error:', error);
    return res.status(500).json({ error: 'Failed to record verified payment.' });
  }
}
