import { useState } from 'react';
import { useDarkMode } from './DarkModeContext';
import aboutImage from '../assets/images/about.jpg';
import React from "react";
const LoginForm = ({ onClose, switchToSignup }) => {
  const { darkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || 'Login successful!');
        // Optionally, save token or user data in localStorage or context
        localStorage.setItem('user', JSON.stringify(data.user));
        // Close the modal
        onClose();
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
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
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

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

          {error && <div className={`p-3 mb-6 rounded-lg ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>{error}</div>}
          {success && <div className={`p-3 mb-6 rounded-lg ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}`}>{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username or email"
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-red-500' : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-red-500' : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
                }`}
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
                Create account here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
