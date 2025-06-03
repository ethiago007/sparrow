import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "This tool saved me 10+ hours weekly on medical school notes. The summaries are incredibly accurate.",
      author: "Sarah K.",
      role: "3rd Year Med Student",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "Finally an AI that understands academic papers. It extracts exactly what I need for my research.",
      author: "David T.",
      role: "PhD Researcher",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "I went from struggling with textbook chapters to acing exams thanks to these concise summaries.",
      author: "Jamal R.",
      role: "Engineering Student",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/men/65.jpg"
    },
    {
      quote: "As a professor, I recommend this to all my students. The quality of analysis is remarkable.",
      author: "Dr. Lisa M.",
      role: "University Professor",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];

  return (
    <section id="testimonials" className="py-12 md:py-20 bg-white px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Loved by Students & Researchers
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands who transformed their study workflow.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <div className="bg-gray-50 p-6 sm:p-8 text-gray-700 rounded-xl h-full flex flex-col transition-all duration-300 hover:bg-black hover:text-white  ">
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-900 mb-4 rotate-180" />
                <p className="text-sm sm:text-base  mb-6 flex-grow">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="font-semibold text-900 text-sm sm:text-base">{testimonial.author}</p>
                    <p className="text-xs sm:text-sm text-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;