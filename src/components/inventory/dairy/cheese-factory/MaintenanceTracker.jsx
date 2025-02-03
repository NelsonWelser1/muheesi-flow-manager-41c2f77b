import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const MaintenanceTracker = () => {
  const { data: maintenanceData, isLoading: isLoadingMaintenance, error: maintenanceError } = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      console.log('Fetching maintenance data');
      const { data, error } = await supabase
        .from('equipment_maintenance')
        .select('*')
        .order('next_maintenance', { ascending: true });

      if (error) {
        console.error('Error fetching maintenance data:', error);
        throw error;
      }

      console.log('Maintenance data:', data);
      return data || [];
    },
  });

  const { data: maintenanceStats, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ['maintenanceStats'],
    queryFn: async () => {
      console.log('Fetching maintenance stats');
      try {
        const { data, error } = await supabase
          .from('maintenance_stats')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching maintenance stats:', error);
          throw error;
        }

        console.log('Maintenance stats:', data);
        if (!data) {
          console.log('No maintenance stats found, using defaults');
          return { completed_today: 0, equipment_health: 0, pending_maintenance: 0 };
        }
        return data;
      } catch (error) {
        console.error('Error in maintenance stats query:', error);
        return { completed_today: 0, equipment_health: 0, pending_maintenance: 0 };
      }
    },
  });

  if (isLoadingMaintenance || isLoadingStats) {
    return <div className="p-4">Loading maintenance data...</div>;
  }

  if (maintenanceError || statsError) {
    return (
      <div className="p-4 text-red-500">
        Error loading maintenance data. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Due Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {maintenanceData?.filter(item => item.status === 'due').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {maintenanceStats?.completed_today || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {maintenanceData?.filter(item => item.status === 'overdue').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Equipment Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceStats?.equipment_health || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMaintenance ? (
            <div>Loading maintenance data...</div>
          ) : (
            <div className="space-y-4">
              {maintenanceData?.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      <h3 className="font-semibold">{item.equipment_name}</h3>
                    </div>
                    <Badge 
                      className={
                        item.status === 'due' ? 'bg-yellow-500' : 
                        item.status === 'upcoming' ? 'bg-blue-500' : 
                        item.status === 'overdue' ? 'bg-red-500' :
                        'bg-green-500'
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Next: {new Date(item.next_maintenance).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Last: {new Date(item.last_maintenance).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{item.maintenance_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Health: {item.health_score}%</span>
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

export default MaintenanceTracker;
