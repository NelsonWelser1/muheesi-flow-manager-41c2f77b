
/**
 * Utility functions for displaying toast notifications in a consistent way
 */

export const showSuccessToast = (toast, message) => {
  toast({
    title: "Success",
    description: message,
    variant: "default"
  });
};

export const showErrorToast = (toast, message) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive"
  });
};

export const showInfoToast = (toast, message) => {
  toast({
    title: "Information",
    description: message,
    variant: "default"
  });
};

export const showWarningToast = (toast, message) => {
  toast({
    title: "Warning",
    description: message,
    variant: "destructive"
  });
};

export const showDebugToast = (toast, message) => {
  if (process.env.NODE_ENV !== 'production') {
    toast({
      title: "Debug",
      description: message,
      variant: "default"
    });
  }
};
