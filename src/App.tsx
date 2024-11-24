import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Upload,
  ArrowRight,
  ArrowLeft,
  Download,
  Share2,
} from "lucide-react";
import { BrowsingRecord } from "./types";
import { analyzeBrowsingHistory } from "./utils/analytics";
import html2canvas from "html2canvas";

import { WebsiteAnalytics } from "./components/WebsiteAnalytics";
import { TimePatterns } from "./components/TimePatterns";
import { CategoryChart } from "./components/CategoryChart";
import YearlyHeatmap from "./components/YearlyHeatmap";

import { HiddenGems } from "./components/HiddenGems";

const SLIDES = [
  "overview",
  "topSites",
  "categories",
  "patterns",
  "yearly",
  "gems",
] as const;

type SlideType = (typeof SLIDES)[number];

function App() {
  const [history, setHistory] = useState<BrowsingRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<SlideType>("overview");
  const [showNav, setShowNav] = useState(true);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowNav(false);
    const timer = setTimeout(() => setShowNav(true), 1000);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split("\n").filter((line) => line.trim());

        // Detect format by checking the first line (header)
        const isChrome =
          lines[0].includes("order") && lines[0].includes("visitCount");
        const records: BrowsingRecord[] = [];

        // Skip header row
        const dataLines = lines.slice(1);

        if (isChrome) {
          // Process Chrome format
          dataLines.forEach((line) => {
            const columns = line.split(",").map((col) => col.trim());
            // Find column indices from header
            const headerColumns = lines[0].split(",").map((col) => col.trim());
            const dateIndex = headerColumns.indexOf("date");
            const timeIndex = headerColumns.indexOf("time");
            const titleIndex = headerColumns.indexOf("title");
            const urlIndex = headerColumns.indexOf("url");

            if (
              dateIndex !== -1 &&
              timeIndex !== -1 &&
              titleIndex !== -1 &&
              urlIndex !== -1
            ) {
              records.push({
                dateTime: `${columns[dateIndex]} ${columns[timeIndex]}`,
                navigatedToUrl: columns[urlIndex],
                pageTitle: columns[titleIndex],
              });
            }
          });
        } else {
          // Process Edge format
          dataLines.forEach((line) => {
            const [dateTime, navigatedToUrl, pageTitle] = line
              .split(",")
              .map((col) => col.trim());
            records.push({
              dateTime,
              navigatedToUrl,
              pageTitle,
            });
          });
        }

        setIsAnalyzing(true);
        setTimeout(() => {
          setHistory(records);
          setIsAnalyzing(false);
        }, 1500);
      } catch (error) {
        console.error("Error parsing file:", error);
        alert(
          "Error parsing file. Please ensure it's in the correct format (Edge or Chrome history export)."
        );
      }
    };
    reader.readAsText(file);
  };
  const handleDownload = async (type: "desktop" | "mobile") => {
    if (!slideRef.current) return;

    try {
      const scale = type === "desktop" ? 2 : 3;
      const canvas = await html2canvas(slideRef.current, {
        backgroundColor: null,
        scale,
        logging: false,
      });

      const aspectRatio = type === "mobile" ? 1.91 : undefined;
      let finalCanvas = canvas;

      if (aspectRatio) {
        const newCanvas = document.createElement("canvas");
        const ctx = newCanvas.getContext("2d");
        if (!ctx) return;

        const targetHeight = canvas.width / aspectRatio;
        newCanvas.width = canvas.width;
        newCanvas.height = targetHeight;

        ctx.fillStyle = "#4F46E5";
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

        const yOffset = (targetHeight - canvas.height) / 2;
        ctx.drawImage(canvas, 0, yOffset);
        finalCanvas = newCanvas;
      }

      finalCanvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `browsing-insights-${currentSlide}-${type}.png`;
          document.body.appendChild(link);
          link.click();
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

  const nextSlide = () => {
    const currentIndex = SLIDES.indexOf(currentSlide);
    if (currentIndex < SLIDES.length - 1) {
      setCurrentSlide(SLIDES[currentIndex + 1]);
    }
  };

  const prevSlide = () => {
    const currentIndex = SLIDES.indexOf(currentSlide);
    if (currentIndex > 0) {
      setCurrentSlide(SLIDES[currentIndex - 1]);
    }
  };

  const calculateTimeSpent = () => {
    if (!analytics?.domainStats) return { days: 0, hours: 0 };

    const totalVisits = analytics.domainStats.reduce(
      (sum, site) => sum + site.visits,
      0
    );
    const avgMinutesPerVisit = 5;
    const totalMinutes = totalVisits * avgMinutesPerVisit;

    return {
      days: Math.floor(totalMinutes / (24 * 60)),
      hours: Math.floor((totalMinutes % (24 * 60)) / 60),
    };
  };

  const getHiddenGems = () => {
    if (!analytics?.domainStats) return [];
    return analytics.domainStats
      .filter((site) => site.visits === 1)
      .slice(0, 5);
  };

  if (!history.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 to-purple-600">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <History className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Browser Story
          </h1>
          <p className="text-white/80 mb-6">
            Upload your browsing history to see your year in review
          </p>
          <label className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-full cursor-pointer hover:bg-white/90 transition-colors font-medium">
            <Upload className="w-5 h-5 mr-2" />
            Choose File
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </motion.div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-2xl font-medium text-white">
            Creating Your Story...
          </p>
        </motion.div>
      </div>
    );
  }

  const analytics = history.length > 0 ? analyzeBrowsingHistory(history) : null;
  const timeSpent = calculateTimeSpent();
  const hiddenGems = getHiddenGems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600">
      <AnimatePresence mode="wait">
        <motion.div
          ref={slideRef}
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="min-h-screen flex items-center justify-center p-8"
        >
          <div className="max-w-4xl w-full">
            {currentSlide === "overview" && (
              <div className="text-center space-y-12 px-4">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-5xl font-bold text-white mb-12"
                >
                  Your Year in Browsing
                </motion.h2>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-8xl font-bold text-white mb-4"
                >
                  {analytics?.totalVisits || 0}
                </motion.div>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl text-white/80"
                >
                  web pages visited
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl font-bold text-white/90 mt-8"
                >
                  {analytics?.uniqueDomains.toLocaleString()}
                </motion.div>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl text-white/80"
                >
                  unique websites explored
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-3xl text-white/90 mt-8"
                >
                  That's about {timeSpent.days} days and {timeSpent.hours} hours
                  of browsing!
                </motion.div>

                {hiddenGems.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12"
                  ></motion.div>
                )}
              </div>
            )}

            {currentSlide === "topSites" && (
              <div className="text-center space-y-8">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-bold text-white mb-12"
                >
                  Your Top Destinations
                </motion.h2>
                <WebsiteAnalytics stats={analytics?.domainStats || []} />
              </div>
            )}

            {currentSlide === "categories" && (
              <div className="text-center space-y-8">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-bold text-white mb-12"
                >
                  Your Internet Universe
                </motion.h2>
                <CategoryChart stats={analytics?.categoryStats || []} />
              </div>
            )}

            {currentSlide === "patterns" && (
              <div className="text-center space-y-8">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-bold text-white mb-12"
                >
                  Your Daily Rhythms
                </motion.h2>
                <TimePatterns stats={analytics?.timeStats || []} />
              </div>
            )}

            {currentSlide === "yearly" && (
              <div className="text-center space-y-8">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-bold text-white mb-12"
                >
                  Your Year at a Glance
                </motion.h2>
                <YearlyHeatmap stats={analytics?.dailyStats || []} />
              </div>
            )}

            {currentSlide === "gems" && (
              <div className="text-center space-y-8">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-bold text-white mb-12"
                >
                  Rediscover These Gems
                </motion.h2>
                <HiddenGems gems={getHiddenGems()} />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showNav && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-0 right-0 flex justify-between items-center px-8 max-w-4xl mx-auto"
          >
            <button
              onClick={prevSlide}
              disabled={currentSlide === "overview"}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                currentSlide === "overview"
                  ? "bg-white/20 text-white/40 cursor-not-allowed"
                  : "bg-white text-indigo-600 hover:bg-white/90"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload("desktop")}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Download for Desktop"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDownload("mobile")}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Download for Social Media"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={nextSlide}
              disabled={currentSlide === "gems"}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                currentSlide === "gems"
                  ? "bg-white/20 text-white/40 cursor-not-allowed"
                  : "bg-white text-indigo-600 hover:bg-white/90"
              }`}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
