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
        <div className="flex gap-8">
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
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center max-w-sm mx-auto px-4">
        {/* Animated rings */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" style={{ animationDuration: '2s' }} />
        </div>

        {/* Loading text */}
        <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Analyzing Your Wallet
        </h2>
        
        {/* Progress steps */}
        <div className="space-y-3 w-full mt-4">
          <LoadingStep text="Fetching transactions..." delay={0} />
          <LoadingStep text="Calculating volume..." delay={500} />
          <LoadingStep text="Analyzing patterns..." delay={1000} />
          <LoadingStep text="Generating your wrap..." delay={1500} />
        </div>
      </div>
    </div>
  );
}

function LoadingStep({ text, delay }: { text: string; delay: number }) {
  return (
    <div 
      className="flex items-center gap-3 text-white/60 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
      <span className="text-sm">{text}</span>
    </div>
  );
}