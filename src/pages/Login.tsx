import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../types/supabase_setup';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    setIsLoading(true);
    setError(null);

    try {
      // Check hardcoded credentials
      if (email === 'admin' && password === 'admin') {
        // Set both authentication and role in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        // Force a page reload to update the app state
        window.location.href = '/admin';
      } else {
        throw new Error('Invalid credentials. Use admin/admin to login.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffcf5] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md"
        style={{ backgroundColor: '#fffcf5', border: '1px solid #d3b17d' }}
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#8b4513]">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-[#d35400]">
            Sign in to manage your products
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-500 p-4 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#8b4513] mb-2">
                Username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-[#d3b17d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400] focus:border-[#d35400] text-base"
                style={{ backgroundColor: '#fff' }}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#8b4513] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-[#d3b17d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400] focus:border-[#d35400] text-base"
                style={{ backgroundColor: '#fff' }}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white bg-[#d35400] hover:bg-[#8b4513] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d35400] transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-[#d35400] hover:text-[#8b4513] text-sm transition-colors"
          >
            Back to Home
          </button>
        </div>

        {/* Add demo credentials info */}
        <div className="mt-4 p-4 bg-[#f9f1e7] rounded-lg border border-[#d3b17d]">
          <p className="text-sm text-[#8b4513]">
            <strong>Demo Credentials:</strong><br />
            Username: admin<br />
            Password: admin
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
