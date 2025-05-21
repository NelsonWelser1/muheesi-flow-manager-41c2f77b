
import { useToast } from "@/components/ui/use-toast";

export const showSuccessToast = (toast, message, duration = 3000) => {
  toast({
    title: "Success",
    description: message,
    variant: "default",
    className: "bg-green-50 border-green-300 text-green-800",
    duration: duration,
  });
};

export const showErrorToast = (toast, message, duration = 5000) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
    duration: duration,
  });
};

export const showWarningToast = (toast, message, duration = 4000) => {
  toast({
    title: "Warning",
    description: message,
    variant: "default",
    className: "bg-amber-50 border-amber-300 text-amber-800",
    duration: duration,
  });
};

export const showInfoToast = (toast, message, duration = 3000) => {
  toast({
    title: "Information",
    description: message,
    variant: "default",
    className: "bg-blue-50 border-blue-300 text-blue-800",
    duration: duration,
  });
};

export const showLoadingToast = (toast, message, duration = Infinity) => {
  return toast({
    title: "Loading",
    description: message,
    variant: "default",
    className: "bg-gray-50 border-gray-300",
    duration: duration, // Stays until manually dismissed by default
  });
};

export const dismissToast = (toastId) => {
  // The toast function returns an object with an id
  // that can be used to dismiss it
  if (toastId) {
    return { id: toastId };
  }
  return null;
};

// New notification helpers for reports
export const showReportSubmittedToast = (toast, reportTitle, duration = 4000) => {
  toast({
    title: "Report Submitted",
    description: `Your report "${reportTitle}" has been submitted successfully.`,
    variant: "default",
    className: "bg-green-50 border-green-300 text-green-800",
    duration: duration,
  });
};

export const showReportSharedToast = (toast, recipients, duration = 3000) => {
  toast({
    title: "Report Shared",
    description: `Report has been shared with ${recipients} recipient(s).`,
    variant: "default",
    className: "bg-blue-50 border-blue-300 text-blue-800",
    duration: duration,
  });
};

export const showReportExportedToast = (toast, format, duration = 3000) => {
  toast({
    title: "Report Exported",
    description: `Report has been exported as ${format.toUpperCase()}.`,
    variant: "default",
    className: "bg-blue-50 border-blue-300 text-blue-800",
    duration: duration,
  });
};
