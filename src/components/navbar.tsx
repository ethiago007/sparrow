import { useState, useEffect, type SetStateAction } from "react";
import { Menu, X, Bird } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeItem, setActiveItem] = useState("Home");
    const [darkBackground, setDarkBackground] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);

            // Get all sections with their background colors
            const sections = [
                { id: "hero", name: "Home", bgDark: true },
                { id: "features", name: "Features", bgDark: false },
                { id: "demo", name: "Demo", bgDark: true },
                { id: "testimonials", name: "Testimony", bgDark: false },
                { id: "cta", name: "CTA", bgDark: true },
                { id: "contact", name: "Contact Us", bgDark: false }
            ];

            // Determine which section is in view and its background
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

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initialize on load
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", href: "#hero" },
        { name: "Features", href: "#features" },
        { name: "Demo", href: "#demo" },
        { name: "Testimony", href: "#testimonials" },
        { name: "Contact Us", href: "#contact" },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: "smooth"
            });
        }
        setIsOpen(false);
    };

    // Color schemes
    const darkBgColor = "bg-[#090909] bg-opacity-90";
    const textColor = darkBackground ? "text-white" : "text-[#090909]";
    const bgColor = darkBackground ? darkBgColor : "bg-white bg-opacity-90";
    const buttonBg = darkBackground
        ? "bg-white text-[#090909]"
        : "bg-[#090909] text-white";
    const activeIndicator = darkBackground ? "bg-white" : "bg-[#090909]";
    const mobileMenuBg = darkBackground ? darkBgColor : "bg-white";

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`fixed w-full z-50 ${bgColor} backdrop-blur-sm transition-colors duration-300 ${scrolled ? "shadow-lg" : ""
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0 flex items-center gap-1 cursor-pointer"
                        onClick={() => scrollToSection("hero")}
                    >
                        <span className={`text-2xl font-bold ${textColor}`}>Sparrow</span>
                        <Bird className={`w-6 h-6 ${textColor}`} />
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
                        <div className="flex space-x-8">
                            {navItems.map((item) => (
                                <motion.div
                                    key={item.name}
                                    onClick={() => scrollToSection(item.href.substring(1))}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium relative transition-colors duration-300 cursor-pointer ${activeItem === item.name
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

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 text-sm font-medium rounded-full ${buttonBg} transition-colors duration-300`}
                            >
                                Login
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 text-sm font-medium rounded-full ${buttonBg} shadow-md transition-all duration-300`}
                            >
                                Sign Up
                            </motion.button>
                        </div>
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
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                                <motion.div
                                    key={item.name}
                                    onClick={() => scrollToSection(item.href.substring(1))}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 * navItems.indexOf(item) }}
                                    className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 cursor-pointer ${activeItem === item.name
                                            ? darkBackground
                                                ? "bg-[#1a1a1a] text-white"
                                                : "bg-gray-200 text-[#090909]"
                                            : `${textColor} ${darkBackground ? "hover:bg-[#1a1a1a]" : "hover:bg-gray-100"}`
                                        }`}
                                >
                                    {item.name}
                                </motion.div>
                            ))}

                            <div className="flex space-x-2 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className={`px-4 py-2 text-sm font-medium rounded-md w-full ${buttonBg}`}
                                >
                                    Login
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className={`px-4 py-2 text-sm font-medium rounded-md w-full ${buttonBg} shadow-md`}
                                >
                                    Sign Up
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;