

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Instagram, Bird } from 'lucide-react';

// Custom X icon component
const XIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="w-5 h-5" 
    fill="currentColor"
    aria-label="X (formerly Twitter)"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Footer = () => {
  // Social media links data
  const socialLinks = [
    {
      name: "X (Twitter)",
      icon: <XIcon />,
      url: "https://x.com/kamaltp__?t=EYl_V-uu23SH4gH92guh7Q&s=09",
      ariaLabel: "Visit our X (formerly Twitter) profile"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/kamaldeen-mohammed-123b89235?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      ariaLabel: "Visit our LinkedIn profile"
    },
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      url: "https://github.com/ethiago007",
      ariaLabel: "Visit our GitHub repository"
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "https://www.instagram.com/kzmzltp?igsh=YzFiZzluM2w2NXAx",
      ariaLabel: "Visit our Instagram profile"
    }
  ];

  return (
    <footer className="bg-[#090909] text-white pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">Sparrow</span>
              <Bird className="w-6 h-6" />
            </div>
            <p className="text-gray-400">
              AI-powered PDF summarization for students and researchers.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="bg-[#1a1a1a] p-2 rounded-full text-gray-300 hover:text-white transition-colors"
                  aria-label={social.ariaLabel}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Features', 'How It Works', 'Pricing', 'Testimonials'].map((item) => (
                                <li key={item}>
                                    <motion.a
                                        href="#"
                                        whileHover={{ x: 5 }}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center"
                                    >
                                        <span className="w-1 h-1 bg-gray-500 rounded-full mr-2"></span>
                                        {item}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Resources */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {['Blog', 'Documentation', 'Help Center', 'API Status'].map((item) => (
                                <li key={item}>
                                    <motion.a
                                        href="#"
                                        whileHover={{ x: 5 }}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center"
                                    >
                                        <span className="w-1 h-1 bg-gray-500 rounded-full mr-2"></span>
                                        {item}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-400">support@sparrow.com</p>
                                    <p className="text-gray-400">sales@sparrow.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-400">+234 906 425 2791 </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-400">123 Tech Street, Boston, MA 02110</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Divider */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="border-t border-gray-800 my-8"
                ></motion.div>

                {/* Bottom row */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="text-gray-500 text-sm"
                    >
                        © {new Date().getFullYear()} Sparrow AI. All rights reserved.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="flex space-x-6 mt-4 md:mt-0"
                    >
                        <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                            Cookies
                        </a>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;