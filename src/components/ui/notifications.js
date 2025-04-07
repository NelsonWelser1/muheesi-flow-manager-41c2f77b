
import { toast as toastFn } from "sonner";

/**
 * Show a success toast notification
 * @param {object} toast - Toast function from useToast hook
 * @param {string} message - Message to display
 * @returns {void}
 */
export const showSuccessToast = (toast, message) => {
  if (toastFn) {
    toastFn.success(message);
  } else if (toast) {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  }
};

/**
 * Show an error toast notification
 * @param {object} toast - Toast function from useToast hook
 * @param {string} message - Message to display
 * @returns {void}
 */
export const showErrorToast = (toast, message) => {
  if (toastFn) {
    toastFn.error(message);
  } else if (toast) {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }
};

/**
 * Show an info toast notification
 * @param {object} toast - Toast function from useToast hook
 * @param {string} message - Message to display
 * @returns {void}
 */
export const showInfoToast = (toast, message) => {
  if (toastFn) {
    toastFn.info(message);
  } else if (toast) {
    toast({
      title: "Information",
      description: message,
      variant: "default",
    });
  }
};

/**
 * Show a warning toast notification
 * @param {object} toast - Toast function from useToast hook
 * @param {string} message - Message to display
 * @returns {void}
 */
export const showWarningToast = (toast, message) => {
  if (toastFn) {
    toastFn.warning(message);
  } else if (toast) {
    toast({
      title: "Warning",
      description: message,
      variant: "destructive",
    });
  }
};

/**
 * Show a loading toast notification
 * @param {object} toast - Toast function from useToast hook
 * @param {string} message - Message to display
 * @returns {string|null} - Toast ID for dismissing
 */
export const showLoadingToast = (toast, message) => {
  if (toastFn) {
    return toastFn.loading(message);
  } else if (toast) {
    return toast({
      title: "Loading",
      description: message,
      variant: "default",
    });
  }
  return null;
};

/**
 * Dismiss a toast by ID
 * @param {string} id - Toast ID to dismiss
 * @returns {void}
 */
export const dismissToast = (id) => {
  if (toastFn && id) {
    toastFn.dismiss(id);
  }
};

/**
 * Show a contract saved toast notification
 * @param {object} toast - Toast function from useToast hook
 * @param {string} contractName - Name of the saved contract
 * @returns {void}
 */
export const showContractSavedToast = (toast, contractName) => {
  if (toastFn) {
    toastFn.success(`Contract "${contractName}" saved successfully`);
  } else if (toast) {
    toast({
      title: "Contract Saved",
      description: `Contract "${contractName}" saved successfully`,
      variant: "default",
    });
  }
};

/**
 * Show a contract export toast notification
 * @param {object} toast - Toast function from useToast hook
 * @param {string} format - Export format (PDF, etc.)
 * @returns {void}
 */
export const showContractExportedToast = (toast, format) => {
  if (toastFn) {
    toastFn.success(`Contract exported as ${format.toUpperCase()} successfully`);
  } else if (toast) {
    toast({
      title: "Contract Exported",
      description: `Contract exported as ${format.toUpperCase()} successfully`,
      variant: "default",
    });
  }
};
