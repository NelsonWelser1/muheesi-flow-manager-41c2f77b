
/**
 * Utility functions for validating delivery data
 */
export const deliveryValidation = {
  /**
   * Validate delivery data before submission
   */
  validateDeliveryData: (data) => {
    const errors = {};
    
    // Required fields
    const requiredFields = {
      delivery_id: 'Delivery ID',
      order_id: 'Order ID',
      customer_name: 'Customer Name',
      status: 'Status',
      pickup_location: 'Pickup Location',
      delivery_location: 'Delivery Location',
      scheduled_pickup_time: 'Scheduled Pickup Time',
      scheduled_delivery_time: 'Scheduled Delivery Time'
    };
    
    // Check for required fields
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!data[field]) {
        errors[field] = `${label} is required`;
      }
    });
    
    // Validate dates
    if (data.scheduled_pickup_time && data.scheduled_delivery_time) {
      const pickupTime = new Date(data.scheduled_pickup_time);
      const deliveryTime = new Date(data.scheduled_delivery_time);
      
      if (pickupTime > deliveryTime) {
        errors.scheduled_delivery_time = 'Delivery time must be after pickup time';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Validate required fields
   */
  validateRequiredFields: (data, requiredFields) => {
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    return true;
  }
};
