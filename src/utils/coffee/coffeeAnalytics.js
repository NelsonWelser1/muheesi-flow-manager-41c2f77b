
/**
 * Calculate total inventory value from coffee stock entries
 * @param {Array} coffeeStockEntries - Array of coffee stock entries
 * @returns {number} - Total inventory value
 */
export const calculateTotalInventoryValue = (coffeeStockEntries) => {
  if (!Array.isArray(coffeeStockEntries) || coffeeStockEntries.length === 0) {
    return 0;
  }
  
  return coffeeStockEntries.reduce((sum, entry) => {
    // Skip entries that don't have both buying_price and quantity
    if (!entry.buying_price || !entry.quantity) {
      return sum;
    }
    
    const itemValue = parseFloat(entry.buying_price) * parseFloat(entry.quantity);
    return sum + (isNaN(itemValue) ? 0 : itemValue);
  }, 0);
};

/**
 * Get summary statistics for coffee inventory 
 * @param {Array} coffeeStockEntries - Array of coffee stock entries
 * @returns {Object} - Summary statistics
 */
export const getCoffeeInventorySummary = (coffeeStockEntries) => {
  if (!Array.isArray(coffeeStockEntries) || coffeeStockEntries.length === 0) {
    return {
      totalEntries: 0,
      totalValue: 0,
      arabicaQuantity: 0,
      robustaQuantity: 0,
      statusCounts: {
        active: 0,
        sold: 0,
        relocated: 0,
        expired: 0
      }
    };
  }
  
  // Initialize counters
  let arabicaQuantity = 0;
  let robustaQuantity = 0;
  const statusCounts = {
    active: 0,
    sold: 0,
    relocated: 0,
    expired: 0
  };
  
  // Process each entry
  coffeeStockEntries.forEach(entry => {
    // Count by coffee type
    if (entry.coffee_type === 'arabica' && entry.quantity) {
      arabicaQuantity += parseFloat(entry.quantity);
    } else if (entry.coffee_type === 'robusta' && entry.quantity) {
      robustaQuantity += parseFloat(entry.quantity);
    }
    
    // Count by status
    if (entry.status && statusCounts[entry.status] !== undefined) {
      statusCounts[entry.status]++;
    }
  });
  
  return {
    totalEntries: coffeeStockEntries.length,
    totalValue: calculateTotalInventoryValue(coffeeStockEntries),
    arabicaQuantity,
    robustaQuantity,
    statusCounts
  };
};
