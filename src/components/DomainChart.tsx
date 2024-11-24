import React from 'react';
import { motion } from 'framer-motion';
import { DomainStats } from '../types';
import { Globe } from 'lucide-react';

interface DomainChartProps {
  stats: DomainStats[];
}

export const DomainChart: React.FC<DomainChartProps> = ({ stats }) => {
  const topDomains = stats.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5" />
        Top Visited Domains
      </h3>
      <div className="space-y-4">
        {topDomains.map((domain, index) => (
          <motion.div
            key={domain.domain}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">{domain.domain}</span>
              <span className="text-sm text-gray-500">{domain.visits} visits</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className="bg-indigo-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${domain.percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};