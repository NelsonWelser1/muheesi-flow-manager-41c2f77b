
/**
 * Utility functions for filtering coffee data by operation type
 */

/**
 * Filters stock data based on operation type
 * @param {Array} data - The data to filter
 * @param {string} operationType - The operation type to filter by
 * @returns {Array} - Filtered data
 */
export const filterDataByOperationType = (data, operationType) => {
  if (!data || data.length === 0) return [];
  if (!operationType || operationType === 'all') return data;
  
  // Convert operation type to lowercase for case-insensitive comparison
  const opType = operationType.toLowerCase();
  
  return data.filter(item => {
    // Extract operation type from item data
    let itemOpType = determineOperationType(item);
    return itemOpType === opType;
  });
};

/**
 * Determines the operation type of a data item
 * @param {Object} item - The data item
 * @returns {string} - The operation type
 */
export const determineOperationType = (item) => {
  // Check if item has an explicit operation_type field
  if (item.operation_type) {
    return item.operation_type.toLowerCase();
  }
  
  // Determine operation type based on table or data structure
  if (item.is_partner_transfer === true) {
    return 'partner-stock';
  }
  
  if (item.source_location && item.destination_location) {
    return 'relocate-stock';
  }
  
  if (item.buyer_name || item.buyer_contact || item.selling_price) {
    return 'sell-stock';
  }
  
  if (item.buying_price || item.humidity) {
    return 'receive-new';
  }
  
  // For transfers, check other fields
  if (item.name && typeof item.name === 'string') {
    const name = item.name.toLowerCase();
    if (name.includes('sale')) return 'sell-stock';
    if (name.includes('transfer') || name.includes('relocat')) return 'relocate-stock';
    if (name.includes('partner')) return 'partner-stock';
  }
  
  // Default to receive-new if no clear indicators
  return 'receive-new';
};

/**
 * Maps an operation type to its corresponding table name
 * @param {string} operationType - The operation type
 * @returns {string} - The corresponding table name
 */
export const getTableForOperationType = (operationType) => {
  switch (operationType) {
    case 'receive-new':
      return 'coffee_stock';
    case 'sell-stock':
      return 'coffee_sales';
    case 'relocate-stock':
    case 'partner-stock':
      return 'coffee_stock_transfers';
    default:
      return '';
  }
};
