import React from 'react';
import { Link } from 'react-router-dom';
import backgroundimg from '../assets/backgroundimg.jpg';
import Footer from '../Components/footer';
// import appStoreImg from '../assets/appstore.png';   // save cropped App Store image in assets
// import playStoreImg from '../assets/playstore.png'; // save cropped Play Store image in assets

// Mock gallery photos (replace with real user data)
const galleryPhotos = [
  'https://source.unsplash.com/400x300/?bird,1',
  'https://source.unsplash.com/400x300/?bird,2',
  'https://source.unsplash.com/400x300/?bird,3',
  'https://source.unsplash.com/400x300/?bird,4',
  'https://source.unsplash.com/400x300/?bird,5',
  'https://source.unsplash.com/400x300/?bird,6',
];

// Mock articles (replace with real user data)
const articles = [
  { id: 1, title: 'The Rise of Birdwatching in Sri Lanka', author: 'Jane Doe', excerpt: 'Birdwatching has become one of the fastest-growing hobbies...' },
  { id: 2, title: 'Top 10 Migratory Birds You Can See This Season', author: 'John Smith', excerpt: 'Every year, thousands of migratory birds pass through...' },
  { id: 3, title: 'Why Protecting Wetlands Matters', author: 'Amal Perera', excerpt: 'Wetlands are home to countless bird species and are critical...' },
];

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover. Share. Protect.
          </h1>
          <p className="mb-6 text-lg">
            Join a vibrant community of bird enthusiasts. Share your sightings,
            learn from others, and contribute to bird conservation.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="App Store" className="h-12" />
            </a>
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Google Play" className="h-12" />
            </a>
          </div>

          <Link
            to="/login"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8 text-center">Bird Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryPhotos.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Bird ${idx + 1}`}
              className="rounded-lg shadow-md object-cover w-full h-48"
            />
          ))}
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <h2 className="text-2xl font-bold mb-8 text-center">Latest Articles</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="p-6 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
              <p className="text-sm text-gray-500 mb-2">By {article.author}</p>
              <p className="text-gray-700">{article.excerpt}</p>
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
