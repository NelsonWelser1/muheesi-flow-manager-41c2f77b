import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const qualityCheckItems = [
  { id: 'equipment', label: 'Equipment Sanitization Check' },
  { id: 'temperature', label: 'Temperature Control Verification' },
  { id: 'ingredients', label: 'Raw Ingredients Quality Check' },
  { id: 'packaging', label: 'Packaging Material Inspection' },
  { id: 'environment', label: 'Production Environment Assessment' },
  { id: 'personnel', label: 'Personnel Hygiene Verification' },
  { id: 'documentation', label: 'Quality Documentation Review' },
  { id: 'allergens', label: 'Allergen Control Check' },
  { id: 'cleaning', label: 'Cleaning Schedule Verification' },
  { id: 'maintenance', label: 'Equipment Maintenance Review' }
];

const QualityChecklist = () => {
  const { toast } = useToast();
  const [checkedItems, setCheckedItems] = useState({});

  const submitChecklist = useMutation({
    mutationFn: async (data) => {
      console.log('Submitting quality checklist:', data);
      const { data: result, error } = await supabase
        .from('quality_checklists')
        .insert([{
          checklist_items: data,
          completed_at: new Date().toISOString(),
          completed_by: 'Current User' // Replace with actual user data when available
        }])
        .select();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Quality checklist submitted successfully",
      });
      setCheckedItems({});
    },
    onError: (error) => {
      console.error('Error submitting checklist:', error);
      toast({
        title: "Error",
        description: "Failed to submit checklist",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    submitChecklist.mutate(checkedItems);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Quality Control Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {qualityCheckItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                checked={checkedItems[item.id] || false}
                onCheckedChange={(checked) => {
                  setCheckedItems(prev => ({
                    ...prev,
                    [item.id]: checked
                  }));
                }}
              />
              <Label htmlFor={item.id}>{item.label}</Label>
            </div>
          ))}
          <Button 
            onClick={handleSubmit} 
            className="w-full mt-4"
            disabled={submitChecklist.isPending}
          >
            {submitChecklist.isPending ? "Submitting..." : "Submit Checklist"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityChecklist;