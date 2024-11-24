import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ExternalLink } from "lucide-react";
import { DomainStats } from "../types";

interface HiddenGemsProps {
  gems: DomainStats[];
}

export const HiddenGems: React.FC<HiddenGemsProps> = ({ gems }) => {
  console.log(gems.map((g) => g.domain));
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-semibold text-gray-700">Hidden Gems</h3>
      </div>
      <p className="text-gray-600 mb-8">
        These interesting websites were visited just once. Maybe it's time to
        rediscover them?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gems.map((gem, index) => (
          <motion.div
            key={gem.domain}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-lg border border-indigo-100"
          >
            <a
              href={`https://${gem.domain}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-800">
                  {gem.domain}
                </h4>
                <ExternalLink className="w-4 h-4 text-indigo-500" />
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
