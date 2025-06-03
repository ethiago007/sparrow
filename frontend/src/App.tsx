import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import HeroSection from './components/hero'
import FeaturesSection from './components/features'
import DemoSection from './components/demo'
import TestimonialsSection from './components/testimonial'
import CTASection from './components/finalCTA'
import ContactSection from './components/contact'
import Footer from './components/footer'
import { ThemeProvider } from './context/ThemeContext'
import Summarizer from './components/action'
import ProtectedRoute from './components/ProtectedRoutes'
import { useEffect } from 'react'
import Preloader from './components/loader'
import './App.css'

function App() {
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 6000); 
  }, []);

  return (
    <>
    {loading && <Preloader />}
      {!loading && (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <FeaturesSection />
              <DemoSection />
              <TestimonialsSection />
              <CTASection />
              <ContactSection />
            </>
          } />
         <Route 
  path="/summarize" 
  element={
    <ProtectedRoute>
      <Summarizer />
    </ProtectedRoute>
  } 
/>
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
     )}
    </>
  )
}

export default App