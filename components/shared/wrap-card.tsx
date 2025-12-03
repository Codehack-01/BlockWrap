"use client";

import { useState, useRef, useEffect } from "react";
import { WalletData } from "@/lib/mock-data";
import { Wallet, Sparkles, Copy, Check, Download, Loader2, Share2 } from "lucide-react";

interface WrapCardProps {
  data: WalletData;
}

export function WrapCard({ data }: WrapCardProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    };
    setIsMobile(checkMobile());
  }, []);

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
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a1025',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
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

  // Native share for mobile - shares image directly
  const handleNativeShare = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) return;

      const file = new File([blob], 'blockwrap-2025.png', { type: 'image/png' });
      const shareData = { files: [file], title: 'My 2025 Solana Wrapped', text: shareText };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.share) {
        await navigator.share({ title: 'My 2025 Solana Wrapped', text: shareText, url: shareUrl });
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error('Share failed:', err);
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

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
        {/* Mobile: Native Share Button */}
        {isMobile && (
          <button
            onClick={handleNativeShare}
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
        )}

        {/* Desktop: Download first, then share */}
        {!isMobile && (
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isGenerating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Download Image'}</span>
          </button>
        )}

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {/* Twitter/X */}
          <button
            onClick={handleTwitterShare}
            className="flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-semibold py-3 px-4 rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>

          {/* Telegram */}
          <button
            onClick={handleTelegramShare}
            className="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-semibold py-3 px-4 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3 px-4 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
        </div>

        {/* Secondary: Download (mobile) / Copy Link */}
        <div className="grid grid-cols-2 gap-3">
          {isMobile && (
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Download className="h-5 w-5" />
              <span>Save</span>
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className={`flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 ${!isMobile ? 'col-span-2' : ''}`}
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