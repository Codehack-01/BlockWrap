"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StoryContainer } from "@/components/wrapped/story-container";
import { IntroSlide, VolumeSlide, TopAssetSlide, PersonalitySlide, InflowOutflowSlide, ShareSlide } from "@/components/wrapped/slides";
import { getMockData, WalletData } from "@/lib/mock-data";
import { fetchWalletData } from "@/app/actions";

function WrapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const address = searchParams.get("address");
  const [data, setData] = useState<WalletData | null>(null);
  const [error, setError] = useState(false);

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
        // Fallback to mock data for demo purposes if API fails
        setData(getMockData(address));
      }
    };

    loadData();
  }, [address, router]);

  if (error) return <div>Failed to load data</div>;

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-lg font-medium">Analyzing Blockchain Data...</p>
        </div>
      </div>
    );
  }

  const slides = [
    <IntroSlide key="intro" data={data} />,
    <VolumeSlide key="volume" data={data} />,
    <InflowOutflowSlide key="inflow" data={data} />,
    <TopAssetSlide key="asset" data={data} />,
    <PersonalitySlide key="personality" data={data} />,
    <ShareSlide key="share" data={data} />,
  ];

  return (
    <main className="min-h-screen bg-black">
      <StoryContainer 
        slides={slides} 
        onComplete={() => router.push(`/dashboard?address=${address}`)} 
      />
    </main>
  );
}

export default function WrapPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black text-white">Loading...</div>}>
      <WrapContent />
    </Suspense>
  );
}