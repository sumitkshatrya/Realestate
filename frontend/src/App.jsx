<<<<<<< HEAD

import { DarkModeProvider } from "./components/DarkModeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./sections/About";
import Client from "./sections/Client";
import Contact from "./sections/Contact";
import Hero from "./sections/Hero";
import PopularAreas from "./sections/PopularAreas";
import Properties from "./sections/Properties";
import Services from "./sections/Services";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
    <DarkModeProvider>
      
      <div>
        <Header />
        <Hero />
        <About />
        <PopularAreas />
        <Properties />
        <Services />
        <Client />
        <Contact />
        <Footer />
      </div>
     </DarkModeProvider>
     </AuthProvider>
  );
};
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import ProtectedRoute from './components/Common/ProtectedRoute';
import HomePage from './components/Home/HomePage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import OTPVerification from './components/Auth/OTPVerification';
import Dashboard from './components/User/Dashboard';
import Profile from './components/User/Profile';
import { ROUTES } from './utils/constants';
import AuthSuccess from './components/Auth/AuthSuccess';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow bg-gray-50">
            <Routes>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.SIGNUP} element={<Signup />} />
              <Route path={ROUTES.VERIFY_OTP} element={<OTPVerification />} />
              <Route path="/auth-success" element={<AuthSuccess />} />
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}
>>>>>>> 04d5531 (first)

export default App;