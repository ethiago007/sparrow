import { auth } from "../firebase/firebase.config";
import { useState } from "react";
import AuthDialog from "./AuthDialog";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
   const navigate = useNavigate();
    const [authOpen, setAuthOpen] = useState(false);
    const [isLogin, _setIsLogin] = useState(false); // Default to signup

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
    <section id="cta" className="py-16 md:py-24 bg-[#090909] px-5 sm:px-6 w-full">
      <div className="mx-auto max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center w-full"
        >
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 text-center max-w-4xl">
            Ready to Transform Your Study Workflow?
          </h2>
          
          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-10 text-center max-w-3xl px-4">
            Join thousands of students and researchers saving hours every week with our AI-powered PDF summarizer.
          </p>
          
          {/* CTA Buttons - Stack on small screens, row on larger */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-[#090909] font-semibold px-6 py-3 sm:px-8 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
              onClick={handleStartSummarizing}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 sm:px-8 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
            >
              See Pricing
            </motion.button>
          </div>
          
          {/* Trust indicators - Stack on small screens */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-gray-300 text-sm md:text-base">
            <div className="flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No credit card required
            </div>
            
            <div className="hidden sm:block text-gray-300">•</div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              7-day free trial
            </div>
            
            <div className="hidden sm:block text-gray-300">•</div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Cancel anytime
            </div>
          </div>
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

export default CTASection;