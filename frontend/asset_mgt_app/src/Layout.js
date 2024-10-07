// components/Layout.js
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SideNav from './components/SideNav';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <SideNav />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
