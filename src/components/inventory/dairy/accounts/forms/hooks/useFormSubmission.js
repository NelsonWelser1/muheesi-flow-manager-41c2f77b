
import { toast } from "@/components/ui/use-toast";

export const useFormSubmission = (
  createBillExpense, 
  uploadedFileUrl, 
  isRecurring, 
  clearFormAfterSubmission, 
  startSubmissionCooldown,
  isSubmissionCooldown
) => {
  const onSubmit = async (data) => {
    if (isSubmissionCooldown) {
      toast({
        title: "Please wait",
        description: "You can submit another record in a few seconds.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Bill/Expense data:", data);
      
      // Add recurring fields if enabled
      if (isRecurring) {
        data.isRecurring = true;
      } else {
        data.isRecurring = false;
        data.recurringFrequency = null;
        data.recurringEndDate = null;
      }
      
      // If file was uploaded, add the URL
      if (uploadedFileUrl) {
        data.receiptUrl = uploadedFileUrl;
      }
      
      // Submit to Supabase
      const result = await createBillExpense(data);
      
      if (result.success) {
        toast({
          title: "Bill/Expense saved",
          description: "Your bill/expense record has been saved successfully.",
        });
        
        // Clear form and start cooldown
        await clearFormAfterSubmission();
        startSubmissionCooldown();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error saving your bill/expense record.",
        variant: "destructive",
      });
    }
  };

  return { onSubmit };
};
