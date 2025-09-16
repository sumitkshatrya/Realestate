import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import { authAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const { userId, email, phone, name } = location.state || {};
  const verifyOtpApi = useApi(authAPI.verifyOTP);
  const resendOtpApi = useApi(authAPI.resendOTP);

  useEffect(() => {
    if (!userId && !email && !phone) {
      navigate(ROUTES.SIGNUP);
    }
  }, [userId, email, phone, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== '' && element.nextSibling) {
      element.nextSibling.focus();
    }
  };
  
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  useEffect(() => {
  if (!location.state) {
    navigate(ROUTES.SIGNUP);
    return;
  }
  
  const { userId, email, phone } = location.state;
  if (!userId && !email && !phone) {
    navigate(ROUTES.SIGNUP);
  }
}, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    try {
      const payload = { otp: otpValue };
      // Use the state from location
    if (location.state.userId) payload.userId = location.state.userId;
    if (location.state.email) payload.email = location.state.email;
    if (location.state.phone) payload.phone = location.state.phone;

      const response = await verifyOtpApi.request(payload);
      const { user, accessToken, refreshToken } = response.data;
      
      login(user, { accessToken, refreshToken });
      toast.success('Account verified successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(error.response?.data?.message || 'verification failed');
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    
    setIsResending(true);
    try {
      const payload = {};
      if (userId) payload.userId = userId;
      if (email) payload.email = email;
      if (phone) payload.phone = phone;

      await resendOtpApi.request(payload);
      setTimer(60);
      toast.success('New OTP sent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    navigate(ROUTES.SIGNUP, { state: { email, phone, name } });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button onClick={handleGoBack}
          className='flex items-center text-gray-600 hover:text-gray-900 mb-4'>
            <ArrowLeft className='h-5 w-5 mr-2' />
            Back to signup
          </button>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code sent to your {email ? 'email' : 'phone'}
          </p>
          <div className='mt-2 text-center text-sm text-gray-600 flex items-center justify-center'>
            {email ? (
              <>
              <Mail className='h-4 w-4 mr-2' />
              {email}
              </>
            ):(
              <>
              <Phone className='h-4 w-4 mr-2' />
              {phone}
              </>
            )}
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-2xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={verifyOtpApi.loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {verifyOtpApi.loading ? (
                <div className="loader"></div>
              ) : (
                'Verify OTP'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className='text-sm text-gray-600'>
              Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={timer > 0 || isResending}
              className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
            >
              {isResending
                ? 'Sending...'
                : timer > 0
                ? `Resend OTP in ${timer}s`
                : 'Resend OTP'}
            </button>
            </p>
          </div>
        </form>

        {/* Development helper - show OTP if in development */}
        {process.env.NODE_ENV === 'development' && location.state?.otp && (
          <div className='mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-md'>
            <p className='text-sm text-yellow-800 text-center'>
              <strong> Development Mode:</strong>
              Your OTP is {location.state.otp}
            </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;