
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useMilkReceptionSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    temperature_threshold: 4.5,
    capacity_warning_threshold: 90,
    auto_cleaning_enabled: false,
    cleaning_interval: 7,
    maintenance_interval: 30
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings) => {
      const { data, error } = await supabase
        .from('milk_reception_settings')
        .upsert([{
          id: 'default',
          ...newSettings,
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milkReceptionSettings'] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error) => {
      console.error('Settings update error:', error);
      toast({
        title: "Error",
        description: "Failed to update settings: " + error.message,
        variant: "destructive"
      });
    }
  });

  return {
    settings,
    setSettings,
    updateSettingsMutation
  };
};
