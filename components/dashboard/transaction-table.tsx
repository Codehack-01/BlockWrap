"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Transaction } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
  pageSize?: number;
}

// Helper function to truncate wallet address
const truncateAddress = (address: string | undefined): string => {
  if (!address) return "Unknown";
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export function TransactionTable({ transactions, pageSize = 10 }: TransactionTableProps) {
  const [displayCount, setDisplayCount] = useState(pageSize);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const displayedTransactions = transactions.slice(0, displayCount);
  const hasMore = displayCount < transactions.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    // Simulate fetch delay for smooth UX
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + pageSize, transactions.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, pageSize, transactions.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  // Reset display count when transactions change (e.g., month filter)
  useEffect(() => {
    setDisplayCount(pageSize);
  }, [transactions, pageSize]);

  return (
    <Card className="col-span-3 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <span className="text-sm text-muted-foreground">
          {displayedTransactions.length} of {transactions.length}
        </span>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="h-[400px] overflow-y-auto pr-2 space-y-4"
        >
          {displayedTransactions.map((tx, index) => (
            <div key={index} className="flex items-center py-2">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${tx.type === 'in' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                {tx.type === 'in' ? (
                  <ArrowDownLeft className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="ml-4 space-y-1 min-w-0 flex-1">
                <p className="text-sm font-medium leading-none">
                  {tx.type === 'in' ? 'Received' : 'Sent'} {tx.currency}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {tx.type === 'in' ? 'From: ' : 'To: '}
                  <span className="font-mono">
                    {truncateAddress(tx.type === 'in' ? tx.from : tx.to)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
              <div className={cn("ml-auto font-medium text-right",
                tx.type === "in" ? "text-green-500" : "text-red-500"
              )}>
                {tx.type === "in" ? "+" : "-"}{tx.amount < 0.0001 ? "<0.0001" : tx.amount.toFixed(4)} {tx.currency}
              </div>
            </div>
          ))}
          
          {/* Loader / Load More Trigger */}
          {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-4">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-sm text-muted-foreground">Scroll for more</span>
              )}
            </div>
          )}
          
          {!hasMore && transactions.length > pageSize && (
            <div className="flex justify-center py-4">
              <span className="text-sm text-muted-foreground">All transactions loaded</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}