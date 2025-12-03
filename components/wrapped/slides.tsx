"use client";

import { motion } from "framer-motion";
import { WalletData } from "@/lib/mock-data";
import { Wallet, TrendingUp, Coins, Sparkles, Trophy, User, ArrowRightLeft } from "lucide-react";
import { WrapCard } from "@/components/shared/wrap-card";

interface SlideProps {
  data: WalletData;
}

export function IntroSlide({ data }: SlideProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-black p-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mb-8 p-6 bg-white/10 rounded-full backdrop-blur-lg"
      >
        <Wallet className="h-16 w-16 text-indigo-400" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold mb-4"
      >
        2025 Wrapped
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xl text-white/70"
      >
        Let's see what you did with
        <br />
        <span className="font-mono text-indigo-400">{data.address.slice(0, 6)}...{data.address.slice(-4)}</span>
      </motion.p>
    </div>
  );
}

export function VolumeSlide({ data }: SlideProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-bl from-purple-900 to-black p-8 text-center">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <TrendingUp className="h-20 w-20 text-purple-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-purple-200">Total Volume</h2>
      </motion.div>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          ${data.totalVolume.toLocaleString()}
        </span>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-lg text-white/60"
      >
        That's a lot of gas! ⛽️
      </motion.p>
    </div>
  );
}

export function TopAssetSlide({ data }: SlideProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-900 to-black p-8 text-center">
      <h2 className="text-3xl font-bold mb-12 text-emerald-200">Your Top Asset</h2>
      <motion.div
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full" />
        <Coins className="h-32 w-32 text-emerald-400 relative z-10" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <h3 className="text-5xl font-black text-white">{data.topAsset.symbol}</h3>
        <p className="text-xl text-emerald-300 mt-2">
          {data.topAsset.amount} tokens
        </p>
        <p className="text-sm text-white/50 mt-1">
          Value: ${data.topAsset.valueUsd.toLocaleString()}
        </p>
      </motion.div>
    </div>
  );
}

export function PersonalitySlide({ data }: SlideProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-900 to-black p-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mb-8"
      >
        <Sparkles className="h-24 w-24 text-pink-400 mx-auto" />
      </motion.div>
      <h2 className="text-2xl text-pink-200 mb-4">Your Crypto Personality</h2>
      <motion.div
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="p-8 border-4 border-pink-500/50 rounded-3xl bg-pink-500/10 backdrop-blur-md"
      >
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest">
          {data.personality}
        </h1>
      </motion.div>
    </div>
  );
}

export function InflowOutflowSlide({ data }: SlideProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 rounded-full bg-blue-500/20 p-6"
      >
        <ArrowRightLeft className="h-16 w-16 text-blue-500" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 text-3xl font-bold text-white"
      >
        Money Moves
      </motion.h2>

      <div className="grid w-full gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl bg-green-500/10 p-6 border border-green-500/20"
        >
          <p className="text-sm text-green-400 mb-1">2025 Inflow</p>
          <p className="text-2xl font-bold text-white">+{data.totalInflow?.toLocaleString() ?? 0} SOL</p>
          <p className="text-sm text-green-400/60 mt-1">
            ${data.totalInflowUsd?.toLocaleString() ?? "0.00"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-xl bg-red-500/10 p-6 border border-red-500/20"
        >
          <p className="text-sm text-red-400 mb-1">2025 Outflow</p>
          <p className="text-2xl font-bold text-white">-{data.totalOutflow?.toLocaleString() ?? 0} SOL</p>
          <p className="text-sm text-red-400/60 mt-1">
            ${data.totalOutflowUsd?.toLocaleString() ?? "0.00"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function ShareSlide({ data }: SlideProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-black p-6 text-center overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Share Your Wrap! 🎉</h2>
        <p className="text-white/60 mb-6 text-sm">Show off your 2025 crypto journey</p>
        
        <WrapCard data={data} />
      </motion.div>
    </div>
  );
}