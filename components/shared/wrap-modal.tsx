"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { WalletData } from "@/lib/mock-data";
import { WrapCard } from "./wrap-card";

interface WrapModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WalletData;
}

export function WrapModal({ isOpen, onClose, data }: WrapModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md pointer-events-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Content */}
              <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-black rounded-3xl p-6 shadow-2xl border border-white/10">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">Your 2025 Wrap 🎉</h2>
                  <p className="text-white/60 text-sm">Share your crypto journey</p>
                </div>
                
                <WrapCard data={data} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}