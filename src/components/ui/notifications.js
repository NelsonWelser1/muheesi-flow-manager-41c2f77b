
import { toast } from "@/components/ui/use-toast";

/**
 * Show a success toast notification
 * @param {Object} toastInstance - Toast instance from useToast hook
 * @param {string} message - Message to display
 */
export const showSuccessToast = (toastInstance, message) => {
  toastInstance({
    title: "Success",
    description: message,
    variant: "default",
  });
};

/**
 * Show an error toast notification
 * @param {Object} toastInstance - Toast instance from useToast hook
 * @param {string} message - Message to display
 */
export const showErrorToast = (toastInstance, message) => {
  toastInstance({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};

/**
 * Show a warning toast notification
 * @param {Object} toastInstance - Toast instance from useToast hook
 * @param {string} message - Message to display
 */
export const showWarningToast = (toastInstance, message) => {
  toastInstance({
    title: "Warning",
    description: message,
    variant: "warning",
  });
};

/**
 * Show an info toast notification
 * @param {Object} toastInstance - Toast instance from useToast hook
 * @param {string} message - Message to display
 */
export const showInfoToast = (toastInstance, message) => {
  toastInstance({
    title: "Information",
    description: message,
    variant: "default",
  });
};

/**
 * Show a loading toast notification
 * @param {Object} toastInstance - Toast instance from useToast hook
 * @param {string} message - Message to display
 * @returns {string} The toast ID for dismissal
 */
export const showLoadingToast = (toastInstance, message) => {
  return toastInstance({
    title: "Loading",
    description: message,
    variant: "default",
    duration: Infinity, // Stays until manually dismissed
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
