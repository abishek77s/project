import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { TimeStats } from '../types';

interface TimePatternsProps {
  stats: TimeStats[];
}

export const TimePatterns: React.FC<TimePatternsProps> = ({ stats }) => {
  const [hoveredHour, setHoveredHour] = useState<TimeStats | null>(null);
  const maxVisits = Math.max(...stats.map(stat => stat.visits));
  
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const getActivityLevel = (visits: number) => {
    const percentage = (visits / maxVisits) * 100;
    if (percentage >= 75) return 'Very High Activity';
    if (percentage >= 50) return 'High Activity';
    if (percentage >= 25) return 'Moderate Activity';
    return 'Low Activity';
  };

  // Find the peak browsing time
  const peakHour = stats.reduce((peak, current) => 
    current.visits > peak.visits ? current : peak
  , stats[0]);

  return (
    <div className="text-white p-6">
      <div className="mb-8 text-center">
        <p className="text-2xl font-bold mb-2">Peak Browsing Time</p>
        <p className="text-4xl font-bold text-indigo-300">
          {formatHour(peakHour.hour)}
        </p>
        <p className="text-xl text-white/80 mt-2">
          {peakHour.visits.toLocaleString()} visits
        </p>
      </div>

      <div className="relative h-64 mt-12">
        {stats.map((stat, index) => {
          const height = (stat.visits / maxVisits) * 100;
          return (
            <motion.div
              key={stat.hour}
              className="absolute bottom-0 w-[3.5%] group"
              style={{
                left: `${(index / 24) * 100}%`,
              }}
              onMouseEnter={() => setHoveredHour(stat)}
              onMouseLeave={() => setHoveredHour(null)}
            >
              <motion.div
                className="w-full bg-white/20 rounded-t-lg cursor-pointer relative overflow-hidden group-hover:bg-indigo-400/40 transition-colors"
                style={{
                  height: '0%',
                }}
                initial={{ height: '0%' }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              {index % 3 === 0 && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform rotate-45 text-xs text-white/80">
                  {formatHour(stat.hour)}
                </div>
              )}
            </motion.div>
          );
        })}

        <AnimatePresence>
          {hoveredHour && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-white/10 backdrop-blur-md rounded-lg p-4 text-white shadow-xl"
              style={{
                width: '200px',
              }}
            >
              <div className="text-lg font-bold mb-1">{formatHour(hoveredHour.hour)}</div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-white/70">Visits: </span>
                  <span className="font-medium">{hoveredHour.visits.toLocaleString()}</span>
                </div>
                <div className="text-sm">
                  <span className="text-white/70">Activity Level: </span>
                  <span className="font-medium">{getActivityLevel(hoveredHour.visits)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-white/70">% of Peak: </span>
                  <span className="font-medium">
                    {Math.round((hoveredHour.visits / maxVisits) * 100)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-16 text-center">
        <p className="text-xl text-white/80">
          You're most active during the
        </p>
        <p className="text-3xl font-bold mt-2">
          {peakHour.hour >= 5 && peakHour.hour < 12 ? 'Morning' :
           peakHour.hour >= 12 && peakHour.hour < 17 ? 'Afternoon' :
           peakHour.hour >= 17 && peakHour.hour < 21 ? 'Evening' : 'Night'} Hours
        </p>
      </div>
    </div>
  );
};