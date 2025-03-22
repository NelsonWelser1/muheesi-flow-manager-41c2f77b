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
export const exportToCSV = (data, filename = 'coffee-stock-export') => {
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
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
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
export const exportToExcel = (data, filename = 'coffee-stock-export') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data to export to Excel');
    return;
  }

  try {
    // For Excel export, we need to use the xlsx library
    // We'll create a worksheet from our data
    const XLSX = window.XLSX;
    
    if (!XLSX) {
      console.error('XLSX library not found. Make sure it is properly imported.');
      return;
    }
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Coffee Stock');
    
    // Generate Excel file and trigger browser download
    XLSX.writeFile(workbook, `${filename}-${new Date().toISOString().slice(0, 10)}.xlsx`);
    
    console.log(`Excel export of ${data.length} records completed`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export to Excel. Please try again later.');
  }
};

/**
 * Export coffee stock data to PDF format
 * @param {Array} data - Coffee stock entries
 * @param {string} filename - Output filename
 */
export const exportToPDF = (data, filename = 'coffee-stock-export') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data to export to PDF');
    return;
  }

  try {
    // For PDF export, we need to use the jsPDF library
    const { jsPDF } = window.jspdf;
    
    if (!jsPDF) {
      console.error('jsPDF library not found. Make sure it is properly imported.');
      return;
    }
    
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Coffee Stock Report', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Select relevant columns for the PDF (to keep it readable)
    const columns = [
      'coffee_type',
      'quality_grade',
      'quantity',
      'buying_price',
      'location',
      'status',
      'created_at'
    ];
    
    // Format data for autoTable
    const tableData = data.map(item => {
      const rowData = [];
      columns.forEach(col => {
        let value = item[col];
        
        // Format date
        if (col === 'created_at' && value) {
          try {
            value = new Date(value).toLocaleDateString();
          } catch (e) {
            // Keep original value if date parsing fails
          }
        }
        
        rowData.push(value || 'N/A');
      });
      return rowData;
    });
    
    // Generate table headers in Title Case
    const headers = columns.map(col => 
      col.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
    
    // Add table to PDF
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 135, 245], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 25 }
    });
    
    // Save PDF
    doc.save(`${filename}-${new Date().toISOString().slice(0, 10)}.pdf`);
    
    console.log(`PDF export of ${data.length} records completed`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Failed to export to PDF. Please try again later.');
  }
};
