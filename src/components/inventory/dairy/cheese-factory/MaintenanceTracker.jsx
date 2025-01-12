import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Tool, Calendar, AlertTriangle } from 'lucide-react';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Maintenance</CardTitle>
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
                    <Tool className="h-5 w-5" />
                    <h3 className="font-semibold">{item.equipment_name}</h3>
                  </div>
                  <Badge 
                    className={
                      item.status === 'due' ? 'bg-red-500' : 
                      item.status === 'upcoming' ? 'bg-yellow-500' : 
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
                    <AlertTriangle className="h-4 w-4" />
                    <span>{item.maintenance_type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceTracker;