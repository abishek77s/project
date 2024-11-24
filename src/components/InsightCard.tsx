import React from 'react';
import { motion } from 'framer-motion';

interface InsightCardProps {
  title: string;
  value: string | number;
  description?: string;
  delay?: number;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, value, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600 mt-2">{value}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
    </motion.div>
  );
};