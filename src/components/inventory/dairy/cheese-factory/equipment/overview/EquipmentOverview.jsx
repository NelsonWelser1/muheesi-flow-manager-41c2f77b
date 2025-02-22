
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  AlertTriangle, 
  Check, 
  Clock, 
  ThermometerSnowflake, 
  Tool
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import PerformanceChart from './PerformanceChart';
import MaintenanceCalendar from './MaintenanceCalendar';
import { getIoTSensorData } from '@/utils/iotIntegration';

const EquipmentOverview = () => {
  const { data: equipmentStats } = useQuery({
    queryKey: ['equipmentStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_maintenance')
        .select('status, health_score');
      
      if (error) throw error;

      const stats = {
        total: data.length,
        operational: data.filter(item => item.status === 'operational').length,
        maintenance: data.filter(item => item.status === 'maintenance').length,
        avgHealth: data.reduce((acc, curr) => acc + curr.health_score, 0) / data.length
      };

      return stats;
    }
  });

  const { data: sensorData } = useQuery({
    queryKey: ['sensorData'],
    queryFn: getIoTSensorData,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  return (
    <div className="space-y-6">
      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Equipment Status
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipmentStats?.operational || 0}/{equipmentStats?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Operational equipment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Health
            </CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipmentStats?.avgHealth?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall equipment health
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Maintenance
            </CardTitle>
            <Tool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipmentStats?.maintenance || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Tasks requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Temperature Status
            </CardTitle>
            <ThermometerSnowflake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensorData?.sensors?.temperature?.toFixed(1) || 0}°C
            </div>
            <p className="text-xs text-muted-foreground">
              Average equipment temperature
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Maintenance Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceCalendar />
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card className="border-red-200">
        <CardHeader className="flex flex-row items-center space-y-0">
          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* We'll implement alerts here */}
            <p className="text-sm text-muted-foreground">No critical alerts at this time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentOverview;
