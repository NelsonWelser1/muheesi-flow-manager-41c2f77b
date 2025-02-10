
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Boxes, ArrowLeftRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';
import { getIoTSensorData } from '@/utils/iotIntegration';

const MetricsCards = () => {
  // Fetch temperature data from IoT sensors
  const { data: sensorData } = useQuery({
    queryKey: ['coldRoomSensors'],
    queryFn: getIoTSensorData,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch inventory totals
  const { data: inventoryData } = useQuery({
    queryKey: ['coldRoomInventoryTotals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cold_room_inventory')
        .select('quantity_stored, movement_action')
        .gte('storage_date_time', new Date(new Date().setHours(0,0,0,0)).toISOString());
      
      if (error) throw error;
      
      const totals = data.reduce((acc, curr) => {
        acc.total += curr.quantity_stored;
        if (curr.movement_action === 'In') acc.in += 1;
        if (curr.movement_action === 'Out') acc.out += 1;
        return acc;
      }, { total: 0, in: 0, out: 0 });
      
      return totals;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Current Temperature
          </CardTitle>
          <Thermometer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {sensorData?.sensors?.temperature?.toFixed(1) || '---'}°C
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Inventory
          </CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inventoryData?.total || 0} units</div>
          <p className="text-xs text-muted-foreground">
            Across all cold rooms
          </p>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today's Movements
          </CardTitle>
          <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(inventoryData?.in || 0) + (inventoryData?.out || 0)}</div>
          <p className="text-xs text-muted-foreground">
            {inventoryData?.in || 0} in / {inventoryData?.out || 0} out
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
