import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield,
  Calendar,
  RefreshCw
} from 'lucide-react';
import useApi from '../../hooks/useApi';
import { userAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(user);
  const getProfileApi = useApi(userAPI.getProfile);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfileApi.request();
        setUserData(response.data);
      } catch (error) {
        // Error handling is done in the API interceptor
      }
    };

    fetchUserProfile();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome to your RealEstate dashboard
          </p>
        </div>

        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Email: {userData?.email || 'Not provided'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Phone: {userData?.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Status: {userData?.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Joined: {userData?.createdAt ? formatDate(userData.createdAt) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Backend Integration Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Backend Integration
              </h2>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>API Endpoints Used:</strong>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>POST /api/auth/signup</li>
                    <li>POST /api/auth/verify-otp</li>
                    <li>POST /api/auth/resend-otp</li>
                    <li>POST /api/auth/login</li>
                    <li>GET /api/user/profile</li>
                  </ul>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Authentication:</strong>
                  <p className="mt-1">JWT tokens with refresh mechanism</p>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Features:</strong>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Email/Phone verification via OTP</li>
                    <li>Password hashing with bcrypt</li>
                    <li>Automatic token refresh</li>
                    <li>Rate limiting protection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* API Response Demo */}
          <div className="mt-6 bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Raw API Response (User Profile)
            </h3>
            <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;