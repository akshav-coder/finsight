import { verifyFirebaseTokenAdmin } from './_lib/firebaseAdmin.js';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const PRO_PLAN_AMOUNT_PAISE = 19900; // ₹199.00 — fixed server-side, never trust a client-supplied amount

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

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Server Misconfiguration: Razorpay keys are not configured.' });
  }

  try {
    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: PRO_PLAN_AMOUNT_PAISE,
        currency: 'INR',
        receipt: `pro_${user.uid}_${Date.now()}`,
        notes: { uid: user.uid },
      }),
    });

    const order = await response.json();
    if (!response.ok) {
      console.error('Razorpay order creation failed:', order);
      return res.status(502).json({ error: order.error?.description || 'Failed to create order' });
    }

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId, // safe to expose — it's the public key, not the secret
    });
  } catch (error) {
    console.error('create-order error:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
}
