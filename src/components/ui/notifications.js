
import { toast } from "./use-toast";

/**
 * Shows a success toast notification
 * @param {Function} toastFunction - The toast function from useToast hook
 * @param {string} message - The message to display
 */
export const showSuccessToast = (toastFunction, message) => {
  toastFunction({
    title: "Success",
    description: message,
    variant: "default",
  });
};

/**
 * Shows an error toast notification
 * @param {Function} toastFunction - The toast function from useToast hook
 * @param {string} message - The error message to display
 */
export const showErrorToast = (toastFunction, message) => {
  toastFunction({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};

/**
 * Shows a warning toast notification
 * @param {Function} toastFunction - The toast function from useToast hook
 * @param {string} message - The warning message to display
 */
export const showWarningToast = (toastFunction, message) => {
  toastFunction({
    title: "Warning",
    description: message,
    variant: "default",
    className: "bg-yellow-50 border-yellow-400 text-yellow-800",
  });
};

/**
 * Shows an info toast notification
 * @param {Function} toastFunction - The toast function from useToast hook
 * @param {string} message - The info message to display
 */
export const showInfoToast = (toastFunction, message) => {
  toastFunction({
    title: "Information",
    description: message,
    variant: "default",
    className: "bg-blue-50 border-blue-400 text-blue-800",
  });
};
