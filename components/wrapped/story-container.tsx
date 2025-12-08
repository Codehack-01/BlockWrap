"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WalletData } from "@/lib/mock-data";
// import { IntroSlide, VolumeSlide, TopAssetSlide, PersonalitySlide, InflowOutflowSlide } from "./slides";
// import { useRouter } from "next/navigation";

interface StoryContainerProps {
  slides: React.ReactNode[];
  onComplete?: () => void;
}

export function StoryContainer({ slides, onComplete }: StoryContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // const router = useRouter(); // Unused

  const SLIDE_DURATION = 5000; // 5 seconds per slide

  const nextSlide = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (onComplete) onComplete();
    }
  }, [currentIndex, slides.length, onComplete]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    // Don't auto-advance on the last slide (share slide)
    if (isPaused || currentIndex === slides.length - 1) return;

    const timer = setTimeout(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, nextSlide, slides.length]);

  return (
    <div className="relative h-full w-full bg-black text-white overflow-hidden flex items-center justify-center overscroll-none touch-none">
      {/* Progress Bars */}
      <div className="absolute top-4 left-0 right-0 z-50 flex gap-2 px-4">
        {slides.map((_, index) => (
          <div
            key={index}
            className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"
          >
            <motion.div
              key={`progress-${index}-${currentIndex}`}
              className="h-full bg-white"
              initial={{ width: index < currentIndex ? "100%" : "0%" }}
              animate={{
                width:
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex && !isPaused
                    ? "100%"
                    : "0%",
              }}
              transition={{
                duration: index === currentIndex ? SLIDE_DURATION / 1000 : 0,
                ease: "linear",
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Areas */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/3 z-40 cursor-w-resize"
        onClick={prevSlide}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 z-40 cursor-e-resize"
        onClick={nextSlide}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      />

      {/* Content */}
      <div className="w-full max-w-md h-full md:h-[80vh] md:rounded-3xl relative overflow-hidden bg-zinc-900 shadow-2xl border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            {slides[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Mobile Controls Hint */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-white/30 text-xs md:hidden">
        Tap left/right to navigate • Hold to pause
      </div>
    </div>
  );
}