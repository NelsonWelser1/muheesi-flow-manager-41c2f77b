
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const SalesChart = ({ salesData }) => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('10'); // Default to 10 days
  
  // Process data for the chart
  const processChartData = () => {
    if (!salesData || salesData.length === 0) return [];
    
    // Sort by date (ascending)
    const sortedData = [...salesData].sort((a, b) => {
      const dateA = new Date(a.date_time || a.created_at);
      const dateB = new Date(b.date_time || b.created_at);
      return dateA - dateB;
    });
    
    // Only take the last N records based on timeRange
    return sortedData.slice(-parseInt(timeRange));
  };
  
  const chartData = processChartData();
  
  // Format date for display on chart
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="bg-white p-2 shadow-lg border">
          <CardContent className="p-2">
            <p className="font-medium">{new Date(data.date_time || data.created_at).toLocaleDateString()}</p>
            <p>Customer: {data.customer_name}</p>
            <p>Quantity: {data.quantity}</p>
            <p>Amount: ${((data.quantity * (data.price_per_unit || data.unit_price))).toFixed(2)}</p>
          </CardContent>
        </Card>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="bar">Bar Chart</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 entries</SelectItem>
            <SelectItem value="10">Last 10 entries</SelectItem>
            <SelectItem value="30">Last 30 entries</SelectItem>
            <SelectItem value="9999">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={salesData[0]?.date_time ? "date_time" : "created_at"}
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="quantity" 
                name="Sales Quantity"
                stroke="#8884d8" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={salesData[0]?.date_time ? "date_time" : "created_at"}
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="quantity" 
                name="Sales Quantity"
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {salesData.length === 0 && (
        <div className="text-center text-muted-foreground">
          No sales data available for chart visualization
        </div>
      )}
    </div>
  );
};

export default SalesChart;
