import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout"; // Import the new Layout component
import About from "./sections/About";
import Client from "./sections/Client";
import Contact from "./sections/Contact";
import Hero from "./sections/Hero";
import PopularAreas from "./sections/PopularAreas";
import Properties from "./sections/Properties";
import Services from "./sections/Services";
import RecentlyViewed from "./pages/RecentlyViewed";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import TestimonialsList from "./components/TestimonialsList";
import ForgotPassword from "./pages/ForgotPassword"; 
import SubmitTestimonial from "./pages/SubmitTestimonial";
import PropertyDetail from "./pages/PropertyDetail";
import MyFavorites from "./pages/MyFavorites";
import UserProfile from "./pages/UserProfile";
import AboutPage from "./pages/AboutPage"; 
import AgentProfile from "./pages/AgentProfile"; 
import { useEffect, useState } from "react";

const Home = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    q: "",
    type: "",
    category: "",
  });
  return (
    <>
      <Hero setSearchCriteria={setSearchCriteria} />
      <About />
      <PopularAreas />
      <Properties searchCriteria={searchCriteria} setSearchCriteria={setSearchCriteria} />
      <RecentlyViewed />
      <Services />
      <Client />
      <Contact />
    </>
  );
};


const ScrollToSection = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToSection />
      <Routes>
        {/* Routes that should have the main layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/testimonials" element={<TestimonialsList />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/submit-testimonial" element={<SubmitTestimonial />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/my-favorites" element={<MyFavorites />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/agent/:id" element={<AgentProfile />} />
        </Route>

        {/* Full-page routes without the main layout (e.g., auth forms) */}
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
