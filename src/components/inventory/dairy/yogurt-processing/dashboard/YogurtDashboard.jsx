
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const YogurtDashboard = () => {
  const { data: productionStats } = useQuery({
    queryKey: ['yogurtProductionStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('yogurt_milk_preparation')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{productionStats?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Production</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {productionStats?.reduce((acc, curr) => acc + Number(curr.milk_volume), 0) || 0} L
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quality Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">All parameters within normal range</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Production Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {productionStats?.map((batch) => (
              <div key={batch.id} className="p-2 border rounded">
                <p className="font-medium">Batch ID: {batch.batch_id}</p>
                <p className="text-sm text-gray-600">
                  Volume: {batch.milk_volume}L | Started: {new Date(batch.date_time).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YogurtDashboard;
