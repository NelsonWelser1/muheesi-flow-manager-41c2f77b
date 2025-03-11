
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";

export const useDossierData = (searchQuery = '') => {
  // Fetch employee dossiers using React Query
  const { data: dossiers = [], isLoading, error } = useQuery({
    queryKey: ['employeeDossiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personnel_employee_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredDossiers = searchQuery 
    ? dossiers.filter(dossier => 
        dossier.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : dossiers;

  return { dossiers: filteredDossiers, isLoading, error };
};
