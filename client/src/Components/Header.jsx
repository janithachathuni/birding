import React from 'react';
import { Link } from 'react-router-dom';
import kurulloIcon from '../assets/kurullo.png';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-black py-3 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left-aligned logo and name */}
        <div className="flex items-center">
          <img 
            src={kurulloIcon} 
            alt="Kurullo Logo" 
            className="h-10 w-10 mr-2"
          />
          <span className="text-3xl text-black "><Link to="/"><h1>Kurullo</h1></Link></span>
        </div>

        {/* Right-aligned items */}
        <div className="flex items-center space-x-8">
          <Link to="/about" className="text-gray-900 hover:text-amber-900">
            About
          </Link>
          <Link to="/birdlist" className="text-gray-900 hover:text-amber-900">
            Birdlist
          </Link>
          <Link to="/login" className="text-gray-900 hover:text-amber-900">
            Login
          </Link>
          <Link 
            to="/signup" 
            className="border border-black bg-[#f8eec8] px-4 py-2  hover:border-black hover:bg-amber-100 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;