
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLivestockManagement } from '@/hooks/useLivestockManagement';
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import LivestockRecordsViewer from './LivestockRecordsViewer';

const LivestockManagement = ({ isKazo, selectedAssociation }) => {
  const { toast } = useToast();
  const [showRecords, setShowRecords] = useState(false);
  
  const {
    formData,
    loading,
    saving,
    error,
    handleDateChange,
    handleInputChange,
    handleSelectChange,
    saveLivestockRecord
  } = useLivestockManagement(selectedAssociation?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!selectedAssociation?.id) {
      showErrorToast(toast, "Please select an association first");
      return;
    }
    
    if (!formData.livestock_type) {
      showErrorToast(toast, "Livestock type is required");
      return;
    }
    
    try {
      const result = await saveLivestockRecord(selectedAssociation.id);
      
      if (result.success) {
        showSuccessToast(toast, result.message || "Livestock record saved successfully");
      } else {
        showErrorToast(toast, result.message || "Failed to save livestock record");
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      showErrorToast(toast, err.message || "Failed to save livestock record");
    }
  };

  const livestockTypeOptions = [
    { value: 'cattle', label: 'Cattle' },
    { value: 'goats', label: 'Goats' },
    { value: 'sheep', label: 'Sheep' },
    { value: 'pigs', label: 'Pigs' },
    { value: 'poultry', label: 'Poultry' },
    { value: 'rabbits', label: 'Rabbits' },
    { value: 'fish', label: 'Fish' },
    { value: 'bees', label: 'Bees' },
    { value: 'other', label: 'Other' }
  ];

  const healthStatusOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'critical', label: 'Critical' },
    { value: 'under_treatment', label: 'Under Treatment' }
  ];

  if (showRecords) {
    return <LivestockRecordsViewer 
      onBack={() => setShowRecords(false)} 
      isKazo={isKazo} 
      associationId={selectedAssociation?.id}
    />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Livestock Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Livestock Entry Form</h3>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowRecords(true)}
            >
              <FileText className="h-4 w-4" />
              View Records
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="livestock_type">Livestock Type</Label>
                <Select 
                  value={formData.livestock_type} 
                  onValueChange={(value) => handleSelectChange('livestock_type', value)}
                >
                  <SelectTrigger id="livestock_type">
                    <SelectValue placeholder="Select livestock type" />
                  </SelectTrigger>
                  <SelectContent>
                    {livestockTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  name="quantity"
                  type="number" 
                  min="0"
                  value={formData.quantity} 
                  onChange={handleInputChange} 
                  placeholder="Enter quantity" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="health_status">Health Status</Label>
                <Select 
                  value={formData.health_status} 
                  onValueChange={(value) => handleSelectChange('health_status', value)}
                >
                  <SelectTrigger id="health_status">
                    <SelectValue placeholder="Select health status" />
                  </SelectTrigger>
                  <SelectContent>
                    {healthStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feeding_schedule">Feeding Schedule</Label>
                <Input 
                  id="feeding_schedule" 
                  name="feeding_schedule" 
                  value={formData.feeding_schedule} 
                  onChange={handleInputChange} 
                  placeholder="Enter feeding schedule" 
                />
              </div>

              <div className="space-y-2">
                <Label>Vaccination Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.vaccination_date 
                        ? format(formData.vaccination_date, "PPP") 
                        : "Select vaccination date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar 
                      mode="single" 
                      selected={formData.vaccination_date} 
                      onSelect={(date) => handleDateChange('vaccination_date', date)} 
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="breeding_program">Breeding Program</Label>
                <Input 
                  id="breeding_program" 
                  name="breeding_program" 
                  value={formData.breeding_program} 
                  onChange={handleInputChange} 
                  placeholder="Enter breeding program details" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
                placeholder="Enter any additional notes"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving || loading}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Livestock Record"
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivestockManagement;
