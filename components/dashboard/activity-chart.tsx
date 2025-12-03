"use client";

import { useState } from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, LineChart as LineChartIcon } from "lucide-react";

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
        <div className="flex items-center space-x-2">
            <Button 
                variant={chartType === "line" ? "secondary" : "ghost"} 
                size="icon" 
                onClick={() => setChartType("line")}
                title="Line Chart"
            >
                <LineChartIcon className="h-4 w-4" />
            </Button>
            <Button 
                variant={chartType === "bar" ? "secondary" : "ghost"} 
                size="icon" 
                onClick={() => setChartType("bar")}
                title="Bar Chart"
            >
                <BarChart2 className="h-4 w-4" />
            </Button>
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
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
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
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
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