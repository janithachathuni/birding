import React from 'react';
import { Link } from 'react-router-dom';
import kurulloImage from '../assets/kurullo.png'; // Import your image

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f8eec8] font-urbanist">

      {/* Hero Section with Your Image */}
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Welcome to Our Site
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Discover amazing things with our platform featuring Kurullo!
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
          </div>
          <div className="md:w-1/2">
            <img 
              src={kurulloImage} 
              alt="Kurullo" 
              className="w-full max-w-md mx-auto rounded-lg shadow-xl"
            />
          </div>
        </div>

        
      </main>

      <div className='bg-white'>
          hello
        </div>

    </div>
  );
};

export default Home;