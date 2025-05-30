import { useState } from 'react'
import Navbar from './components/navbar'
import HeroSection from './components/hero'
import FeaturesSection from './components/features'
import DemoSection from './components/demo'
import TestimonialsSection from './components/testimonial'
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
<TestimonialsSection />
      </ThemeProvider>
    </>
  )
}

export default App
