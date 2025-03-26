
/**
 * Coffee analytics utilities
 */

/**
 * Calculate the total inventory value based on current stock and unit prices
 * @param {Array} stockItems - Array of stock items with quantity and unit_cost
 * @returns {Object} - Total value and breakdown by coffee type
 */
export const calculateTotalInventoryValue = (stockItems = []) => {
  if (!stockItems || stockItems.length === 0) {
    return { 
      totalValue: 0, 
      arabicaValue: 0, 
      robustaValue: 0,
      otherValue: 0
    };
  }

  return stockItems.reduce((acc, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitCost = parseFloat(item.unit_cost) || 0;
    const itemValue = quantity * unitCost;
    
    acc.totalValue += itemValue;
    
    // Categorize value by coffee type
    if (item.coffee_type === 'arabica' || (item.item_name && item.item_name.toLowerCase().includes('arabica'))) {
      acc.arabicaValue += itemValue;
    } else if (item.coffee_type === 'robusta' || (item.item_name && item.item_name.toLowerCase().includes('robusta'))) {
      acc.robustaValue += itemValue;
    } else {
      acc.otherValue += itemValue;
    }
    
    return acc;
  }, { 
    totalValue: 0, 
    arabicaValue: 0, 
    robustaValue: 0,
    otherValue: 0
  });
};

/**
 * Get a summary of coffee inventory by type, grade, and location
 * @param {Array} stockItems - Array of stock items
 * @returns {Object} - Summarized inventory data
 */
export const getCoffeeInventorySummary = (stockItems = []) => {
  if (!stockItems || stockItems.length === 0) {
    return {
      byType: [],
      byGrade: [],
      byLocation: [],
      totalQuantity: 0
    };
  }
  
  // Initialize summary objects
  const typeMap = {};
  const gradeMap = {};
  const locationMap = {};
  let totalQuantity = 0;
  
  // Process each stock item
  stockItems.forEach(item => {
    const quantity = parseFloat(item.quantity) || 0;
    totalQuantity += quantity;
    
    // Process by coffee type
    const coffeeType = item.coffee_type || 
                       (item.item_name && item.item_name.toLowerCase().includes('arabica') ? 'arabica' : 
                       item.item_name && item.item_name.toLowerCase().includes('robusta') ? 'robusta' : 
                       'other');
    
    if (!typeMap[coffeeType]) {
      typeMap[coffeeType] = { type: coffeeType, quantity: 0 };
    }
    typeMap[coffeeType].quantity += quantity;
    
    // Process by quality grade
    const grade = item.quality_grade || 'Standard';
    if (!gradeMap[grade]) {
      gradeMap[grade] = { grade, quantity: 0 };
    }
    gradeMap[grade].quantity += quantity;
    
    // Process by location
    const location = item.location || item.source_location || 'Unknown';
    if (!locationMap[location]) {
      locationMap[location] = { location, quantity: 0 };
    }
    locationMap[location].quantity += quantity;
  });
  
  // Convert maps to arrays and sort by quantity
  const byType = Object.values(typeMap).sort((a, b) => b.quantity - a.quantity);
  const byGrade = Object.values(gradeMap).sort((a, b) => b.quantity - a.quantity);
  const byLocation = Object.values(locationMap).sort((a, b) => b.quantity - a.quantity);
  
  return {
    byType,
    byGrade,
    byLocation,
    totalQuantity
  };
};

/**
 * Calculate trend data based on historical records
 * @param {Array} records - Array of transfer records with timestamps
 * @param {number} days - Number of days to analyze
 * @returns {Object} - Trend data including daily volumes and growth rates
 */
export const calculateTrends = (records = [], days = 30) => {
  if (!records || records.length === 0) {
    return {
      dailyVolumes: [],
      weeklyGrowth: 0,
      monthlyGrowth: 0
    };
  }
  
  // Sort records by date
  const sortedRecords = [...records].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  
  // Set date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  
  // Create day buckets
  const dailyData = {};
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    dailyData[dateKey] = {
      date: dateKey,
      arabica: 0,
      robusta: 0,
      total: 0
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Fill data into buckets
  sortedRecords.forEach(record => {
    const recordDate = new Date(record.created_at);
    if (recordDate >= startDate && recordDate <= endDate) {
      const dateKey = recordDate.toISOString().split('T')[0];
      const quantity = parseFloat(record.quantity) || 0;
      
      if (dailyData[dateKey]) {
        if (record.coffee_type === 'arabica') {
          dailyData[dateKey].arabica += quantity;
        } else if (record.coffee_type === 'robusta') {
          dailyData[dateKey].robusta += quantity;
        }
        dailyData[dateKey].total += quantity;
      }
    }
  });
  
  // Convert to array and calculate growth
  const dailyVolumes = Object.values(dailyData);
  
  // Calculate weekly growth (last 7 days vs previous 7 days)
  const last7Days = dailyVolumes.slice(-7);
  const previous7Days = dailyVolumes.slice(-14, -7);
  
  const last7Total = last7Days.reduce((sum, day) => sum + day.total, 0);
  const previous7Total = previous7Days.reduce((sum, day) => sum + day.total, 0);
  
  const weeklyGrowth = previous7Total === 0 ? 0 : ((last7Total - previous7Total) / previous7Total) * 100;
  
  // Calculate monthly growth (last 30 days vs previous 30 days)
  const last30Days = dailyVolumes.slice(-30);
  const previous30Days = dailyVolumes.slice(-60, -30);
  
  const last30Total = last30Days.reduce((sum, day) => sum + day.total, 0);
  const previous30Total = previous30Days.reduce((sum, day) => sum + day.total, 0);
  
  const monthlyGrowth = previous30Total === 0 ? 0 : ((last30Total - previous30Total) / previous30Total) * 100;
  
  return {
    dailyVolumes,
    weeklyGrowth,
    monthlyGrowth
  };
};
