
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const EquipmentList = () => {
  const { data: equipmentList } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_maintenance')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipmentList?.map((equipment) => (
          <Card key={equipment.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {equipment.equipment_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`text-sm font-medium ${
                    equipment.status === 'operational' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {equipment.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Health Score</span>
                  <span className="text-sm font-medium">{equipment.health_score}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Maintenance</span>
                  <span className="text-sm">
                    {new Date(equipment.last_maintenance).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!equipmentList?.length && (
          <p className="text-muted-foreground col-span-full text-center py-4">
            No equipment found
          </p>
        )}
      </div>
    </div>
  );
};

export default EquipmentList;
