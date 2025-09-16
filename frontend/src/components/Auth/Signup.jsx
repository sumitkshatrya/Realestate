import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Phone, User, UserPlus, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import { authAPI } from '../../services/api';
import { ROUTES } from '../../utils/constants';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const signupApi = useApi(authAPI.signup);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.email && !formData.phone) {
      toast.error('Please provide either email or phone number');
      return;
    }

    try {
      const response = await signupApi.request(formData);
      // toast.success('OTP sent successfully!');
      navigate(ROUTES.VERIFY_OTP, { 
        state: { 
        userId: response.data.userId,
        email: formData.email,
        phone: formData.phone,
        name: formData.name,
        otp: response.data.otp
        } 
      });

      // toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Signup error details:', error.response?.data);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-green-600 hover:text-green-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Google Signup Button */}
        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-md hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-sm font-medium"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5 mr-2" />
            Sign up with Google
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or create with email/phone</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="phone" className="sr-only">
                Phone number
              </label>
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                {showPassword ? (
                  <EyeOff
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-b-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the <a href="#" className="text-green-600 hover:text-green-500">Terms</a> and <a href="#" className="text-green-600 hover:text-green-500">Privacy Policy</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={signupApi.loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {signupApi.loading ? (
                <div className="loader"></div>
              ) : (
                'Create my account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-green-600 hover:text-green-500"
              >
                <LogIn className="h-4 w-4 inline mr-1" />
                Sign in now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;