import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { BrowsingRecord } from "./types";
import { analyzeBrowsingHistory } from "./utils/analytics";

import { WebsiteAnalytics } from "./components/WebsiteAnalytics";
import { TimePatterns } from "./components/TimePatterns";
import { CategoryChart } from "./components/CategoryChart";
import YearlyHeatmap from "./components/YearlyHeatmap";
import { HiddenGems } from "./components/HiddenGems";
import { SlideContainer } from "./components/SlideContainer";
import { NavigationControls } from "./components/NavigationControls";
import { LandingPage } from "./components/LandingPage";
import { motion } from "framer-motion";

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
  const slideRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split("\n").filter((line) => line.trim());
        const isChrome =
          lines[0].includes("order") && lines[0].includes("visitCount");
        const records: BrowsingRecord[] = [];
        const dataLines = lines.slice(1);

        if (isChrome) {
          dataLines.forEach((line) => {
            const columns = line.split(",").map((col) => col.trim());
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
          dataLines.forEach((line) => {
            const [dateTime, navigatedToUrl, pageTitle] = line
              .split(",")
              .map((col) => col.trim());
            records.push({ dateTime, navigatedToUrl, pageTitle });
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

  const handleDownload = async () => {
    if (!slideRef.current) return;

    try {
      const scale = 3;
      const canvas = await html2canvas(slideRef.current, {
        backgroundColor: null,
        scale,
        logging: false,
      });

      const aspectRatio = 1.91;
      let finalCanvas = canvas;

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

      finalCanvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `web-wrapped${currentSlide}.png`;
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
    const avgTimePerVisit = 4;
    const totalMinutes = analytics?.totalVisits
      ? analytics.totalVisits * avgTimePerVisit
      : 0;
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    return { days, hours };
  };

  if (!history.length) {
    return <LandingPage onFileUpload={handleFileUpload} />;
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600" role="status" aria-live="polite">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-hidden="true" />
          <p className="text-2xl font-medium text-white">
            Creating Your Story...
          </p>
        </div>
      </div>
    );
  }

  const analytics = analyzeBrowsingHistory(history);
  const currentIndex = SLIDES.indexOf(currentSlide);
  const timeSpent = calculateTimeSpent();

  return (
    <div className="font-geist-mono min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600">
      <header role="banner" className="sr-only">
        <h1>Web Wrapped - Your Browsing History Analysis</h1>
      </header>
      
      <main role="main" ref={slideRef}>
        <SlideContainer currentSlide={currentSlide}>
          {currentSlide === "overview" && (
            <div className="px-4">
              <h2 className="text-5xl font-bold text-white mb-12 text-center">
                Your Year in Browsing
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="text-7xl font-bold text-white">
                    {analytics?.totalVisits || 0}
                    <p className="text-2xl text-white/80">web pages visited</p>
                  </div>
                  <div className="text-4xl font-bold text-white/90">
                    {analytics?.uniqueDomains.toLocaleString()}
                    <p className="text-xl text-white/80">
                      unique websites explored
                    </p>
                  </div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-2xl text-white/90"
                  >
                    That's about {timeSpent.days} days and {timeSpent.hours} hours
                    of browsing!
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white mb-6">
                    Your Top Sites
                  </h3>
                  {analytics?.domainStats.slice(0, 3).map((site, index) => (
                    <motion.div
                      key={site.domain}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-white">
                            #{index + 1}
                          </span>
                          <span className="ml-4 text-xl font-medium text-white">
                            {site.domain}
                          </span>
                        </div>
                        <span className="text-white/80 text-lg">
                          {site.visits.toLocaleString()} visits
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentSlide === "topSites" && (
            <section aria-label="Top Sites Analysis">
              <h2 className="text-4xl font-bold text-white mb-2 text-center">
                Your Top Destinations
              </h2>
              <WebsiteAnalytics stats={analytics?.domainStats || []} />
            </section>
          )}

          {currentSlide === "categories" && (
            <section aria-label="Website Categories">
              <h2 className="text-4xl font-bold text-white mb-2 text-center">
                Your Internet Universe
              </h2>
              <CategoryChart stats={analytics?.categoryStats || []} />
            </section>
          )}

          {currentSlide === "patterns" && (
            <section aria-label="Time Patterns">
              <h2 className="text-4xl font-bold text-white mb-2 text-center">
                Your Daily Rhythms
              </h2>
              <TimePatterns stats={analytics?.timeStats || []} />
            </section>
          )}

          {currentSlide === "yearly" && (
            <section aria-label="Yearly Overview">
              <h2 className="text-4xl font-bold text-white mb-2 text-center">
                Your Year at a Glance
              </h2>
              <YearlyHeatmap stats={analytics?.dailyStats || []} />
            </section>
          )}

          {currentSlide === "gems" && (
            <section aria-label="Hidden Gems">
              <h2 className="text-4xl font-bold text-white mb-2 text-center">
                Rediscover These Gems
              </h2>
              <HiddenGems
                gems={
                  analytics?.domainStats
                    .filter((site) => site.visits === 1)
                    .slice(0, 5) || []
                }
              />
            </section>
          )}
        </SlideContainer>
      </main>

      <NavigationControls
        currentSlide={currentSlide}
        totalSlides={SLIDES.length}
        currentIndex={currentIndex}
        onNext={nextSlide}
        onPrev={prevSlide}
        onDownload={handleDownload}
      />
    </div>
  );
}

export default App;