import { useState, useEffect, type SetStateAction } from "react";
import { Menu, X, User, Bird } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [darkBackground, setDarkBackground] = useState(true); // Default to dark

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Improved background detection with null checks
      const heroSection = document.getElementById("hero");
      const featuresSection = document.getElementById("features");
      const demoSection = document.getElementById("demo");
      const scrollPos = window.scrollY;

      let isOverDark = true; // Default to dark

      if (featuresSection) {
        isOverDark = scrollPos < featuresSection.offsetTop;
      }

      // Override to dark when in demo section
      if (
        demoSection &&
        scrollPos >= demoSection.offsetTop &&
        scrollPos < demoSection.offsetTop + demoSection.offsetHeight
      ) {
        isOverDark = true;
      }

      setDarkBackground(isOverDark);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#", current: activeItem === "Home" },
    { name: "Features", href: "#features", current: activeItem === "Features" },
    { name: "Demo", href: "#demo", current: activeItem === "Demo" },
    { name: "Testimony", href: "#", current: activeItem === "About" },
    { name: "Contact Us", href: "#", current: activeItem === "Contact" },
  ];

  const handleItemClick = (itemName: SetStateAction<string>) => {
    setActiveItem(itemName);
    setIsOpen(false);
  };

  const darkBgColor = "bg-[#090909] bg-opacity-90";
  const textColor = darkBackground ? "text-white" : "text-[#090909]";
  const bgColor = darkBackground ? darkBgColor : "bg-white bg-opacity-90";
  const hoverColor = darkBackground
    ? "hover:bg-[#1a1a1a] hover:text-white"
    : "hover:bg-gray-100 hover:text-[#090909]";
  const buttonBg = darkBackground
    ? "bg-white text-[#090909]"
    : "bg-[#090909] text-white";
  const activeIndicator = darkBackground ? "bg-white" : "bg-[#090909]";
  const mobileMenuBg = darkBackground ? darkBgColor : "bg-white";
  const mobileMenuItem = darkBackground
    ? "hover:bg-[#1a1a1a]"
    : "hover:bg-gray-100";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`fixed w-full z-50 ${bgColor} backdrop-blur-sm transition-colors duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 flex items-center gap-1"
          >
            <span className={`text-2xl font-bold ${textColor}`}>Sparrow</span>
            <Bird className={`w-6 h-6 ${textColor}`} />
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
                    item.current ? `${textColor} font-semibold` : textColor
                  }`}
                >
                  {item.current && (
                    <motion.span
                      layoutId="navActiveIndicator"
                      className={`absolute left-0 right-0 -bottom-1 h-0.5 ${activeIndicator} transition-colors duration-300`}
                      transition={{ type: "spring", bounce: 0.25 }}
                    />
                  )}
                  {item.name}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <motion.div className="flex space-x-2">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full ${buttonBg} ${hoverColor} transition-colors duration-300`}
              >
                Login
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm font-medium ${buttonBg} rounded-full shadow-md transition-all duration-300`}
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
              className={`inline-flex items-center justify-center p-2 rounded-md ${textColor}`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden overflow-hidden ${mobileMenuBg}`}
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
                      ? darkBackground
                        ? "bg-[#1a1a1a] text-white"
                        : "bg-gray-200 text-black"
                      : `${textColor} ${mobileMenuItem}`
                  }`}
                >
                  {item.name}
                </motion.a>
              ))}

              <div className="flex items-center justify-between pt-4">
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${buttonBg} ${hoverColor} transition-colors duration-300`}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-2 text-sm font-medium ${buttonBg} rounded-md shadow-md transition-all duration-300`}
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
