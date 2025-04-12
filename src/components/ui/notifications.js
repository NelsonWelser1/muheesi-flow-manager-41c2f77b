
/**
 * Utility functions for displaying toast notifications
 */

export const showSuccessToast = (toast, message) => {
  toast({
    title: "Success",
    description: message,
    variant: "default",
  });
};

export const showErrorToast = (toast, message) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};

export const showWarningToast = (toast, message) => {
  toast({
    title: "Warning",
    description: message,
    variant: "default",
    className: "bg-yellow-100 border-yellow-400 text-yellow-800",
  });
};

export const showInfoToast = (toast, message) => {
  toast({
    title: "Info",
    description: message,
    variant: "default",
    className: "bg-blue-100 border-blue-400 text-blue-800",
  });
};

/**
 * Show a loading toast notification that stays until manually dismissed
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

/**
 * Dismiss a toast notification by ID
 * @param {string} toastId - ID of the toast to dismiss
 * @returns {Object|null} Object with toast ID or null
 */
export const dismissToast = (toastId) => {
  if (toastId) {
    return { id: toastId };
  }
  return null;
};

