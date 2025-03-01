
/**
 * Utility functions for displaying toast notifications
 */

export const showSuccessToast = (toast, message) => {
  toast({
    title: "Success",
    description: message,
    variant: "success",
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
    variant: "warning",
  });
};

export const showInfoToast = (toast, message) => {
  toast({
    title: "Information",
    description: message,
  });
};
