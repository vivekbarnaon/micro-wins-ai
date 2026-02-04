/**
 * Login Page
 * Entry point for user authentication
 */

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { ROUTES } from '../utils/constants';
import { signInWithGoogle } from '../firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const user = await signInWithGoogle();
      console.log('User signed in:', user);
      navigate(ROUTES.SETUP);
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center px-4 py-8 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Logo/Icon Area */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Logo size={48} />
          </div>
          <h1 className="text-3xl font-bold text-calm-text dark:text-white mb-2">
            MicroWins
          </h1>
          <p className="text-calm-textLight dark:text-gray-300">
            Break big goals into small wins
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-calm-text dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-calm-textLight dark:text-gray-300">
              Sign in to continue your journey
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Button 
            variant="primary" 
            fullWidth
            size="large"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </div>
          </Button>

          <div className="mt-8 text-center">
            <p className="text-xs text-calm-textLight dark:text-gray-400">
              By continuing, you agree to our Terms of Service
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-calm-textLight dark:text-gray-300 font-medium">
            🌟 Designed for calm, focused productivity
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
