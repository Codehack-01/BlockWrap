"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { WalletData } from "@/lib/mock-data";
import { formatTransactionCount } from "@/lib/utils";
import { TrendingUp, Coins, Trophy, Users, Sparkles, ArrowRightLeft, ArrowDownLeft, ArrowUpRight, Calendar, Rocket, Share2, Download, Loader2 } from "lucide-react";
import { toBlob, toPng } from "html-to-image";

interface SlideProps {
  data: WalletData;
}

export function IntroSlide({ data }: SlideProps) {
  return (
    <div className="h-full w-full flex flex-col justify-between p-8 relative overflow-hidden bg-zinc-950">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12"
      >
        <p className="font-space text-sm uppercase tracking-widest text-zinc-500 mb-4">
          BlockWrap &copy; 2025
        </p>
        <div className="h-px w-24 bg-zinc-800" />
      </motion.div>

      <div className="relative z-10">
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-[12rem] leading-[0.8] font-bold tracking-tighter text-white mix-blend-difference"
        >
          20
          <br />
          25
        </motion.h1>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight block mt-[-2rem] ml-2">
            WRAPPED
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-end items-end"
      >
        <div className="text-right">
          <p className="font-space text-xs text-zinc-500 uppercase tracking-wider mb-1">Wallet Address</p>
          <p className="font-space text-xl text-zinc-300 font-medium">
            {data.address.slice(0, 6)}...{data.address.slice(-4)}
          </p>
        </div>
      </motion.div>
    </div>
  );
}


function getVolumeStatus(volume: number): string {
  if (volume < 100) return "Normie";
  if (volume < 1000) return "Plankton";
  if (volume < 10000) return "Shrimp";
  if (volume < 50000) return "Dolphin";
  if (volume < 250000) return "Whale";
  return "Whale Shark";
}

export function VolumeSlide({ data }: SlideProps) {
  const status = getVolumeStatus(data.totalVolume);

  return (
    <div className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
      <div className="absolute bottom-[-20%] left-[-20%] w-[800px] h-[800px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-8"
        >
          <TrendingUp className="h-6 w-6 text-purple-400" />
          <h2 className="font-space text-sm uppercase tracking-widest text-purple-400">Transactions Volume</h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs md:text-sm text-zinc-500 font-mono uppercase tracking-widest mb-4">
            You had a total transaction volume of
          </p>
          <div className="flex flex-col md:flex-row items-center md:items-baseline justify-center gap-2 md:gap-4">
            <span className={`${
              data.totalVolume.toLocaleString().length <= 4 ? "text-[5rem] md:text-[7rem]" : // 999
              data.totalVolume.toLocaleString().length <= 6 ? "text-[4.5rem] md:text-[6rem]" : // 10,000
              data.totalVolume.toLocaleString().length <= 8 ? "text-[4rem] md:text-[5rem]" : // 100,000
              data.totalVolume.toLocaleString().length <= 10 ? "text-[3.5rem] md:text-[4rem]" : // 10,000,000
              data.totalVolume.toLocaleString().length <= 13 ? "text-[3rem] md:text-[3rem]" : // 100,000,000
              "text-[2rem] md:text-[2.5rem]" // Billions+
            } leading-none font-bold tracking-tighter text-white block whitespace-nowrap`}>
              {data.totalVolume.toLocaleString()}
            </span>
            <span className="text-2xl md:text-4xl font-bold tracking-tight text-white">SOL</span>
          </div>
          <p className="text-center font-space text-sm md:text-xl text-zinc-500 mt-2 md:mt-4">
            ≈ ${(data.totalVolume * (data.solPrice || 0)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex gap-8"
        >
          <div>
            <p className="font-space text-xs text-zinc-500 uppercase tracking-wider mb-1">Network</p>
            <p className="font-space text-xl text-white">Solana</p>
          </div>
          <div>
            <p className="font-space text-xs text-zinc-500 uppercase tracking-wider mb-1">Status</p>
            <p className="font-space text-xl text-purple-400">{status}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function TopAssetSlide({ data }: SlideProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!slideRef.current) return;

    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for render

      const dataUrl = await toPng(slideRef.current, {
        cacheBust: true,
        backgroundColor: "#09090b",
        filter: (node) => !node.classList?.contains("no-capture"),
      });

      const link = document.createElement("a");
      link.download = `blockwrap-top-asset-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Capture failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!slideRef.current) return;

    setIsSharing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for watermark render

      const blob = await toBlob(slideRef.current, {
        cacheBust: true,
        backgroundColor: "#09090b",
        filter: (node) => !node.classList?.contains("no-capture"),
      });

      if (!blob) throw new Error("Failed to generate image blob");

      const file = new File([blob], "top-asset.png", { type: "image/png" });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Top Crypto Asset 2025",
          text: `Check out my top asset: ${data.topAsset.symbol}!`,
          files: [file],
        });
      } else {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]); 
        alert("Image copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div ref={slideRef} className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <Coins className="h-5 w-5 text-emerald-400" />
            <p className="font-space text-sm uppercase tracking-widest text-emerald-400">Top Asset</p>
          </div>
          
          <h1 className="text-[5rem] md:text-[6rem] leading-[0.8] font-bold tracking-tighter text-white mb-8">
            {data.topAsset.symbol}
          </h1>
          
          <div className="space-y-6">
            <div className="border-l border-zinc-800 pl-6">
              <p className="font-space text-xs text-zinc-500 uppercase tracking-wider mb-1">Balance</p>
              <p className="font-space text-3xl text-white">{data.topAsset.amount.toLocaleString()}</p>
            </div>
            <div className="border-l border-zinc-800 pl-6">
              <p className="font-space text-xs text-zinc-500 uppercase tracking-wider mb-1">Value (USD)</p>
              <p className="font-space text-3xl text-emerald-400">${data.topAsset.valueUsd.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden md:block z-10"
        >
          <div className="aspect-square rounded-full border border-zinc-800 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-full animate-pulse" />
            <Coins className="h-48 w-48 text-zinc-800" />
            <div className="absolute inset-0 border border-emerald-500/20 rounded-full scale-110" />
            <div className="absolute inset-0 border border-emerald-500/10 rounded-full scale-125" />
          </div>
        </motion.div>
      </div>

      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-0 right-0 z-50 flex justify-center gap-4 no-capture"
        data-html2canvas-ignore
      >
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all font-space text-sm uppercase tracking-wide disabled:opacity-50 shadow-lg shadow-white/10"
        >
          {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          <span className="hidden md:inline">Share</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-space text-sm uppercase tracking-wide disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden md:inline">Save</span>
        </button>
      </motion.div>

      {/* Watermark - Only visible during capture */}
      {(isSharing || isDownloading) && (
        <div className="absolute bottom-4 right-4 z-[100] font-bold text-white/40 text-sm tracking-wider font-space pointer-events-none">
          blockwrap.xyz
        </div>
      )}
    </div>
  );
}

export function TopAssetsSlide({ data }: SlideProps) {
  const topAssets = data.topAssets || [data.topAsset];
  
  return (
    <div className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] blur-[60px] md:w-[600px] md:h-[600px] md:blur-[120px] bg-yellow-600/10 rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <p className="font-space text-sm uppercase tracking-widest text-yellow-500">Portfolio Leaders</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Top 5 Assets</h2>
        </motion.div>

        <div className="space-y-0">
          {topAssets.map((asset, index) => (
            <motion.div
              key={`${asset.symbol}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group flex items-baseline justify-between py-4 border-b border-zinc-800 hover:border-yellow-500/50 transition-colors duration-500 will-change-transform"
            >
              <div className="flex items-baseline gap-6">
                <span className="font-space text-sm text-zinc-600">0{index + 1}</span>
                <h3 className="text-4xl md:text-3xl font-bold text-zinc-300 group-hover:text-white transition-colors duration-300">
                  {asset.symbol}
                </h3>
              </div>
              
              <div className="text-right">
                <p className="font-space text-xl text-white mb-1">
                  ${asset.valueUsd.toLocaleString()}
                </p>
                <p className="font-space text-xs text-zinc-600 uppercase tracking-wider">
                  {asset.amount.toLocaleString()} Tokens
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TopWalletsSlide({ data }: SlideProps) {
  const topWallets = data.topWallets || [];
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 1500);
  };

  if (topWallets.length === 0) {
    return (
      <div className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
        <div className="relative z-10 flex flex-col items-center text-center">
          <Users className="h-12 w-12 text-zinc-700 mb-6" />
          <h2 className="text-4xl font-bold text-zinc-500 mb-4">No Connections</h2>
          <p className="font-space text-zinc-600">Start interacting on-chain to see your network.</p>
        </div>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "sent": return "OUT";
      case "received": return "IN";
      default: return "BI-DIR";
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] blur-[60px] md:w-[600px] md:h-[600px] md:blur-[120px] bg-cyan-600/10 rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-cyan-500" />
            <p className="font-space text-sm uppercase tracking-widest text-cyan-500">Network</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">Top 5 Transactions</h2>
        </motion.div>

        <div className="space-y-0 relative">
          {topWallets.map((wallet, index) => (
            <motion.div
              key={wallet.address}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={(e) => handleCopy(wallet.address, e)}
              className="group flex items-center justify-between py-3 border-b border-zinc-800 hover:border-cyan-500/50 transition-colors duration-500 cursor-pointer will-change-transform"
            >
              <div className="flex items-center gap-6 min-w-0 flex-1">
                <span className="font-space text-sm text-zinc-600">0{index + 1}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg md:text-xl font-bold text-zinc-300 group-hover:text-white transition-colors duration-300 truncate font-mono">
                      {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                    </h3>
                    {copiedAddress === wallet.address && (
                      <span className="text-emerald-400 text-xs font-bold tracking-wider font-space animate-in fade-in slide-in-from-left-2 duration-300">
                        COPIED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500 font-space">
                      {getTypeLabel(wallet.type)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right pl-4">
                <p className="font-space text-xl text-white mb-1">
                  {wallet.interactionCount} <span className="text-sm text-zinc-600">TXS</span>
                </p>
                <p className="font-space text-xs text-zinc-600 uppercase tracking-wider">
                  {wallet.totalVolume.toFixed(2)} SOL
                </p>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </div>
  );
}

export function PersonalitySlide({ data }: SlideProps) {
  return (
    <div className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
      <div className="absolute bottom-0 left-0 w-full md:w-[800px] h-[50vh] md:h-[800px] bg-pink-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="font-space text-pink-400 uppercase tracking-widest text-sm mb-8"
        >
          Your Archetype
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.9] tracking-tighter mix-blend-overlay opacity-50 absolute top-2 left-2 select-none w-full">
            {data.personality}
          </h1>
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-pink-200 leading-[0.9] tracking-tighter relative z-10">
            {data.personality}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-zinc-800" />
          <Sparkles className="h-6 w-6 text-pink-400" />
          <div className="h-px flex-1 bg-zinc-800" />
        </motion.div>
      </div>
    </div>
  );
}

// import { toBlob, toPng } from "html-to-image"; // Duplicate removed
// import html2canvas from "html2canvas"; // Removed

// ... (inside component)

export function InflowOutflowSlide({ data }: SlideProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!slideRef.current) return;

    setIsDownloading(true);
    try {
      // Small delay to ensure render is stable
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(slideRef.current, {
        cacheBust: true,
        backgroundColor: "#09090b",
        filter: (node) => !node.classList?.contains("no-capture"),
      });

      const link = document.createElement("a");
      link.download = `blockwrap-money-moves-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Capture failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!slideRef.current) return;

    setIsSharing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for watermark render

      const blob = await toBlob(slideRef.current, {
        cacheBust: true,
        backgroundColor: "#09090b",
        filter: (node) => !node.classList?.contains("no-capture"),
      });

      if (!blob) throw new Error("Failed to generate image blob");

      const file = new File([blob], "money-moves.png", { type: "image/png" });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My BlockWrap 2025 Money Moves",
          text: "Check out my on-chain flow analysis!",
          files: [file],
        });
      } else {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]); 
        alert("Image copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
      // Fallback/Error UI could be added here
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div ref={slideRef} className="h-full w-full flex flex-col justify-center relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 flex pointer-events-none">
        <div className="w-1/2 h-full bg-zinc-950 border-r border-zinc-800" />
        <div className="w-1/2 h-full bg-zinc-900/30" />
      </div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50">
            <ArrowRightLeft className="h-4 w-4 text-blue-400" />
            <span className="font-space text-xs uppercase tracking-widest text-blue-400">Flow Analysis</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">Money Moves</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-right pr-2 md:pr-0"
          >
            <div className="flex items-center justify-end gap-3 mb-4">
              <span className="font-space text-sm uppercase tracking-widest text-green-500">Inflow</span>
              <ArrowDownLeft className="h-5 w-5 text-green-500" />
            </div>
            <p className={`${
              (data.totalInflow?.toLocaleString() ?? "0").length <= 4 ? "text-[2.5rem] md:text-[3rem]" :
              (data.totalInflow?.toLocaleString() ?? "0").length <= 6 ? "text-[2rem] md:text-[3rem]" :
              (data.totalInflow?.toLocaleString() ?? "0").length <= 8 ? "text-[1.8rem] md:text-[2.2rem]" :
              (data.totalInflow?.toLocaleString() ?? "0").length <= 10 ? "text-[1.5rem] md:text-[2rem]" :
              (data.totalInflow?.toLocaleString() ?? "0").length <= 13 ? "text-[1.2rem] md:text-[1.7rem]" :
              "text-[1rem] md:text-[3rem]"
            } font-bold text-white tracking-tighter mb-2 whitespace-nowrap leading-[0.9]`}>
              +{data.totalInflow?.toLocaleString() ?? 0}
            </p>
            <p className={`font-space text-zinc-500 ${
              (data.totalInflowUsd?.toLocaleString() ?? "0.00").length > 10 ? "text-xs md:text-xl" : "text-xl"
            }`}>
              ${data.totalInflowUsd?.toLocaleString() ?? "0.00"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-left pl-2 md:pl-0"
          >
            <div className="flex items-center gap-3 mb-4">
              <ArrowUpRight className="h-5 w-5 text-red-500" />
              <span className="font-space text-sm uppercase tracking-widest text-red-500">Outflow</span>
            </div>
            <p className={`${
              (data.totalOutflow?.toLocaleString() ?? "0").length <= 4 ? "text-[2.5rem] md:text-[3rem]" :
              (data.totalOutflow?.toLocaleString() ?? "0").length <= 6 ? "text-[2rem] md:text-[3rem]" :
              (data.totalOutflow?.toLocaleString() ?? "0").length <= 8 ? "text-[1.8rem] md:text-[2.2rem]" :
              (data.totalOutflow?.toLocaleString() ?? "0").length <= 10 ? "text-[1.5rem] md:text-[2rem]" :
              (data.totalOutflow?.toLocaleString() ?? "0").length <= 13 ? "text-[1.2rem] md:text-[1.7rem]" :
              "text-[1rem] md:text-[3rem]"
            } font-bold text-white tracking-tighter mb-2 whitespace-nowrap leading-[0.9]`}>
              -{data.totalOutflow?.toLocaleString() ?? 0}
            </p>
            <p className={`font-space text-zinc-500 ${
              (data.totalOutflowUsd?.toLocaleString() ?? "0.00").length > 10 ? "text-xs md:text-xl" : "text-xl"
            }`}>
              ${data.totalOutflowUsd?.toLocaleString() ?? "0.00"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Action Bar - Styled to float at bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-0 right-0 z-50 flex justify-center gap-4 no-capture"
        data-html2canvas-ignore // Don't capture the buttons themselves
      >
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all font-space text-sm uppercase tracking-wide disabled:opacity-50 shadow-lg shadow-white/10"
        >
          {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          <span className="hidden md:inline">Share</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-space text-sm uppercase tracking-wide disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden md:inline">Save</span>
        </button>
      </motion.div>

      {/* Watermark - Only visible during capture */}
      {(isSharing || isDownloading) && (
        <div className="absolute bottom-4 right-4 z-[100] font-bold text-white/40 text-sm tracking-wider font-space pointer-events-none">
          blockwrap.xyz
        </div>
      )}
    </div>
  );
}

export function MostActiveDaySlide({ data }: SlideProps) {
  const { date, count } = data.mostActiveDay || { date: "N/A", count: 0 };
  
  return (
    <div className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-6" />
          <h2 className="font-space text-sm uppercase tracking-widest text-orange-500 mb-2">Peak Activity</h2>
          <div className="h-px w-24 bg-orange-500/30 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl leading-none font-bold tracking-tighter text-white mb-8">
            {date}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-block border border-zinc-800 bg-zinc-900/50 px-6 py-3 rounded-full backdrop-blur-sm"
        >
          <p className="font-space text-xl text-zinc-300">
            <span className="text-white font-bold">{count}</span> Transactions
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function BiggestTransactionSlide({ data }: SlideProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const { amount, currency, usdValue, to, date } = data.biggestTransaction || { 
    amount: 1250, 
    currency: "SOL", 
    usdValue: 275000, 
    to: "8x2...9z1", 
    date: "Jan 12, 2024" 
  };

  const handleCopy = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 1500);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!slideRef.current) return;

    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for watermark render

      const blob = await toBlob(slideRef.current, {
        cacheBust: true,
        backgroundColor: "#09090b",
        filter: (node) => !node.classList?.contains("no-capture"),
      });

      if (!blob) throw new Error("Failed to generate image blob");

      const link = document.createElement("a");
      link.download = "biggest-tx.png";
      link.href = URL.createObjectURL(blob);
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!slideRef.current) return;

    setIsSharing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for watermark render

      const blob = await toBlob(slideRef.current, {
        cacheBust: true,
        backgroundColor: "#09090b",
        filter: (node) => !node.classList?.contains("no-capture"),
      });

      if (!blob) throw new Error("Failed to generate image blob");

      const file = new File([blob], "biggest-tx.png", { type: "image/png" });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Biggest 2025 Transaction",
          text: `I moved ${amount.toLocaleString()} ${currency} on Solana!`,
          files: [file],
        });
      } else {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]); 
        alert("Image copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div ref={slideRef} className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
      <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Rocket className="h-8 w-8 text-indigo-500 mx-auto mb-6" />
          <h2 className="font-space text-sm uppercase tracking-widest text-indigo-500 mb-2">Biggest Transaction</h2>
          <div className="h-px w-24 bg-indigo-500/30 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-white mb-4">
            {amount.toLocaleString()} {currency}
          </h1>
          {usdValue && usdValue > 0 && (
            <p className="font-space text-2xl text-indigo-400">
              ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <p className="font-space text-sm text-zinc-500 uppercase tracking-wider mb-2">Sent to</p>
          <div 
            onClick={(e) => handleCopy(to, e)}
            className="inline-flex items-center gap-3 border border-zinc-800 bg-zinc-900/50 px-6 py-3 rounded-full backdrop-blur-sm cursor-pointer hover:bg-zinc-800 transition-colors group"
          >
            <p className="font-space text-xl text-zinc-300 font-mono group-hover:text-white transition-colors">
              {to.length > 10 ? `${to.slice(0, 4)}...${to.slice(-4)}` : to}
            </p>
            {copiedAddress === to && (
              <span className="text-emerald-400 text-xs font-bold tracking-wider font-space animate-in fade-in slide-in-from-left-2 duration-300">
                COPIED
              </span>
            )}
          </div>
          <p className="font-space text-xs text-zinc-600 mt-4">{date}</p>
        </motion.div>
      </div>

      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-0 right-0 z-50 flex justify-center gap-4 no-capture"
        data-html2canvas-ignore
      >
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all font-space text-sm uppercase tracking-wide disabled:opacity-50 shadow-lg shadow-white/10"
        >
          {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          <span className="hidden md:inline">Share</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-space text-sm uppercase tracking-wide disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden md:inline">Save</span>
        </button>
      </motion.div>

      {/* Watermark - Only visible during capture */}
      {(isSharing || isDownloading) && (
        <div className="absolute bottom-4 right-4 z-[100] font-bold text-white/40 text-sm tracking-wider font-space pointer-events-none">
          blockwrap.xyz
        </div>
      )}
    </div>
  );
}

export function ShareSlide({ data }: SlideProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { percentile, label } = data.walletRank || { percentile: 50, label: "Solana Plankton" };
  const totalVolumeUsd = data.totalVolume * (data.solPrice || 0);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!slideRef.current) return;

    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const isMobile = window.innerWidth < 768;
      
      const dataUrl = await toPng(slideRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#09090b",
        filter: (node) => !node.classList?.contains("no-capture"),
        width: isMobile ? slideRef.current.clientWidth : undefined,
        style: isMobile ? { 
          height: 'auto',
          minHeight: '850px', // Force it to be tall/big
          width: '100%',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '3rem',
          paddingBottom: '3rem'
          // removed justify-between so footer stays near content
        } : undefined,
      });

      const link = document.createElement("a");
      link.download = `blockwrap-summary-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Capture failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!slideRef.current) return;

    setIsSharing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for watermark render

      const isMobile = window.innerWidth < 768;
      
      const blob = await toBlob(slideRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#09090b",
        filter: (node) => !node.classList?.contains("no-capture"),
        width: isMobile ? slideRef.current.clientWidth : undefined,
        style: isMobile ? { 
          height: 'auto',
          minHeight: '850px',
          width: '100%',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '3rem',
          paddingBottom: '3rem'
        } : undefined,
      });

      if (!blob) throw new Error("Failed to generate image blob");

      const file = new File([blob], "summary.png", { type: "image/png" });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My BlockWrap 2025 Summary",
          text: `Check out my 2025 on-chain stats! Volume: $${data.totalVolume.toLocaleString()} • Rank: Top ${percentile}%`,
          files: [file],
        });
      } else {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]); 
        alert("Image copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div ref={slideRef} className="h-full w-full flex flex-col p-5 md:p-8 relative overflow-hidden bg-zinc-950 font-syne text-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 flex justify-between items-start mb-3 md:mb-6 flex-shrink-0">
        <div>
          <h1 className="text-xl md:text-4xl font-bold tracking-tighter mb-0.5 md:mb-1">2025 Wrapped</h1>
          <p className="font-space text-zinc-500 text-[10px] md:text-sm tracking-wider uppercase">{data.address.slice(0, 4)}...{data.address.slice(-4)}</p>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
           <div className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-white/5 border border-white/10">
             <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[8px] md:text-xs font-space text-zinc-400">ON-CHAIN</span>
           </div>
        </div>
      </div>

      {/* Content Container - Switched to Flex for better height control */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col gap-2 md:gap-4 pb-16 md:pb-20">
        
        {/* Total Volume - Takes natural height */}
        <div className="w-full bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden group flex-shrink-0">
          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2 text-purple-300">
               <TrendingUp className="w-4 h-4" />
               <span className="text-xs font-space uppercase tracking-wider">Total Volume</span>
             </div>
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
               <p className={`${totalVolumeUsd.toLocaleString().length > 12 ? "text-4xl md:text-2xl" : totalVolumeUsd.toLocaleString().length > 8 ? "text-3xl md:text-3xl" : "text-4xl md:text-4xl"} font-bold tracking-tighter text-white whitespace-nowrap`}>
                 ${totalVolumeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
               </p>
               <div className="md:text-right">
                 <p className="text-2xl font-bold text-white/80">{formatTransactionCount(data.transactionCount)}</p>
                 <p className="text-xs font-space uppercase tracking-wider text-zinc-500">Transactions</p>
               </div>
             </div>
          </div>
        </div>

        {/* 2x2 Grid for the rest - Fills remaining space */}
        <div className="flex-1 grid grid-cols-2 gap-2 md:gap-4 min-h-0">
            {/* Top Asset */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-between">
               <div className="flex items-center gap-2 text-zinc-400 mb-2">
                 <Coins className="w-4 h-4" />
                 <span className="text-xs font-space uppercase tracking-wider">Top Asset</span>
               </div>
               <div>
                 <p className="text-3xl font-bold text-white mb-1">{data.topAsset.symbol}</p>
                 <p className="text-sm text-zinc-500 font-space">${data.topAsset.valueUsd.toLocaleString()} Value</p>
               </div>
            </div>

            {/* Global Rank */}
            {/* Global Rank - SWISS MINIMALIST UI */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
               {/* Technical Grid Background */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
               
               <div className="relative z-10 flex flex-col h-full justify-between">
                 <div className="flex items-center justify-between">
                   <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Global Rank</span>
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 </div>
                 
                  <div>
                     <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-300 tracking-tighter origin-left scale-y-[1.5]">
                       {percentile}%
                     </p>
                     <div className="mt-3 flex items-center gap-2">
                        <div className="h-px w-8 bg-zinc-700" />
                        <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">{label}</p>
                     </div>
                  </div>
                </div>
             </div>

             {/* Net Flow */}
             <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5">
               <div className="flex items-center gap-2 text-zinc-400 mb-4">
                 <ArrowRightLeft className="w-4 h-4" />
                 <span className="text-xs font-space uppercase tracking-wider">Net Flow</span>
               </div>
               <div className="space-y-3">
                 <div className="flex justify-between items-center">
                   <span className="text-xs text-zinc-500">In</span>
                   <span className="text-sm font-bold text-green-400">+${data.totalInflowUsd?.toLocaleString() ?? "0"}</span>
                 </div>
                 <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500/50 w-[70%]" />
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-xs text-zinc-500">Out</span>
                   <span className="text-sm font-bold text-red-400">-${data.totalOutflowUsd?.toLocaleString() ?? "0"}</span>
                 </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-red-500/50 w-[40%]" />
                 </div>
               </div>
            </div>

            {/* Personality */}
            <div className="bg-gradient-to-br from-pink-900/40 to-black border border-pink-500/20 rounded-3xl p-5 flex flex-col justify-center items-center text-center">
                <Sparkles className="w-6 h-6 text-pink-400 mb-2" />
                <p className="text-lg font-bold text-white">{data.personality}</p>
                <p className="text-[10px] text-pink-400/60 uppercase tracking-widest mt-1">Vibe Check</p>
            </div>
        </div>
      </div>


      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-0 right-0 z-50 flex justify-center gap-4 no-capture"
        data-html2canvas-ignore
      >
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all font-space text-sm uppercase tracking-wide disabled:opacity-50 shadow-lg shadow-white/10"
        >
          {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          <span className="hidden md:inline">Share</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-space text-sm uppercase tracking-wide disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden md:inline">Save</span>
        </button>
      </motion.div>


      {/* Watermark - Only visible during capture */}
      {(isSharing || isDownloading) && (
        <div className="absolute bottom-4 right-4 z-[100] font-bold text-white/40 text-sm tracking-wider font-space pointer-events-none">
          blockwrap.xyz
        </div>
      )}
    </div>
  );
}

export function WalletRankSlide({ data }: SlideProps) {
  const { percentile, label } = data.walletRank || { percentile: 50, label: "Solana Plankton" };
  
  const slideRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!slideRef.current) return;

    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const isMobile = window.innerWidth < 768;
      const blob = await toBlob(slideRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#09090b",
        filter: (node) => !node.classList?.contains("no-capture"),
        width: isMobile ? slideRef.current.clientWidth : undefined,
        style: isMobile ? { 
          height: 'auto',
          minHeight: '850px',
          width: '100%',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '3rem',
          paddingBottom: '3rem'
        } : undefined,
      });

      if (!blob) throw new Error("Failed to generate image blob");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `global-rank-${data.address.slice(0, 4)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!slideRef.current) return;

    setIsSharing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const isMobile = window.innerWidth < 768;
      const blob = await toBlob(slideRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#09090b",
        filter: (node) => !node.classList?.contains("no-capture"),
        width: isMobile ? slideRef.current.clientWidth : undefined,
        style: isMobile ? { 
          height: 'auto',
          minHeight: '850px',
          width: '100%',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '3rem',
          paddingBottom: '3rem'
        } : undefined,
      });

      if (!blob) throw new Error("Failed to generate image blob");

      const file = new File([blob], "rank.png", { type: "image/png" });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Global Rank",
          text: `I'm in the Top ${percentile}% of Solana holders! #BlockWrap`,
          files: [file],
        });
      } else {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]); 
        alert("Image copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div ref={slideRef} className="h-full w-full flex flex-col bg-zinc-950 relative overflow-hidden font-syne justify-center">
      {/* Swiss Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Decorative Technical Lines */}
      {/* <div className="absolute top-8 left-8 w-64 h-px bg-zinc-800" />
      <div className="absolute top-8 left-8 w-px h-64 bg-zinc-800" /> */}
      <div className="absolute bottom-8 right-8 w-64 h-px bg-zinc-800" />
      <div className="absolute bottom-8 right-8 w-px h-64 bg-zinc-800" />

      <div className="relative z-10 w-full flex flex-col items-center justify-center p-8">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="w-full max-w-4xl"
        >
            <div className="border-b border-zinc-800 pb-8 mb-8">
              <div className="flex flex-col md:flex-row items-baseline gap-4 md:gap-8">
                <h1 className="text-[4rem] md:text-[4rem] leading- font-black  text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-300 origin-bottom scale-y-[1.35]">
                    {percentile}%
                </h1>
    
                <div className="flex flex-col">
                    <span className="text-lg md:text-xl font-bold text-zinc-300">TOP</span>
                    <span className="text-xs md:text-sm text-zinc-500 font-mono uppercase tracking-widest">Global Percentile</span>
                </div>
              </div>

              <div className="mt-6 block">
                  <p className="text-xs md:text-sm text-zinc-500 font-mono uppercase tracking-widest">You ranked top {percentile}% in the solana holders global percentage</p>
              </div>
            </div>

            
            

            <div className="mt-12 space-y-8">
                <div>
                   <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">Rank Designation</p>
                   <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">{label}</p>
                </div>
                <div className="flex flex-col">
                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - percentile}%` }}
                          transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                          className="h-full bg-white" 
                        />
                    </div>
                    <div className="flex justify-between mt-2 font-mono text-[10px] text-zinc-600 uppercase">
                        <span></span>
                        <span>Top {percentile}%</span>
                    </div>
                </div>
            </div>
        </motion.div>
        {/* Spacer for Action Bar - hidden during capture */}
        <div className="h-24 hidden md:block no-capture w-full flex-shrink-0" />
      </div>

      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 left-0 right-0 z-50 flex justify-center gap-4 no-capture"
        data-html2canvas-ignore
      >
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all font-space text-sm uppercase tracking-wide disabled:opacity-50 shadow-lg shadow-white/10"
        >
          {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          <span className="hidden md:inline">Share</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-space text-sm uppercase tracking-wide disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden md:inline">Save</span>
        </button>
      </motion.div>

       {/* Watermark - Only visible during capture */}
       {(isSharing || isDownloading) && (
        <div className="absolute bottom-4 right-4 z-[100] font-bold text-white/40 text-sm tracking-wider font-space pointer-events-none">
          blockwrap.xyz
        </div>
      )}
    </div>
  );
}