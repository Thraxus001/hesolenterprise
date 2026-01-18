// src/services/authService.js
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authService = {
  // =============== GOOGLE AUTHENTICATION ===============
  /**
   * Sign in with Google account
   * @returns {Promise<Object>} Result object with success status and user data
   */
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      // The user will be redirected to Google and back to our app
      // The actual user data will be available after the redirect
      toast.success('Redirecting to Google...');
      return { success: true, data };
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google');
      return { success: false, error: error.message };
    }
  },

  // =============== EMAIL/PASSWORD AUTHENTICATION ===============
  /**
   * Register new user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} displayName - User's display name
   * @returns {Promise<Object>} Result object with success status and user data
   */
  async registerWithEmail(email, password, displayName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: 'customer'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile in Supabase
        await this.createUserProfile(data.user, { display_name: displayName });
        
        toast.success('Registration successful! Please check your email for verification.');
        return { success: true, user: data.user };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      
      switch (error.message) {
        case 'User already registered':
          errorMessage = 'Email is already registered';
          break;
        case 'Invalid email':
          errorMessage = 'Invalid email address';
          break;
        case 'Password should be at least 6 characters':
          errorMessage = 'Password is too weak';
          break;
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Sign in with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Result object with success status and user data
   */
  async signInWithEmail(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Check if email is verified (Supabase handles this automatically)
        // Update last login
        await this.updateUserProfile(data.user.id, {
          last_login: new Date().toISOString()
        });

        toast.success('Welcome back!');
        return { success: true, user: data.user, session: data.session };
      }

      return { success: false, error: 'Sign in failed' };
    } catch (error) {
      console.error('Sign in error:', error);
      let errorMessage = 'Sign in failed';
      
      switch (error.message) {
        case 'Invalid login credentials':
          errorMessage = 'Invalid email or password';
          break;
        case 'Email not confirmed':
          errorMessage = 'Please verify your email before signing in';
          return { success: false, error: errorMessage, needsVerification: true };
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // =============== PASSWORD MANAGEMENT ===============
  /**
   * Send password reset email
   * @param {string} email - User's email
   * @returns {Promise<Object>} Result object with success status
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset email';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Update user password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Result object with success status
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      toast.error('Failed to update password');
      return { success: false, error: error.message };
    }
  },

  // =============== USER MANAGEMENT ===============
  /**
   * Sign out current user
   * @returns {Promise<Object>} Result object with success status
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Signed out successfully');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      return { success: false, error: error.message };
    }
  },

  /**
   * Get current user profile from Supabase
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { success: true, profile: data };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Result object with success status
   */
  async updateUserProfile(userId, updates) {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Update auth metadata if display_name is provided
      if (updates.display_name) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { display_name: updates.display_name }
        });
        
        if (updateError) throw updateError;
      }

      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete user account
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Result object with success status
   */
  async deleteAccount(userId) {
    try {
      // Delete user profile from users table
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Note: In Supabase, user deletion from auth should be done
      // through the dashboard or with a server-side function
      // For client-side, we can just sign out
      await this.signOut();

      toast.success('Account deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Failed to delete account');
      return { success: false, error: error.message };
    }
  },

  // =============== HELPER FUNCTIONS ===============
  /**
   * Create user profile in Supabase
   * @param {Object} user - Supabase user object
   * @param {Object} additionalData - Additional user data
   * @returns {Promise<void>}
   */
  async createUserProfile(user, additionalData = {}) {
    try {
      const userData = {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.display_name || additionalData.display_name || 'User',
        avatar_url: user.user_metadata?.avatar_url || '',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        email_confirmed_at: user.email_confirmed_at,
        role: 'customer',
        ...additionalData
      };

      const { error } = await supabase
        .from('users')
        .insert([userData]);

      if (error) throw error;
    } catch (error) {
      console.error('Create user profile error:', error);
      throw error;
    }
  },

  /**
   * Check if user exists by email
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if user exists
   */
  async checkUserExists(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Check user exists error:', error);
      return false;
    }
  },

  /**
   * Get current user's authentication state
   * @returns {Promise<Object|null>} Current user or null
   */
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Get current session
   * @returns {Promise<Object|null>} Current session or null
   */
  async getSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} True if user is authenticated
   */
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  },

  /**
   * Check if user has specific role
   * @param {string} userId - User ID
   * @param {string} role - Role to check
   * @returns {Promise<boolean>} True if user has role
   */
  async checkUserRole(userId, role) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return data.role === role;
    } catch (error) {
      console.error('Check role error:', error);
      return false;
    }
  },

  /**
   * Subscribe to auth state changes
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  /**
   * Resend email verification
   * @returns {Promise<Object>} Result object with success status
   */
  async resendEmailVerification() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      if (error) throw error;

      toast.success('Verification email sent!');
      return { success: true };
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to send verification email');
      return { success: false, error: error.message };
    }
  },

  /**
   * Refresh session
   * @returns {Promise<Object>} Refreshed session
   */
  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return { success: true, session: data.session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default authService;