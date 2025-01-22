import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useToast } from "@/components/ui/use-toast";
import ProductionMetrics from '../cheese-factory/monitor/ProductionMetrics';
import BatchList from '../cheese-factory/monitor/BatchList';
import ProductionTrends from '../cheese-factory/monitor/ProductionTrends';
import { Card } from "@/components/ui/card";

const CheeseProductionMonitor = () => {
  console.log('Rendering CheeseProductionMonitor');
  const { toast } = useToast();

  const { data: activeBatches, isLoading: isLoadingProduction, error: productionError } = useQuery({
    queryKey: ['cheeseProduction'],
    queryFn: async () => {
      console.log('Fetching cheese production data...');
      try {
        const { data, error } = await supabase
          .from('cheese_production')
          .select('*, production_line:production_line_id(*)')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching cheese production data:', error);
          toast({
            variant: "destructive",
            title: "Error fetching production data",
            description: error.message
          });
          throw error;
        }

        console.log('Successfully fetched cheese production data:', data);
        return data;
      } catch (error) {
        console.error('Error in cheese production query:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: true
  });

  const { data: productionStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['productionStats'],
    queryFn: async () => {
      console.log('Fetching production stats...');
      try {
        const { data, error } = await supabase
          .from('cheese_production_stats')
          .select('*')
          .order('date', { ascending: false })
          .limit(7);

        if (error) {
          console.error('Error fetching production stats:', error);
          toast({
            variant: "destructive",
            title: "Error fetching production stats",
            description: error.message
          });
          throw error;
        }

        console.log('Successfully fetched production stats:', data);
        return data;
      } catch (error) {
        console.error('Error in production stats query:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: true
  });

  if (productionError) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error loading production data. Please try again later.</p>
      </div>
    );
  }

  if (isLoadingProduction || isLoadingStats) {
    return <div className="p-4">Loading production data...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">Cheese Production Monitor</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ProductionMetrics 
          activeBatches={activeBatches || []}
          totalProduction={productionStats?.[0]?.production_amount || 0}
          averageQuality={85}
        />
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Active Production Batches</h3>
        <BatchList activeBatches={activeBatches || []} />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Production Trends</h3>
        <ProductionTrends productionStats={productionStats || []} />
      </Card>
    </div>
  );
};

export default CheeseProductionMonitor;