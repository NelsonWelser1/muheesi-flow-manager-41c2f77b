
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import HealthRecordsView from "../cattle/health/HealthRecordsView";

const HerdManagement = () => {
  const [activeTab, setActiveTab] = useState("health");
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Additional logic can be added here if needed
      toast({
        title: "Data Refreshed",
        description: "Herd management data has been refreshed.",
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Herd Management</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 h-14 rounded-lg bg-muted/30 p-1">
          <TabsTrigger value="health">Health Records</TabsTrigger>
          <TabsTrigger value="growth">Growth Metrics</TabsTrigger>
          <TabsTrigger value="breeding">Breeding Records</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <HealthRecordsView />
        </TabsContent>

        <TabsContent value="growth">
          <div className="p-6 bg-slate-50 rounded-lg text-center">
            <h3 className="text-xl font-medium mb-4">Growth Metrics Coming Soon</h3>
            <p>This feature is under development. Check back later for updates!</p>
          </div>
        </TabsContent>

        <TabsContent value="breeding">
          <div className="p-6 bg-slate-50 rounded-lg text-center">
            <h3 className="text-xl font-medium mb-4">Breeding Records Coming Soon</h3>
            <p>This feature is under development. Check back later for updates!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HerdManagement;
