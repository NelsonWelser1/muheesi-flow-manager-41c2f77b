
import { supabase } from '../../supabase';

/**
 * Utility functions for sales orders that don't need state management
 */
export const salesOrderUtils = {
  /**
   * Format a sales order for display
   */
  formatSalesOrder: (order) => {
    if (!order) return null;
    
    return {
      ...order,
      formattedDate: new Date(order.order_date).toLocaleDateString(),
      formattedTotal: `${order.total_amount?.toLocaleString() || 0} UGX`,
      statusClass: order.payment_status === 'paid' 
        ? 'text-green-600' 
        : order.payment_status === 'partially_paid' 
          ? 'text-amber-600' 
          : 'text-red-600'
    };
  },
  
  /**
   * Calculate order summary statistics
   */
  calculateOrderStatistics: (orders) => {
    if (!orders || !orders.length) return { total: 0, paid: 0, pending: 0 };
    
    return {
      total: orders.length,
      paid: orders.filter(order => order.payment_status === 'paid').length,
      pending: orders.filter(order => order.payment_status === 'pending').length,
      totalValue: orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0)
    };
  },

  /**
   * Filter orders by payment status
   */
  filterOrdersByStatus: (orders, status) => {
    if (!orders || !orders.length) return [];
    if (!status || status === 'all') return orders;
    
    return orders.filter(order => order.payment_status === status);
  }
};
