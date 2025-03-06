
/**
 * Utility functions for showing toast notifications related to deliveries
 */
export const deliveryToasts = {
  /**
   * Show success toast for delivery operations
   */
  success: (toast, message) => {
    toast({
      title: "Success",
      description: message,
    });
  },

  /**
   * Show error toast for delivery operations
   */
  error: (toast, errorMessage) => {
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  }
};
