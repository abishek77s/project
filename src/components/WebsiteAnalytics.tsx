import React from "react";
import { motion } from "framer-motion";
import { Clock, Globe } from "lucide-react";
import { DomainStats } from "../types";

interface WebsiteAnalyticsProps {
  stats: DomainStats[];
}

export const WebsiteAnalytics: React.FC<WebsiteAnalyticsProps> = ({
  stats,
}) => {
  const calculateTimeSpent = (visits: number) => {
    const avgMinutesPerVisit = 3;
    const totalMinutes = visits * avgMinutesPerVisit;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const topDomains = stats.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-700">
            Your Digital Time
          </h3>
        </div>
        <Clock className="w-5 h-5 text-indigo-600" />
      </div>

      <div className="space-y-6">
        {topDomains.map((domain, index) => (
          <motion.div
            key={domain.domain}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-lg font-medium text-gray-800">
                  {domain.domain}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {domain.visits.toLocaleString()} visits
                </span>
              </div>
              <span className="text-indigo-600 font-semibold whitespace-nowrap">
                {calculateTimeSpent(domain.visits)}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${domain.percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
            <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
              <span>{Math.round(domain.percentage)}% of total activity</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
