import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';

function App() {
  const location = useLocation();
  
  // Paths where Navbar should appear
  const showNavbarPaths = [
    '/', 
    '/login', 
    '/sign-up'
  ];

  // Check if current path matches exactly or starts with /admin
  const shouldShowNavbar = 
    showNavbarPaths.includes(location.pathname) 
    // ||
    // location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </div>
  );
}

export default App;