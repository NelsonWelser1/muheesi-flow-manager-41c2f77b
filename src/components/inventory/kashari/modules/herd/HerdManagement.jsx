
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useHerdData } from '@/hooks/useHerdData';
import HealthRecordsView from '../cattle/health/HealthRecordsView';
import GrowthMetricsView from '../cattle/growth/GrowthMetricsView';
import BreedingRecordsView from '../cattle/breeding/BreedingRecordsView';

const HerdManagement = () => {
  const [activeTab, setActiveTab] = useState('health');
  const { herdData, loading, refreshData } = useHerdData();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Herd Management</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 h-14 rounded-lg bg-muted/30 p-1">
          <TabsTrigger value="health">Health Records</TabsTrigger>
          <TabsTrigger value="growth">Growth Metrics</TabsTrigger>
          <TabsTrigger value="breeding">Breeding Records</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <HealthRecordsView records={herdData.health} onRefresh={refreshData} />
        </TabsContent>
        
        <TabsContent value="growth">
          <GrowthMetricsView records={herdData.growth} onRefresh={refreshData} />
        </TabsContent>
        
        <TabsContent value="breeding">
          <BreedingRecordsView records={herdData.breeding} onRefresh={refreshData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HerdManagement;
