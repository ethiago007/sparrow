import { motion } from 'framer-motion';
import darkBg from "/darkH.jpg";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.config";
import { useState } from "react";
import AuthDialog from "./AuthDialog";

const HeroSection = () => {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // Default to signup
  
  const handleStartSummarizing = () => {
    if (auth.currentUser) {
      // User is logged in, navigate to summarizer page
      navigate("/summarize");
    } else {
      // User is not logged in, show auth dialog (default to signup)
      setAuthOpen(true);
    }
  };

  return (
    <section
      id="hero"
      className="hero-section relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${darkBg})`,
      }}
    >
      {/* Dark teal overlay with 60% opacity */}
      <div className="absolute inset-0 bg-[#090909]/60"></div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pt-[20vh]">
        {/* Text Content */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-2xl sm:text-4xl md:text-4xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            From <span className="text-white">Overwhelming PDFs</span> to
            <span className="block mt-2 sm:mt-3 text-white">
              AI-Powered One-Page Summaries
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-lg mb-8 mx-auto text-white/90 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Drowning in lecture slides? Upload any PDF and get a concise,
            <span className="font-semibold"> AI-generated summary</span> —
            perfect for last-minute studying or research.
          </motion.p>

          {/* Button with enhanced animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.button
              className="text-md  max-w-2xl mx-auto bg-white text-[#090909] px-6 py-3 rounded-full  text-base shadow-sm cursor-pointer"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
              }}
              whileTap={{
                scale: 0.98,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 10
              }}
              onClick={handleStartSummarizing}
            >
              Start Summarizing
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <AuthDialog 
        open={authOpen} 
        onClose={() => setAuthOpen(false)} 
        isLogin={isLogin}
        darkMode={true}
      />
    </section>
  );
};

export default HeroSection;