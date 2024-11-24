import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { DomainStats } from "../types";

interface WebsiteTimeAnalyticsProps {
  stats: DomainStats[];
}

export const WebsiteTimeAnalytics: React.FC<WebsiteTimeAnalyticsProps> = ({
  stats,
}) => {
  const calculateTimeSpent = (visits: number) => {
    const avgMinutesPerVisit = 3;
    const totalMinutes = visits * avgMinutesPerVisit;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hours`;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Time Spent on Top Sites
      </h3>
      <div className="space-y-6">
        {stats.slice(0, 5).map((site, index) => (
          <motion.div
            key={site.domain}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-gray-800">
                {site.domain}
              </span>
              <span className="text-indigo-600 font-semibold">
                {calculateTimeSpent(site.visits)}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <motion.div
                className="bg-indigo-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${site.percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {site.visits.toLocaleString()} visits
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
