"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      router.push(`/wrap?address=${address}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="z-10 w-full max-w-md space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4">
            BlockWrap
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Get deep insight on you solana transactions. <br />
            Unwrap your blockchain story.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-card/50 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div className="relative flex items-center">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter SOL address"
                className="pl-10 h-12 bg-background/50 border-white/10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 transition-all text-lg"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
              disabled={!address}
            >
              Get Wrapped <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4 text-lg text-muted-foreground"
        >
          {/* <span>Ethereum</span> */}
          <span>•</span>
          <span>Solana</span>
          <span>•</span>
          {/* <span>Polygon</span> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-3 text-lg text-muted-foreground mt-12"
        >
          <span>Powered by</span>
          <Image
            src="/helius.png"
            alt="Helius"
            width={80}
            height={80}
            className="opacity-70 hover:opacity-100 transition-opacity"
          />
        </motion.div>
      </div>
    </main>
  );
}
