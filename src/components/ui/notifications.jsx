
import { useToast } from "@/components/ui/use-toast";

export const showSuccessToast = (toast, message) => {
  toast({
    title: "Success",
    description: message,
    variant: "default",
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
