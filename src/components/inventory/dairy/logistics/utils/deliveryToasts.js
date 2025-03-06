
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
  },
  
  /**
   * Show authentication error toast
   */
  authError: (toast, message = "You must be logged in to perform this action") => {
    toast({
      title: "Authentication Required",
      description: message,
      variant: "destructive",
    });
  },

  /**
   * Show validation error toast
   */
  validationError: (toast, message = "Please check the form for errors") => {
    toast({
      title: "Validation Error",
      description: message,
      variant: "destructive",
    });
  },

  /**
   * Show network error toast
   */
  networkError: (toast, message = "Network error occurred. Please try again.") => {
    toast({
      title: "Connection Error",
      description: message,
      variant: "destructive",
    });
  }
};
