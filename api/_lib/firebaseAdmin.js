import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Server-only: uses a service account, unlike the client SDK. This is what
// lets the server write `isPro` with full trust, bypassing whatever a
// signed-in user's own client could otherwise write to their own document.
function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error('Server misconfiguration: FIREBASE_SERVICE_ACCOUNT_KEY is not set.');
  }

  const serviceAccount = JSON.parse(raw);
  return initializeApp({ credential: cert(serviceAccount) });
}

export async function verifyFirebaseTokenAdmin(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing Authorization header. Sign in and try again.');
  }
  const idToken = authHeader.slice('Bearer '.length).trim();
  const app = getAdminApp();
  return getAuth(app).verifyIdToken(idToken);
}

export function getAdminFirestore() {
  const app = getAdminApp();
  return getFirestore(app);
}
