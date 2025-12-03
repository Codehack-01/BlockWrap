"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export function CryptoTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h"
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch prices");
        }
        
        const data = await response.json();
        setPrices(data);
        setError(null);
      } catch (err) {
        setError("Unable to load prices");
        console.error("Error fetching crypto prices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-black/40 backdrop-blur-sm border-b border-white/10 py-3 px-4 overflow-hidden">
        <div className="flex items-center justify-center">
          <span className="text-sm text-white/50">Loading prices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-black/40 backdrop-blur-sm border-b border-white/10 py-3 px-4 overflow-hidden">
        <div className="flex items-center justify-center">
          <span className="text-sm text-white/50">{error}</span>
        </div>
      </div>
    );
  }

  const TickerContent = () => (
    <div className="flex items-center">
      {prices.map((crypto, index) => (
        <div 
          key={crypto.id} 
          className="flex items-center gap-2 shrink-0 px-4"
        >
          {/* Rank */}
          <span className="text-xs font-bold text-white/40">
            {index + 1}
          </span>
          
          {/* Symbol */}
          <span className="text-sm font-semibold text-white uppercase">
            {crypto.symbol}
          </span>
          
          {/* Price */}
          <span className="text-sm text-white/80">
            {formatPrice(crypto.current_price)}
          </span>
          
          {/* 24h Change */}
          <div className={`flex items-center gap-0.5 text-xs font-medium ${
            crypto.price_change_percentage_24h >= 0 
              ? "text-green-400" 
              : "text-red-400"
          }`}>
            {crypto.price_change_percentage_24h >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>
              {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>

          {/* Separator */}
          <span className="text-white/20 ml-2">|</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-black/40 backdrop-blur-sm border-b border-white/10 py-3 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          <TickerContent />
          <TickerContent />
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          overflow: hidden;
          width: 100%;
        }
        .marquee-content {
          display: flex;
          gap: 0;
          width: fit-content;
          animation: scroll 30s linear infinite;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}