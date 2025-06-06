
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { predictProduction } from '@/utils/productionAI';

/**
 * Hook for generating cattle growth predictions
 */
export const useGrowthPredictions = (cattleData = []) => {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch historical growth data to use as a baseline
  const fetchHistoricalData = async () => {
    try {
      // Try to fetch data from Supabase
      const { data, error } = await supabase
        .from('cattle_growth_metrics')
        .select('*')
        .order('measurement_date', { ascending: false });
      
      // If error is "relation does not exist", just return empty array
      if (error && error.code === '42P01') {
        console.error('Error fetching historical growth data:', error);
        return [];
      }
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching historical growth data:', err);
      return [];
    }
  };

  // Generate predictions for a specific cattle
  const generatePredictionsForCattle = async (cattle, historicalData) => {
    if (!cattle) return null;
    
    // Get breed-specific growth rates (these would come from research/standards)
    const breedGrowthRates = {
      'Ankole': 0.7, // kg/day
      'Ankole Longhorn': 0.65,
      'Holstein': 0.85,
      'Jersey': 0.6,
      'Friesian': 0.8,
      'Brahman': 0.75,
      'Boran': 0.7,
      // Default growth rate if breed not found
      'default': 0.7
    };
    
    // Calculate age in months
    const birthDate = cattle.date_of_birth ? new Date(cattle.date_of_birth) : null;
    const ageInMonths = birthDate ? Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24 * 30.4)) : 24;
    
    // Get growth rate based on breed, or use default
    const dailyGrowthRate = breedGrowthRates[cattle.breed] || breedGrowthRates.default;
    
    // Cattle type affects growth patterns
    const growthMultiplier = cattle.cattle_type === 'dairy' ? 0.9 : 1.1;
    
    // Current weight or estimated weight based on age and breed
    const currentWeight = cattle.weight || (ageInMonths * 15 + 40);
    
    // Generate 6-month projection data (180 days)
    const projectionData = Array.from({ length: 7 }).map((_, index) => {
      const monthsAhead = index;
      const daysAhead = monthsAhead * 30;
      const projectedWeight = currentWeight + (dailyGrowthRate * growthMultiplier * daysAhead);
      
      // Calculate height based on weight (rough estimation)
      const projectedHeight = Math.floor(100 + (projectedWeight / 10));
      
      // Body condition score tends to improve with proper feeding
      let bodyCond = 3; // Default is moderate
      if (projectedWeight > currentWeight * 1.2) bodyCond = 4; // Good
      if (projectedWeight > currentWeight * 1.4) bodyCond = 5; // Excellent
      
      return {
        months: monthsAhead,
        date: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight: Math.round(projectedWeight),
        height: projectedHeight,
        girth: Math.round(projectedHeight * 1.3), // Estimate girth based on height
        body_condition_score: bodyCond,
        daily_gain: parseFloat((dailyGrowthRate * growthMultiplier).toFixed(2)),
        feed_conversion_ratio: parseFloat((3.5 + Math.random() * 1.5).toFixed(2)), // Random FCR between 3.5-5
      };
    });
    
    return {
      cattle_id: cattle.id,
      tag_number: cattle.tag_number || `TAG-${Math.floor(Math.random() * 10000)}`,
      name: cattle.name || 'Unnamed',
      breed: cattle.breed || 'Unknown Breed',
      type: cattle.cattle_type || 'dairy',
      age_months: ageInMonths,
      projections: projectionData
    };
  };

  // Generate predictions for all cattle
  const generatePredictions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // If no cattle data, create sample data
      const cattleToProcess = cattleData && cattleData.length > 0 ? cattleData : generateSampleCattleData();
      
      const historicalData = await fetchHistoricalData();
      
      // Generate predictions for each cattle
      const allPredictions = await Promise.all(
        cattleToProcess.map(cattle => generatePredictionsForCattle(cattle, historicalData))
      );
      
      // Filter out any null predictions
      setPredictions(allPredictions.filter(Boolean));
      setIsLoading(false);
    } catch (err) {
      console.error('Error generating predictions:', err);
      setError(err.message || 'Failed to generate predictions');
      
      // Even if we have an error, try to generate sample data
      try {
        const sampleCattle = generateSampleCattleData();
        const samplePredictions = await Promise.all(
          sampleCattle.map(cattle => generatePredictionsForCattle(cattle, []))
        );
        setPredictions(samplePredictions.filter(Boolean));
      } catch (fallbackErr) {
        console.error('Error generating fallback predictions:', fallbackErr);
      }
      
      setIsLoading(false);
    }
  };
  
  // Generate sample cattle data when real data isn't available
  const generateSampleCattleData = () => {
    const breeds = ['Ankole', 'Holstein', 'Jersey', 'Friesian', 'Brahman'];
    const types = ['dairy', 'beef'];
    
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `sample-${i + 1}`,
      tag_number: `TAG-${1000 + i}`,
      name: `Sample Cow ${i + 1}`,
      breed: breeds[i % breeds.length],
      cattle_type: types[i % types.length],
      weight: 250 + (i * 50),
      date_of_birth: new Date(Date.now() - (24 + i * 3) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  };

  // This will run whenever cattleData changes
  useEffect(() => {
    generatePredictions();
  }, [cattleData]);

  return {
    predictions,
    isLoading,
    error,
    regeneratePredictions: generatePredictions
  };
};
