import React from 'react';
import { FileText, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DemoSection = () => {
  return (
    <section id="demo" className="py-20 bg-[#090909]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            From Chaos to Clarity
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            See how we transform dense academic content into digestible knowledge.
          </p>
        </div>

        {/* Demo Comparison */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          {/* Before - PDF */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-black" />
              <h3 className="font-bold text-black">Original PDF</h3>
            </div>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500 text-center p-4">
                [Example: 50-page Biology Lecture PDF]
                <span className="block text-xs mt-2 text-gray-400">Dense text • Complex diagrams • 12,000 words</span>
              </p>
            </div>
          </motion.div>

          {/* Arrow (animated) */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="hidden md:block"
          >
            <ArrowRight className="w-8 h-8 text-white" />
          </motion.div>

          {/* After - Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-[#090909]" />
              <h3 className="font-bold text-[#090909]">AI Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-100 rounded-lg hover:bg-[#090909] hover:text-white transition-colors">
                <h4 className="font-medium">Key Concept 1</h4>
                <p className="text-sm  ">Photosynthesis light-dependent reactions</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg hover:bg-[#090909] hover:text-white transition-colors">
                <h4 className="font-medium">Key Concept 2</h4>
                <p className="text-sm  ">Krebs Cycle energy output</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg hover:bg-[#090909] hover:text-white transition-colors">
                <h4 className="font-medium">Key Concept 3</h4>
                <p className="text-sm  ">DNA replication enzymes</p>
              </div>
              <button className="mt-4 w-full py-2 bg-[#090909] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all hover:shadow-md">
                View Full Summary
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats with Hover Effects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '94%', label: 'Accuracy Rate' },
            { value: '5.2s', label: 'Avg. Processing' },
            { value: '10×', label: 'Content Reduction' },
            { value: '24/7', label: 'Availability' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white bg-opacity-5 p-6 rounded-xl text-center hover:bg-black hover:border-black hover:text-white border border-white border-opacity-10  transition-all cursor-default"
            >
              <p className="text-3xl font-bold mb-2  transition-colors">
                {stat.value}
              </p>
              <p className="  text-sm font-medium transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;