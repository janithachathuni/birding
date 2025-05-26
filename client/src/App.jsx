import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './Components/Footer';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  return (
    <div className="app-container"> {/* Ensure this has proper styling */}
      <Routes>
        <Route path="/" element={<h1 class="text-3xl">home page</h1>}/> Add at least 1 route
      </Routes>
      <Footer /> {/* Now it should appear */}
    </div>
  );
}