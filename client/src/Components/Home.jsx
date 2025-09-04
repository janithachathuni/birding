import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Hero images
import backgroundimg from "../assets/backgroundimg.jpg";
import backgroundimg2 from "../assets/backgroundimg2.jpg";
import backgroundimg3 from "../assets/backgroundimg3.jpg";
import backgroundimg4 from "../assets/backgroundimg4.jpg";

import kurulloiconmain from "../assets/kurulloiconmain.jpg";
import birdlogo from "../assets/birdlogo.png";

// Footer and navbar
import Footer from "../Components/footer";
import Navbar from "./Navbar";

const galleryPhotos = [
  "https://source.unsplash.com/400x300/?bird,1",
  "https://source.unsplash.com/400x300/?bird,2",
  "https://source.unsplash.com/400x300/?bird,3",
  "https://source.unsplash.com/400x300/?bird,4",
  "https://source.unsplash.com/400x300/?bird,5",
  "https://source.unsplash.com/400x300/?bird,6",
];

const infoCards = [
  {
    id: 1,
    title: "Discover Birds",
    description: "Explore a comprehensive database of bird species in Sri Lanka.",
  },
  {
    id: 2,
    title: "Join the Community",
    description: "Connect with fellow bird enthusiasts and share your sightings.",
  },
  {
    id: 3,
    title: "Track your sightings",
    description: "Log and manage your birdwatching activities with ease.",
  },
];

const articles = [
  {
    id: 1,
    title: "The Rise of Birdwatching in Sri Lanka",
    author: "Jane Doe",
    excerpt:
      "Birdwatching has become one of the fastest-growing hobbies, bringing people closer to nature...",
  },
  {
    id: 2,
    title: "Top 10 Migratory Birds You Can See This Season",
    author: "John Smith",
    excerpt:
      "Every year, thousands of migratory birds pass through Sri Lanka. Here are the top 10 to spot...",
  },
  {
    id: 3,
    title: "Why Protecting Wetlands Matters",
    author: "Amal Perera",
    excerpt:
      "Wetlands are home to countless bird species and play a vital role in biodiversity...",
  },
];

const heroImages = [
  {
    src: backgroundimg,
    rotation: "-12deg",
    zIndex: 4,
    top: "15%",
    left: "10%",
  },
  {
    src: backgroundimg2,
    rotation: "8deg",
    zIndex: 3,
    top: "35%",
    left: "25%",
  },
  {
    src: backgroundimg3,
    rotation: "-5deg",
    zIndex: 2,
    top: "20%",
    left: "45%",
  },
  {
    src: backgroundimg4,
    rotation: "15deg",
    zIndex: 1,
    top: "50%",
    left: "15%",
  },
];

const Home = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  // Navbar show/hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate info cards on scroll
  useEffect(() => {
    const cards = document.querySelectorAll(
      ".opacity-0.translate-y-10"
    );

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-10");
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const handleImageClick = (index) => {
    if (activeImageIndex === index) {
      setActiveImageIndex(null);
    } else {
      setActiveImageIndex(index);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      {showNavbar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-screen flex">
        {/* Left half */}
        <div className="w-2/5 h-full flex items-center justify-center px-10 -mt-2">
          <div className="max-w-lg">
            {/* <img
              src={kurulloiconmain}
              alt="Kurullo Icon"
              className=" w-[80%] mb-7"
            /> */}
            <div className="flex items-center gap-3">
  <h1 className="text-xl mb-7 md:text-[5rem] text-[black] font-bold tracking-tight">
    Kurullo
  </h1>
  <img
    src={birdlogo}
    className="h-12 -ml-10 -mt-25"
    alt="Kurullo logo"
  />
</div>
            <p className="mb-15 md:text-[16px] leading-relaxed text-gray-600">
              Join a vibrant community of bird enthusiasts. Share your
              sightings, learn from others, and contribute to bird conservation.
            </p>

            <div className="flex flex-col md:flex-row justify-start gap-4 mb-8">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-105 transition-transform"
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="h-12"
                />
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-105 transition-transform"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-12"
                />
              </a>
            </div>

            <Link
              to="/login"
              className="inline-block px-8 py-4 w-80 text-center bg-[#143829] hover:bg-white rounded-full text-white hover:text-black border hover:border-black font-semibold tracking-wide transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Right half - hero images */}
        <div className="w-3/5 h-full relative bg-white overflow-visible -mt-6">
          {heroImages.map((image, index) => {
            let zIndexValue = image.zIndex;
            if (activeImageIndex === index) {
              zIndexValue = 999;
            } else if (activeImageIndex !== null) {
              zIndexValue = 1;
            }

            return (
              <div
                key={index}
                className="absolute cursor-pointer transition-all duration-500 group"
                style={{
                  top: image.top,
                  left: image.left,
                  transform: `rotate(${image.rotation})`,
                  zIndex: zIndexValue,
                }}
                onClick={() => handleImageClick(index)}
              >
                <div
                  className="border border-black overflow-hidden transition-all duration-500 group-hover:rotate-0 group-hover:scale-150 group-hover:z-[999] relative"
                  style={{ width: "350px", height: "250px" }}
                >
                  <img
                    src={image.src}
                    alt="Bird"
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                </div>
              </div>
            );
          })}

          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-transparent via-gray-200 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Introduction Cards */}
      <section className="py-20 px-6 mt-10 md:px-12 bg-[#f5f6f5]">
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3">
          {infoCards.map((card) => (
            <div
              key={card.id}
              className="p-6 bg-white border border-gray-400 rounded hover:shadow-md hover:-translate-y-1 transition text-center opacity-0 translate-y-10 duration-700 ease-out will-change-transform"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#89311b]">
                {card.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-wide text-[#506142]">
          Latest Articles
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="p-6 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#143829]">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3">By {article.author}</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {article.excerpt}
              </p>
              <button className="mt-4 text-[#C4501B] hover:underline text-sm font-medium">
                Read more →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-6 md:px-12">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-wide text-[#143829]">
          Explore Bird Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryPhotos.map((src, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl transition transform hover:scale-105"
            >
              <img
                src={src}
                alt={`Bird ${idx + 1}`}
                className="object-cover w-full h-56"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
