import { useState, useEffect, type SetStateAction } from 'react';
import { Menu, X, Moon, Sun, User, Bird, MoonStarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  // Set dark mode class on HTML element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#', current: activeItem === 'Home' },
    { name: 'Features', href: '#', current: activeItem === 'Features' },
    { name: 'About', href: '#', current: activeItem === 'About' },
    { name: 'Contact', href: '#', current: activeItem === 'Contact' },
  ];

  const handleItemClick = (itemName: SetStateAction<string>) => {
    setActiveItem(itemName);
    setIsOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`fixed w-full z-50 transition-colors duration-300 ${
        darkMode ? 'bg-white text-black' : 'bg-black text-white'
      } ${
        scrolled ? 'shadow-lg backdrop-blur-sm bg-opacity-90' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo with Bird Icon */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 flex items-center gap-1"
          >
            <span className={`text-2xl font-bold ${darkMode ? 'text-black' : 'text-white'}`}>
              Sparrow
            </span>
            <Bird className={`w-6 h-6 ${darkMode ? 'text-black' : 'text-white'}`} />
          </motion.div>

          
          <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => handleItemClick(item.name)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium relative transition-colors duration-300 ${
                    item.current 
                      ? darkMode 
                        ? 'text-black font-semibold' 
                        : 'text-white font-semibold'
                      : darkMode 
                        ? 'text-gray-600' 
                        : 'text-gray-400'
                  }`}
                >
                  {item.current && (
                    <motion.span
                      layoutId="navActiveIndicator"
                      className={`absolute left-0 right-0 -bottom-1 h-0.5 transition-colors duration-300 ${
                        darkMode ? 'bg-black' : 'bg-white'
                      }`}
                      transition={{ type: 'spring', bounce: 0.25 }}
                    />
                  )}
                  {item.name}
                </motion.a>
              ))}
            </div>
          </div>

        
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors duration-300 ${
                darkMode ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
              }`}
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -30, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 30, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="w-5 h-5 text-gray-800" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 30, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -30, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="w-5 h-5 text-gray-200" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex space-x-2"
            >
              <button className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                darkMode ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
              }`}>
                Login
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm font-medium rounded-full shadow-md transition-all duration-300 ${
                  darkMode ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                Sign Up
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Animated) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden overflow-hidden transition-colors duration-300 ${
              darkMode ? 'bg-white' : 'bg-black'
            }`}
          >
            <div className="px-2 pt-2 pb-4 space-y-2">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => handleItemClick(item.name)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * navItems.indexOf(item) }}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 ${
                    item.current
                      ? darkMode
                        ? 'bg-gray-200 text-black'
                        : 'bg-gray-800 text-white'
                      : darkMode
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-gray-400 hover:bg-gray-900'
                  }`}
                >
                  {item.name}
                </motion.a>
              ))}

              <div className="flex items-center justify-between pt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    darkMode ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {darkMode ? (
                      <motion.div
                        key="moon-mobile"
                        initial={{ rotate: -30, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 30, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Moon className="w-6 h-6 text-gray-800" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sun-mobile"
                        initial={{ rotate: 30, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -30, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Sun className="w-6 h-6 text-gray-200" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
                      darkMode ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
                    }`}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-2 text-sm font-medium rounded-md shadow-md transition-all duration-300 ${
                      darkMode ? 'bg-black text-white' : 'bg-white text-black'
                    }`}
                  >
                    Sign Up
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;