
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from '@/components/ui/notifications';
import { supabase } from '@/integrations/supabase/supabase';
import { ChartPie, LineChart, TrendingUp, Container, Calendar } from "lucide-react";
import ProductionSummary from './ProductionSummary';
import ProductionTrendsChart from './ProductionTrendsChart';
import ProductionEfficiencyChart from './ProductionEfficiencyChart';
import { format, subDays } from 'date-fns';

const DairyAnalytics = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [milkData, setMilkData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');  // 'week', 'month', 'quarter', 'year'
  const { toast } = useToast();

  useEffect(() => {
    fetchMilkData();
  }, [dateRange]);

  const fetchMilkData = async () => {
    setIsLoading(true);
    try {
      // Calculate date range
      let startDate;
      const today = new Date();
      
      switch (dateRange) {
        case 'week':
          startDate = format(subDays(today, 7), 'yyyy-MM-dd');
          break;
        case 'month':
          startDate = format(subDays(today, 30), 'yyyy-MM-dd');
          break;
        case 'quarter':
          startDate = format(subDays(today, 90), 'yyyy-MM-dd');
          break;
        case 'year':
          startDate = format(subDays(today, 365), 'yyyy-MM-dd');
          break;
        default:
          startDate = format(subDays(today, 7), 'yyyy-MM-dd');
      }

      const { data, error } = await supabase
        .from('milk_production')
        .select('*')
        .gte('date', startDate)
        .order('date', { ascending: true });

      if (error) throw error;
      setMilkData(data || []);
    } catch (error) {
      console.error('Error fetching milk production data:', error);
      showErrorToast(toast, `Failed to fetch milk production data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Dairy Analytics Dashboard</h3>
        <select 
          className="border rounded px-2 py-1 text-sm" 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 90 Days</option>
          <option value="year">Last 365 Days</option>
        </select>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <ChartPie className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Production Trends
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Efficiency
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Container className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Forecast
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <ProductionSummary 
            milkData={milkData} 
            isLoading={isLoading} 
            dateRange={dateRange}
          />
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <ProductionTrendsChart 
            milkData={milkData} 
            isLoading={isLoading} 
            dateRange={dateRange}
          />
        </TabsContent>
        
        <TabsContent value="efficiency" className="space-y-4">
          <ProductionEfficiencyChart 
            milkData={milkData} 
            isLoading={isLoading} 
            dateRange={dateRange}
          />
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analytics</CardTitle>
              <CardDescription>
                Track your dairy inventory levels and consumption rates
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Inventory analytics feature coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Forecast</CardTitle>
              <CardDescription>
                AI-powered production forecasting based on historical data
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Production forecasting feature coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DairyAnalytics;
