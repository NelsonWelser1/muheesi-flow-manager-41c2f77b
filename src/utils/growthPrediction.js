
/**
 * Utility functions for predicting cattle growth measurements
 */

/**
 * Predicts the next weight based on historical data and cattle age
 * @param {number} currentWeight - Current weight in kg
 * @param {number} ageInMonths - Age of the cattle in months
 * @param {string} breed - Breed of the cattle
 * @returns {number} - Predicted weight in kg
 */
export const predictWeight = (currentWeight, ageInMonths, breed) => {
  // Growth rate varies by breed and age (kg per month)
  const breedGrowthRates = {
    'Holstein': [25, 22, 18, 15], // 0-6m, 7-12m, 13-24m, 25m+
    'Jersey': [20, 18, 15, 12],
    'Friesian': [23, 20, 17, 14],
    'Ankole': [18, 15, 13, 10],
    'Boran': [22, 19, 16, 13],
    'default': [20, 18, 15, 12], // Default growth rate if breed not found
  };
  
  // Select appropriate growth rate based on age
  let growthRateIndex = 0;
  if (ageInMonths > 6 && ageInMonths <= 12) growthRateIndex = 1;
  else if (ageInMonths > 12 && ageInMonths <= 24) growthRateIndex = 2;
  else if (ageInMonths > 24) growthRateIndex = 3;
  
  // Get growth rate for the breed or use default
  const growthRates = breedGrowthRates[breed] || breedGrowthRates.default;
  const monthlyGrowthRate = growthRates[growthRateIndex];
  
  // Predict next month's weight (with some randomization for realism)
  const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
  const predictedGrowth = monthlyGrowthRate * randomFactor;
  
  return Math.round((currentWeight + predictedGrowth) * 10) / 10; // Round to 1 decimal place
};

/**
 * Predicts the next height based on current height and age
 * @param {number} currentHeight - Current height in cm
 * @param {number} ageInMonths - Age of the cattle in months
 * @returns {number} - Predicted height in cm
 */
export const predictHeight = (currentHeight, ageInMonths) => {
  // Height growth slows down with age
  let growthFactor = 0;
  
  if (ageInMonths < 6) growthFactor = 0.03;
  else if (ageInMonths < 12) growthFactor = 0.02;
  else if (ageInMonths < 24) growthFactor = 0.01;
  else growthFactor = 0.005;
  
  const randomVariation = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
  const heightIncrease = currentHeight * growthFactor * randomVariation;
  
  return Math.round((currentHeight + heightIncrease) * 10) / 10; // Round to 1 decimal place
};

/**
 * Predicts body condition score based on current metrics
 * @param {number} currentWeight - Current weight in kg
 * @param {number} optimalWeight - Optimal weight for breed and age
 * @returns {number} - Body condition score (1-5 scale)
 */
export const predictBodyCondition = (currentWeight, optimalWeight) => {
  // Calculate ratio of current weight to optimal weight
  const ratio = currentWeight / optimalWeight;
  
  // Map ratio to body condition score (1-5 scale)
  if (ratio < 0.8) return 2; // Underweight
  else if (ratio < 0.9) return 3; // Slightly underweight
  else if (ratio < 1.1) return 4; // Optimal
  else return 5; // Overweight
};

/**
 * Generate predictive growth data for a cattle
 * @param {object} cattle - Cattle data object
 * @param {Array} historicalData - Previous growth measurements
 * @returns {object} - Predicted growth measurements
 */
export const generatePredictiveGrowth = (cattle, historicalData = []) => {
  // Default values if no historical data
  let currentWeight = 0;
  let currentHeight = 0;
  let ageInMonths = 24; // Default age
  
  // Extract data from cattle object
  const breed = cattle?.breed || 'default';
  
  // If we have cattle data with date of birth, calculate age
  if (cattle?.date_of_birth) {
    const birthDate = new Date(cattle.date_of_birth);
    const today = new Date();
    const diffTime = Math.abs(today - birthDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    ageInMonths = Math.floor(diffDays / 30);
  }
  
  // Use historical data if available, otherwise use cattle data
  if (historicalData.length > 0) {
    const latestRecord = historicalData[0]; // Assume sorted with newest first
    currentWeight = latestRecord.weight || cattle?.weight || 350;
    currentHeight = latestRecord.height || 140;
  } else {
    currentWeight = cattle?.weight || 350;
    currentHeight = 140; // Default height if not available
  }
  
  // Calculate optimal weight based on breed and age
  const breedWeightFactors = {
    'Holstein': 1.2,
    'Jersey': 0.8,
    'Friesian': 1.1,
    'Ankole': 1.0,
    'Boran': 1.1,
    'default': 1.0
  };
  
  const breedFactor = breedWeightFactors[breed] || breedWeightFactors.default;
  const baseOptimalWeight = 150 + (ageInMonths * 20);
  const optimalWeight = baseOptimalWeight * breedFactor;
  
  // Generate predictions
  const predictedWeight = predictWeight(currentWeight, ageInMonths, breed);
  const predictedHeight = predictHeight(currentHeight, ageInMonths);
  const bodyCondition = predictBodyCondition(currentWeight, optimalWeight);
  
  return {
    measurement_date: new Date().toISOString().split('T')[0],
    weight: predictedWeight,
    height: predictedHeight,
    girth: Math.round(predictedWeight / 2.3), // Estimated girth based on weight
    body_condition_score: bodyCondition,
    notes: `AI-generated prediction based on ${historicalData.length} historical records. Age: ${ageInMonths} months.`,
    is_prediction: true
  };
};
