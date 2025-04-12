
/**
 * Utility functions for displaying toast notifications
 */

export const showSuccessToast = (toast, message) => {
  toast({
    title: "Success",
    description: message,
    variant: "default",
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
    variant: "default",
    className: "bg-yellow-100 border-yellow-400 text-yellow-800",
  });
};

export const showInfoToast = (toast, message) => {
  toast({
    title: "Info",
    description: message,
    variant: "default",
    className: "bg-blue-100 border-blue-400 text-blue-800",
  });
};
