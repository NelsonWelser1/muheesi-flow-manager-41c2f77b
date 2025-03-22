
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

// Export functions for PDF, Excel, and CSV exports
export const exportToPDF = (data, title) => {
  console.log(`Exporting ${data.length} records to PDF with title: ${title}`);
  alert('PDF Export functionality is not fully implemented yet.');
  // Here you would implement the actual PDF export logic
};

export const exportToExcel = (data, title) => {
  console.log(`Exporting ${data.length} records to Excel with title: ${title}`);
  alert('Excel Export functionality is not fully implemented yet.');
  // Here you would implement the actual Excel export logic
};

export const exportToCSV = (data, title) => {
  console.log(`Exporting ${data.length} records to CSV with title: ${title}`);
  
  try {
    // Create CSV content
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    alert('Failed to export to CSV');
  }
};
