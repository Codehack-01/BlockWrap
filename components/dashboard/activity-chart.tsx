"use client";

import { useState } from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

interface ActivityChartProps {
  data: number[] | { name: string; total: number }[];
  title?: string;
}

export function ActivityChart({ data, title = "Monthly Activity" }: ActivityChartProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("line");

  let chartData;

  if (Array.isArray(data) && typeof data[0] === 'number') {
    // Monthly data (array of numbers)
    chartData = (data as number[]).map((value, index) => ({
      name: new Date(0, index).toLocaleString('default', { month: 'short' }),
      total: value,
    }));
  } else {
    // Daily data (already formatted)
    chartData = data as { name: string; total: number }[];
  }

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center p-1 bg-white/5 rounded-lg border border-white/10">
          <button
            onClick={() => setChartType("line")}
            className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
              chartType === "line"
                ? "bg-purple-500 text-white shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
            title="Trendline"
          >
            <TrendingUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
              chartType === "bar"
                ? "bg-purple-500 text-white shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          {chartType === "bar" ? (
            <BarChart key="bar-chart" data={chartData}>
                <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-900/90 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-xl">
                          <p className="font-space text-xs text-zinc-400 mb-1">{label}</p>
                          <p className="font-space text-sm font-bold text-white">
                            {payload[0].value} <span className="text-purple-400 text-xs font-normal">TXS</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                dataKey="total"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
                />
            </BarChart>
          ) : (
            <LineChart key="line-chart" data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                domain={[0, 'auto']}
                allowDecimals={false}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-900/90 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-xl">
                          <p className="font-space text-xs text-zinc-400 mb-1">{label}</p>
                          <p className="font-space text-sm font-bold text-white">
                            {payload[0].value} <span className="text-purple-400 text-xs font-normal">TXS</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line
                type="monotone"
                dataKey="total"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                connectNulls
                />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}