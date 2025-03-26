
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAssociationTrainings } from "@/integrations/supabase";
import FormField from "@/components/inventory/dairy/sales/forms/components/FormField";

const ScheduleTrainingDialog = ({ open, onOpenChange, onSuccess, associationId }) => {
  const { toast } = useToast();
  const { createTraining, loading: isSubmitting } = useAssociationTrainings();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'farming',
    date: '',
    time: '',
    location: '',
    trainer: '',
    max_members: 50,
    notes: ''
  });

  const categories = [
    { value: 'farming', label: 'Farming Practices' },
    { value: 'processing', label: 'Processing Techniques' },
    { value: 'quality', label: 'Quality Control' },
    { value: 'certification', label: 'Certification' },
    { value: 'marketing', label: 'Marketing & Sales' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['title', 'category', 'date', 'time', 'location', 'trainer'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: "Missing required field",
          description: `Please provide the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive"
        });
        return false;
      }
    }

    if (formData.max_members <= 0) {
      toast({
        title: "Invalid number of participants",
        description: "Maximum participants must be at least 1",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Prepare the data for submission to Supabase
    const trainingData = {
      ...formData,
      association_id: associationId || null,
      enrolled_members: 0,
      status: 'upcoming'
    };
    
    try {
      // Save the training to Supabase
      const { success, data, error } = await createTraining(trainingData);
      
      if (success) {
        // Reset form data
        setFormData({
          title: '',
          description: '',
          category: 'farming',
          date: '',
          time: '',
          location: '',
          trainer: '',
          max_members: 50,
          notes: ''
        });
        
        // Call the onSuccess callback with the new training data
        if (onSuccess) {
          onSuccess(data);
        }
        
        // Close the dialog
        onOpenChange(false);
      } else {
        console.error("Error from createTraining:", error);
      }
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      toast({
        title: "Failed to schedule training",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule New Training</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule a new training session for association members.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <FormField label="Training Title">
            <Input 
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter the title of the training"
            />
          </FormField>
          
          <FormField label="Description">
            <Textarea 
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what this training will cover"
              className="min-h-[80px]"
            />
          </FormField>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Category">
              <Select 
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            
            <FormField label="Trainer">
              <Input 
                value={formData.trainer}
                onChange={(e) => handleInputChange('trainer', e.target.value)}
                placeholder="Who will conduct this training"
              />
            </FormField>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Date">
              <Input 
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </FormField>
            
            <FormField label="Time">
              <Input 
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
              />
            </FormField>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Location">
              <Input 
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Where the training will be held"
              />
            </FormField>
            
            <FormField label="Maximum Participants">
              <Input 
                type="number"
                value={formData.max_members}
                onChange={(e) => handleInputChange('max_members', parseInt(e.target.value) || 0)}
                placeholder="Maximum number of participants"
              />
            </FormField>
          </div>
          
          <FormField label="Additional Notes">
            <Textarea 
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information or special requirements"
              className="min-h-[80px]"
            />
          </FormField>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="mt-2 sm:mt-0"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-2 sm:mt-0"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Training"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleTrainingDialog;
