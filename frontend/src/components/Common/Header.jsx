import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/auth/google';
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">RealEstate</span>
          </Link>

          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.PROFILE}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </button>
                <button
                  onClick={() => navigate(ROUTES.SIGNUP)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </button>
                <button
                  onClick={handleGoogleLogin}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 border border-gray-300 flex items-center"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4 mr-2" />
                  Google
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;