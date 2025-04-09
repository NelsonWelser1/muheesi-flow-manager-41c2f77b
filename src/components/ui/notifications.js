
import { toast } from "@/components/ui/use-toast";

/**
 * Show a success toast notification
 * @param {Object} toastFn - Toast function from useToast hook
 * @param {String} message - Message to display
 */
export const showSuccessToast = (toastFn, message) => {
  toastFn({
    title: "Success",
    description: message,
    variant: "default",
  });
};

/**
 * Show an error toast notification
 * @param {Object} toastFn - Toast function from useToast hook
 * @param {String} message - Message to display
 */
export const showErrorToast = (toastFn, message) => {
  toastFn({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};

/**
 * Show a warning toast notification
 * @param {Object} toastFn - Toast function from useToast hook
 * @param {String} message - Message to display
 */
export const showWarningToast = (toastFn, message) => {
  toastFn({
    title: "Warning",
    description: message,
    variant: "default",
    className: "bg-amber-50 border-amber-200 text-amber-800",
  });
};

/**
 * Show an info toast notification
 * @param {Object} toastFn - Toast function from useToast hook
 * @param {String} message - Message to display
 */
export const showInfoToast = (toastFn, message) => {
  toastFn({
    title: "Information",
    description: message,
    variant: "default",
    className: "bg-blue-50 border-blue-200 text-blue-800",
  });
};

/**
 * Show a loading toast notification that stays until dismissed
 * @param {Object} toastFn - Toast function from useToast hook
 * @param {String} message - Message to display
 * @returns {Object} - The toast object which can be used to dismiss
 */
export const showLoadingToast = (toastFn, message) => {
  return toastFn({
    title: "Loading",
    description: message,
    variant: "default",
    className: "bg-gray-50 border-gray-200 text-gray-800",
    duration: Infinity, // Stays until manually dismissed
  });
};

/**
 * Dismiss a toast notification
 * @param {String} toastId - ID of the toast to dismiss
 * @returns {Object} - Object containing the toast ID
 */
export const dismissToast = (toastId) => {
  if (toastId) {
    return { id: toastId };
  }
  return null;
};

