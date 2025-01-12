import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import ProductionMetrics from './monitor/ProductionMetrics';
import ProductionTrends from './monitor/ProductionTrends';
import BatchList from './monitor/BatchList';

const CheeseProductionMonitor = () => {
  const { toast } = useToast();

  const { data: productionData, isLoading, error } = useQuery({
    queryKey: ['cheeseProduction'],
    queryFn: async () => {
      console.log('Fetching cheese production data');
      const { data, error } = await supabase
        .from('cheese_production')
        .select(`
          *,
          production_line:production_line_id(*)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching cheese production data:', error);
        throw error;
      }

      console.log('Cheese production data:', data);
      return data;
    },
  });

  const { data: productionStats } = useQuery({
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
        throw error;
      }

      console.log('Production stats:', data);
      return data;
    },
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch production data. Please try again later.",
      variant: "destructive",
    });
    return null;
  }

  if (isLoading) {
    return <div>Loading production data...</div>;
  }

  const activeBatches = productionData?.filter(batch => batch.status === 'active') || [];
  const totalProduction = productionData?.reduce((acc, curr) => acc + (curr.yield_amount || 0), 0) || 0;
  const averageQuality = Math.round(
    productionData?.reduce((acc, curr) => acc + (curr.quality_score || 0), 0) / (productionData?.length || 1)
  ) || 0;

  return (
    <div className="space-y-6">
      <ProductionMetrics 
        activeBatches={activeBatches}
        totalProduction={totalProduction}
        averageQuality={averageQuality}
      />
      
      <ProductionTrends productionStats={productionStats} />
      
      <BatchList activeBatches={activeBatches} />
    </div>
  );
};

export default CheeseProductionMonitor;