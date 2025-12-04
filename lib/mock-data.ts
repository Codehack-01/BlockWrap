export interface Transaction {
    hash: string;
    type: "in" | "out";
    amount: number;
    currency: string;
    date: string;
    to?: string;
    from?: string;
    timestamp?: number;
}

export interface TopAsset {
    symbol: string;
    amount: number;
    valueUsd: number;
}

export interface TopWallet {
    address: string;
    interactionCount: number;
    totalVolume: number;
    type: "sent" | "received" | "both";
}

export interface WalletData {
    address: string;
    totalVolume: number;
    totalInflow: number;
    totalInflowUsd?: number; // Added
    totalOutflow: number;
    totalOutflowUsd?: number; // Added
    transactionCount: number;
    topAsset: TopAsset;
    topAssets?: TopAsset[]; // Top 5 assets
    topWallets?: TopWallet[]; // Top 5 interacted wallets
    mostActiveDay?: {
        date: string;
        count: number;
    };
    activity: number[] | { name: string; total: number }[]; // Monthly (number[]) or Daily (object[])
    monthChange?: number; // Transactions in the last 30 days
    volumeChangePercentage?: number; // % change in volume vs previous 30 days
    personality: "The HODLer" | "The Degen" | "The Trader" | "The NFT Collector";
    transactions: Transaction[];
    allTransactions?: Transaction[]; // For filtering
    solPrice?: number; // For dynamic USD calculation
    biggestTransaction?: {
        amount: number;
        currency: string;
        to: string;
        date: string;
        usdValue?: number;
    };
}

export const getMockData = (address: string): WalletData => {
    // Deterministic mock data based on address length or char codes to make it feel "real"
    const seed = address.length;

    return {
        address,
        totalVolume: 142069.42,
        totalInflow: 80000.00,
        totalInflowUsd: 12000000,
        totalOutflow: 62069.42,
        totalOutflowUsd: 9310413,
        transactionCount: 1337,
        monthChange: 180,
        volumeChangePercentage: 20.1,
        topAsset: {
            symbol: "SOL",
            amount: 420.69,
            valueUsd: 85000,
        },
        topAssets: [
            { symbol: "SOL", amount: 420.69, valueUsd: 85000 },
            { symbol: "BONK", amount: 50000000, valueUsd: 12500 },
            { symbol: "JUP", amount: 5000, valueUsd: 4500 },
            { symbol: "USDC", amount: 3500, valueUsd: 3500 },
            { symbol: "RAY", amount: 250, valueUsd: 1200 },
        ],
        topWallets: [
            { address: "9WzDX...mK4P", interactionCount: 42, totalVolume: 125.5, type: "both" },
            { address: "Fj3Kx...nR2Q", interactionCount: 28, totalVolume: 89.2, type: "sent" },
            { address: "Hm7Lp...vT8N", interactionCount: 19, totalVolume: 56.8, type: "received" },
            { address: "Bx2Wn...kY5J", interactionCount: 15, totalVolume: 34.1, type: "both" },
            { address: "Qp9Zr...cH3M", interactionCount: 11, totalVolume: 22.7, type: "sent" },
        ],
        activity: [10, 25, 40, 30, 60, 80, 45, 90, 100, 75, 50, 120],
        personality: "The Degen",
        transactions: [
            { hash: "0x123...", type: "in", amount: 1.5, currency: "SOL", date: "2024-12-01" },
            { hash: "0x456...", type: "out", amount: 0.5, currency: "SOL", date: "2024-11-28" },
            { hash: "0x789...", type: "in", amount: 500, currency: "USDC", date: "2024-11-25" },
        ],
        biggestTransaction: {
            amount: 1337.42,
            currency: "SOL",
            to: "8Xy...9z2A",
            date: "2024-08-15",
            usdValue: 250000
        }
    };
};