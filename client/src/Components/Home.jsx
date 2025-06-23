import React from "react";
import backgroundimg from "../assets/backgroundimg.jpg";

const Home = () => {
  return (
    <div className>
      {/* Full-screen hero image */}
      <div className="h-screen min-h-screen bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url(${backgroundimg})` }}>

      </div>

      {/* Content sections */}
      <div className="bg-white">
        <section className="container mx-auto ">
          <div className="max-w-4xl mx-auto px-8 py-20">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-emerald-900">
              Welcome to Kurullo
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-700 px-8 py-20">
              Discover the fascinating world of birds and nature
            </p>
          </div>
        </section>

        <section className="container mx-auto px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-emerald-900">
              Discover Our World
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-emerald-800">About Us</h3>
                <p className="text-gray-700 mb-6">
                  Kurullo is dedicated to preserving and showcasing the beauty of avian life. 
                  Our mission is to connect people with nature through education and conservation.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-emerald-800">Featured Birds</h3>
                <p className="text-gray-700 mb-6">
                  Explore our extensive collection of rare and beautiful bird species from around the world.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;