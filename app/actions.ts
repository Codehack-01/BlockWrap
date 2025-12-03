"use server";

import { getHeliusData } from "@/lib/helius";
import { WalletData } from "@/lib/mock-data";

export async function fetchWalletData(address: string): Promise<WalletData> {
    try {
        const data = await getHeliusData(address);
        return data;
    } catch (error) {
        console.error("Failed to fetch Helius data:", error);
        throw new Error("Failed to fetch wallet data");
    }
}
