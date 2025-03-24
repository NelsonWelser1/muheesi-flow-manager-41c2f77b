
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, FileText, Loader2 } from "lucide-react";
import { useOperationsForm } from '@/hooks/useOperationsForm';
import { useToast } from "@/components/ui/use-toast";
import OperationsRecordsViewer from './OperationsRecordsViewer';
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

const AssociationOperations = ({ isKazo, selectedAssociation }) => {
  const { toast } = useToast();
  const [showOperationsRecords, setShowOperationsRecords] = useState(false);
  
  const {
    formData,
    loading,
    saving,
    error,
    handleDateChange,
    handleInputChange,
    handleSelectChange,
    saveOperation
  } = useOperationsForm(selectedAssociation?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!selectedAssociation?.id) {
      showErrorToast(toast, "Please select an association first");
      return;
    }
    
    try {
      const result = await saveOperation(selectedAssociation.id);
      
      if (result) {
        showSuccessToast(toast, "Operation saved successfully to database");
      } else {
        showErrorToast(toast, error || "Failed to save operation");
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      showErrorToast(toast, err.message || "Failed to save operation");
    }
  };

  if (showOperationsRecords) {
    return <OperationsRecordsViewer 
      onBack={() => setShowOperationsRecords(false)} 
      isKazo={isKazo} 
      associationId={selectedAssociation?.id}
    />;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Operations Form</h3>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowOperationsRecords(true)}
            >
              <FileText className="h-4 w-4" />
              View Records
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Next Meeting Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.next_meeting_date 
                        ? format(formData.next_meeting_date, "PPP") 
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar 
                      mode="single" 
                      selected={formData.next_meeting_date} 
                      onSelect={(date) => handleDateChange('next_meeting_date', date)} 
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Training Schedule</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.training_schedule 
                        ? format(formData.training_schedule, "PPP") 
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar 
                      mode="single" 
                      selected={formData.training_schedule} 
                      onSelect={(date) => handleDateChange('training_schedule', date)} 
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="collective_resources">Collective Resources</Label>
                <Input 
                  id="collective_resources" 
                  name="collective_resources" 
                  placeholder="Enter available resources" 
                  value={formData.collective_resources} 
                  onChange={handleInputChange} 
                />
              </div>

              <div>
                <Label htmlFor="shared_equipment">Shared Equipment</Label>
                <Input 
                  id="shared_equipment" 
                  name="shared_equipment" 
                  placeholder="Enter shared equipment" 
                  value={formData.shared_equipment} 
                  onChange={handleInputChange} 
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="postponed">Postponed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={saving || loading}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Operations"
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociationOperations;
