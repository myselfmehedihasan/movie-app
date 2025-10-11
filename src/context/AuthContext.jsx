import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase/firebase.init';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signUp = async (email, password, fullName) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: fullName,
    });

    // Send verification email
    await sendEmailVerification(userCredential.user);

    return userCredential;
  };

  // Login with email and password
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async () => {
    return await signOut(auth);
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Google sign in
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  // GitHub sign in
  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  // Update user profile
  const updateUserProfile = (updates) => {
    return updateProfile(auth.currentUser, updates);
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signUp,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    signInWithGithub,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


