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
        const isChrome = lines[0].includes("order") && lines[0].includes("visitCount");
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

            if (dateIndex !== -1 && timeIndex !== -1 && titleIndex !== -1 && urlIndex !== -1) {
              records.push({
                dateTime: `${columns[dateIndex]} ${columns[timeIndex]}`,
                navigatedToUrl: columns[urlIndex],
                pageTitle: columns[titleIndex],
              });
            }
          });
        } else {
          dataLines.forEach((line) => {
            const [dateTime, navigatedToUrl, pageTitle] = line.split(",").map((col) => col.trim());
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
        alert("Error parsing file. Please ensure it's in the correct format (Edge or Chrome history export).");
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

      finalCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `browsing-insights-${currentSlide}-${type}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png", 1.0);
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

  if (!history.length) {
    return <LandingPage onFileUpload={handleFileUpload} />;
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-2xl font-medium text-white">Creating Your Story...</p>
        </div>
      </div>
    );
  }

  const analytics = analyzeBrowsingHistory(history);
  const currentIndex = SLIDES.indexOf(currentSlide);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600">
      <div ref={slideRef}>
        <SlideContainer currentSlide={currentSlide}>
          {currentSlide === "overview" && (
            <div className="text-center space-y-12 px-4">
              <h2 className="text-5xl font-bold text-white mb-12">Your Year in Browsing</h2>
              <div className="text-8xl font-bold text-white mb-4">{analytics?.totalVisits || 0}</div>
              <p className="text-2xl text-white/80">web pages visited</p>
              <div className="text-4xl font-bold text-white/90 mt-8">
                {analytics?.uniqueDomains.toLocaleString()}
              </div>
              <p className="text-xl text-white/80">unique websites explored</p>
            </div>
          )}

          {currentSlide === "topSites" && (
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold text-white mb-12">Your Top Destinations</h2>
              <WebsiteAnalytics stats={analytics?.domainStats || []} />
            </div>
          )}

          {currentSlide === "categories" && (
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold text-white mb-12">Your Internet Universe</h2>
              <CategoryChart stats={analytics?.categoryStats || []} />
            </div>
          )}

          {currentSlide === "patterns" && (
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold text-white mb-12">Your Daily Rhythms</h2>
              <TimePatterns stats={analytics?.timeStats || []} />
            </div>
          )}

          {currentSlide === "yearly" && (
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold text-white mb-12">Your Year at a Glance</h2>
              <YearlyHeatmap stats={analytics?.dailyStats || []} />
            </div>
          )}

          {currentSlide === "gems" && (
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold text-white mb-12">Rediscover These Gems</h2>
              <HiddenGems gems={analytics?.domainStats.filter((site) => site.visits === 1).slice(0, 5) || []} />
            </div>
          )}
        </SlideContainer>
      </div>

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