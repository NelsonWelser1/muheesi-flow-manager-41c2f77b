import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import MaintenanceEntryForm from './MaintenanceEntryForm';

const MaintenanceTracker = () => {
  const { data: maintenanceData, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      console.log('Fetching maintenance data');
      const { data, error } = await supabase
        .from('maintenance_records')
        .select('*')
        .order('next_maintenance', { ascending: true });

      if (error) {
        console.error('Error fetching maintenance data:', error);
        throw error;
      }

      const processedData = data?.map(record => {
        const lastMaintenance = new Date(record.last_maintenance);
        const nextMaintenance = new Date(record.next_maintenance);
        const interval = nextMaintenance.getTime() - lastMaintenance.getTime();
        
        const projections = [1, 2, 3].map(multiplier => {
          const projectedDate = new Date(nextMaintenance.getTime() + (interval * multiplier));
          return {
            date: projectedDate,
            projected: true
          };
        });

        return {
          ...record,
          projections
        };
      });

      return processedData || [];
    }
  });

  return (
    <div className="space-y-6">
      <MaintenanceEntryForm />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingMaintenance ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-4">
                {maintenanceData?.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-lg border transition-all duration-300"
                    style={{
                      borderRadius: 'calc(0.25 * min(100%, 100vh))',
                      backgroundColor: item.status === 'due' ? '#ea384c1a' :
                                    item.status === 'upcoming' ? '#F973161a' :
                                    item.status === 'overdue' ? '#8B5CF61a' :
                                    '#9b87f51a'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{item.equipment_name}</h3>
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: item.status === 'due' ? '#ea384c' :
                                        item.status === 'upcoming' ? '#F97316' :
                                        item.status === 'overdue' ? '#8B5CF6' :
                                        '#9b87f5',
                          color: 'white'
                        }}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Next Maintenance: {new Date(item.next_maintenance).toLocaleDateString()}</p>
                      <p>Projections:</p>
                      <ul className="pl-4">
                        {item.projections.map((projection, index) => (
                          <li key={index} className="text-muted-foreground">
                            {projection.date.toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceCalendar />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceTracker;
