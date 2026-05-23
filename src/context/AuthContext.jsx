import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
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
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        const currentMonth = new Date().getMonth();

        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.resetMonth !== currentMonth) {
            await updateDoc(userRef, { uploadCount: 0, resetMonth: currentMonth });
            setUploadCount(0);
          } else {
            setUploadCount(data.uploadCount || 0);
          }
          setIsPro(data.isPro || false);
        } else {
          await setDoc(userRef, {
            uploadCount: 0,
            resetMonth: currentMonth,
            isPro: false,
          });
          setUploadCount(0);
          setIsPro(false);
        }
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

  const incrementUpload = async () => {
    if (!user) return;
    const newCount = uploadCount + 1;
    setUploadCount(newCount);
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { uploadCount: newCount });
  };

  const canUpload = isPro || uploadCount < 2;

  const value = {
    user,
    loading,
    uploadCount,
    isPro,
    setIsPro,
    canUpload,
    incrementUpload,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
