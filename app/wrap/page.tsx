"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StoryContainer } from "@/components/wrapped/story-container";
import { 
  IntroSlide, 
  VolumeSlide, 
  TopAssetSlide, 
  TopAssetsSlide,
  TopWalletsSlide,
  PersonalitySlide, 
  InflowOutflowSlide, 
  MostActiveDaySlide,
  BiggestTransactionSlide,
  WalletRankSlide,
  ShareSlide 
} from "@/components/wrapped/slides";
import { GrainOverlay } from "@/components/wrapped/grain-overlay";
import { getMockData, WalletData } from "@/lib/mock-data";
import { fetchWalletData } from "@/app/actions";
import { WrapLoadingSkeleton } from "@/components/ui/skeleton";

function WrapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const address = searchParams.get("address");
  const [data, setData] = useState<WalletData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      router.push("/");
      return;
    }

    const loadData = async () => {
      try {
        const walletData = await fetchWalletData(address);
        setData(walletData);
      } catch (err: unknown) {
        if (err instanceof Error && err.message === "INVALID_WALLET_ADDRESS") {
          setError("INVALID_WALLET_ADDRESS");
        } else {
          console.error("API Error, falling back to mock:", err);
          setData(getMockData(address));
        }
      }
    };

    loadData();
  }, [address, router]);

  if (error === "INVALID_WALLET_ADDRESS") {
    return (
      <div className="h-screen w-full bg-black text-white flex items-center justify-center font-syne relative overflow-hidden">
        <GrainOverlay />
        <div className="z-10 text-center space-y-6 max-w-md px-4">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-10 h-10 text-red-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Invalid Wallet</h1>
            <p className="text-white/60">
              The address you entered doesn&apos;t look like a Solana wallet. Please check and try again.
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <WrapLoadingSkeleton />;
  }

  const slides = [
    <IntroSlide key="intro" data={data} />,
    <VolumeSlide key="volume" data={data} />,
    <InflowOutflowSlide key="inflow" data={data} />,
    <TopAssetSlide key="asset" data={data} />,
    <TopAssetsSlide key="top-assets" data={data} />,
    <TopWalletsSlide key="top-wallets" data={data} />,
    <MostActiveDaySlide key="active-day" data={data} />,
    <BiggestTransactionSlide key="biggest-tx" data={data} />,
    <WalletRankSlide key="rank" data={data} />,
    <PersonalitySlide key="personality" data={data} />,
    <ShareSlide key="share" data={data} />,
  ];

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-black text-white overflow-hidden overscroll-none touch-none font-syne">
      <GrainOverlay />
      <StoryContainer
        slides={slides}
        onComplete={() => router.push(`/dashboard?address=${address}`)}
      />
    </div>
  );
}

export default function WrapPage() {
  return (
    <Suspense fallback={<WrapLoadingSkeleton />}>
      <WrapContent />
    </Suspense>
  );
}