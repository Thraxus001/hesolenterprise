import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseConfig';
// Added semicolon here:
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Get the session from URL hash
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session) {
        // Check if user exists in public.users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError && userError.code === 'PGRST116') {
          // User doesn't exist in public.users, create record
          const { error: createError } = await supabase
            .from('users')
            .insert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.name || '',
              role: 'customer',
              created_at: new Date().toISOString()
            });

          if (createError) throw createError;
        }

        setStatus('success');
        setMessage('Authentication successful! Redirecting...');

        // Redirect to home page after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setStatus('error');
        setMessage('No session found. Please try logging in again.');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      setStatus('error');
      setMessage(error.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Authentication
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your login...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Success!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="animate-pulse">
              <div className="h-2 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;