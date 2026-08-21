import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Upload count and Pro status are owned by the server (see api/gemini.js
// and api/verify-payment.js, which use the Firebase Admin SDK). The client
// only ever reads this data — it can no longer write uploadCount/isPro to
// Firestore itself (see firestore.rules), so a signed-in user can't just
// reset their own quota or grant themselves Pro from devtools.
async function fetchAccountStatus(uid) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  const currentMonth = new Date().getMonth();

  if (!userSnap.exists()) {
    // First-ever sign-in: create the doc. This is the one write the client
    // still makes, and only happens once, when there's nothing to protect yet.
    await setDoc(userRef, { uploadCount: 0, resetMonth: currentMonth, isPro: false });
    return { uploadCount: 0, isPro: false };
  }

  const data = userSnap.data();
  // Display-only month rollover — doesn't write anything. The server
  // performs the same reset (and persists it) the next time this user
  // successfully calls /api/gemini for statement parsing.
  const sameMonth = data.resetMonth === currentMonth;
  return {
    uploadCount: sameMonth ? (data.uploadCount || 0) : 0,
    isPro: data.isPro || false,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadCount, setUploadCount] = useState(0);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const { uploadCount: count, isPro: pro } = await fetchAccountStatus(currentUser.uid);
        setUploadCount(count);
        setIsPro(pro);
      } else {
        setUploadCount(0);
        setIsPro(false);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  // Re-syncs uploadCount/isPro from Firestore after the server has changed
  // them (a successful statement parse, or a verified Pro payment).
  const refreshAccountStatus = useCallback(async () => {
    if (!user) return;
    const { uploadCount: count, isPro: pro } = await fetchAccountStatus(user.uid);
    setUploadCount(count);
    setIsPro(pro);
  }, [user]);

  const canUpload = isPro || uploadCount < 2;

  const value = {
    user,
    loading,
    uploadCount,
    isPro,
    setIsPro,
    canUpload,
    refreshAccountStatus,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
