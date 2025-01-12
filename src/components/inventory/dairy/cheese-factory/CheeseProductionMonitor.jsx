import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Thermometer, Timer, AlertCircle, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/components/ui/use-toast";

const CheeseProductionMonitor = () => {
  const { toast } = useToast();

  const { data: productionData, isLoading, error } = useQuery({
    queryKey: ['cheeseProduction'],
    queryFn: async () => {
      console.log('Fetching cheese production data');
      const { data, error } = await supabase
        .from('cheese_production')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching cheese production data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch production data. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Cheese production data:', data);
      return data;
    },
    retry: 2,
    staleTime: 30000,
  });

  const { data: productionStats, error: statsError } = useQuery({
    queryKey: ['cheeseProductionStats'],
    queryFn: async () => {
      console.log('Fetching production stats');
      const { data, error } = await supabase
        .from('cheese_production_stats')
        .select('*')
        .order('date', { ascending: true })
        .limit(7);

      if (error) {
        console.error('Error fetching production stats:', error);
        toast({
          title: "Error",
          description: "Failed to fetch production statistics. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Production stats:', data);
      return data;
    },
    retry: 2,
    staleTime: 30000,
  });

  if (error || statsError) {
    return (
      <div className="p-4 text-red-500">
        <AlertCircle className="w-6 h-6 mb-2" />
        <p>Error loading data. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading production data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productionData?.filter(batch => batch.status === 'active').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Daily Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productionData?.reduce((acc, curr) => acc + (curr.yield_amount || 0), 0)} kg
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(productionData?.reduce((acc, curr) => acc + (curr.quality_score || 0), 0) / (productionData?.length || 1))}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Production Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={productionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="production_amount" stroke="#8884d8" name="Production (kg)" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Production Batches</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading production data...</div>
          ) : (
            <div className="space-y-4">
              {productionData?.map((batch) => (
                <div key={batch.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Batch #{batch.batch_number}</h3>
                    <Badge>{batch.status}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      <span>{batch.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      <span>{batch.duration} hrs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{batch.ph_level} pH</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheeseProductionMonitor;
