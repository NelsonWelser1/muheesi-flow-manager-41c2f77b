
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { ArrowLeft, Save, Calculator } from "lucide-react";
import { useKyalimaCattleFattening } from '@/hooks/useKyalimaCattleFattening';
import { useToast } from '@/components/ui/use-toast';

const CattleFatteningForm = ({ existingData, onCancel }) => {
  const { addFatteningProgram, updateFatteningProgram, isSubmitting } = useKyalimaCattleFattening();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tag_number: '',
    name: '',
    breed: '',
    date_of_birth: '',
    entry_date: format(new Date(), 'yyyy-MM-dd'),
    entry_weight: '',
    current_weight: '',
    target_weight: '',
    feeding_regime: 'standard',
    notes: '',
    status: 'active'
  });
  
  const [calculatedDailyGain, setCalculatedDailyGain] = useState(null);
  const [errors, setErrors] = useState({});

  // Load existing data if editing
  useEffect(() => {
    if (existingData) {
      setFormData({
        tag_number: existingData.tag_number || '',
        name: existingData.name || '',
        breed: existingData.breed || '',
        date_of_birth: existingData.date_of_birth || '',
        entry_date: existingData.entry_date || format(new Date(), 'yyyy-MM-dd'),
        entry_weight: existingData.entry_weight || '',
        current_weight: existingData.current_weight || '',
        target_weight: existingData.target_weight || '',
        feeding_regime: existingData.feeding_regime || 'standard',
        status: existingData.status || 'active',
        notes: existingData.notes || ''
      });
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Calculate estimated daily gain
  const calculateDailyGain = () => {
    const { entry_weight, current_weight, entry_date } = formData;
    
    if (!entry_weight || !current_weight || !entry_date) {
      toast({
        title: "Missing Data",
        description: "Please provide entry weight, current weight, and entry date",
        variant: "destructive"
      });
      return;
    }
    
    const entryDate = new Date(entry_date);
    const today = new Date();
    const daysDiff = Math.max(1, Math.floor((today - entryDate) / (1000 * 60 * 60 * 24)));
    
    const weightDiff = parseFloat(current_weight) - parseFloat(entry_weight);
    const dailyGain = weightDiff / daysDiff;
    
    setCalculatedDailyGain(dailyGain.toFixed(2));
    
    // Estimate completion date
    const targetWeight = parseFloat(formData.target_weight);
    if (targetWeight > 0 && dailyGain > 0) {
      const remainingGain = targetWeight - parseFloat(current_weight);
      const daysToTarget = Math.ceil(remainingGain / dailyGain);
      const completionDate = new Date();
      completionDate.setDate(today.getDate() + daysToTarget);
      
      toast({
        title: "Daily Gain Calculated",
        description: `Estimated daily gain: ${dailyGain.toFixed(2)} kg/day. Expected completion: ${format(completionDate, 'yyyy-MM-dd')}`
      });
    } else {
      toast({
        title: "Daily Gain Calculated",
        description: `Estimated daily gain: ${dailyGain.toFixed(2)} kg/day.`
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tag_number) newErrors.tag_number = "Tag number is required";
    if (!formData.breed) newErrors.breed = "Breed is required";
    if (!formData.entry_date) newErrors.entry_date = "Entry date is required";
    if (!formData.entry_weight) {
      newErrors.entry_weight = "Entry weight is required";
    } else if (parseFloat(formData.entry_weight) <= 0) {
      newErrors.entry_weight = "Entry weight must be greater than 0";
    }
    
    if (!formData.current_weight) {
      newErrors.current_weight = "Current weight is required";
    } else if (parseFloat(formData.current_weight) <= 0) {
      newErrors.current_weight = "Current weight must be greater than 0";
    }
    
    if (!formData.target_weight) {
      newErrors.target_weight = "Target weight is required";
    } else if (parseFloat(formData.target_weight) <= 0) {
      newErrors.target_weight = "Target weight must be greater than 0";
    } else if (parseFloat(formData.target_weight) <= parseFloat(formData.current_weight)) {
      newErrors.target_weight = "Target weight must be greater than current weight";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Convert string values to numbers
    const processedData = {
      ...formData,
      entry_weight: parseFloat(formData.entry_weight),
      current_weight: parseFloat(formData.current_weight),
      target_weight: parseFloat(formData.target_weight)
    };
    
    let success;
    
    if (existingData) {
      success = await updateFatteningProgram(existingData.id, processedData);
    } else {
      success = await addFatteningProgram(processedData);
    }
    
    if (success) {
      onCancel(); // Go back to list
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cattle List
        </Button>
        <h2 className="text-2xl font-bold">{existingData ? "Edit Cattle" : "Add New Cattle to Fattening Program"}</h2>
        <div className="w-24"></div> {/* Empty div for flex alignment */}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cattle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Identification */}
              <div className="space-y-4">
                <h3 className="font-medium">Identification</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="tag_number">Tag Number *</Label>
                  <Input
                    id="tag_number"
                    name="tag_number"
                    value={formData.tag_number}
                    onChange={handleChange}
                    placeholder="KYL-C001"
                    required
                    className={errors.tag_number ? "border-red-500" : ""}
                  />
                  {errors.tag_number && (
                    <p className="text-sm text-red-500">{errors.tag_number}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Bull 1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed *</Label>
                  <Select 
                    name="breed"
                    value={formData.breed} 
                    onValueChange={(value) => handleSelectChange("breed", value)}
                    required
                  >
                    <SelectTrigger className={errors.breed ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Boran">Boran</SelectItem>
                      <SelectItem value="Ankole Longhorn">Ankole Longhorn</SelectItem>
                      <SelectItem value="Hereford">Hereford</SelectItem>
                      <SelectItem value="Aberdeen">Aberdeen</SelectItem>
                      <SelectItem value="Angus">Angus</SelectItem>
                      <SelectItem value="Charolais">Charolais</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.breed && (
                    <p className="text-sm text-red-500">{errors.breed}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Weight & Date Information */}
              <div className="space-y-4">
                <h3 className="font-medium">Weight & Program Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="entry_date">Entry Date *</Label>
                  <Input
                    id="entry_date"
                    name="entry_date"
                    type="date"
                    value={formData.entry_date}
                    onChange={handleChange}
                    required
                    className={errors.entry_date ? "border-red-500" : ""}
                  />
                  {errors.entry_date && (
                    <p className="text-sm text-red-500">{errors.entry_date}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entry_weight">Entry Weight (kg) *</Label>
                    <Input
                      id="entry_weight"
                      name="entry_weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.entry_weight}
                      onChange={handleChange}
                      required
                      className={errors.entry_weight ? "border-red-500" : ""}
                    />
                    {errors.entry_weight && (
                      <p className="text-sm text-red-500">{errors.entry_weight}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current_weight">Current Weight (kg) *</Label>
                    <Input
                      id="current_weight"
                      name="current_weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.current_weight}
                      onChange={handleChange}
                      required
                      className={errors.current_weight ? "border-red-500" : ""}
                    />
                    {errors.current_weight && (
                      <p className="text-sm text-red-500">{errors.current_weight}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-end space-x-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="target_weight">Target Weight (kg) *</Label>
                    <Input
                      id="target_weight"
                      name="target_weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.target_weight}
                      onChange={handleChange}
                      required
                      className={errors.target_weight ? "border-red-500" : ""}
                    />
                    {errors.target_weight && (
                      <p className="text-sm text-red-500">{errors.target_weight}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={calculateDailyGain}
                    className="mb-0.5"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Daily Gain
                  </Button>
                </div>
                
                {calculatedDailyGain !== null && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-green-800 mt-2">
                    Estimated Daily Gain: <strong>{calculatedDailyGain} kg/day</strong>
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Additional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="feeding_regime">Feeding Regime *</Label>
                  <Select 
                    name="feeding_regime"
                    value={formData.feeding_regime} 
                    onValueChange={(value) => handleSelectChange("feeding_regime", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select feeding regime" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="intensive">Intensive</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="specialized">Specialized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select 
                    name="status"
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="deceased">Deceased</SelectItem>
                      <SelectItem value="transferred">Transferred</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter any additional notes or observations"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : existingData ? "Update Cattle" : "Save Cattle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleFatteningForm;
