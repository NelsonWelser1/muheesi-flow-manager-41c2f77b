
import { deliveryFetch } from './operations/deliveryFetch';
import { deliveryCreate } from './operations/deliveryCreate';
import { deliveryUpdate } from './operations/deliveryUpdate';
import { deliveryDelete } from './operations/deliveryDelete';
import { deliveryValidation } from './utils/deliveryValidation';

/**
 * Service for handling delivery data operations with Supabase
 */
export const deliveryService = {
  // Fetch operations
  fetchAll: deliveryFetch.fetchAll,
  getById: deliveryFetch.getById,
  
  // Create operations
  create: deliveryCreate.create,
  
  // Update operations
  update: deliveryUpdate.update,
  
  // Delete operations
  delete: deliveryDelete.delete,
  
  // Validation
  validateDeliveryData: deliveryValidation.validateDeliveryData
};
