import { jwtVerify, createRemoteJWKSet } from 'jose';

// Verifies a Firebase Auth ID token using Google's public signing keys.
// No service account/secret required — this only checks that the token
// was genuinely issued by Firebase Auth for this project and hasn't expired.
const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/metadata/jwk/securetoken@system.gserviceaccount.com')
);

export async function verifyFirebaseToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing Authorization header. Sign in and try again.');
  }

  const idToken = authHeader.slice('Bearer '.length).trim();
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('Server misconfiguration: FIREBASE_PROJECT_ID is not set.');
  }

  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  return payload; // payload.sub is the Firebase uid
}
