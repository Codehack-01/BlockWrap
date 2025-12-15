"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { WalletData } from "@/lib/mock-data";
import { ShareSlide } from "@/components/wrapped/slides";

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
            className="fixed inset-0 h-[100dvh] w-screen bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md pointer-events-auto">
              {/* Close Button - Floating at edge of corner */}
              <button
                onClick={onClose}
                className="absolute -top-3 -right-3 z-50 p-2 bg-zinc-900 border border-white/20 hover:bg-zinc-800 text-white transition-all rounded-full shadow-xl"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="relative w-full max-w-md h-full md:h-[85vh] md:max-h-[700px] bg-black md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
                <ShareSlide data={data} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}