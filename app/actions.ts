"use server";

import { getHeliusData } from "@/lib/helius";
import { WalletData } from "@/lib/mock-data";

// Helper to validate Solana address format
function isValidSolanaAddress(address: string): boolean {
    // Solana addresses are base58 encoded and typically 32-44 characters long
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export async function fetchWalletData(address: string): Promise<WalletData> {
    if (!isValidSolanaAddress(address)) {
        throw new Error("INVALID_WALLET_ADDRESS");
    }

    try {
        const data = await getHeliusData(address);
        return data;
    } catch (error) {
        console.error("Failed to fetch Helius data:", error);
        throw new Error("Failed to fetch wallet data");
    }
}
