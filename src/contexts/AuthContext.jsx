// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
// CHANGE THIS LINE:
// import { auth, db } from '../config/firebaseConfig';
// TO THIS:
import { auth, db } from '../config/supabaseConfig'; // or './supabaseConfig'

// Also update Firebase-specific code to Supabase:
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Supabase signup function
  async function signup(email, password, userData) {
    try {
      const { data, error } = await auth.signUp({
        email,
        password,
        options: {
          data: userData // Additional user data
        }
      });
      
      if (error) throw error;
      
      // Create user profile in database
      if (data.user) {
        await db.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          ...userData,
          created_at: new Date()
        });
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }

  // Supabase login function
  async function login(email, password) {
    try {
      const { data, error } = await auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }

  // Supabase logout function
  async function logout() {
    try {
      const { error } = await auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Reset password
  async function resetPassword(email) {
    try {
      const { error } = await auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  useEffect(() => {
    // Supabase auth state listener
    const { data: { subscription } } = auth.onAuthStateChange(
      (event, session) => {
        setCurrentUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}