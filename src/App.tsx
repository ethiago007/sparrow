import { useState } from 'react'
import Navbar from './components/navbar'
import HeroSection from './components/hero'
import FeaturesSection from './components/features'
import DemoSection from './components/demo'
import { ThemeProvider } from './context/ThemeContext';
import './App.css'

function App() {
  

  return (
    <> 
    <ThemeProvider>
      <Navbar />
<HeroSection />
<FeaturesSection />
<DemoSection />
      </ThemeProvider>
    </>
  )
}

export default App
