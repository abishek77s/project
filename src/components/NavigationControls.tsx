import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Download, Share2 } from "lucide-react";

interface NavigationControlsProps {
  currentSlide: string;
  totalSlides: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onDownload: (type: "desktop" | "mobile") => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentSlide,
  totalSlides,
  currentIndex,
  onNext,
  onPrev,
  onDownload,
}) => {
  return (
    <>
      {/* Top Actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-8 right-8 flex gap-2"
      >
        <button
          onClick={() => onDownload("mobile")}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          title="Download for Social Media"
        >
          <Download className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Side Navigation */}
      <div className="fixed inset-y-0 left-8 flex items-center">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className={`p-3 rounded-full transition-colors ${
            currentIndex === 0
              ? "bg-white/20 text-white/40 cursor-not-allowed"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="fixed inset-y-0 right-8 flex items-center">
        <button
          onClick={onNext}
          disabled={currentIndex === totalSlides - 1}
          className={`p-3 rounded-full transition-colors ${
            currentIndex === totalSlides - 1
              ? "bg-white/20 text-white/40 cursor-not-allowed"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Progress */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-white" : "w-4 bg-white/30"
            }`}
          />
        ))}
      </div>
    </>
  );
};
