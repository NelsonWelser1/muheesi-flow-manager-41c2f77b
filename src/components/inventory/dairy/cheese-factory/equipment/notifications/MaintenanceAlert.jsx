
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const MaintenanceAlert = () => {
  const { data: urgentMaintenance } = useQuery({
    queryKey: ['urgentMaintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_maintenance')
        .select('*')
        .or('status.eq.critical,health_score.lt.40')
        .order('next_maintenance');
      
      if (error) throw error;
      return data;
    }
  });

  if (!urgentMaintenance?.length) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Urgent Maintenance Required</AlertTitle>
      <AlertDescription>
        {urgentMaintenance.length} equipment {urgentMaintenance.length === 1 ? 'item needs' : 'items need'} immediate attention.
      </AlertDescription>
    </Alert>
  );
};

export default MaintenanceAlert;
