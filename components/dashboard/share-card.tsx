"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletData } from "@/lib/mock-data";
import { Share2, Sparkles, Copy, Check, ExternalLink } from "lucide-react";

interface ShareCardProps {
  data: WalletData;
}

export function ShareCard({ data }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/wrap?address=${data.address}` 
    : '';

  const shareText = `🚀 My 2025 Solana Wrapped is here!

💰 Volume: $${data.totalVolume.toLocaleString()}
📈 Inflow: +${data.totalInflow?.toLocaleString() ?? 0} SOL
📉 Outflow: -${data.totalOutflow?.toLocaleString() ?? 0} SOL
🏆 Top Asset: ${data.topAsset.symbol}
✨ Personality: ${data.personality}

Check yours at BlockWrap! 👇`;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Share2 className="h-5 w-5 text-purple-400" />
            </div>
            <CardTitle>Share Your Wrap</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">2025</span>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {/* Mini Preview Card */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-full">
              <Sparkles className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">{data.personality}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {data.address.slice(0, 4)}...{data.address.slice(-4)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Volume</p>
              <p className="font-bold">${data.totalVolume.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Transactions</p>
              <p className="font-bold">{data.transactionCount}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => window.open(`/wrap?address=${data.address}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            View Wrap
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
        </div>

        {/* Social Share Buttons */}
        <div className="flex gap-2">
          <Button
            className="flex-1 gap-2 bg-black hover:bg-zinc-800 text-white"
            onClick={handleTwitterShare}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </Button>
          <Button
            className="flex-1 gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white"
            onClick={handleTelegramShare}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Telegram
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}