import { useState } from 'react';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import { userAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const updateProfileApi = useApi(userAPI.updateProfile);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfileApi.request(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      // Error handling is done in the API interceptor
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your account information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-green-800">
                Account Verified
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Your account has been successfully verified through our OTP system.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateProfileApi.loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {updateProfileApi.loading ? (
                <div className="loader mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Backend Integration Details */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Backend Integration Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">API Endpoints</h3>
            <ul className="space-y-1">
              <li><code>PUT /api/user/profile</code> - Update user profile</li>
              <li><code>GET /api/user/profile</code> - Get user profile</li>
              <li><code>POST /api/auth/refresh-token</code> - Refresh JWT tokens</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Request/Response Flow</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Frontend sends updated profile data</li>
              <li>Backend validates and sanitizes input</li>
              <li>MongoDB updates user document</li>
              <li>Backend returns updated user data</li>
              <li>Frontend updates local state with response</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;