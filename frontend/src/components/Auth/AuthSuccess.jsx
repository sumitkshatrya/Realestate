
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // You might want to fetch user profile here
      // For now, redirect to dashboard
      navigate(ROUTES.DASHBOARD);
    } else {
      // If no tokens, redirect to login
      navigate(ROUTES.LOGIN);
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="loader mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">
          Completing authentication...
        </h2>
        <p className="text-gray-600 mt-2">
          Please wait while we log you in.
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;