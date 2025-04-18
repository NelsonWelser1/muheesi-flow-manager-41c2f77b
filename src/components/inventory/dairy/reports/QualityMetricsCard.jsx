
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const QualityMetricsCard = ({ qualityMetrics = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Fetch quality data directly from Supabase
  const { data: fetchedQualityMetrics, isLoading, error } = useQuery({
    queryKey: ['qualityMetrics'],
    queryFn: async () => {
      console.log('Fetching quality metrics data...');
      
      // First try the quality_checks table
      let { data: qualityData, error: qualityError } = await supabase
        .from('quality_checks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (qualityError || !qualityData || qualityData.length === 0) {
        console.log('No data in quality_checks, checking milk_reception...');
        
        // Try milk_reception as fallback
        const { data: receptionData, error: receptionError } = await supabase
          .from('milk_reception')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (!receptionError && receptionData && receptionData.length > 0) {
          console.log('Found quality data in milk_reception:', receptionData.length, 'records');
          return formatMilkReceptionData(receptionData);
        }
      } else {
        console.log('Found quality data in quality_checks:', qualityData.length, 'records');
        return formatQualityChecksData(qualityData);
      }
      
      // Return the provided fallback data if no data found in any table
      console.log('No quality data found in any table, using fallback data');
      return qualityMetrics.length > 0 ? qualityMetrics : generateFallbackData();
    },
  });
  
  // Format data from different tables
  const formatMilkReceptionData = (data) => {
    return data.map(item => ({
      date: new Date(item.datetime || item.created_at).toLocaleDateString(),
      avgQuality: parseQualityScore(item.quality_score),
      volume: Number(item.milk_volume) || 0
    }));
  };
  
  const formatQualityChecksData = (data) => {
    return data.map(item => {
      // Calculate quality score based on various parameters
      const totalChecks = 6; // Total number of checks
      const passedChecks = [
        item.temperature_status,
        item.ph_status || item.ph_level_status,
        item.moisture_status,
        item.fat_status,
        item.protein_status,
        item.salt_status
      ].filter(status => 
        status && (status.toLowerCase() === 'pass' || status.toLowerCase() === 'passed')
      ).length;
      
      const qualityScore = Math.round((passedChecks / totalChecks) * 100);
      
      return {
        date: new Date(item.created_at).toLocaleDateString(),
        avgQuality: qualityScore,
        volume: 0 // Volume data might not be available in this table
      };
    });
  };
  
  // Helper function to parse quality score from different formats
  const parseQualityScore = (score) => {
    if (!score) return 85; // Default score
    
    if (typeof score === 'number') {
      return score;
    }
    
    // Handle grade-based scores
    if (typeof score === 'string') {
      switch (score.trim()) {
        case 'Grade A': return 90;
        case 'Grade B': return 75;
        case 'Grade C': return 60;
        case 'Rejected': return 30;
        default:
          // Try to parse numeric string
          const numericScore = parseFloat(score);
          return isNaN(numericScore) ? 85 : numericScore;
      }
    }
    
    return 85; // Default fallback
  };

  // Generate fallback data if no data is available
  const generateFallbackData = () => {
    const today = new Date();
    return Array(5).fill().map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString(),
        avgQuality: 80 + Math.floor(Math.random() * 15),
        volume: 400 + Math.floor(Math.random() * 200)
      };
    }).reverse();
  };

  // Use fetched data if available, otherwise use the provided data or fallback
  const chartData = (fetchedQualityMetrics && fetchedQualityMetrics.length > 0) 
    ? fetchedQualityMetrics 
    : qualityMetrics.length > 0 
      ? qualityMetrics 
      : generateFallbackData();

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
          {payload.length > 1 && (
            <p className="text-green-600 dark:text-green-400">
              {`Volume: ${payload[1].value} L`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading quality metrics data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Error loading quality metrics: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

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
