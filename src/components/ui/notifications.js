
import { toast as toastFn } from "sonner";

export const showSuccessToast = (toast, message) => {
  if (toastFn) {
    toastFn.success(message);
  } else if (toast) {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  }
};

export const showErrorToast = (toast, message) => {
  if (toastFn) {
    toastFn.error(message);
  } else if (toast) {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }
};

export const showInfoToast = (toast, message) => {
  if (toastFn) {
    toastFn.info(message);
  } else if (toast) {
    toast({
      title: "Information",
      description: message,
      variant: "default",
    });
  }
};

export const showWarningToast = (toast, message) => {
  if (toastFn) {
    toastFn.warning(message);
  } else if (toast) {
    toast({
      title: "Warning",
      description: message,
      variant: "destructive",
    });
  }
};

export const showLoadingToast = (toast, message) => {
  if (toastFn) {
    return toastFn.loading(message);
  } else if (toast) {
    return toast({
      title: "Loading",
      description: message,
      variant: "default",
    });
  }
  return null;
};

export const dismissToast = (id) => {
  if (toastFn && id) {
    toastFn.dismiss(id);
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
