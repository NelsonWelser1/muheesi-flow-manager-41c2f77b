
import { supabase } from '@/integrations/supabase/supabase';

/**
 * Fetch coffee stock data with optional filters
 * @param {Object} options - Query options
 * @param {string} options.statusFilter - Filter by status
 * @param {Date} options.startDate - Start date for time range filter
 * @param {Date} options.endDate - End date for time range filter
 * @param {string} options.sortField - Field to sort by
 * @param {boolean} options.ascending - Sort direction
 * @param {number} options.limit - Limit number of results
 * @returns {Promise<Array>} - Coffee stock data
 */
export const fetchCoffeeStock = async ({
  statusFilter = null,
  startDate = null,
  endDate = null,
  sortField = 'created_at',
  ascending = false,
  limit = null
} = {}) => {
  try {
    let query = supabase.from('coffee_stock').select('*');
    
    // Apply status filter if provided
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    
    // Apply date range filter if provided
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }
    
    // Apply sorting
    query = query.order(sortField, { ascending });
    
    // Apply limit if provided
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching coffee stock:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception when fetching coffee stock:', err);
    throw err;
  }
};

/**
 * Update the status of a coffee stock entry
 * @param {string} id - Coffee stock entry ID
 * @param {string} status - New status value
 * @returns {Promise<Object>} - Updated coffee stock entry
 */
export const updateCoffeeStockStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('coffee_stock')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating coffee stock status:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Exception when updating coffee stock status:', err);
    throw err;
  }
};

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

/**
 * Export coffee stock data to CSV format
 * @param {Array} data - Coffee stock entries
 * @param {string} filename - Output filename
 */
export const exportToCSV = (data, filename = 'coffee-stock-export.csv') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data to export to CSV');
    return;
  }

  try {
    // Get headers from the first item
    const headers = Object.keys(data[0]);
    
    // Format data rows
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that need quotes (contain commas, quotes, or newlines)
          const formatted = value === null || value === undefined ? '' : String(value);
          return formatted.includes(',') || formatted.includes('"') || formatted.includes('\n') 
            ? `"${formatted.replace(/"/g, '""')}"` 
            : formatted;
        }).join(',')
      )
    ];
    
    // Create CSV content and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger click
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`CSV export of ${data.length} records completed`);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

/**
 * Export coffee stock data to Excel format
 * @param {Array} data - Coffee stock entries
 * @param {string} filename - Output filename
 */
export const exportToExcel = (data, filename = 'coffee-stock-export.xlsx') => {
  console.log(`Exporting ${data?.length || 0} records to Excel as ${filename}`);
  // Full implementation would use xlsx library
  // This is a placeholder for the actual implementation
};

/**
 * Export coffee stock data to PDF format
 * @param {Array} data - Coffee stock entries
 * @param {string} filename - Output filename
 */
export const exportToPDF = (data, filename = 'coffee-stock-export.pdf') => {
  console.log(`Exporting ${data?.length || 0} records to PDF as ${filename}`);
  // Full implementation would use jspdf library
  // This is a placeholder for the actual implementation
};
