import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Facebook, Instagram, Send } from 'lucide-react';

// Modern X (Twitter) icon since Lucide doesn't include it yet
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-white px-5 sm:px-6 w-full">
      <div className="mx-auto max-w-6xl w-full">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Have questions? We're here to help with anything about our PDF summarizer.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-xl p-8 shadow-sm"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send us a message</h3>
            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#090909] focus:border-[#090909] transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#090909] focus:border-[#090909] transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#090909] focus:border-[#090909] transition-all"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#090909] text-white font-semibold py-3 px-6 rounded-lg transition-all hover:bg-opacity-90 flex items-center justify-center gap-2"
              >
                Send Message
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-start gap-5">
              <div className=" bg-opacity-10 p-3 rounded-full text-[#090909]">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Email Us</h3>
                <p className="text-gray-600">support@sparrow.com</p>
                <p className="text-gray-600">sales@sparrow.com</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className=" bg-opacity-10 p-3 rounded-full text-[#090909]">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Call Us</h3>
                <p className="text-gray-600">+234 906 425 2791</p>
                <p className="text-gray-600">Mon-Fri: 9am-5pm WAT</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className=" bg-opacity-10 p-3 rounded-full text-[#090909]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Visit Us</h3>
                <p className="text-gray-600">123 Tech Street</p>
                <p className="text-gray-600">Boston, MA 02110</p>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://x.com/kamaltp__?t=EYl_V-uu23SH4gH92guh7Q&s=09"
                  className="bg-gray-100 p-3 rounded-full text-gray-700 hover:bg-[#090909] hover:text-white transition-all"
                  aria-label="X (formerly Twitter)"
                >
                  <XIcon />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://www.linkedin.com/in/kamaldeen-mohammed-123b89235?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  className="bg-gray-100 p-3 rounded-full text-gray-700 hover:bg-[#090909] hover:text-white transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://github.com/ethiago007"
                  className="bg-gray-100 p-3 rounded-full text-gray-700 hover:bg-[#090909] hover:text-white transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://www.instagram.com/kzmzltp?igsh=YzFiZzluM2w2NXAx"
                  className="bg-gray-100 p-3 rounded-full text-gray-700 hover:bg-[#090909] hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;