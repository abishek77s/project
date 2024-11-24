import React from 'react';
import { motion } from 'framer-motion';
import { TimeStats } from '../types';
import { Clock } from 'lucide-react';

interface TimeHeatmapProps {
  stats: TimeStats[];
}

export const TimeHeatmap: React.FC<TimeHeatmapProps> = ({ stats }) => {
  const maxVisits = Math.max(...stats.map(stat => stat.visits));

  const getOpacity = (visits: number) => {
    return 0.2 + (visits / maxVisits) * 0.8;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Browsing Time Patterns
      </h3>
      <div className="grid grid-cols-6 gap-2">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.hour}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="aspect-square"
          >
            <div
              className="w-full h-full rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `rgba(79, 70, 229, ${getOpacity(stat.visits)})`,
              }}
            >
              <div className="text-center">
                <div className="text-xs font-medium text-white">
                  {stat.hour}:00
                </div>
                <div className="text-xs text-white/80">
                  {stat.visits}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};