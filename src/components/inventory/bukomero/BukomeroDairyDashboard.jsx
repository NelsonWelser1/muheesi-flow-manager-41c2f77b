
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { useBukomeroDairyData } from '@/hooks/useBukomeroDairyData';
import { Loader2, Milk, Beef, TrendingUp } from 'lucide-react';

const BukomeroDairyDashboard = () => {
  const { farmMetrics, isLoading, error, refreshMetrics } = useBukomeroDairyData();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading farm metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">Error loading farm data: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bukomero Dairy Farm Dashboard</h1>
        <button 
          onClick={refreshMetrics}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {farmMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
              <Beef className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farmMetrics.totalCattle}</div>
              <p className="text-xs text-muted-foreground">Active livestock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Milk Production</CardTitle>
              <Milk className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farmMetrics.milkProduction}</div>
              <p className="text-xs text-muted-foreground">Average daily production</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fattening Program</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farmMetrics.activeFattening}</div>
              <p className="text-xs text-muted-foreground">Cattle in program</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Farm Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the Bukomero Dairy Farm management dashboard. 
            Monitor your livestock, track milk production, and manage your fattening programs all in one place.
          </p>
          {farmMetrics?.lastUpdated && (
            <p className="text-xs text-muted-foreground mt-4">
              Last updated: {new Date(farmMetrics.lastUpdated).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroDairyDashboard;
