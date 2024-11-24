import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideContainerProps {
  children: React.ReactNode;
  currentSlide: string;
}

export const SlideContainer: React.FC<SlideContainerProps> = ({ children, currentSlide }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="min-h-screen flex items-center justify-center p-8"
      >
        <div className="max-w-4xl w-full">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};