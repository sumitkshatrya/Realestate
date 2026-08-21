import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet /> {/* This will render the matched child route element */}
      <Footer />
    </>
  );
};

export default Layout;