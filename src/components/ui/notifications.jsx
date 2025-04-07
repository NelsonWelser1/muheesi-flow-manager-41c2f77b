
import { useToast } from "@/components/ui/use-toast";

export const showSuccessToast = (toast, message) => {
  toast({
    title: "Success",
    description: message,
    variant: "default",
    className: "bg-green-50 border-green-300 text-green-800",
    duration: 3000,
  });
};

export const showErrorToast = (toast, message) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
    duration: 5000,
  });
};

export const showWarningToast = (toast, message) => {
  toast({
    title: "Warning",
    description: message,
    variant: "default",
    className: "bg-amber-50 border-amber-300 text-amber-800",
    duration: 4000,
  });
};

export const showInfoToast = (toast, message) => {
  toast({
    title: "Information",
    description: message,
    variant: "default",
    className: "bg-blue-50 border-blue-300 text-blue-800",
    duration: 3000,
  });
};

export const showLoadingToast = (toast, message) => {
  return toast({
    title: "Loading",
    description: message,
    variant: "default",
    className: "bg-gray-50 border-gray-300",
    duration: Infinity, // Stays until manually dismissed
  });
};

export const dismissToast = (toastId) => {
  // The toast function returns an object with an id
  // that can be used to dismiss it
  if (toastId) {
    return { id: toastId };
  }
};

// Contract specific toast notifications
export const showContractSavedToast = (toast, buyerName) => {
  showSuccessToast(
    toast, 
    `Contract for ${buyerName || 'client'} has been saved successfully.`
  );
};

export const showContractExportedToast = (toast, format, buyerName) => {
  showSuccessToast(
    toast, 
    `Contract for ${buyerName || 'client'} has been exported as ${format}.`
  );
};

export const showContractErrorToast = (toast, errorType, message) => {
  showErrorToast(
    toast, 
    `${errorType}: ${message}`
  );
};

// New notification helpers for reports
export const showReportSubmittedToast = (toast, reportTitle) => {
  toast({
    title: "Report Submitted",
    description: `Your report "${reportTitle}" has been submitted successfully.`,
    variant: "default",
    className: "bg-green-50 border-green-300 text-green-800",
    duration: 4000,
  });
};

export const showReportSharedToast = (toast, recipients) => {
  toast({
    title: "Report Shared",
    description: `Report has been shared with ${recipients} recipient(s).`,
    variant: "default",
    className: "bg-blue-50 border-blue-300 text-blue-800",
    duration: 3000,
  });
};

export const showReportExportedToast = (toast, format) => {
  toast({
    title: "Report Exported",
    description: `Report has been exported as ${format.toUpperCase()}.`,
    variant: "default",
    className: "bg-blue-50 border-blue-300 text-blue-800",
    duration: 3000,
  });
};
