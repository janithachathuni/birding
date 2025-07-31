import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';

function App() {
  const location = useLocation();
  
  // List of paths where Navbar should be *hidden*
  const noNavbarPaths = [
    // Add paths here where Navbar should NOT appear
    // (empty in this case since we want Navbar on all pages)
  ];

  // Check if current path is NOT in noNavbarPaths
  const shouldShowNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {shouldShowNavbar && <Navbar />}
      <Outlet /> {/* Renders the matched child route */}
    </div>
  );
}

export default App;