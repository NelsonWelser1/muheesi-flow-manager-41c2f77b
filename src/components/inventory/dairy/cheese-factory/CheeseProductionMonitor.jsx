import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Thermometer, Timer, AlertCircle } from 'lucide-react';

const CheeseProductionMonitor = () => {
  const { data: productionData, isLoading } = useQuery({
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
        throw error;
      }

      console.log('Cheese production data:', data);
      return data;
    },
  });

  return (
    <div className="space-y-4">
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