import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {ThemeProvider} from './Context/ThemeContext';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Header from './Components/Header';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Dashboard from './Pages/Dashboard';
import Blog from './Pages/Blog';
import SingleBird from './Pages/SingleBird';

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const hideHeaderFooter = ['/dashboard', '/other-route', '/blog'].includes(location.pathname);
 

  return (
    

    <div className="app-container min-h-screen font-urbanist"> {/* Ensure this has proper styling */}
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />      
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/bird" element={<SingleBird/>}/>

      </Routes>
    
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}