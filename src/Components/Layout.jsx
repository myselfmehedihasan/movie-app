import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      {/* Navbar appears on all pages */}
      <Navbar />
      
      {/* Main content - renders the current route */}
      <Outlet />
    </>
  );
};

export default Layout;