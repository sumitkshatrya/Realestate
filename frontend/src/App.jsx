import React from "react";
import { Routes, Route } from "react-router-dom";

import { DarkModeProvider } from "./components/DarkModeContext";
import { AuthProvider } from "./context/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./sections/About";
import Client from "./sections/Client";
import Contact from "./sections/Contact";
import Hero from "./sections/Hero";
import PopularAreas from "./sections/PopularAreas";
import Properties from "./sections/Properties";
import Services from "./sections/Services";

import TestimonialCard from "./components/TestimonialCard";
import TestimonialsList from "./components/TestimonialsList";

import SubmitTestimonial from "./pages/SubmitTestimonial";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

// ✅ Home Page Component (combining all sections)
const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <PopularAreas />
      <Properties />
      <Services />
      <Client />
      <Contact />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SubmitTestimonial" element={<SubmitTestimonial />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/testimonials" element={<TestimonialsList />} />
        </Routes>
      </DarkModeProvider>
    </AuthProvider>
  );
};

export default App;
