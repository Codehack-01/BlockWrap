import { WalletData, Transaction } from "./mock-data";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

interface HeliusResponse {
    result: {
        items: HeliusAsset[];
        nativeBalance: {
            lamports: number;
            price_per_sol: number;
            total_price: number;
        };
    };
    error?: {
        message: string;
    };
}

interface HeliusAsset {
    id: string;
    content: {
        metadata: {
            name: string;
            symbol: string;
        };
    };
    token_info: {
        balance: number;
        decimals: number;
        price_info?: {
            price_per_token: number;
            total_price: number;
        };
    };
}

interface HeliusTransaction {
    signature: string;
    timestamp: number;
    type: string;
    fee: number;
    nativeTransfers: {
        fromUserAccount: string;
        toUserAccount: string;
        amount: number;
    }[];
    tokenTransfers: {
        fromUserAccount: string;
        toUserAccount: string;
        mint: string;
        tokenAmount: number;
    }[];
}

export async function getHeliusData(address: string): Promise<WalletData> {
    if (!HELIUS_API_KEY) {
        throw new Error("HELIUS_API_KEY is not defined");
    }

    // 1. Fetch Assets (Balances)
    const assetsResponse = await fetch(RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "get-assets",
            method: "getAssetsByOwner",
            params: {
                ownerAddress: address,
                page: 1,
                limit: 100,
                displayOptions: {
                    showFungible: true,
                    showNativeBalance: true,
                },
            },
        }),
    });



    const assetsJson = await assetsResponse.json();

    if (assetsJson.error) {
        console.error("Helius API Error:", assetsJson.error);
        throw new Error(assetsJson.error.message);
    }

    const assets: HeliusAsset[] = assetsJson.result?.items || [];


    // Find top asset by value
    let topAsset = { symbol: "SOL", amount: 0, valueUsd: 0 };

    // Handle Native SOL Balance
    if (assetsJson.result?.nativeBalance) {
        const nativeBalance = assetsJson.result.nativeBalance;
        const solAmount = nativeBalance.lamports / 1e9;
        const solValue = nativeBalance.total_price || 0;

        // Set SOL as initial top asset
        topAsset = {
            symbol: "SOL",
            amount: solAmount,
            valueUsd: solValue
        };
    }

    assets.forEach((asset) => {
        // Skip if no token info (e.g. some NFTs or compressed assets)
        if (!asset.token_info) return;

        // Calculate amount (balance / 10^decimals)
        const decimals = asset.token_info.decimals || 0;
        const amount = asset.token_info.balance / Math.pow(10, decimals);
        const value = asset.token_info.price_info?.total_price || 0;
        const symbol = asset.content.metadata.symbol || "Unknown";

        // Logic: Strictly prioritize USD Value.
        // If we have price data, use it.
        if (value > topAsset.valueUsd) {
            topAsset = { symbol, amount, valueUsd: value };
        }
        // If both have 0 USD value (or very low), prefer non-SOL tokens just for variety, 
        // but ONLY if the current top asset is effectively worthless (< $10).
        // This ensures that if you have $600 SOL, it shows SOL. But if you have $4 SOL and a meme coin, it shows the meme coin.
        else if (topAsset.valueUsd < 10 && value === 0 && symbol !== "SOL" && topAsset.symbol === "SOL") {
            topAsset = { symbol, amount, valueUsd: value };
        }
    });

    // Create a map of Mint -> Symbol for quick lookup
    const mintToSymbol = new Map<string, string>();
    assets.forEach(asset => {
        if (asset.id && asset.content.metadata.symbol) {
            mintToSymbol.set(asset.id, asset.content.metadata.symbol);
        }
    });

    // 2. Fetch Signatures for accurate count (up to 1000)
    const signaturesResponse = await fetch(RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "get-signatures",
            method: "getSignaturesForAddress",
            params: [
                address,
                { limit: 1000 }
            ],
        }),
    });
    const signaturesJson = await signaturesResponse.json();
    const signatures = signaturesJson.result || [];
    const transactionCount = signatures.length;

    // Calculate Month Change (Transactions in last 30 days)
    const thirtyDaysAgo = Date.now() / 1000 - 30 * 24 * 60 * 60;
    const monthChange = signatures.filter((sig: any) => sig.blockTime > thirtyDaysAgo).length;

    // 3. Fetch Transaction History (Enhanced Transactions API)
    // We want to fetch details for as many 2025 transactions as possible (up to the 1000 signatures we have)
    // to ensure "All Time" (YTD) stats are accurate.

    const startOf2025 = new Date("2025-01-01T00:00:00Z").getTime() / 1000;
    const signatures2025 = signatures.filter((s: any) => s.blockTime >= startOf2025).map((s: any) => s.signature);

    let history: HeliusTransaction[] = [];

    // Batch fetch details (chunk size 100)
    const chunkSize = 100;
    const batches = [];
    for (let i = 0; i < signatures2025.length; i += chunkSize) {
        batches.push(signatures2025.slice(i, i + chunkSize));
    }

    // Process batches in parallel (limit concurrency if needed, but 10 requests is fine)
    const results = await Promise.all(batches.map(async (batch) => {
        try {
            const response = await fetch(`https://api.helius.xyz/v0/transactions?api-key=${HELIUS_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactions: batch }),
            });
            return await response.json();
        } catch (e) {
            console.error("Failed to fetch batch", e);
            return [];
        }
    }));

    // Flatten results
    history = results.flat();

    // STRICT 2025 FILTER:
    // We removed the fallback here. If there are no 2025 transactions, history should be empty.
    // This ensures we don't accidentally show 2024 data as "2025 Inflow".

    // [NEW] Enrich Mint Map with historical tokens
    // Collect all mints from history that we don't know yet
    const missingMints = new Set<string>();
    history.forEach(tx => {
        tx.tokenTransfers?.forEach(t => {
            if (t.mint && !mintToSymbol.has(t.mint)) {
                missingMints.add(t.mint);
            }
        });
    });

    // Batch fetch metadata for missing mints (chunk size 100)
    const missingMintsArray = Array.from(missingMints);
    if (missingMintsArray.length > 0) {
        const assetBatches = [];
        for (let i = 0; i < missingMintsArray.length; i += 100) {
            assetBatches.push(missingMintsArray.slice(i, i + 100));
        }

        await Promise.all(assetBatches.map(async (batch) => {
            try {
                const response = await fetch(RPC_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        id: "get-asset-batch",
                        method: "getAssetBatch",
                        params: {
                            ids: batch
                        },
                    }),
                });
                const json = await response.json();
                if (json.result) {
                    json.result.forEach((asset: any) => {
                        if (asset?.content?.metadata?.symbol) {
                            mintToSymbol.set(asset.id, asset.content.metadata.symbol);
                        }
                    });
                }
            } catch (e) {
                console.error("Failed to fetch asset batch", e);
            }
        }));
    }

    // Process Transactions
    let totalVolume = 0;
    let totalInflow = 0;
    let totalOutflow = 0;
    let currentMonthVolume = 0;
    let prevMonthVolume = 0;
    const now = Date.now() / 1000;
    const thirtyDays = 30 * 24 * 60 * 60;

    const activity = new Array(12).fill(0);
    const transactions: Transaction[] = [];

    history.forEach((tx) => {
        const date = new Date(tx.timestamp * 1000);
        const month = date.getMonth();
        activity[month]++;

        // Calculate Volume (simplified: sum of all native transfers involving the user)
        let txAmount = 0;
        let type: "in" | "out" = "out";

        // Check native transfers
        let counterparty = "";
        tx.nativeTransfers?.forEach(transfer => {
            const amount = transfer.amount / 1e9; // Lamports to SOL
            if (transfer.fromUserAccount === address || transfer.toUserAccount === address) {
                if (transfer.fromUserAccount === address) {
                    txAmount += amount; // Accumulate
                    type = "out";
                    totalOutflow += amount;
                    counterparty = transfer.toUserAccount || "";
                } else {
                    txAmount += amount; // Accumulate
                    type = "in";
                    totalInflow += amount;
                    counterparty = transfer.fromUserAccount || "";
                }

                totalVolume += amount;

                // Bucket into time periods
                const timeDiff = now - tx.timestamp;
                if (timeDiff <= thirtyDays) {
                    currentMonthVolume += amount;
                } else if (timeDiff <= thirtyDays * 2) {
                    prevMonthVolume += amount;
                }
            }
        });

        // Check token transfers if no native transfer found (or if it's a token swap/transfer)
        // Note: This is simplified. Complex txs might have both. We prioritize native SOL for volume, 
        // but for the "Recent Transactions" list, we want to show what happened.
        let currency = "SOL";
        if (txAmount === 0 && tx.tokenTransfers && tx.tokenTransfers.length > 0) {
            // Find the first transfer involving the user
            const transfer = tx.tokenTransfers.find(t => t.fromUserAccount === address || t.toUserAccount === address);
            if (transfer) {
                txAmount = transfer.tokenAmount;
                // Try to resolve symbol from our assets map
                const resolvedSymbol = mintToSymbol.get(transfer.mint);
                currency = resolvedSymbol || "Token";

                if (transfer.fromUserAccount === address) {
                    type = "out";
                    counterparty = transfer.toUserAccount || "";
                } else {
                    type = "in";
                    counterparty = transfer.fromUserAccount || "";
                }
            }
        }

        // Add to recent transactions list (limit to 10)
        // Show even small amounts, but format them nicely in UI. 
        // If amount is 0, it might be a failed tx or interaction without transfer, skip those for the list.
        if (txAmount > 0) {
            const formattedTx = {
                hash: tx.signature,
                type,
                amount: txAmount, // Pass raw amount, let UI handle formatting
                currency: currency,
                date: date.toLocaleDateString(),
                timestamp: tx.timestamp, // Add timestamp for easier filtering
                from: type === "in" ? counterparty : address,
                to: type === "out" ? counterparty : address,
            };

            // Add to full list
            transactions.push(formattedTx);
        }
    });

    // Sort transactions by date (newest first)
    transactions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // Determine Personality
    let personality: WalletData["personality"] = "The HODLer";
    if (history.length > 100) personality = "The Trader";
    if (history.some(tx => tx.type === "NFT_SALE" || tx.type === "NFT_BID")) personality = "The NFT Collector";
    if (history.length > 500) personality = "The Degen";

    // Calculate Percentage Change
    let volumeChangePercentage = 0;
    if (prevMonthVolume > 0) {
        volumeChangePercentage = ((currentMonthVolume - prevMonthVolume) / prevMonthVolume) * 100;
    } else if (currentMonthVolume > 0) {
        volumeChangePercentage = 100; // 100% increase if previous was 0
    }

    // Calculate USD values
    // We already fetched the native balance which includes price_per_sol
    const solPrice = assetsJson.result?.nativeBalance?.price_per_sol || 0;
    const totalInflowUsd = totalInflow * solPrice;
    const totalOutflowUsd = totalOutflow * solPrice;

    return {
        address,
        totalVolume: parseFloat(totalVolume.toFixed(2)),
        totalInflow: parseFloat(totalInflow.toFixed(2)),
        totalInflowUsd: parseFloat(totalInflowUsd.toFixed(2)),
        totalOutflow: parseFloat(totalOutflow.toFixed(2)),
        totalOutflowUsd: parseFloat(totalOutflowUsd.toFixed(2)),
        transactionCount: transactionCount,
        monthChange,
        volumeChangePercentage: parseFloat(volumeChangePercentage.toFixed(1)),
        topAsset,
        activity,
        personality,
        transactions: transactions.slice(0, 10), // Keep top 10 for default view
        allTransactions: transactions, // Send all for filtering
        solPrice
    };
}