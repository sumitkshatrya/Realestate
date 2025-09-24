import { useState, } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from './DarkModeContext';
import aboutImage from '../assets/images/about.jpg';

const LoginForm = ({ onClose, switchToSignup }) => {
  const { darkMode } = useDarkMode();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.email === 'demo@example.com' && formData.password === 'password') {
      login({
        id: 1,
        name: 'Demo User',
        email: formData.email
      });
      onClose();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundImage: `url(${aboutImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1f2937' 
      }}
    >
      
      <div className="absolute inset-0  bg-opacity-30"></div> 
      
      <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
        darkMode ? 'bg-gray-900 bg-opacity-95 text-white' : 'bg-white bg-opacity-98 text-gray-900'
      } backdrop-blur-sm`}> 
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full z-10 transition-colors duration-200 ${
            darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-700'
          }`}
        >
          ×
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Login to Your Account
          </h2>
          
          {error && (
            <div className={`p-3 rounded-lg mb-6 ${
              darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-red-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
                }`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-red-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
                }`}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <button
                onClick={switchToSignup}
                className="text-red-500 hover:text-red-600 font-semibold underline transition-colors duration-200"
              >
                Create User here
              </button>
            </p>
          </div>

          <div className={`mt-6 p-4 rounded-lg text-sm border ${
            darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
          }`}>
            <p className="font-semibold mb-2">Demo credentials for testing:</p>
            <p>📧 Email: <span className="font-mono">demo@example.com</span></p>
            <p>🔐 Password: <span className="font-mono">password</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;