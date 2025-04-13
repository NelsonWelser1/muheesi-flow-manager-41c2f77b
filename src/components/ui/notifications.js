
/**
 * Helper functions for displaying toast notifications
 */

export const showSuccessToast = (toast, message) => {
  toast({
    title: "Success",
    description: message,
    variant: "success",
    duration: 5000,
  });
};

export const showErrorToast = (toast, message) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
    duration: 8000,
  });
};

export const showInfoToast = (toast, message) => {
  toast({
    title: "Information",
    description: message,
    duration: 5000,
  });
};

export const showWarningToast = (toast, message) => {
  toast({
    title: "Warning",
    description: message,
    variant: "warning",
    duration: 6000,
  });
};
