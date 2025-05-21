
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilkReceptionForm } from "./hooks/useMilkReceptionForm";
import MilkReceptionFormFields from "./components/MilkReceptionFormFields";
import { useToast } from "@/components/ui/use-toast";

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
    console.log('Form submitted, awaiting result...');
    
    const result = await submitForm(e);
    
    if (result && result.success) {
      // Show success notification for 60 seconds (60000ms)
      toast({
        title: "Success",
        description: "Milk reception record added successfully",
        duration: 60000, // 60 seconds
        className: "bg-green-50 border-green-300 text-green-800",
      });
      console.log('Success toast triggered');
    } else if (result && !result.success) {
      // Show error notification for 60 seconds
      toast({
        title: "Error",
        description: "Failed to submit milk reception record. Please try again.",
        variant: "destructive",
        duration: 60000, // 60 seconds
      });
      console.log('Error toast triggered');
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
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium" 
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
