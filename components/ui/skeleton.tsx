"use client";

import { cn } from "@/lib/utils";


interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/10",
        className
      )}
      {...props}
    />
  );
}

// Card skeleton for dashboard stats
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
      <div className="flex items-end gap-2 h-[300px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1 rounded-t-md" 
            style={{ height: `${(i % 5 + 1) * 15 + 20}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Transaction list skeleton
export function TransactionSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Full dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Ticker skeleton */}
      <div className="w-full bg-black/40 border-b border-white/10 py-3 px-4">
        <div className="flex gap-8 justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-8 pt-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>

        {/* Chart and transactions skeleton */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <ChartSkeleton />
          </div>
          <div className="lg:col-span-3">
            <TransactionSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap loading animation
export function WrapLoadingSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background Grid Effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />
      
      <div className="flex flex-col items-center max-w-sm mx-auto px-4 relative z-10">
        {/* Radar Scanner Animation */}
        <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
          {/* Outer Dashed Ring - Slow Rotation */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30 animate-[spin_10s_linear_infinite]" />
          
          {/* Middle Ring - Reverse Rotation */}
          <div className="absolute inset-4 rounded-full border border-emerald-500/50 animate-[spin_3s_linear_infinite_reverse]" />
          
          {/* Inner Ring - Pulse */}
          <div className="absolute inset-12 rounded-full border-2 border-emerald-400 opacity-50 animate-pulse" />
          
          {/* Radar Sweep - Clockwise Scan */}
          <div className="absolute inset-2 rounded-full overflow-hidden animate-[spin_2s_linear_infinite]">
            <div className="w-1/2 h-full bg-gradient-to-l from-emerald-500/20 to-transparent blur-sm absolute right-0" />
            <div className="w-full h-1 bg-emerald-400 absolute top-1/2 -translate-y-1/2 shadow-[0_0_10px_#34d399]" />
          </div>

          {/* Center Target */}
          <div className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399] animate-ping" />
          
          {/* Decorative Crosshairs */}
          <div className="absolute top-0 bottom-0 w-px bg-emerald-500/20" />
          <div className="absolute left-0 right-0 h-px bg-emerald-500/20" />
        </div>

        {/* Loading text with typewriter effect vibe */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-mono font-bold text-emerald-400 tracking-widest uppercase">
            Initialising Scan
          </h2>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
          </div>
        </div>
        
        {/* Progress steps (Terminal style) */}
        <div className="mt-8 space-y-2 w-64 font-mono text-xs">
          <LoadingStep text="> Accessing blockchain data..." delay={0} />
          <LoadingStep text="> Analyzing wallet activity..." delay={800} />
          <LoadingStep text="> Identifying patterns..." delay={1600} />
          <LoadingStep text="> Generating report..." delay={2400} />
        </div>
      </div>
    </div>
  );
}

function LoadingStep({ text, delay }: { text: string; delay: number }) {
  return (
    <div 
      className="flex items-center gap-3 text-emerald-500/60 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-emerald-500">{text}</span>
    </div>
  );
}