
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useBukomeroDairyData = () => {
  const [farmMetrics, setFarmMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchFarmMetrics = async () => {
    setIsLoading(true);
    try {
      // Get cattle counts from cattle_inventory
      const { data: cattleData, error: cattleError } = await supabase
        .from('cattle_inventory')
        .select('cattle_type, count')
        .eq('farm_id', 'bukomero');

      if (cattleError) throw cattleError;

      // Get milk production data
      const { data: milkData, error: milkError } = await supabase
        .from('milk_production')
        .select('date, total_volume')
        .eq('farm_id', 'bukomero')
        .order('date', { ascending: false })
        .limit(30);

      if (milkError) throw milkError;

      // Get fattening program data
      const { data: fatteningData, error: fatteningError } = await supabase
        .from('cattle_fattening')
        .select('status, count')
        .eq('farm_id', 'bukomero');

      if (fatteningError) throw fatteningError;

      // Calculate metrics
      const totalCattle = cattleData.reduce((sum, type) => sum + (type.count || 0), 0);
      
      const activeFattening = fatteningData
        .filter(item => item.status === 'active')
        .reduce((sum, item) => sum + (item.count || 0), 0);
      
      const avgMilkProduction = milkData.length > 0
        ? milkData.slice(0, 7).reduce((sum, day) => sum + (day.total_volume || 0), 0) / 
          Math.min(7, milkData.length)
        : 0;

      // Set consolidated metrics
      setFarmMetrics({
        totalCattle,
        milkProduction: `${avgMilkProduction.toFixed(0)} liters/day`,
        activeFattening,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error fetching Bukomero dairy data:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmMetrics();
    
    // Set up real-time subscriptions for live updates
    const cattleSubscription = supabase
      .channel('cattle-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'cattle_inventory',
        filter: 'farm_id=eq.bukomero'
      }, () => {
        fetchFarmMetrics();
      })
      .subscribe();
      
    const milkSubscription = supabase
      .channel('milk-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'milk_production',
        filter: 'farm_id=eq.bukomero'
      }, () => {
        fetchFarmMetrics();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(cattleSubscription);
      supabase.removeChannel(milkSubscription);
    };
  }, []);

  return {
    farmMetrics,
    isLoading,
    error,
    refreshMetrics: fetchFarmMetrics
  };
};
