import { toast as sonnerToast } from "sonner";

export const useToast = () => {
  const toast = ({ title, description, variant = "default", ...props }) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
        ...props,
      });
    } else {
      sonnerToast(title, {
        description,
        ...props,
      });
    }
  };

  return { toast };
};
