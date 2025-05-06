
/**
 * Helper functions for displaying toast notifications
 */

export const showSuccessToast = (toast, message) => {
  toast({
    title: "Success",
    description: message,
    variant: "success",
    duration: 5000,
  });
};

export const showErrorToast = (toast, message) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
    duration: 8000,
  });
};

export const showInfoToast = (toast, message) => {
  toast({
    title: "Information",
    description: message,
    duration: 5000,
  });
};

export const showWarningToast = (toast, message) => {
  toast({
    title: "Warning",
    description: message,
    variant: "warning",
    duration: 6000,
  });
};

/**
 * Dismiss a toast notification by ID
 * @param {string} toastId - ID of the toast to dismiss
 * @returns {Object} Object with toast ID
 */
export const dismissToast = (toastId) => {
  if (toastId) {
    return { id: toastId };
  }
  return null;
};

/**
 * Show a loading toast notification
 * @param {Object} toast - Toast function from useToast hook
 * @param {string} message - Message to display
 * @returns {string} The toast ID for dismissal
 */
export const showLoadingToast = (toast, message) => {
  return toast({
    title: "Loading",
    description: message,
    variant: "default",
    className: "bg-gray-50 border-gray-300",
    duration: Infinity, // Stays until manually dismissed
  });
};
