
/**
 * Utility functions for displaying toast notifications
 */

// Success notifications
export const showSuccessToast = (toast, message) => {
  toast({
    title: "Success",
    description: message,
    variant: "success",
  });
};

// Error notifications
export const showErrorToast = (toast, message) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};

// Warning notifications
export const showWarningToast = (toast, message) => {
  toast({
    title: "Warning",
    description: message,
    variant: "warning",
  });
};

// Information notifications
export const showInfoToast = (toast, message) => {
  toast({
    title: "Information",
    description: message,
  });
};

// Status-based notifications with consistent formatting
export const showStatusToast = (toast, status, message) => {
  const statusConfig = {
    pending: { title: "Pending", variant: "warning" },
    processing: { title: "Processing", variant: "info" },
    approved: { title: "Approved", variant: "success" },
    rejected: { title: "Rejected", variant: "destructive" },
    completed: { title: "Completed", variant: "success" },
    cancelled: { title: "Cancelled", variant: "destructive" },
  };
  
  const config = statusConfig[status.toLowerCase()] || { title: status, variant: "default" };
  
  toast({
    title: config.title,
    description: message,
    variant: config.variant,
  });
};

// Feedback submission notification
export const showFeedbackSubmittedToast = (toast) => {
  toast({
    title: "Feedback Submitted",
    description: "Thank you for your feedback. We'll review it shortly.",
    variant: "success",
  });
};
