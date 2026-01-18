// src/config/supabaseConfig.js
import { createClient } from '@supabase/supabase-js';

// Get from Supabase dashboard: Settings → API
const supabaseUrl = "https://paxnqyuzuxgktqlnlqxi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBheG5xeXV6dXhna3RxbG5scXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1ODczOTAsImV4cCI6MjA4MzE2MzM5MH0.KTfQTBSjLLU4anJbJ3j1xrG0wkGX3IYKz1sqNK_hOUk";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper exports for different services (similar to Firebase pattern)
export const auth = supabase.auth;           // Equivalent to Firebase Auth
export const db = supabase;                  // Main DB client (includes all)
export const storage = supabase.storage;     // Equivalent to Firebase Storage

// For real-time subscriptions (Firestore's onSnapshot)
export const realtime = supabase.channel.bind(supabase);

// Export default (similar to Firebase app)
export default supabase;