import React from 'react';
import { motion } from 'framer-motion';
import { Upload, ScanSearch, FileText, MessageSquareText } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: 'Seamless Upload',
      description: 'Drag-and-drop any PDF—lecture slides, research papers, or textbooks.'
    },
    {
      icon: <ScanSearch className="w-8 h-8" />,
      title: 'Precision Analysis',
      description: 'AI identifies key concepts with 94% accuracy.'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Instant Summary',
      description: 'Structured summaries with highlighted essentials.'
    },
    {
      icon: <MessageSquareText className="w-8 h-8" />,
      title: 'Interactive Q&A',
      description: 'Ask questions or get suggested questions about the content.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-black mb-4">
            Academic Relief, Simplified
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform documents into active learning with powerful AI tools.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="h-full" // Ensure consistent height
    >
      <div className="group flex flex-col items-center text-center p-8 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-black hover:border-black hover:scale-[1.02] h-full">
        <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <h3 className="font-bold text-xl mb-2 text-black group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeaturesSection;