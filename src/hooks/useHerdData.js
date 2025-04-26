
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useHerdData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [herdData, setHerdData] = useState({
    health: [],
    growth: [],
    breeding: []
  });
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch health records
      const { data: healthData, error: healthError } = await supabase
        .from('cattle_health_records')
        .select('*, cattle_inventory(tag_number, name)')
        .order('record_date', { ascending: false });
      
      if (healthError) throw healthError;

      // Fetch growth records when table exists
      const { data: growthData, error: growthError } = await supabase
        .from('cattle_growth_metrics')
        .select('*, cattle_inventory(tag_number, name)')
        .order('measurement_date', { ascending: false });

      // Fetch breeding records when table exists  
      const { data: breedingData, error: breedingError } = await supabase
        .from('cattle_breeding_records')
        .select('*, cattle_inventory(tag_number, name)')
        .order('record_date', { ascending: false });

      setHerdData({
        health: healthData || [],
        growth: growthData || [],
        breeding: breedingData || []
      });

      toast({
        title: "Data refreshed successfully",
        description: "The latest records have been loaded.",
      });

    } catch (err) {
      console.error('Error fetching herd data:', err);
      setError(err);
      toast({
        title: "Error refreshing data",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  return {
    herdData,
    loading,
    error,
    refreshData: fetchData
  };
};
