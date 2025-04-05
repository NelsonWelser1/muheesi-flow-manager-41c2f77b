
import { toast as toastFunction } from "@/components/ui/use-toast";

/**
 * Show a success toast notification
 * @param {Object} toast - The toast object from useToast hook
 * @param {string} message - The message to display
 */
export const showSuccessToast = (toast, message) => {
  toast({
    title: "Success",
    description: message,
    variant: "default"
  });
};

/**
 * Show an error toast notification
 * @param {Object} toast - The toast object from useToast hook
 * @param {string} message - The message to display
 */
export const showErrorToast = (toast, message) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive"
  });
};

/**
 * Show an info toast notification
 * @param {Object} toast - The toast object from useToast hook
 * @param {string} message - The message to display
 */
export const showInfoToast = (toast, message) => {
  toast({
    title: "Information",
    description: message,
    variant: "default"
  });
};

/**
 * Show a warning toast notification
 * @param {Object} toast - The toast object from useToast hook
 * @param {string} message - The message to display
 */
export const showWarningToast = (toast, message) => {
  toast({
    title: "Warning",
    description: message,
    variant: "destructive"
  });
};

/**
 * Show a loading toast notification
 * @param {Object} toast - The toast object from useToast hook
 * @param {string} message - The message to display
 * @returns {string|null} The toast ID that can be used to dismiss the toast
 */
export const showLoadingToast = (toast, message) => {
  return toast({
    title: "Loading",
    description: message,
    variant: "default",
    duration: Infinity // Stays until manually dismissed
  });
};

/**
 * Dismiss a toast by its ID
 * @param {string|number} toastId - The ID of the toast to dismiss
 * @returns {Object|null} An object with the ID of the dismissed toast
 */
export const dismissToast = (toastId) => {
  if (toastId) {
    return { id: toastId };
  }
  return null;
};
