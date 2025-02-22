
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, Clock, AlertOctagon } from "lucide-react";

const EquipmentList = () => {
  const { data: equipmentList, isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_maintenance')
        .select('*')
        .order('equipment_name');
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertOctagon className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-48">Loading equipment data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Equipment List</h2>
        <Button>Add Equipment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipmentList?.map((equipment) => (
          <Card key={equipment.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {equipment.equipment_name}
              </CardTitle>
              {getStatusIcon(equipment.status)}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(equipment.status)}>
                    {equipment.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Health Score</span>
                  <span className="font-medium">{equipment.health_score}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Maintenance</span>
                  <span className="text-sm">
                    {new Date(equipment.last_maintenance).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Next Due</span>
                  <span className="text-sm">
                    {new Date(equipment.next_maintenance).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!equipmentList?.length && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No equipment found</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
