
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

