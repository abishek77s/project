import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryStats } from "../types";
import { FolderKanban } from "lucide-react";

interface CategoryChartProps {
  stats: CategoryStats[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ stats }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Other"
  );

  const selectedStats = stats.find((s) => s.category === selectedCategory);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <FolderKanban className="w-5 h-5" />
        Website Categories
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {stats.map((category, index) => (
          <motion.button
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.category
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category.category
                  ? null
                  : category.category
              )
            }
          >
            {category.category}
            <div className="text-xs opacity-75">
              {category.visits} visits ({Math.round(category.percentage)}%)
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedCategory && selectedStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">
                Top Sites in {selectedCategory}
              </h4>
              <div className="space-y-2">
                {selectedStats.domains.slice(0, 5).map((domain, index) => (
                  <motion.div
                    key={domain.domain}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-700">{domain.domain}</span>
                    <span className="text-gray-500">
                      {domain.visits} visits
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
