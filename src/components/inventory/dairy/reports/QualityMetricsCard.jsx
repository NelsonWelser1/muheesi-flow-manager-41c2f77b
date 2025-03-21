
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTheme } from 'next-themes';

const QualityMetricsCard = ({ qualityMetrics = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Set default data if none provided
  const chartData = qualityMetrics.length > 0 ? qualityMetrics : [
    { date: '1/1', avgQuality: 85, volume: 500 },
    { date: '1/2', avgQuality: 88, volume: 450 },
    { date: '1/3', avgQuality: 82, volume: 520 },
    { date: '1/4', avgQuality: 86, volume: 480 },
    { date: '1/5', avgQuality: 89, volume: 510 }
  ];

  // Calculate average quality score
  const avgQualityScore = Math.round(
    chartData.reduce((sum, item) => sum + item.avgQuality, 0) / chartData.length
  );

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border rounded shadow">
          <p className="font-semibold">{`Date: ${label}`}</p>
          <p className="text-blue-600 dark:text-blue-400">
            {`Quality Score: ${payload[0].value}%`}
          </p>
          <p className="text-green-600 dark:text-green-400">
            {`Volume: ${payload[1].value} L`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quality Metrics</CardTitle>
        <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded text-sm font-medium">
          Avg: {avgQualityScore}%
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: isDark ? "#9CA3AF" : "#4B5563" }} 
                stroke={isDark ? "#4B5563" : "#9CA3AF"}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: isDark ? "#9CA3AF" : "#4B5563" }} 
                stroke={isDark ? "#4B5563" : "#9CA3AF"}
                domain={[0, 100]}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fill: isDark ? "#9CA3AF" : "#4B5563" }} 
                stroke={isDark ? "#4B5563" : "#9CA3AF"}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="avgQuality" 
                name="Quality Score"
                stroke="#8884d8" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorQuality)" 
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="volume" 
                name="Volume (L)"
                stroke="#82ca9d" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVolume)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityMetricsCard;
