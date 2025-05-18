
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilkReceptionForm } from "./hooks/useMilkReceptionForm";
import MilkReceptionFormFields from "./components/MilkReceptionFormFields";
import { showSuccessToast } from "@/components/ui/notifications";
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
    const result = await submitForm(e);
    
    if (result && result.success) {
      // Show the success toast notification below the form
      showSuccessToast(toast, "Milk reception record added successfully");
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
