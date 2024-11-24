import React, { useState } from "react";
import { Calendar } from "lucide-react";

interface TopSite {
  domain: string;
  visits: number;
}

interface DailyStats {
  date: string;
  visits: number;
  topSites: TopSite[];
}

interface YearlyHeatmapProps {
  stats: DailyStats[];
}

const YearlyHeatmap: React.FC<YearlyHeatmapProps> = ({ stats }) => {
  const [hoveredDay, setHoveredDay] = useState<{ stats: DailyStats; rect: DOMRect } | null>(null);

  const maxVisits = Math.max(...stats.map((day) => day.visits));

  const getOpacity = (visits: number) => {
    return 0.2 + (visits / maxVisits) * 0.8;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDayHover = (day: DailyStats, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredDay({ stats: day, rect });
  };

  const statsByMonth = stats.reduce((acc, stat) => {
    const date = new Date(stat.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(stat);
    return acc;
  }, {} as Record<string, DailyStats[]>);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Activity Overview
      </h3>

      <div className="relative">
        <div className="flex flex-wrap gap-6">
          {Object.entries(statsByMonth).map(([monthKey, monthStats]) => (
            <div key={monthKey} className="flex flex-col">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                {new Date(monthStats[0].date).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h4>
              <div className="grid grid-cols-7 gap-1">
                {monthStats.map((day) => (
                  <div
                    key={day.date}
                    className="relative aspect-square w-4"
                    onMouseEnter={(e) => handleDayHover(day, e)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    <div
                      className="w-full h-full rounded-sm cursor-pointer transition-all duration-200 hover:scale-110"
                      style={{
                        backgroundColor: `rgba(79, 70, 229, ${getOpacity(
                          day.visits
                        )})`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {hoveredDay && (
          <div 
            className="fixed bg-gray-800 text-white rounded-lg text-sm z-50 p-3 shadow-xl"
            style={{
              top: hoveredDay.rect.top - 120,
              left: hoveredDay.rect.left + hoveredDay.rect.width / 2,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-medium mb-1">
              {formatDate(hoveredDay.stats.date)}
            </div>
            <div className="text-gray-300 mb-2">
              {hoveredDay.stats.visits} total visits
            </div>
            <div className="space-y-1">
              {hoveredDay.stats.topSites.map((site, index) => (
                <div
                  key={site.domain}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-300">
                    #{index + 1} {site.domain}
                  </span>
                  <span className="text-gray-400">{site.visits} visits</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center items-center gap-2 text-sm text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
            <div
              key={opacity}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: `rgba(79, 70, 229, ${opacity})` }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default YearlyHeatmap;