
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilkReceptionForm } from "./hooks/useMilkReceptionForm";
import MilkReceptionFormFields from "./components/MilkReceptionFormFields";
import { useToast } from "@/components/ui/use-toast";
import { Check, AlertCircle } from "lucide-react";

const MilkReceptionForm = () => {
  const { toast } = useToast();
  const {
    formData,
    submitting,
    handleInputChange,
    handleQualityChange,
    handleTankSelection,
    handleSubmit: submitForm
  } = useMilkReceptionForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting milk reception form...');
    
    try {
      const result = await submitForm(e);
      
      if (result && result.success) {
        // Show success toast
        toast({
          title: "Success!",
          description: "Milk reception record added successfully",
          duration: 6000,
          className: "bg-green-50 border-2 border-green-500 text-green-800 font-medium",
          action: (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          ),
        });
        console.log('Success toast triggered');
      } else {
        // Show error toast
        const errorMessage = result?.error?.message || "Failed to submit milk reception record. Please try again.";
        
        toast({
          title: "Submission Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 6000,
          className: "bg-red-50 border-2 border-red-500 text-red-800 font-medium",
          action: (
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
          ),
        });
        console.log('Error toast triggered');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      
      // Show exception toast
      toast({
        title: "System Error",
        description: "An unexpected error occurred. Please try again or contact support.",
        variant: "destructive",
        duration: 6000,
        className: "bg-red-50 border-2 border-red-500 text-red-800 font-medium",
        action: (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
        ),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Milk Reception Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <MilkReceptionFormFields 
            formData={formData}
            handleInputChange={handleInputChange}
            handleQualityChange={handleQualityChange}
            handleTankSelection={handleTankSelection}
          />
          
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-[0.98]" 
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MilkReceptionForm;
