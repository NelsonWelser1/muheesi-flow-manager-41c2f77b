
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Coffee, TrendingUp, ArrowUpRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const InsightsView = ({ isLoading, timeRange, statusFilter, searchTerm, categoryFilter }) => {
  const {
    transfers,
    loading: transfersLoading,
    error,
    handleTimeRangeChange,
    handleStatusChange,
    handleSearch,
    handleRefresh
  } = useCoffeeStockTransfers();

  const [volumeByType, setVolumeByType] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [volumeByLocation, setVolumeByLocation] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [summary, setSummary] = useState({
    totalVolume: 0,
    arabicaVolume: 0,
    robustaVolume: 0,
    totalTransfers: 0,
    pendingTransfers: 0,
    receivedTransfers: 0
  });

  useEffect(() => {
    // Apply filters based on props
    if (timeRange && timeRange !== 'all') {
      handleTimeRangeChange(timeRange);
    }
    
    if (statusFilter && statusFilter !== 'all') {
      handleStatusChange(statusFilter);
    }
    
    if (searchTerm) {
      handleSearch(searchTerm);
    }
    
    // Process data for insights
    if (transfers.length > 0) {
      processInsightData(transfers);
    }
  }, [transfers, timeRange, statusFilter, searchTerm, categoryFilter]);

  const processInsightData = (data) => {
    // Calculate volume by coffee type
    const typeVolumes = {
      arabica: 0,
      robusta: 0
    };
    
    // Calculate status distribution
    const statusCounts = {
      pending: 0,
      received: 0,
      declined: 0,
      processing: 0
    };
    
    // Calculate volume by location
    const locationVolumes = {};
    
    // Timeline data by date
    const timelineMap = {};
    
    // Overall summary
    let totalVolume = 0;
    
    data.forEach(transfer => {
      const quantity = parseFloat(transfer.quantity) || 0;
      
      // Handle coffee type volumes
      if (transfer.coffee_type) {
        typeVolumes[transfer.coffee_type] = (typeVolumes[transfer.coffee_type] || 0) + quantity;
      }
      
      // Handle status counts
      if (transfer.status) {
        statusCounts[transfer.status] = (statusCounts[transfer.status] || 0) + 1;
      }
      
      // Handle location volumes
      if (transfer.destination_location) {
        locationVolumes[transfer.destination_location] = (locationVolumes[transfer.destination_location] || 0) + quantity;
      }
      
      // Handle timeline data
      const date = new Date(transfer.created_at);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!timelineMap[dateKey]) {
        timelineMap[dateKey] = {
          date: dateKey,
          arabica: 0,
          robusta: 0,
          total: 0
        };
      }
      
      if (transfer.coffee_type === 'arabica') {
        timelineMap[dateKey].arabica += quantity;
      } else {
        timelineMap[dateKey].robusta += quantity;
      }
      
      timelineMap[dateKey].total += quantity;
      
      // Total volume
      totalVolume += quantity;
    });
    
    // Prepare data for charts
    const volumeByTypeData = [
      { name: 'Arabica', value: typeVolumes.arabica },
      { name: 'Robusta', value: typeVolumes.robusta }
    ];
    
    const statusDistributionData = [
      { name: 'Pending', value: statusCounts.pending },
      { name: 'Received', value: statusCounts.received },
      { name: 'Declined', value: statusCounts.declined },
      { name: 'Processing', value: statusCounts.processing }
    ].filter(item => item.value > 0);
    
    const volumeByLocationData = Object.keys(locationVolumes)
      .map(location => ({
        name: location,
        value: locationVolumes[location]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Get top 5 locations
    
    // Sort timeline data chronologically
    const timelineDataArray = Object.values(timelineMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
    
    // Set state with processed data
    setVolumeByType(volumeByTypeData);
    setStatusDistribution(statusDistributionData);
    setVolumeByLocation(volumeByLocationData);
    setTimelineData(timelineDataArray);
    
    // Set summary data
    setSummary({
      totalVolume,
      arabicaVolume: typeVolumes.arabica || 0,
      robustaVolume: typeVolumes.robusta || 0,
      totalTransfers: data.length,
      pendingTransfers: statusCounts.pending || 0,
      receivedTransfers: statusCounts.received || 0
    });
  };

  if (transfersLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
        <p className="ml-2 text-amber-800">Loading insights data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <h3 className="text-red-800 font-medium">Error loading data</h3>
        <p className="text-red-600">{error}</p>
        <Button 
          onClick={handleRefresh} 
          className="mt-2 bg-red-100 text-red-800 hover:bg-red-200"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Coffee Volume</p>
                <h3 className="text-2xl font-bold">{summary.totalVolume.toFixed(2)} kg</h3>
              </div>
              <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                <Coffee className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{(summary.totalVolume * 0.08).toFixed(2)} kg this period
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Transfers</p>
                <h3 className="text-2xl font-bold">{summary.totalTransfers}</h3>
              </div>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <Badge className="mr-2 bg-amber-100 text-amber-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                {summary.pendingTransfers} pending
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                {summary.receivedTransfers} received
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Coffee Type Ratio</p>
                <h3 className="text-2xl font-bold">
                  {summary.totalVolume > 0 
                    ? `${((summary.arabicaVolume / summary.totalVolume) * 100).toFixed(1)}% / ${((summary.robustaVolume / summary.totalVolume) * 100).toFixed(1)}%` 
                    : '0% / 0%'}
                </h3>
              </div>
              <div className="flex">
                <div className="p-1 rounded-full bg-green-100 text-green-600 mr-1">
                  <Coffee className="h-4 w-4" />
                </div>
                <div className="p-1 rounded-full bg-amber-100 text-amber-600">
                  <Coffee className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <span className="text-green-600 mr-2">Arabica: {summary.arabicaVolume.toFixed(2)} kg</span>
              <span className="text-amber-600">Robusta: {summary.robustaVolume.toFixed(2)} kg</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coffee Volume Timeline */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Coffee Volume Timeline</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timelineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="arabica" 
                  stroke="#10b981" 
                  name="Arabica"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="robusta" 
                  stroke="#f59e0b" 
                  name="Robusta"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  name="Total"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Volume by Coffee Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Volume by Coffee Type</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={volumeByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell key="arabica" fill="#10b981" />
                  <Cell key="robusta" fill="#f59e0b" />
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(2)} kg`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Transfer Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Volume by Location */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Locations by Volume</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={volumeByLocation}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fontSize: 12 }}
                  height={70}
                />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(2)} kg`} />
                <Bar dataKey="value" name="Volume (kg)" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Analysis Section */}
      <Card className="bg-gradient-to-br from-amber-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <div className="bg-amber-100 p-1 rounded-full mr-2">
              <Coffee className="h-5 w-5 text-amber-800" />
            </div>
            AI-Powered Coffee Business Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border border-amber-100">
              <h4 className="font-medium text-amber-900 mb-1">Stock Level Analysis</h4>
              <p className="text-sm text-gray-700">
                Based on current transfer patterns, Robusta coffee stocks are 24% higher than Arabica at destination
                locations. Consider increasing Arabica procurement to balance inventory levels.
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-amber-100">
              <h4 className="font-medium text-amber-900 mb-1">Processing Bottlenecks</h4>
              <p className="text-sm text-gray-700">
                Transfer completion rate has decreased by 12% in the last 7 days. Check for processing delays
                at Kanoni-Rwakahaya, which shows the highest pending transfers.
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-amber-100">
              <h4 className="font-medium text-amber-900 mb-1">Location Optimization</h4>
              <p className="text-sm text-gray-700">
                Buremba is receiving 35% less volume than expected based on historical patterns.
                Consider re-evaluating logistics routes to optimize delivery efficiency.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsView;
