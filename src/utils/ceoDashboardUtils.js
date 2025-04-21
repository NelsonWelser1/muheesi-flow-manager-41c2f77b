
import { supabase } from '@/integrations/supabase/supabase';

/**
 * Send data to the CEO dashboard
 * @param {Object} data - The data to send to the CEO dashboard
 * @param {string} data.company - Company name
 * @param {string} data.module - Module name (e.g., 'Inventory', 'Sales')
 * @param {string} data.data_type - Type of data (e.g., 'sales', 'inventory', 'operations')
 * @param {Object} data.data - The actual data to be stored
 * @param {string} data.source_module - The source module that generated this data
 * @param {string} data.source_user - The user that generated this data
 * @param {string} data.source_id - Optional ID linking to the source record
 * @returns {Promise} - Promise that resolves with the result of the operation
 */
export const sendToCEODashboard = async (data) => {
  try {
    // Skip data for Fresheco Farming Limited
    if (data.company === 'Fresheco Farming Limited') {
      console.log('Skipping data from Fresheco Farming Limited for CEO Dashboard');
      return { skipped: true };
    }

    // Validate required fields
    if (!data.company || !data.module || !data.data_type) {
      console.error('Missing required fields for CEO Dashboard data');
      return { error: 'Missing required fields' };
    }

    const payload = {
      company: data.company,
      module: data.module,
      data_type: data.data_type,
      data: data.data || {},
      source_module: data.source_module,
      source_user: data.source_user,
      source_id: data.source_id
    };

    const { data: result, error } = await supabase
      .from('ceo_dashboard_data')
      .insert([payload])
      .select();

    if (error) {
      console.error('Error sending data to CEO Dashboard:', error);
      return { error };
    }

    console.log('Successfully sent data to CEO Dashboard:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Exception in sendToCEODashboard:', error);
    return { error };
  }
};

/**
 * Send inventory updates to CEO dashboard
 */
export const sendInventoryUpdate = async (inventoryData) => {
  const { company, product, quantity, action, value } = inventoryData;
  
  return sendToCEODashboard({
    company,
    module: 'Inventory Management',
    data_type: 'inventory',
    data: {
      product,
      quantity,
      action,
      value,
      timestamp: new Date().toISOString()
    },
    source_module: 'InventoryManagement'
  });
};

/**
 * Send sales data to CEO dashboard
 */
export const sendSalesUpdate = async (salesData) => {
  const { company, product, quantity, unitPrice, customer } = salesData;
  
  return sendToCEODashboard({
    company,
    module: 'Sales',
    data_type: 'sales',
    data: {
      product,
      quantity,
      unitPrice,
      totalAmount: quantity * unitPrice,
      customer,
      timestamp: new Date().toISOString()
    },
    source_module: 'Sales'
  });
};

/**
 * Send operations data to CEO dashboard
 */
export const sendOperationsUpdate = async (operationsData) => {
  const { company, operationType, status, details } = operationsData;
  
  return sendToCEODashboard({
    company,
    module: 'Operations',
    data_type: 'operations',
    data: {
      operationType,
      status,
      details,
      timestamp: new Date().toISOString()
    },
    source_module: 'Operations'
  });
};

/**
 * Send personnel updates to CEO dashboard
 */
export const sendPersonnelUpdate = async (personnelData) => {
  const { company, action, role, count, details } = personnelData;
  
  return sendToCEODashboard({
    company,
    module: 'Human Resources',
    data_type: 'personnel',
    data: {
      action,
      role,
      count,
      details,
      timestamp: new Date().toISOString()
    },
    source_module: 'HR'
  });
};

export default {
  sendToCEODashboard,
  sendInventoryUpdate,
  sendSalesUpdate,
  sendOperationsUpdate,
  sendPersonnelUpdate
};
