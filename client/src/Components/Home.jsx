import React from 'react';
import {Link} from 'react-router-dom';
import backgroundimg from '../assets/backgroundimg.jpg';
import Footer from '../Components/footer'


const Home = () => {
  return (
    <div className=''>
      <div className='h-screen'>Home</div>
      <div className='h-screen bg-red-400'></div>
      <div className='h-screen bg-white'></div>

      <Footer/>
    </div>
  )
}

export default Home
