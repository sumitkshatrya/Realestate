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
import LoginForm from "./components/LoginForm"; // Import LoginForm
import SignupForm from "./components/SignupForm";
import TestimonialCard from "./components/TestimonialCard";
import TestimonialsList from "./components/TestimonialsList";
import SubmitTestimonial from "./pages/SubmitTestimonial";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import AdminServices from "./components/AdminServices";
import AdminServicesList from "./components/AdminServicesList";
import AdminDashboard from "./components/AdminDashboard";
import AdminSidebar from "./components/AdminSidebar";

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
          <Route path="/signup" element={<SignupForm/>} />
          <Route path="/login" element={<LoginForm/>} /> {/* Add this route */}
          <Route path="/TestimonialCard" element={<TestimonialCard/>}></Route>
          <Route path="/client" element={<Client/>}></Route>
          <Route path="/contact" element={<Contact/>}></Route>
          <Route path="/services" element={<Services/>}></Route>
          <Route path="/about" element={<About/>}></Route>
          <Route path="/properties" element={<Properties/>}></Route>
          <Route path="/adminservices" element={<AdminServices/>}></Route>
            <Route path="/adminserviceslist" element={<AdminServicesList/>}></Route>
            <Route path="/admindashboard" element={<AdminDashboard/>}></Route>
            <Route path="/adminsidebar" element={<AdminSidebar/>}></Route>
        </Routes>
      </DarkModeProvider>
    </AuthProvider>
  );
};

export default App;