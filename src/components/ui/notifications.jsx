
import { toast } from '@/components/ui/use-toast';

/**
 * Shows a success toast notification
 * @param {Function} toastFn - The toast function from useToast hook
 * @param {string} message - The message to display
 * @returns {Object} - Toast return value
 */
export const showSuccessToast = (toastFn, message) => {
  return toastFn({
    title: "Success",
    description: message,
    variant: "default",
    duration: 3000,
  });
};

/**
 * Shows an error toast notification
 * @param {Function} toastFn - The toast function from useToast hook
 * @param {string} message - The error message to display
 * @returns {Object} - Toast return value
 */
export const showErrorToast = (toastFn, message) => {
  return toastFn({
    title: "Error",
    description: message,
    variant: "destructive",
    duration: 5000,
  });
};

/**
 * Shows a loading toast notification
 * @param {Function} toastFn - The toast function from useToast hook
 * @param {string} message - The loading message to display
 * @returns {string} - Toast ID for dismissal
 */
export const showLoadingToast = (toastFn, message) => {
  return toastFn({
    title: "Loading",
    description: message,
    duration: 100000, // Long duration as we'll dismiss it manually
  });
};

/**
 * Dismisses a toast by ID
 * @param {string} toastId - ID of the toast to dismiss
 */
export const dismissToast = (toastId) => {
  if (toastId) {
    toast.dismiss(toastId);
  }
};

/**
 * Shows a warning toast notification
 * @param {Function} toastFn - The toast function from useToast hook
 * @param {string} message - The warning message to display
 * @returns {Object} - Toast return value
 */
export const showWarningToast = (toastFn, message) => {
  return toastFn({
    title: "Warning",
    description: message,
    variant: "warning",
    duration: 4000,
  });
};

/**
 * Shows an info toast notification
 * @param {Function} toastFn - The toast function from useToast hook
 * @param {string} message - The info message to display
 * @returns {Object} - Toast return value
 */
export const showInfoToast = (toastFn, message) => {
  return toastFn({
    title: "Information",
    description: message,
    duration: 3000,
  });
};
