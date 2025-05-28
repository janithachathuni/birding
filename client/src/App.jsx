import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Header from './Components/Header';
import Login from './Components/Login';
import SignUp from './Components/SignUp';

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
    <div className="app-container min-h-screen bg-[#fffdef] font-urbanist"> {/* Ensure this has proper styling */}
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />      
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>

      </Routes>
    
      <Footer />
    </div>
  );
}