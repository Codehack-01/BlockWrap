"use client";

import { useState, useRef } from "react";
import { WalletData } from "@/lib/mock-data";
import { Wallet, Sparkles, Copy, Check, Download, Loader2, Share2 } from "lucide-react";

interface WrapCardProps {
  data: WalletData;
}

export function WrapCard({ data }: WrapCardProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Share URL is just the main site - no wallet address exposed
  const shareUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : '';

  const shareText = `🚀 My 2025 Solana Wrapped is here!

💰 Volume: $${data.totalVolume.toLocaleString()}
📈 Inflow: +$${data.totalInflowUsd?.toLocaleString() ?? 0}
📉 Outflow: -$${data.totalOutflowUsd?.toLocaleString() ?? 0}
🏆 Top Asset: ${data.topAsset.symbol}
✨ Personality: ${data.personality}

Get yours at BlockWrap! 👇
${shareUrl}`;

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      // Clone the element to avoid modifying the original
      const clone = cardRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);
      
      const canvas = await html2canvas(clone, {
        backgroundColor: '#1a1025',
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Fix any color issues in the cloned document
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const style = window.getComputedStyle(el as Element);
            const element = el as HTMLElement;
            // Replace any problematic colors with fallbacks
            if (style.color.includes('oklab') || style.color.includes('oklch')) {
              element.style.color = '#ffffff';
            }
            if (style.backgroundColor.includes('oklab') || style.backgroundColor.includes('oklch')) {
              element.style.backgroundColor = 'transparent';
            }
          });
        }
      });
      
      document.body.removeChild(clone);
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (err) {
      console.error('Failed to generate image:', err);
      return null;
    }
  };

  // Share with image using Web Share API
  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) {
        console.error('Failed to generate image');
        setIsGenerating(false);
        return;
      }

      const file = new File([blob], 'blockwrap-2025.png', { type: 'image/png' });
      const shareData = { 
        files: [file], 
        title: 'My 2025 Solana Wrapped', 
        text: shareText 
      };

      // Check if Web Share API with files is supported
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.share) {
        // Fallback to text-only share
        await navigator.share({ 
          title: 'My 2025 Solana Wrapped', 
          text: shareText, 
          url: shareUrl 
        });
      } else {
        // Final fallback - just download the image
        handleDownload();
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateImage();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blockwrap-${data.address.slice(0, 8)}-2025.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } finally {
      setIsGenerating(false);
    }
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
    <div className="w-full max-w-sm mx-auto">
      {/* Summary Card - Uses inline styles for html2canvas compatibility */}
      <div 
        ref={cardRef}
        style={{
          background: 'linear-gradient(135deg, #2d1b4e 0%, #1a1025 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '24px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '128px',
          height: '128px',
          background: 'rgba(168, 85, 247, 0.2)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '96px',
          height: '96px',
          background: 'rgba(59, 130, 246, 0.2)',
          borderRadius: '50%',
          filter: 'blur(30px)',
        }} />
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <Wallet style={{ height: '20px', width: '20px', color: '#a855f7' }} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                {data.address.slice(0, 4)}...{data.address.slice(-4)}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '9999px' }}>
              2025
            </span>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Volume</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>${data.totalVolume.toLocaleString()}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Transactions</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>{data.transactionCount}</p>
            </div>
            <div style={{ background: 'rgba(34,197,94,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'rgba(74,222,128,0.7)', marginBottom: '4px' }}>Inflow</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#4ade80' }}>+${data.totalInflowUsd?.toLocaleString() ?? "0"}</p>
              <p style={{ fontSize: '12px', color: 'rgba(74,222,128,0.5)' }}>{data.totalInflow?.toLocaleString() ?? 0} SOL</p>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'rgba(248,113,113,0.7)', marginBottom: '4px' }}>Outflow</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#f87171' }}>-${data.totalOutflowUsd?.toLocaleString() ?? "0"}</p>
              <p style={{ fontSize: '12px', color: 'rgba(248,113,113,0.5)' }}>{data.totalOutflow?.toLocaleString() ?? 0} SOL</p>
            </div>
          </div>

          {/* Personality Badge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            background: 'linear-gradient(90deg, rgba(168,85,247,0.2) 0%, rgba(236,72,153,0.2) 100%)', 
            borderRadius: '12px', 
            padding: '12px', 
            border: '1px solid rgba(168,85,247,0.3)' 
          }}>
            <Sparkles style={{ height: '20px', width: '20px', color: '#a855f7' }} />
            <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{data.personality}</span>
          </div>

          {/* Branding */}
          <div style={{ 
            marginTop: '16px', 
            paddingTop: '16px', 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px' 
          }}>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: 900, 
              background: 'linear-gradient(90deg, #a855f7, #ec4899)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              BlockWrap
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>blockwrap.xyz</span>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="space-y-3">
        {/* Primary: Share with Image */}
        <button
          onClick={handleShare}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isGenerating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Share2 className="h-5 w-5" />
          )}
          <span>{isGenerating ? 'Generating...' : 'Share'}</span>
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}