
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/supabase";
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";

const SalesAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState('month');
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, [timePeriod]);

  const fetchSalesData = async () => {
    setIsLoading(true);
    try {
      let { data, error } = await supabase
        .from('sales_records')
        .select('*')
        .order('date_time', { ascending: false });

      if (error) throw error;

      // Process data for visualization
      const processedData = processDataForTimePeriod(data || [], timePeriod);
      setSalesData(processedData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processDataForTimePeriod = (data, period) => {
    // This would be more sophisticated in a real app
    const now = new Date();
    let filteredData;
    
    switch (period) {
      case 'week':
        // Last 7 days
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredData = data.filter(item => new Date(item.date_time) >= weekAgo);
        return aggregateByDay(filteredData);
      case 'month':
        // Last 30 days
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredData = data.filter(item => new Date(item.date_time) >= monthAgo);
        return aggregateByDay(filteredData);
      case 'quarter':
        // Last 90 days
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filteredData = data.filter(item => new Date(item.date_time) >= quarterAgo);
        return aggregateByWeek(filteredData);
      case 'year':
        // Last 365 days
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredData = data.filter(item => new Date(item.date_time) >= yearAgo);
        return aggregateByMonth(filteredData);
      default:
        return aggregateByDay(data);
    }
  };

  const aggregateByDay = (data) => {
    // Group data by day and sum up sales
    const groupedData = {};
    
    data.forEach(item => {
      const date = new Date(item.date_time);
      const day = date.toISOString().split('T')[0];
      const saleAmount = item.quantity * item.price_per_unit;
      
      if (!groupedData[day]) {
        groupedData[day] = { 
          date: day, 
          sales: 0,
          transactions: 0,
          units: 0
        };
      }
      
      groupedData[day].sales += saleAmount;
      groupedData[day].transactions += 1;
      groupedData[day].units += item.quantity;
    });
    
    // Convert to array and sort by date
    return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
  };

  const aggregateByWeek = (data) => {
    // Implement week aggregation
    // Simplified for this example
    return aggregateByDay(data);
  };

  const aggregateByMonth = (data) => {
    // Group data by month
    const groupedData = {};
    
    data.forEach(item => {
      const date = new Date(item.date_time);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const saleAmount = item.quantity * item.price_per_unit;
      
      if (!groupedData[month]) {
        groupedData[month] = { 
          date: month, 
          sales: 0,
          transactions: 0,
          units: 0
        };
      }
      
      groupedData[month].sales += saleAmount;
      groupedData[month].transactions += 1;
      groupedData[month].units += item.quantity;
    });
    
    // Convert to array and sort by date
    return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Calculate summary statistics
  const calculateTotalSales = () => {
    return salesData.reduce((total, item) => total + item.sales, 0).toFixed(2);
  };

  const calculateTotalTransactions = () => {
    return salesData.reduce((total, item) => total + item.transactions, 0);
  };

  const calculateTotalUnits = () => {
    return salesData.reduce((total, item) => total + item.units, 0);
  };

  const calculateAverageOrderValue = () => {
    const totalSales = salesData.reduce((total, item) => total + item.sales, 0);
    const totalTransactions = salesData.reduce((total, item) => total + item.transactions, 0);
    return totalTransactions ? (totalSales / totalTransactions).toFixed(2) : '0.00';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Analytics</h2>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          icon={<DollarSign className="h-8 w-8 text-blue-600" />}
          title="Total Sales"
          value={`$${calculateTotalSales()}`}
          description={`For the last ${
            timePeriod === 'week' ? '7 days' : 
            timePeriod === 'month' ? '30 days' : 
            timePeriod === 'quarter' ? '90 days' : '365 days'
          }`}
        />
        
        <MetricCard 
          icon={<ShoppingCart className="h-8 w-8 text-green-600" />}
          title="Total Transactions"
          value={calculateTotalTransactions()}
          description="Number of orders"
        />
        
        <MetricCard 
          icon={<TrendingUp className="h-8 w-8 text-purple-600" />}
          title="Avg. Order Value"
          value={`$${calculateAverageOrderValue()}`}
          description="Average sale per transaction"
        />
        
        <MetricCard 
          icon={<Users className="h-8 w-8 text-orange-600" />}
          title="Units Sold"
          value={calculateTotalUnits()}
          description="Total product units"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading sales data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Sales']} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="Sales ($)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading transaction data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" />
                    <Bar dataKey="units" fill="#ffc658" name="Units Sold" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper component for metric cards
const MetricCard = ({ icon, title, value, description }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start">
          <div className="p-2 rounded-lg bg-blue-50">{icon}</div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesAnalytics;
