import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const MaintenanceTracker = () => {
  const { data: maintenanceData, isLoading } = useQuery({
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
      return data;
    },
  });

  const { data: maintenanceStats } = useQuery({
    queryKey: ['maintenanceStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_stats')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
  });

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
          {isLoading ? (
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