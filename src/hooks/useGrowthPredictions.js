
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { generatePredictiveGrowth } from '@/utils/growthPrediction';

/**
 * Custom hook for generating growth predictions
 */
export const useGrowthPredictions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Fetch historical growth data and generate prediction
   * @param {string} cattleId - ID of the cattle
   */
  const generatePrediction = async (cattleId) => {
    if (!cattleId) {
      toast({
        title: "Error",
        description: "Please select a cattle first",
        variant: "destructive",
      });
      return null;
    }
    
    setLoading(true);
    
    try {
      // Fetch cattle details
      const { data: cattleData, error: cattleError } = await supabase
        .from('cattle_inventory')
        .select('*')
        .eq('id', cattleId)
        .single();
        
      if (cattleError) throw cattleError;
      
      // Fetch historical growth data
      const { data: historicalData, error: historicalError } = await supabase
        .from('cattle_growth_metrics')
        .select('*')
        .eq('cattle_id', cattleId)
        .order('measurement_date', { ascending: false })
        .limit(5);
        
      if (historicalError) throw historicalError;
      
      // Generate prediction based on cattle data and history
      const prediction = generatePredictiveGrowth(cattleData, historicalData);
      
      toast({
        title: "Prediction Generated",
        description: `Predicted weight: ${prediction.weight}kg, Height: ${prediction.height}cm`,
      });
      
      return prediction;
    } catch (error) {
      console.error("Error generating prediction:", error);
      toast({
        title: "Error",
        description: "Failed to generate prediction",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return { generatePrediction, loading };
};
