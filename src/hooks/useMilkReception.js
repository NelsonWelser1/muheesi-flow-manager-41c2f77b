import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useMilkReception = () => {
  const queryClient = useQueryClient();

  const { data: receptionData, isLoading } = useQuery({
    queryKey: ['milkReception'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('milk_reception')
        .select('*')
        .order('datetime', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addMilkReception = useMutation({
    mutationFn: async (formData) => {
      console.log('Submitting milk reception data:', formData);
      const { data, error } = await supabase
        .from('milk_reception')
        .insert([{
          supplier_name: formData.supplierName,
          milk_volume: parseFloat(formData.milkVolume),
          temperature: parseFloat(formData.temperature),
          fat_percentage: parseFloat(formData.fatPercentage),
          protein_percentage: parseFloat(formData.proteinPercentage),
          total_plate_count: parseInt(formData.totalPlateCount),
          acidity: parseFloat(formData.acidity),
          notes: formData.notes,
          datetime: new Date().toISOString(),
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['milkReception']);
    },
  });

  return {
    receptionData,
    isLoading,
    addMilkReception,
  };
};