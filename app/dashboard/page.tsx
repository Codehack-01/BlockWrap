"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMockData, WalletData } from "@/lib/mock-data";
import { fetchWalletData } from "@/app/actions";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { TransactionTable } from "@/components/dashboard/transaction-table";
import { WrapModal } from "@/components/shared/wrap-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, DollarSign, Activity, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const address = searchParams.get("address");
  const [data, setData] = useState<WalletData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [filteredData, setFilteredData] = useState<WalletData | null>(null);
  const [isWrapModalOpen, setIsWrapModalOpen] = useState(false);

  useEffect(() => {
    if (!address) {
      router.push("/");
      return;
    }
    
    const loadData = async () => {
      try {
        const walletData = await fetchWalletData(address);
        setData(walletData);
        setFilteredData(walletData);
      } catch (err) {
        console.error("API Error, falling back to mock:", err);
        const mock = getMockData(address);
        setData(mock);
        setFilteredData(mock);
      }
    };

    loadData();
  }, [address, router]);

  useEffect(() => {
    if (!data) return;

    if (selectedMonth === "all") {
      setFilteredData({
        ...data,
        transactions: data.allTransactions || data.transactions, // Use all transactions
      });
      return;
    }

    const monthIndex = parseInt(selectedMonth);
    const allTxs = data.allTransactions || data.transactions;
    
    // Filter transactions for the selected month
    const filteredTxs = allTxs.filter(tx => {
        // Use timestamp if available, otherwise parse date string
        if (tx.timestamp) {
            const date = new Date(tx.timestamp * 1000);
            return date.getMonth() === monthIndex;
        }
        const date = new Date(tx.date);
        return date.getMonth() === monthIndex;
    });

    // Recalculate metrics
    let volume = 0;
    let inflow = 0;
    let outflow = 0;

    filteredTxs.forEach(tx => {
        // Only count SOL transactions for Volume/Inflow/Outflow to match backend logic
        // and to ensure USD calculation (which uses solPrice) is correct.
        if (tx.currency !== "SOL") return;

        if (tx.type === "in") {
            inflow += tx.amount;
        } else {
            outflow += tx.amount;
        }
        volume += tx.amount;
    });

    // Recalculate USD values
    const solPrice = data.solPrice || 0;
    const inflowUsd = inflow * solPrice;
    const outflowUsd = outflow * solPrice;

    // Update Activity Chart
    let newActivity: number[] | { name: string; total: number }[] = [];

    // Calculate daily activity for the selected month
    const daysInMonth = new Date(2025, monthIndex + 1, 0).getDate();
    newActivity = Array.from({ length: daysInMonth }, (_, i) => ({
        name: (i + 1).toString(),
        total: 0
    }));

    filteredTxs.forEach(tx => {
        let day = 0;
        if (tx.timestamp) {
            day = new Date(tx.timestamp * 1000).getDate();
        } else {
            day = new Date(tx.date).getDate();
        }
        // day is 1-indexed, array is 0-indexed
        if (day >= 1 && day <= daysInMonth) {
            (newActivity[day - 1] as { name: string; total: number }).total += 1; // Count transactions
        }
    }); 

    setFilteredData({
        ...data,
        totalVolume: parseFloat(volume.toFixed(2)),
        totalInflow: parseFloat(inflow.toFixed(2)),
        totalInflowUsd: parseFloat(inflowUsd.toFixed(2)),
        totalOutflow: parseFloat(outflow.toFixed(2)),
        totalOutflowUsd: parseFloat(outflowUsd.toFixed(2)),
        transactionCount: filteredTxs.length,
        transactions: filteredTxs, // Pass all transactions, pagination handled by component
        activity: newActivity as any // Cast to any to avoid type conflict with WalletData interface which expects number[]
    });

  }, [selectedMonth, data]);

  if (!filteredData) return null;

  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 min-h-screen bg-background">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
          <Button variant="outline" onClick={() => setIsWrapModalOpen(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Wrap
          </Button>
          <Button onClick={() => router.push(`/wrap?address=${address}`)}>
            Replay Wrapped
          </Button>
        </div>
      </div>

      {/* Wrap Modal */}
      <WrapModal 
        isOpen={isWrapModalOpen} 
        onClose={() => setIsWrapModalOpen(false)} 
        data={filteredData} 
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {selectedMonth === "all" ? "Total Volume" : "Monthly Volume"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${filteredData.totalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredData.volumeChangePercentage !== undefined 
                ? `${filteredData.volumeChangePercentage >= 0 ? "+" : ""}${filteredData.volumeChangePercentage}% from last month`
                : "No recent activity"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.transactionCount}</div>
            <p className="text-xs text-muted-foreground">
              {filteredData.monthChange !== undefined ? `+${filteredData.monthChange} since last month` : "No recent activity"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {selectedMonth === "all" ? "2025 Inflow" : "Monthly Inflow"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+{filteredData.totalInflow?.toLocaleString() ?? 0} SOL</div>
            <p className="text-xs text-muted-foreground">
              {filteredData.totalInflowUsd ? `$${filteredData.totalInflowUsd.toLocaleString()}` : "$0.00"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {selectedMonth === "all" ? "2025 Outflow" : "Monthly Outflow"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">-{filteredData.totalOutflow?.toLocaleString() ?? 0} SOL</div>
            <p className="text-xs text-muted-foreground">
              {filteredData.totalOutflowUsd ? `$${filteredData.totalOutflowUsd.toLocaleString()}` : "$0.00"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Asset</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.topAsset.symbol}</div>
            <p className="text-xs text-muted-foreground">{filteredData.topAsset.amount} tokens</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personality</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.personality}</div>
            <p className="text-xs text-muted-foreground">Based on your activity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ActivityChart 
            data={filteredData.activity} 
            title={selectedMonth === "all" ? "Monthly Activity" : "Daily Activity"}
          />
        </div>
        <div className="col-span-3">
          <TransactionTable transactions={filteredData.transactions} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}