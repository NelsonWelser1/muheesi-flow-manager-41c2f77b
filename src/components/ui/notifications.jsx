
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

// New function for data update notifications
export const showDataUpdateToast = (toast, entityName, action) => {
  toast({
    title: "Data Updated",
    description: `${entityName} data has been ${action} successfully.`,
    variant: "default",
    className: "bg-indigo-50 border-indigo-300 text-indigo-800",
    duration: 3000,
  });
};

// New function for report submission notifications
export const showReportSubmissionToast = (toast, reportType) => {
  toast({
    title: "Report Submitted",
    description: `Your ${reportType} report has been submitted successfully.`,
    variant: "default",
    className: "bg-green-50 border-green-300 text-green-800",
    duration: 4000,
  });
};
