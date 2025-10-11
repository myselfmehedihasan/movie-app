import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const Layout = () => {
  return (
    <div className="relative min-h-screen">
      {/* Scroll to top on route change */}
      <ScrollToTop />
      
      {/* Navbar with higher z-index */}
      <div className="sticky top-0 z-50 backdrop-blur-xl">
        <Navbar />
      </div>
      
      {/* Main content with lower z-index */}
      <div className="relative z-10">
        <Outlet />
      </div>
        <Footer />
    </div>
  );
};

export default Layout;