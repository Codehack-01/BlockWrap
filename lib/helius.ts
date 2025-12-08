import { WalletData, Transaction, TopWallet } from "./mock-data";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

// HeliusResponse interface removed as it is unused

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

interface HeliusSignature {
    signature: string;
    slot: number;
    err: unknown;
    memo: string | null;
    blockTime: number;
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

    const allAssets: { symbol: string; amount: number; valueUsd: number }[] = [];

    // Add SOL if it exists
    if (topAsset.amount > 0) {
        allAssets.push(topAsset);
    }

    assets.forEach((asset) => {
        // Skip if no token info (e.g. some NFTs or compressed assets)
        if (!asset.token_info) return;

        // Calculate amount (balance / 10^decimals)
        const decimals = asset.token_info.decimals || 0;
        const amount = asset.token_info.balance / Math.pow(10, decimals);
        const value = asset.token_info.price_info?.total_price || 0;
        const symbol = asset.content.metadata.symbol || "Unknown";

        // Add to list
        if (amount > 0) {
            allAssets.push({ symbol, amount, valueUsd: value });
        }
    });

    // Sort by USD Value descending
    allAssets.sort((a, b) => b.valueUsd - a.valueUsd);

    // Update topAsset to be the actual top one (if any exist)
    if (allAssets.length > 0) {
        topAsset = allAssets[0];
    }

    // Get Top 5
    const topAssets = allAssets.slice(0, 5);

    // Create a map of Mint -> Symbol and Mint -> Price for quick lookup
    const mintToSymbol = new Map<string, string>();
    const mintToPrice = new Map<string, number>();

    assets.forEach(asset => {
        if (asset.id) {
            if (asset.content.metadata.symbol) {
                mintToSymbol.set(asset.id, asset.content.metadata.symbol);
            }
            if (asset.token_info?.price_info?.price_per_token) {
                mintToPrice.set(asset.id, asset.token_info.price_info.price_per_token);
            }
        }
    });

    // 2. Fetch Signatures (Pagination enabled)
    // Fetch up to 10,000 transactions to get a deeper "Total Transactions" count
    const MAX_SIGNATURES = 10000;
    // Note: We REMOVED the 2025 check here so we can count older transactions for the "Total" metric.
    // We will still filter for 2025 later for the detailed stats.

    let signatures: any[] = [];
    let beforeSignature: string | undefined = undefined;

    while (signatures.length < MAX_SIGNATURES) {
        const params: any[] = [address, { limit: 1000 }];
        if (beforeSignature) {
            params[1].before = beforeSignature;
        }

        try {
            const signaturesResponse = await fetch(RPC_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: "get-signatures",
                    method: "getSignaturesForAddress",
                    params: params,
                }),
            });
            const signaturesJson = await signaturesResponse.json();
            const batch = signaturesJson.result || [];

            if (batch.length === 0) break;

            signatures = signatures.concat(batch);
            beforeSignature = batch[batch.length - 1].signature;

            // REMOVED: Date check. We want to count them all up to the limit.

            // If we got fewer than requested, we reached the end of history
            if (batch.length < 1000) break;

        } catch (e) {
            console.error("Error fetching signatures batch:", e);
            break;
        }
    }

    const transactionCount = signatures.length;

    // Calculate Month Change (Transactions in last 30 days)
    const thirtyDaysAgo = Date.now() / 1000 - 30 * 24 * 60 * 60;
    const monthChange = signatures.filter((sig: HeliusSignature) => sig.blockTime > thirtyDaysAgo).length;

    // 3. Fetch Transaction History (Enhanced Transactions API)
    // We want to fetch details for as many 2025 transactions as possible (up to the 1000 signatures we have)
    // to ensure "All Time" (YTD) stats are accurate.

    const startOf2025 = new Date("2025-01-01T00:00:00Z").getTime() / 1000;
    const signatures2025 = signatures.filter((s: HeliusSignature) => s.blockTime >= startOf2025).map((s: HeliusSignature) => s.signature);

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
                    json.result.forEach((asset: HeliusAsset) => {
                        if (asset?.content?.metadata?.symbol) {
                            mintToSymbol.set(asset.id, asset.content.metadata.symbol);
                        }
                        if (asset?.token_info?.price_info?.price_per_token) {
                            mintToPrice.set(asset.id, asset.token_info.price_info.price_per_token);
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
    const walletInteractions = new Map<string, TopWallet>();
    let biggestTx = { amount: 0, currency: "SOL", to: "Unknown", date: "N/A", usdValue: 0 };

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
                date: date.toLocaleDateString() + ' | ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: tx.timestamp, // Add timestamp for easier filtering
                from: type === "in" ? counterparty : address,
                to: type === "out" ? counterparty : address,
            };

            // Add to full list
            transactions.push(formattedTx);

            // Check for biggest transaction
            // Calculate USD value
            let txUsdValue = 0;
            if (formattedTx.currency === "SOL") {
                txUsdValue = formattedTx.amount * (assetsJson.result?.nativeBalance?.price_per_sol || 0);
            } else {
                // Try to find mint for this currency (this is tricky since we only have symbol in formattedTx)
                // We need to look at the raw tx again or store mint in formattedTx
                // Simpler: we know the mint from the loop above if it was a token transfer
                if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
                    const transfer = tx.tokenTransfers.find(t => t.fromUserAccount === address || t.toUserAccount === address);
                    if (transfer && transfer.mint) {
                        const price = mintToPrice.get(transfer.mint) || 0;
                        txUsdValue = formattedTx.amount * price;
                    }
                }
            }

            if (txUsdValue > biggestTx.usdValue) {
                biggestTx = {
                    amount: formattedTx.amount,
                    currency: formattedTx.currency,
                    to: formattedTx.to,
                    date: date.toLocaleDateString(),
                    usdValue: txUsdValue
                };
            }
        }

        // Track interactions
        if (counterparty && counterparty !== address) {
            // Map "in"/"out" to "received"/"sent"
            const interactionType = type === "in" ? "received" : "sent";

            const existing = walletInteractions.get(counterparty) || {
                address: counterparty,
                interactionCount: 0,
                totalVolume: 0,
                type: interactionType
            };

            existing.interactionCount++;
            existing.totalVolume += txAmount;

            // Update type if different (to become "both")
            if (existing.type !== "both" && existing.type !== interactionType) {
                existing.type = "both";
            }

            walletInteractions.set(counterparty, existing);
        }
    });

    // Calculate Most Active Day
    const dayCounts = new Map<string, number>();
    transactions.forEach(tx => {
        // tx.date is already formatted as "YYYY-MM-DD | HH:MM" or similar, 
        // but let's use the raw timestamp to be safe and format it as YYYY-MM-DD
        const dateObj = new Date((tx.timestamp || 0) * 1000);
        const dateKey = dateObj.toLocaleDateString(); // e.g. "12/25/2024"

        dayCounts.set(dateKey, (dayCounts.get(dateKey) || 0) + 1);
    });

    let mostActiveDay = { date: "Jan 1", count: 0 };
    let maxCount = 0;

    dayCounts.forEach((count, date) => {
        if (count > maxCount) {
            maxCount = count;
            mostActiveDay = { date, count };
        }
    });

    // Process Top Wallets
    const topWallets = Array.from(walletInteractions.values())
        .sort((a, b) => b.interactionCount - a.interactionCount)
        .slice(0, 5);

    // Sort transactions by date (newest first)
    transactions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // Determine Personality
    let personality: WalletData["personality"] = "The HODLer";

    // Metrics for personality
    const txCount = transactionCount; // Total signatures
    // We need to ensure solPrice is available. It comes from assetsJson.
    const solPrice = assetsJson.result?.nativeBalance?.price_per_sol || 0;
    const solVolUsd = totalVolume * solPrice; // Approx USD volume of SOL moves

    // 1. Time based & Type based
    let nightTxCount = 0;
    let weekendTxCount = 0;
    let nftTxCount = 0;
    let nonSolTokenTxCount = 0;

    history.forEach(tx => {
        const date = new Date((tx.timestamp || 0) * 1000);
        const hour = date.getHours();
        const day = date.getDay(); // 0 = Sun, 6 = Sat

        if (hour >= 0 && hour < 6) nightTxCount++;
        if (day === 0 || day === 6) weekendTxCount++;

        if (tx.type === "NFT_SALE" || tx.type === "NFT_BID") nftTxCount++;

        // rudimentary check for SPL tokens
        if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
            nonSolTokenTxCount++;
        }
    });

    const isNightOwl = history.length > 0 && (nightTxCount / history.length > 0.5);
    const isWeekender = history.length > 0 && (weekendTxCount / history.length > 0.5);
    const isSolanaMaxi = nonSolTokenTxCount === 0 && totalVolume > 0; // Pure SOL mover

    // Determining Archetype (Precedence Order)
    if (txCount >= 1000) {
        personality = "The Bot?";
    } else if (solVolUsd > 50000 && txCount < 20) {
        personality = "The Diamond Hands";
    } else if (nonSolTokenTxCount > 500) {
        personality = "The Degen";
    } else if (nftTxCount > 0) {
        personality = "The NFT Collector";
    } else if (isNightOwl) {
        personality = "The Night Owl";
    } else if (isWeekender) {
        personality = "The Weekender";
    } else if (isSolanaMaxi && txCount > 10) {
        personality = "The Solana Maxi";
    } else if (txCount > 100) {
        personality = "The Trader";
    }

    // Calculate Percentage Change
    let volumeChangePercentage = 0;
    if (prevMonthVolume > 0) {
        volumeChangePercentage = ((currentMonthVolume - prevMonthVolume) / prevMonthVolume) * 100;
    } else if (currentMonthVolume > 0) {
        volumeChangePercentage = 100; // 100% increase if previous was 0
    }

    // Calculate USD values
    // solPrice is already defined above
    const totalInflowUsd = totalInflow * solPrice;
    const totalOutflowUsd = totalOutflow * solPrice;

    // Calculate Rank (Based on ~11.5M wallets estimates)
    const calculateRank = (solBalance: number) => {
        if (solBalance >= 1000) return { percentile: 0.2, label: "Solana Whale Shark" };
        if (solBalance >= 100) return { percentile: 1.3, label: "Solana Whale" };
        if (solBalance >= 20) return { percentile: 5, label: "Solana Dolphin" };
        if (solBalance >= 10) return { percentile: 7, label: "Solana Fish" };
        if (solBalance >= 1) return { percentile: 28, label: "Solana Shrimp" };
        return { percentile: 50, label: "Solana Plankton" };
    };

    const solBalance = assetsJson.result?.nativeBalance?.lamports ? assetsJson.result.nativeBalance.lamports / 1e9 : 0;
    const walletRank = calculateRank(solBalance);

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
        topAssets,
        topWallets,
        mostActiveDay,
        activity,
        personality,
        walletRank,
        transactions: transactions.slice(0, 10), // Keep top 10 for default view
        allTransactions: transactions, // Send all for filtering
        solPrice,
        biggestTransaction: biggestTx
    };
}