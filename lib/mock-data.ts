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

export interface WalletData {
    address: string;
    totalVolume: number;
    totalInflow: number;
    totalInflowUsd?: number; // Added
    totalOutflow: number;
    totalOutflowUsd?: number; // Added
    transactionCount: number;
    topAsset: {
        symbol: string;
        amount: number;
        valueUsd: number;
    };
    activity: number[] | { name: string; total: number }[]; // Monthly (number[]) or Daily (object[])
    monthChange?: number; // Transactions in the last 30 days
    volumeChangePercentage?: number; // % change in volume vs previous 30 days
    personality: "The HODLer" | "The Degen" | "The Trader" | "The NFT Collector";
    transactions: Transaction[];
    allTransactions?: Transaction[]; // For filtering
    solPrice?: number; // For dynamic USD calculation
}

export const getMockData = (address: string): WalletData => {
    // Deterministic mock data based on address length or char codes to make it feel "real"
    const seed = address.length;

    return {
        address,
        totalVolume: 142069.42,
        totalInflow: 80000.00,
        totalOutflow: 62069.42,
        transactionCount: 1337,
        monthChange: 180,
        volumeChangePercentage: 20.1,
        topAsset: {
            symbol: "ETH",
            amount: 42.5,
            valueUsd: 85000,
        },
        activity: [10, 25, 40, 30, 60, 80, 45, 90, 100, 75, 50, 120],
        personality: "The Degen",
        transactions: [
            { hash: "0x123...", type: "in", amount: 1.5, currency: "ETH", date: "2024-12-01" },
            { hash: "0x456...", type: "out", amount: 0.5, currency: "ETH", date: "2024-11-28" },
            { hash: "0x789...", type: "in", amount: 500, currency: "USDC", date: "2024-11-25" },
        ]
    };
};
