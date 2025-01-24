import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

const ReceiveMilkForm = () => {
  const { toast } = useToast();
  const [batchId, setBatchId] = useState('');
  const [milkType, setMilkType] = useState('cow');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    supplier: '',
    quantity: '',
    temperature: '',
    fatPercentage: '',
    proteinPercentage: '',
    totalPlateCount: '',
    acidity: '',
    notes: ''
  });

  useEffect(() => {
    console.log('Initializing form...');
    setBatchId(generateBatchId());
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        toast({
          title: "Authentication Error",
          description: "Please ensure you are logged in",
          variant: "destructive",
        });
        return;
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    }
  };

  const generateBatchId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MK${year}${month}${day}-${random}`;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['supplier', 'quantity', 'temperature', 'fatPercentage', 'proteinPercentage', 'totalPlateCount', 'acidity'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    // Validate numeric fields
    const numericFields = {
      quantity: parseFloat(formData.quantity),
      temperature: parseFloat(formData.temperature),
      fatPercentage: parseFloat(formData.fatPercentage),
      proteinPercentage: parseFloat(formData.proteinPercentage),
      totalPlateCount: parseInt(formData.totalPlateCount),
      acidity: parseFloat(formData.acidity)
    };

    for (const [field, value] of Object.entries(numericFields)) {
      if (isNaN(value)) {
        toast({
          title: "Validation Error",
          description: `Invalid numeric value for ${field}`,
          variant: "destructive",
        });
        return false;
      }
    }

    return { numericFields };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');

    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit data",
        variant: "destructive",
      });
      return;
    }

    const validation = validateForm();
    if (!validation) return;

    try {
      setIsSubmitting(true);
      const { numericFields } = validation;

      const dataToSubmit = {
        batch_id: batchId,
        reception_date: new Date().toISOString(),
        supplier: formData.supplier,
        milk_type: milkType,
        quantity: numericFields.quantity,
        temperature: numericFields.temperature,
        fat_percentage: numericFields.fatPercentage,
        protein_percentage: numericFields.proteinPercentage,
        total_plate_count: numericFields.totalPlateCount,
        acidity: numericFields.acidity,
        notes: formData.notes || null,
        user_id: currentUser.id
      };

      console.log('Submitting data to Supabase:', dataToSubmit);

      const { error } = await supabase
        .from('milk_reception_data')
        .insert([dataToSubmit]);

      if (error) {
        console.error('Error submitting form:', error);
        toast({
          title: "Submission Error",
          description: error.message || "Failed to record milk reception data",
          variant: "destructive",
        });
        return;
      }

      console.log('Form submitted successfully');
      toast({
        title: "Success",
        description: "Milk reception data has been recorded",
      });

      // Reset form
      setFormData({
        supplier: '',
        quantity: '',
        temperature: '',
        fatPercentage: '',
        proteinPercentage: '',
        totalPlateCount: '',
        acidity: '',
        notes: ''
      });
      setBatchId(generateBatchId());
      setMilkType('cow');

    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-[800px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="receptionDateTime">Date and Time of Reception</Label>
          <Input 
            id="receptionDateTime" 
            type="text"
            value={new Date().toLocaleString()}
            className="focus:ring-2 focus:ring-blue-200 border-gray-200 bg-gray-50"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier Name/ID</Label>
          <Input 
            id="supplier" 
            type="text"
            value={formData.supplier}
            onChange={handleInputChange}
            placeholder="Enter supplier name or ID"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Milk Volume (Liters)</Label>
          <Input 
            id="quantity" 
            type="number" 
            step="0.1"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Enter volume"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature at Reception (°C)</Label>
          <Input 
            id="temperature" 
            type="number" 
            step="0.1"
            value={formData.temperature}
            onChange={handleInputChange}
            placeholder="Enter temperature"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="milkType">Milk Type</Label>
          <Select value={milkType} onValueChange={setMilkType} required>
            <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-200 border-gray-200">
              <SelectValue placeholder="Select milk type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cow">Cow Milk</SelectItem>
              <SelectItem value="goat">Goat Milk</SelectItem>
              <SelectItem value="sheep">Sheep Milk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="batchId">Batch ID</Label>
          <Input 
            id="batchId" 
            type="text"
            value={batchId}
            className="focus:ring-2 focus:ring-blue-200 border-gray-200 bg-gray-50"
            readOnly
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Quality Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fatPercentage">Fat Percentage (%)</Label>
            <Input 
              id="fatPercentage" 
              type="number" 
              step="0.01"
              value={formData.fatPercentage}
              onChange={handleInputChange}
              placeholder="Enter fat %"
              className="focus:ring-2 focus:ring-blue-200 border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proteinPercentage">Protein Percentage (%)</Label>
            <Input 
              id="proteinPercentage" 
              type="number" 
              step="0.01"
              value={formData.proteinPercentage}
              onChange={handleInputChange}
              placeholder="Enter protein %"
              className="focus:ring-2 focus:ring-blue-200 border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalPlateCount">Total Plate Count (CFU/ml)</Label>
            <Input 
              id="totalPlateCount" 
              type="number"
              value={formData.totalPlateCount}
              onChange={handleInputChange}
              placeholder="Enter TPC"
              className="focus:ring-2 focus:ring-blue-200 border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acidity">Acidity (%)</Label>
            <Input 
              id="acidity" 
              type="number" 
              step="0.01"
              value={formData.acidity}
              onChange={handleInputChange}
              placeholder="Enter acidity"
              className="focus:ring-2 focus:ring-blue-200 border-gray-200"
              required
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Input 
            id="notes" 
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Enter any additional notes"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );

};

export default ReceiveMilkForm;
