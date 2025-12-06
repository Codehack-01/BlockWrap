"use client";

import { motion } from "framer-motion";
import { WalletData } from "@/lib/mock-data";
import { TrendingUp, Coins, Trophy, Users, Sparkles, ArrowRightLeft, ArrowDownLeft, ArrowUpRight, Calendar, Rocket } from "lucide-react";
import { WrapCard } from "@/components/shared/wrap-card";

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
          <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight block mt-[-2rem] ml-2">
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

export function VolumeSlide({ data }: SlideProps) {
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
          <h2 className="font-space text-sm uppercase tracking-widest text-purple-400">Total Volume</h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[7vw] leading-none font-bold tracking-tighter text-white block">
            ${data.totalVolume.toLocaleString()}
          </span>
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
            <p className="font-space text-xl text-purple-400">Whale Activity</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function TopAssetSlide({ data }: SlideProps) {
  return (
    <div className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
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
          
          <h1 className="text-[6rem] leading-[0.8] font-bold tracking-tighter text-white mb-8">
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
    </div>
  );
}

export function TopAssetsSlide({ data }: SlideProps) {
  const topAssets = data.topAssets || [data.topAsset];
  
  return (
    <div className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
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
              key={asset.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group flex items-baseline justify-between py-4 border-b border-zinc-800 hover:border-yellow-500/50 transition-colors duration-500"
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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
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

        <div className="space-y-0">
          {topWallets.map((wallet, index) => (
            <motion.div
              key={wallet.address}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group flex items-center justify-between py-3 border-b border-zinc-800 hover:border-cyan-500/50 transition-colors duration-500"
            >
              <div className="flex items-center gap-6 min-w-0 flex-1">
                <span className="font-space text-sm text-zinc-600">0{index + 1}</span>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-zinc-300 group-hover:text-white transition-colors duration-300 truncate font-mono">
                    {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                  </h3>
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
                  {wallet.totalVolume.toFixed(2)} SOL Vol
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
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-pink-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
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
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.9] tracking-tighter mix-blend-overlay opacity-50 absolute top-2 left-2 select-none">
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

export function InflowOutflowSlide({ data }: SlideProps) {
  return (
    <div className="h-full w-full flex flex-col justify-center relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 flex">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-right pr-8 md:pr-0"
          >
            <div className="flex items-center justify-end gap-3 mb-4">
              <span className="font-space text-sm uppercase tracking-widest text-green-500">Inflow</span>
              <ArrowDownLeft className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-2">
              +{data.totalInflow?.toLocaleString() ?? 0}
            </p>
            <p className="font-space text-xl text-zinc-500">
              ${data.totalInflowUsd?.toLocaleString() ?? "0.00"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-left pl-8 md:pl-0 "
          >
            <div className="flex items-center gap-3 mb-4 ">
              <ArrowUpRight className="h-5 w-5 text-red-500" />
              <span className="font-space text-sm uppercase tracking-widest text-red-500">Outflow</span>
            </div>
            <p className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-2">
              -{data.totalOutflow?.toLocaleString() ?? 0}
            </p>
            <p className="font-space text-xl text-zinc-500">
              ${data.totalOutflowUsd?.toLocaleString() ?? "0.00"}
            </p>
          </motion.div>
        </div>
      </div>
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
  const { amount, currency, to, date, usdValue } = data.biggestTransaction || { amount: 0, currency: "SOL", to: "Unknown", date: "N/A", usdValue: 0 };

  return (
    <div className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
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
          <div className="inline-block border border-zinc-800 bg-zinc-900/50 px-6 py-3 rounded-full backdrop-blur-sm">
            <p className="font-space text-xl text-zinc-300 font-mono">
              {to.length > 10 ? `${to.slice(0, 4)}...${to.slice(-4)}` : to}
            </p>
          </div>
          <p className="font-space text-xs text-zinc-600 mt-4">{date}</p>
        </motion.div>
      </div>
    </div>
  );
}

export function ShareSlide({ data }: SlideProps) {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-8 relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold tracking-tighter text-white mb-4">Share It</h2>
          <p className="font-space text-zinc-500 uppercase tracking-widest text-sm">
            Show off your 2025 on-chain legacy
          </p>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="transform hover:scale-[1.02] transition-transform duration-500"
        >
          <WrapCard data={data} />
        </motion.div>
      </div>
    </div>
  );
}

export function WalletRankSlide({ data }: SlideProps) {
  const { percentile, label } = data.walletRank || { percentile: 50, label: "Solana Plankton" };

  return (
    <div className="h-full w-full flex flex-col justify-center p-8 relative overflow-hidden bg-zinc-950">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Trophy className="h-12 w-12 text-amber-400 mx-auto mb-6" />
          <h2 className="font-space text-sm uppercase tracking-widest text-amber-400 mb-2">Global Ranking</h2>
          <div className="h-px w-24 bg-amber-500/30 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-2xl text-zinc-400 mb-4 font-space">You are in the</p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6">
            Top {percentile}%
          </h1>
          <p className="text-xl text-zinc-500 font-space uppercase tracking-widest">
            of Solana Holders
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 inline-block"
        >
          <div className="px-8 py-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
            <p className="font-space text-sm text-amber-500/70 uppercase tracking-wider mb-2">Rank Title</p>
            <p className="text-3xl font-bold text-amber-400">{label}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}