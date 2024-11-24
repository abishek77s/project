import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { TimeStats } from "../types";

interface TimePatternsProps {
  stats: TimeStats[];
}

export const TimePatterns: React.FC<TimePatternsProps> = ({ stats }) => {
  const [hoveredHour, setHoveredHour] = useState<TimeStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const maxVisits = Math.max(...stats.map((stat) => stat.visits));

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const getActivityLevel = (visits: number) => {
    const percentage = (visits / maxVisits) * 100;
    if (percentage >= 75) return "Very High Activity";
    if (percentage >= 50) return "High Activity";
    if (percentage >= 25) return "Moderate Activity";
    return "Low Activity";
  };

  const peakHour = stats.reduce(
    (peak, current) => (current.visits > peak.visits ? current : peak),
    stats[0]
  );

  const getTimePersona = (hour: number) => {
    if (hour >= 22 || hour < 4)
      return {
        title: "Night Owl 🦉",
        desc: "You thrive in the quiet hours of the night!",
      };
    if (hour >= 4 && hour < 8)
      return {
        title: "Early Bird 🐦",
        desc: "Rising with the sun, seizing every moment!",
      };
    if (hour >= 8 && hour < 12)
      return {
        title: "Morning Person ☀️",
        desc: "Making the most of your mornings!",
      };
    if (hour >= 12 && hour < 17)
      return {
        title: "Afternoon Achiever 🌤️",
        desc: "Peak productivity in the daylight hours!",
      };
    if (hour >= 17 && hour < 22)
      return {
        title: "Evening Explorer 🌅",
        desc: "Finding your flow as the day winds down!",
      };
    return {
      title: "Balanced Browser 🎯",
      desc: "Your browsing patterns are well-distributed!",
    };
  };

  const persona = getTimePersona(peakHour.hour);

  return (
    <div className="text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-2">
          {peakHour.hour >= 22 || peakHour.hour < 6 ? (
            <Moon className="w-8 h-8" />
          ) : peakHour.hour < 12 ? (
            <Sunrise className="w-8 h-8" />
          ) : peakHour.hour < 17 ? (
            <Sun className="w-8 h-8" />
          ) : (
            <Sunset className="w-8 h-8" />
          )}
          <h2 className="text-3xl font-medium">{persona.title}</h2>
        </div>
        <p className="text-xl text-white/80 mb-4">{persona.desc}</p>
        <p className="text-4xl font-bold text-indigo-300 mb-2">
          {formatHour(peakHour.hour)}
        </p>
        <p className="text-xl text-white/80">
          Peak activity with {peakHour.visits.toLocaleString()} visits
        </p>
      </motion.div>

      <div className="relative h-64 mt-6">
        {stats.map((stat, index) => {
          const height = (stat.visits / maxVisits) * 100;
          const isPeakHour = stat.hour === peakHour.hour;
          return (
            <motion.div
              key={stat.hour}
              className="absolute bottom-0 w-[3.5%] group"
              style={{ left: `${(index / 24) * 100}%` }}
              initial={{ height: 0 }}
              animate={{ height: isVisible ? `${height}%` : 0 }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              onMouseEnter={() => setHoveredHour(stat)}
              onMouseLeave={() => setHoveredHour(null)}
            >
              <div
                className={`w-full rounded-t-lg cursor-pointer relative overflow-hidden transition-colors ${
                  isPeakHour
                    ? "bg-white group-hover:bg-white/90"
                    : "bg-black/20 group-hover:bg-black/30"
                }`}
                style={{ height: "100%" }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    isPeakHour
                      ? "from-white/20 to-transparent"
                      : "from-black/10 to-transparent"
                  } opacity-0 group-hover:opacity-100 transition-opacity`}
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {index % 3 === 0 && (
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 transform text-xs text-white/80 mt-16">
                    {formatHour(stat.hour)}
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {hoveredHour && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-black/30 backdrop-blur-md rounded-lg p-4 text-white shadow-xl"
              style={{ width: "200px" }}
            >
              <div className="text-lg font-bold mb-1">
                {formatHour(hoveredHour.hour)}
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-white/70">Visits: </span>
                  <span className="font-medium">
                    {hoveredHour.visits.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-white/70">Activity Level: </span>
                  <span className="font-medium">
                    {getActivityLevel(hoveredHour.visits)}
                  </span>
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
    </div>
  );
};
