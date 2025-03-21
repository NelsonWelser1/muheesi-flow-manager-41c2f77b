
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
