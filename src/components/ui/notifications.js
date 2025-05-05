
import { toast as sonnerToast } from "sonner";

/**
 * Shows an error toast notification
 * @param {Function} toast - Toast function from useToast hook (optional)
 * @param {string} title - Title of the toast
 * @param {string} description - Description of the toast
 * @returns {any} - Toast ID or response
 */
export const showErrorToast = (toast, title, description) => {
  if (toast) {
    return toast({
      title,
      description,
      variant: "destructive",
      duration: 5000,
    });
  } else {
    return sonnerToast.error(title, {
      description,
      duration: 5000,
    });
  }
};

/**
 * Shows a success toast notification
 * @param {Function} toast - Toast function from useToast hook (optional)
 * @param {string} title - Title of the toast
 * @param {string} description - Description of the toast
 * @returns {any} - Toast ID or response
 */
export const showSuccessToast = (toast, title, description) => {
  if (toast) {
    return toast({
      title,
      description,
      duration: 3000,
    });
  } else {
    return sonnerToast.success(title, {
      description,
      duration: 3000,
    });
  }
};

/**
 * Shows an informational toast notification
 * @param {Function} toast - Toast function from useToast hook (optional)
 * @param {string} title - Title of the toast
 * @param {string} description - Description of the toast
 * @returns {any} - Toast ID or response
 */
export const showInfoToast = (toast, title, description) => {
  if (toast) {
    return toast({
      title,
      description,
      duration: 4000,
    });
  } else {
    return sonnerToast(title, {
      description,
      duration: 4000,
    });
  }
};

/**
 * Shows a loading toast notification
 * @param {Function} toast - Toast function from useToast hook (optional)
 * @param {string} description - Description of the toast
 * @returns {any} - Toast ID or response
 */
export const showLoadingToast = (toast, description) => {
  if (toast) {
    return toast({
      title: "Loading",
      description,
      duration: 10000,
    });
  } else {
    return sonnerToast.loading(description, {
      duration: 10000,
    });
  }
};

/**
 * Dismisses a toast by ID
 * @param {string|number} id - ID of the toast to dismiss
 */
export const dismissToast = (id) => {
  sonnerToast.dismiss(id);
};
