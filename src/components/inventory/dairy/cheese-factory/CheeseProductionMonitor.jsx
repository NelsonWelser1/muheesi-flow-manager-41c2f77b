import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import ProductionMetrics from './monitor/ProductionMetrics';
import ProductionTrends from './monitor/ProductionTrends';
import BatchList from './monitor/BatchList';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const CheeseProductionMonitor = () => {
  console.log('Rendering CheeseProductionMonitor');
  const { toast } = useToast();

  const { data: productionData, isLoading: isLoadingProduction, error: productionError } = useQuery({
    queryKey: ['cheeseProduction'],
    queryFn: async () => {
      console.log('Fetching cheese production data');
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

        console.log('Cheese production data:', data);
        return data || [];
      } catch (error) {
        console.error('Failed to fetch cheese production data:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: true
  });

  const { data: productionStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['cheeseProductionStats'],
    queryFn: async () => {
      console.log('Fetching production stats');
      try {
        const { data, error } = await supabase
          .from('cheese_production_stats')
          .select('*')
          .order('date', { ascending: true })
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

        console.log('Production stats:', data);
        return data || [];
      } catch (error) {
        console.error('Failed to fetch production stats:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: true
  });

  if (productionError) {
    console.error('Production error:', productionError);
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to fetch production data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoadingProduction || isLoadingStats) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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