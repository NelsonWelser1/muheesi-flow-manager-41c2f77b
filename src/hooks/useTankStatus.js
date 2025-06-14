
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useTankStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedTank, setSelectedTank] = useState(null);
  const [outOfServiceDate, setOutOfServiceDate] = useState(null);
  const [outOfServiceTime, setOutOfServiceTime] = useState('');

  const updateTankStatusMutation = useMutation({
    mutationFn: async ({ tankName, status, endDate = null }) => {
      let finalDate = null;
      if (endDate && outOfServiceTime) {
        const [hours, minutes] = outOfServiceTime.split(':');
        finalDate = new Date(endDate);
        finalDate.setHours(parseInt(hours), parseInt(minutes));
      } else if (endDate) {
        finalDate = endDate;
      }

      console.log('Updating tank status:', { tankName, status, finalDate });

      const { data, error } = await supabase
        .from('storage_tanks')
        .update({
          status: status,
          service_end_date: finalDate?.toISOString()
        })
        .eq('tank_name', tankName)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milkReception'] });
      queryClient.invalidateQueries({ queryKey: ['storageTanks'] });
      toast({
        title: "Success",
        description: "Tank status updated successfully",
      });
      setShowStatusDialog(false);
      setSelectedTank(null);
      setOutOfServiceDate(null);
      setOutOfServiceTime('');
    },
    onError: (error) => {
      console.error('Status update error:', error);
      toast({
        title: "Error",
        description: "Failed to update tank status: " + error.message,
        variant: "destructive"
      });
    }
  });

  return {
    showStatusDialog,
    setShowStatusDialog,
    selectedTank,
    setSelectedTank,
    outOfServiceDate,
    setOutOfServiceDate,
    outOfServiceTime,
    setOutOfServiceTime,
    updateTankStatusMutation
  };
};
