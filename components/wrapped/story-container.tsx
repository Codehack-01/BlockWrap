"use client";

import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Context for child slides to pause/resume the story
interface StoryContextType {
  pauseStory: () => void;
  resumeStory: () => void;
  isPaused: boolean;
}

const StoryContext = createContext<StoryContextType | null>(null);

export const useStoryContext = () => {
  const context = useContext(StoryContext);
  if (!context) {
    // Return no-op functions if context not available (for standalone slide usage)
    return { pauseStory: () => {}, resumeStory: () => {}, isPaused: false };
  }
  return context;
};

interface StoryContainerProps {
  slides: React.ReactNode[];
  onComplete?: () => void;
}

export function StoryContainer({ slides, onComplete }: StoryContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchUsedRef = useRef(false); // Track if touch was used to prevent double navigation
  const isTransitioningRef = useRef(false); // Prevent double-firing during slide transition

  const SLIDE_DURATION = 5000; // 5 seconds per slide
  const HOLD_THRESHOLD = 150; // ms to register as "hold" vs "tap"

  const pauseStory = useCallback(() => setIsPaused(true), []);
  const resumeStory = useCallback(() => setIsPaused(false), []);

  const nextSlide = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      if (onComplete) onComplete();
    }
  }, [currentIndex, slides.length, onComplete]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Progress bar timer
  useEffect(() => {
    // Reset transitioning flag when effect re-runs (new slide)
    isTransitioningRef.current = false;
    
    // Don't auto-advance on the last slide (share slide)
    if (isPaused || currentIndex === slides.length - 1) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    const interval = 50; // Update every 50ms for smooth animation
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (interval / SLIDE_DURATION) * 100;
        if (next >= 100 && !isTransitioningRef.current) {
          isTransitioningRef.current = true;
          // Use setTimeout to avoid calling setState during render
          setTimeout(() => {
            setCurrentIndex((prevIndex) => {
              if (prevIndex < slides.length - 1) {
                return prevIndex + 1;
              } else {
                if (onComplete) onComplete();
                return prevIndex;
              }
            });
            setProgress(0);
            isTransitioningRef.current = false;
          }, 0);
          return prev; // Keep current progress until transition
        }
        return next >= 100 ? prev : next;
      });
    }, interval);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [currentIndex, isPaused, slides.length, onComplete]);

  // Touch handlers for hold-to-pause
  const handleTouchStart = useCallback(() => {
    touchUsedRef.current = true;
    holdTimerRef.current = setTimeout(() => {
      setIsPaused(true);
    }, HOLD_THRESHOLD);
  }, []);

  const handleTouchEnd = useCallback((side: 'left' | 'right') => {
    // Clear hold timer
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    // If was holding, resume and don't navigate
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    // Otherwise, it was a tap - navigate
    if (side === 'left') {
      prevSlide();
    } else {
      nextSlide();
    }
  }, [isPaused, prevSlide, nextSlide]);

  // Mouse handlers for desktop
  const handleMouseDown = useCallback(() => {
    holdTimerRef.current = setTimeout(() => {
      setIsPaused(true);
    }, HOLD_THRESHOLD);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (isPaused) {
      setIsPaused(false);
    }
  }, [isPaused]);

  const handleClick = useCallback((side: 'left' | 'right') => {
    // Skip click if touch was just used (prevents double navigation on touch devices)
    if (touchUsedRef.current) {
      touchUsedRef.current = false;
      return;
    }
    
    // Only navigate if not holding (tap)
    if (!isPaused) {
      if (side === 'left') {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  }, [isPaused, prevSlide, nextSlide]);

  return (
    <StoryContext.Provider value={{ pauseStory, resumeStory, isPaused }}>
      <div 
        className="relative h-full w-full bg-black text-white overflow-hidden flex items-center justify-center overscroll-none touch-none select-none"
        style={{
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        {/* Progress Bars */}
        <div className="absolute top-4 left-0 right-0 z-50 flex gap-2 px-4">
          {slides.map((_, index) => (
            <div
              key={index}
              className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-none"
                style={{
                  width: index < currentIndex 
                    ? '100%' 
                    : index === currentIndex 
                      ? `${progress}%` 
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation Areas - Left */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/3 z-40 cursor-w-resize"
          onClick={() => handleClick('left')}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={() => handleTouchEnd('left')}
        />
        
        {/* Navigation Areas - Right */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/3 z-40 cursor-e-resize"
          onClick={() => handleClick('right')}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={() => handleTouchEnd('right')}
        />

        {/* Content */}
        <div className="w-full max-w-md h-full md:h-[80vh] md:rounded-3xl relative overflow-hidden bg-zinc-900 shadow-2xl border border-white/10">
          {/* Desktop click-to-pause overlay (full card area, z-index below action buttons) */}
          <div
            className="absolute inset-0 z-30 cursor-pointer hidden md:block"
            onClick={() => setIsPaused(prev => !prev)}
          />
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
        
        {/* Desktop Controls Hint */}
        <div className="absolute bottom-8 left-0 right-0 text-center text-white/40 text-sm hidden md:block">
          {isPaused ? 'Paused — Click to resume' : 'Click on card to pause'}
        </div>
      </div>
    </StoryContext.Provider>
  );
}