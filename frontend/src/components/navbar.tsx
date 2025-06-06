import { useState, useEffect, useRef } from "react";
import { Menu, X, Bird } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, signOut } from "../firebase/firebase.config";
import AuthDialog from "./AuthDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [darkBackground, setDarkBackground] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  
  // Add this ref to track when user is clicking navigation
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Don't update active item if user is currently navigating
      if (isNavigatingRef.current) {
        return;
      }

      const sections = [
        { id: "hero", name: "Home", bgDark: true },
        { id: "features", name: "Features", bgDark: false },
        { id: "demo", name: "Demo", bgDark: true },
        { id: "testimonials", name: "Testimony", bgDark: false },
        { id: "cta", name: "CTA", bgDark: true },
        { id: "contact", name: "Contact Us", bgDark: false },
      ];

      let currentSection = "Home";
      let shouldBeDark = true;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.name;
            shouldBeDark = section.bgDark;
            break;
          }
        }
      }

      setActiveItem(currentSection);
      setDarkBackground(shouldBeDark);
    };

    // Initialize immediately
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    
    // Also handle resize for mobile orientation changes
    const handleResize = () => {
      setTimeout(handleScroll, 100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navItems = [
    { name: "Home", href: "hero" },
    { name: "Features", href: "features" },
    { name: "Demo", href: "demo" },
    { name: "Testimony", href: "testimonials" },
    { name: "Contact Us", href: "contact" },
  ];

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    // Immediately set the active item to what we're clicking
    const sectionName = navItems.find((item) => item.href === id)?.name || "Home";
    
    // Set navigation flag to prevent scroll handler from interfering
    isNavigatingRef.current = true;
    
    // Update active state immediately
    setActiveItem(sectionName);
    setIsOpen(false);
    
    // Also update dark background immediately based on the section
    const sections = [
      { id: "hero", name: "Home", bgDark: true },
      { id: "features", name: "Features", bgDark: false },
      { id: "demo", name: "Demo", bgDark: true },
      { id: "testimonials", name: "Testimony", bgDark: false },
      { id: "cta", name: "CTA", bgDark: true },
      { id: "contact", name: "Contact Us", bgDark: false },
    ];
    
    const targetSection = sections.find(section => section.id === id);
    if (targetSection) {
      setDarkBackground(targetSection.bgDark);
    }

    // Calculate scroll position
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - 100; // Adjust for navbar

    // Scroll to the section
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });

    // Reset navigation flag after scroll completes - increased timeout
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1500);
  }
};

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      setAvatarMenuOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const darkBgColor = "bg-[#090909] bg-opacity-90";
  const textColor = darkBackground ? "text-white" : "text-[#090909]";
  const bgColor = darkBackground ? darkBgColor : "bg-white bg-opacity-90";
  const buttonBg = darkBackground
    ? "bg-white text-[#090909]"
    : "bg-[#090909] text-white";
  const activeIndicator = darkBackground ? "bg-white" : "bg-[#090909]";
  const mobileMenuBg = darkBackground ? darkBgColor : "bg-white";
  const hoverColor = darkBackground ? "hover:bg-[#1a1a1a]" : "hover:bg-gray-100";

  // Get user initials for fallback avatar
  const getUserInitials = () => {
    if (!auth.currentUser) return "";
    const name = auth.currentUser.displayName || auth.currentUser.email || "";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: 0, 
          opacity: 1 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          duration: 0.3
        }}
        className={`fixed top-0 left-0 right-0 z-50 ${bgColor} backdrop-blur-sm transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="mx-auto px-3 sm:px-4 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 cursor-pointer flex-shrink-0"
              onClick={() => scrollToSection("hero")}
            >
              <span className={`text-lg sm:text-xl md:text-2xl font-bold ${textColor}`}>Sparrow</span>
              <Bird className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${textColor}`} />
            </motion.div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
              <div className="flex space-x-8">
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium relative transition-colors duration-300 cursor-pointer ${
                      activeItem === item.name
                        ? `${textColor} font-semibold`
                        : `${textColor} opacity-80 hover:opacity-100`
                    }`}
                  >
                    {activeItem === item.name && (
                      <motion.span
                        layoutId="navActiveIndicator"
                        className={`absolute left-0 right-0 -bottom-1 h-0.5 ${activeIndicator}`}
                        transition={{ type: "spring", bounce: 0.25 }}
                      />
                    )}
                    {item.name}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Auth buttons (desktop) */}
            <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
              {auth.currentUser ? (
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer ${
                      darkBackground ? "bg-white" : "bg-[#090909]"
                    }`}
                  >
                    {auth.currentUser.photoURL ? (
                      <img
                        src={auth.currentUser.photoURL}
                        alt="User"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className={`text-sm font-medium ${
                          darkBackground ? "text-[#090909]" : "text-white"
                        }`}
                      >
                        {getUserInitials()}
                      </span>
                    )}
                  </motion.div>

                  {/* Avatar dropdown menu */}
                  <AnimatePresence>
                    {avatarMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                          darkBackground ? "bg-[#1a1a1a]" : "bg-white"
                        }`}
                      >
                        <button
                          onClick={() => {
                            setChangePasswordOpen(true);
                            setAvatarMenuOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkBackground
                              ? "text-white hover:bg-[#2a2a2a]"
                              : "text-[#090909] hover:bg-gray-100"
                          }`}
                        >
                          Change Password
                        </button>
                        <button
                          onClick={handleSignOut}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkBackground
                              ? "text-white hover:bg-[#2a2a2a]"
                              : "text-[#090909] hover:bg-gray-100"
                          }`}
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAuthOpen(true);
                      setIsLogin(true);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-full ${buttonBg} transition-colors duration-300`}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAuthOpen(true);
                      setIsLogin(false);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-full ${buttonBg} shadow-md transition-all duration-300`}
                  >
                    Sign Up
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden inline-flex items-center justify-center p-2 rounded-md ${textColor} touch-manipulation flex-shrink-0`}
              aria-label="Toggle menu"
              style={{ 
                minWidth: '44px', 
                minHeight: '44px'
              }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden ${mobileMenuBg}`}
            >
              <div className="px-2 pt-2 pb-4 space-y-2">
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    onClick={() => {
                      setIsOpen(false);
                      setTimeout(() => scrollToSection(item.href), 250);
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * navItems.indexOf(item) }}
                    className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 cursor-pointer ${
                      activeItem === item.name
                        ? darkBackground
                          ? "bg-[#1a1a1a] text-white"
                          : "bg-gray-200 text-[#090909]"
                        : `${textColor} ${hoverColor}`
                    }`}
                  >
                    {item.name}
                  </motion.div>
                ))}

                {/* Auth buttons (mobile) */}
                <div className="pt-4">
                  {auth.currentUser ? (
                    <div className="flex items-center space-x-4 mb-4 px-3 py-2">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          darkBackground ? "bg-white" : "bg-[#090909]"
                        }`}
                      >
                        {auth.currentUser.photoURL ? (
                          <img
                            src={auth.currentUser.photoURL}
                            alt="User"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span
                            className={`text-sm font-medium ${
                              darkBackground ? "text-[#090909]" : "text-white"
                            }`}
                          >
                            {getUserInitials()}
                          </span>
                        )}
                      </div>
                      <span className={`text-sm ${textColor}`}>
                        {auth.currentUser.displayName || auth.currentUser.email}
                      </span>
                    </div>
                  ) : null}

                  {auth.currentUser ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          setChangePasswordOpen(true);
                          setIsOpen(false);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-md w-full ${buttonBg}`}
                      >
                        Change Password
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-md w-full ${buttonBg} shadow-md mt-2`}
                      >
                        Logout
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          setAuthOpen(true);
                          setIsLogin(true);
                          setIsOpen(false);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-md w-full ${buttonBg}`}
                      >
                        Login
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          setAuthOpen(true);
                          setIsLogin(false);
                          setIsOpen(false);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-md w-full ${buttonBg} shadow-md mt-2`}
                      >
                        Sign Up
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        isLogin={isLogin}
        darkMode={darkBackground}
      />
      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </>
  );
};

export default Navbar;