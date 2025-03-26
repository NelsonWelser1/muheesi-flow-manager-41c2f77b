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
  
  // For transfers, check if it's a partner transfer based on patterns in the data
  if (item.source_location && item.destination_location) {
    // Check if the item is a partner transfer
    if (item.is_partner_transfer === true) {
      return 'partner-stock';
    }
    
    // Regular stock transfer (not partner transfer)
    return 'relocate-stock';
  }
  
  // For sales data
  if (item.buyer_name || item.buyer_contact || item.selling_price) {
    return 'sell-stock';
  }
  
  // For new stock receipts
  if (item.buying_price || item.humidity) {
    return 'receive-new';
  }
  
  // For transfer records in coffee_stock_transfers table without is_partner_transfer field
  // We need to infer based on the available fields
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
  switch (operationType.toLowerCase()) {
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

/**
 * Special filter for partner stock data from transfers table
 * @param {Array} data - Data from coffee_stock_transfers table
 * @returns {Array} - Data filtered to only show partner stock transfers
 */
export const filterPartnerStockTransfers = (data) => {
  if (!data || data.length === 0) return [];
  
  // Since the current schema might not have is_partner_transfer field,
  // we need to infer this based on observed patterns in the data
  
  // For now, we'll consider transfers where destination_location matches
  // a known partner location pattern, or where the transaction implies
  // a partner relationship rather than a direct relocation
  return data.filter(item => {
    // Add logic to identify partner transfers
    // This is a simple example - adjust based on your specific data patterns
    if (item.operation_type === 'partner-stock') return true;
    
    // Check if this is a receipt from a partner rather than an internal transfer
    const isPartnerReceipt = !item.source_location || 
      item.source_location.toLowerCase().includes('partner') ||
      (item.notes && item.notes.toLowerCase().includes('partner'));
      
    return isPartnerReceipt;
  });
};

/**
 * Special filter for relocation transfers (non-partner)
 * @param {Array} data - Data from coffee_stock_transfers table
 * @returns {Array} - Data filtered to only show relocation transfers
 */
export const filterRelocationTransfers = (data) => {
  if (!data || data.length === 0) return [];
  
  // Include only transfers that are clearly relocations (both source and destination specified)
  return data.filter(item => {
    // If already categorized as relocation, use that
    if (item.operation_type === 'relocate-stock') return true;
    
    // Otherwise, check if it has both source and destination, indicating a relocation
    return item.source_location && item.destination_location && 
      !filterPartnerStockTransfers([item]).length;
  });
};
