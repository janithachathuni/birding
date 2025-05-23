import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Footer from './Components/Footer';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        Hello world
      </div>
    </>
  )
}

export default App
