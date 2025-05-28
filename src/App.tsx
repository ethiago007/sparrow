import { useState } from 'react'
import Navbar from './components/navbar'
import HeroSection from './components/hero'
import { ThemeProvider } from './context/ThemeContext';
import './App.css'

function App() {
  

  return (
    <> 
    <ThemeProvider>
      <Navbar />
<HeroSection />
      </ThemeProvider>
    </>
  )
}

export default App
