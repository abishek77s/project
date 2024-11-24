import React, { useRef } from "react";
import { motion } from "framer-motion";
import { VideoStats, MediaStats } from "../types";
import { Film, Share2, Download } from "lucide-react";
import html2canvas from "html2canvas";

interface MediaInsightsProps {
  videoCategories: VideoStats[];
  mediaStats: MediaStats;
  onShare: () => void;
}

export const MediaInsights: React.FC<MediaInsightsProps> = ({
  videoCategories,
  mediaStats,
  onShare,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handleSaveAsImage = async () => {
    if (!componentRef.current) return;

    try {
      // Create canvas from the component
      const canvas = await html2canvas(componentRef.current, {
        backgroundColor: "white",
        scale: 2, // Higher quality
        logging: false,
      });

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "media-insights.png";

          // Trigger download
          document.body.appendChild(link);
          link.click();

          // Cleanup
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        "image/png",
        1.0
      );
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <div ref={componentRef} className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <Film className="w-5 h-5" />
          Media Insights
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleSaveAsImage}
            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            title="Save as Image"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onShare}
            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            title="Share Insights"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {videoCategories.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Video Categories You Love
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {videoCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 p-3 rounded-lg"
              >
                <div className="text-sm font-medium text-gray-700">
                  {category.category}
                </div>
                <div className="text-xs text-gray-500">
                  {category.count} videos ({Math.round(category.percentage)}%)
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {mediaStats.topVideos.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Most Watched Videos
          </h4>
          <div className="space-y-2">
            {mediaStats.topVideos.slice(0, 5).map((video, index) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-700 truncate flex-1">
                  {video.title}
                </span>
                <span className="text-gray-500 ml-2">{video.views} views</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {(mediaStats.movies.length > 0 || mediaStats.anime.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mediaStats.movies.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2">
                Movies Watched
              </h4>
              <div className="space-y-1">
                {mediaStats.movies.slice(0, 5).map((movie, index) => (
                  <motion.div
                    key={movie}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm text-gray-600"
                  >
                    {movie}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {mediaStats.anime.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2">
                Anime Watched
              </h4>
              <div className="space-y-1">
                {mediaStats.anime.slice(0, 5).map((anime, index) => (
                  <motion.div
                    key={anime}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm text-gray-600"
                  >
                    {anime}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
