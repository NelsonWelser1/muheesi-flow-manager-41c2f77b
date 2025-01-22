import React from 'react';
import { useCheeseProduction, useProductionStats } from '@/hooks/useCheeseProduction';
import ProductionBatchCard from './components/ProductionBatchCard';
import ProductionStats from './components/ProductionStats';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const CheeseProductionMonitor = () => {
  console.log('Rendering CheeseProductionMonitor');
  
  const { 
    data: productionData, 
    isLoading: isLoadingProduction,
    error: productionError 
  } = useCheeseProduction();
  
  const { 
    data: statsData, 
    isLoading: isLoadingStats,
    error: statsError 
  } = useProductionStats();

  if (isLoadingProduction || isLoadingStats) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (productionError || statsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {productionError?.message || statsError?.message || 'Failed to load production data'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Production Batches</h3>
          {productionData?.map((batch) => (
            <ProductionBatchCard key={batch.id} batch={batch} />
          ))}
        </div>
        
        <ProductionStats stats={statsData || []} />
      </div>
    </div>
  );
};

export default CheeseProductionMonitor;