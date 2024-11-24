import React from 'react';
import { motion } from 'framer-motion';
import { History, Upload, Globe, Clock, PieChart, Calendar } from 'lucide-react';

interface LandingPageProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onFileUpload }) => {
  const features = [
    {
      icon: Globe,
      title: 'Website Analytics',
      description: 'Discover your most visited websites and browsing patterns',
    },
    {
      icon: Clock,
      title: 'Time Insights',
      description: 'Understand your daily browsing rhythms and peak hours',
    },
    {
      icon: PieChart,
      title: 'Category Breakdown',
      description: 'See how you spend time across different website categories',
    },
    {
      icon: Calendar,
      title: 'Yearly Overview',
      description: 'Visualize your browsing habits throughout the year',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <History className="w-20 h-20 mx-auto mb-6 text-white/90" />
            <h1 className="text-5xl font-bold mb-4">Your Browser Story</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Transform your browsing history into beautiful insights. Upload your history file and discover your digital journey.
            </p>

            <div className="flex flex-col items-center gap-4">
              <label className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-full cursor-pointer hover:bg-white/90 transition-colors font-medium shadow-lg hover:shadow-xl">
                <Upload className="w-5 h-5 mr-2" />
                Choose History File
                <input type="file" accept=".csv,.txt" onChange={onFileUpload} className="hidden" />
              </label>
              <p className="text-sm text-white/70">
                Supports Chrome (with{' '}
                <a
                  href="https://chromewebstore.google.com/detail/export-chrome-history/dihloblpkeiddiaojbagoecedbfpifdj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                >
                  extension
                </a>
                ) and Edge browser history exports
              </p>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-colors"
            >
              <feature.icon className="w-10 h-10 mb-4 text-white/90" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center text-white/60 text-sm"
        >
          <p>Your privacy matters! All processing happens locally in your browser.</p>
          <p>No data is ever uploaded or stored on any server.</p>
        </motion.div>
      </div>
    </div>
  );
};