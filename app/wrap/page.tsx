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

  useEffect(() => {
    if (!address) {
      router.push("/");
      return;
    }

    const loadData = async () => {
      try {
        const walletData = await fetchWalletData(address);
        setData(walletData);
      } catch (err) {
        console.error("API Error, falling back to mock:", err);
        setData(getMockData(address));
      }
    };

    loadData();
  }, [address, router]);



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
    <PersonalitySlide key="personality" data={data} />,
    <ShareSlide key="share" data={data} />,
  ];

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden relative font-syne">
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