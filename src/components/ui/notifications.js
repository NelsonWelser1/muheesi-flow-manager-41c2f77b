
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
