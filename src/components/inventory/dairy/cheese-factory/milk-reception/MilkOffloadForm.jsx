
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Add this import
import { AlertCircle } from "lucide-react"; // Add this import
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';
import { useMilkReception } from '@/hooks/useMilkReception';
import { format } from 'date-fns';

const MilkOffloadForm = () => {
  const { toast } = useToast();
  const { data: milkReceptionData, refetch: refetchMilkReception } = useMilkReception();
  const [validationError, setValidationError] = useState(null);
  const [formData, setFormData] = useState({
    storage_tank: '',
    supplier_name: 'Offload from Tank',
    milk_volume: '',
    temperature: '',
    fat_percentage: '',
    protein_percentage: '',
    total_plate_count: '',
    acidity: '',
    destination: '',
    quality_check: 'Grade A',
    notes: ''
  });

  const handleTankSelection = (tankValue) => {
    console.log('Selected tank:', tankValue);
    setFormData(prev => ({
      ...prev,
      storage_tank: tankValue,
      supplier_name: `Offload from ${tankValue}`
    }));
    setValidationError(null); // Clear any previous errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError(null); // Clear any previous errors
  };

  const validateForm = () => {
    console.log('Validating form with data:', formData);
    const errors = [];
    const requiredFields = [
      'storage_tank', 'milk_volume', 'temperature',
      'fat_percentage', 'protein_percentage', 'total_plate_count', 'acidity'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field.replace('_', ' ')} is required`);
      }
    });

    // Get tanks data
    const tankAMilk = milkReceptionData
      ?.filter(record => record.tank_number === 'Tank A')
      .reduce((total, record) => total + (record.milk_volume || 0), 0) || 0;

    const tankBMilk = milkReceptionData
      ?.filter(record => record.tank_number === 'Tank B')
      .reduce((total, record) => total + (record.milk_volume || 0), 0) || 0;

    // Convert milk_volume to number for comparison
    const offloadVolume = Math.abs(parseFloat(formData.milk_volume));
    
    if (offloadVolume > 0) {
      if (formData.storage_tank === 'Tank A' && offloadVolume > tankAMilk) {
        if (offloadVolume <= tankBMilk) {
          setValidationError({
            title: "Insufficient Volume in Tank A",
            description: `Tank A only has ${tankAMilk.toFixed(2)}L available. Consider using Tank B which has ${tankBMilk.toFixed(2)}L available.`,
            suggestedTank: 'Tank B'
          });
        } else {
          setValidationError({
            title: "Insufficient Volume in Both Tanks",
            description: `Not enough milk in either tank. Tank A has ${tankAMilk.toFixed(2)}L and Tank B has ${tankBMilk.toFixed(2)}L available.`,
            suggestedTank: null
          });
        }
        errors.push("Insufficient volume");
      } else if (formData.storage_tank === 'Tank B' && offloadVolume > tankBMilk) {
        if (offloadVolume <= tankAMilk) {
          setValidationError({
            title: "Insufficient Volume in Tank B",
            description: `Tank B only has ${tankBMilk.toFixed(2)}L available. Consider using Tank A which has ${tankAMilk.toFixed(2)}L available.`,
            suggestedTank: 'Tank A'
          });
        } else {
          setValidationError({
            title: "Insufficient Volume in Both Tanks",
            description: `Not enough milk in either tank. Tank A has ${tankAMilk.toFixed(2)}L and Tank B has ${tankBMilk.toFixed(2)}L available.`,
            suggestedTank: null
          });
        }
        errors.push("Insufficient volume");
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting form submission with data:', formData);
    setValidationError(null);

    const errors = validateForm();
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      if (!validationError) {
        toast({
          title: "Validation Error",
          description: errors.join(', '),
          variant: "destructive",
        });
      }
      return;
    }

    try {
      console.log('Recording milk offload...');
      const { data: offloadData, error: offloadError } = await supabase
        .from('milk_reception')
        .insert([{
          supplier_name: formData.supplier_name,
          milk_volume: -Math.abs(parseFloat(formData.milk_volume)),
          temperature: parseFloat(formData.temperature),
          fat_percentage: parseFloat(formData.fat_percentage),
          protein_percentage: parseFloat(formData.protein_percentage),
          total_plate_count: parseInt(formData.total_plate_count),
          acidity: parseFloat(formData.acidity),
          notes: formData.notes,
          quality_score: formData.quality_check,
          tank_number: formData.storage_tank
        }])
        .select();

      if (offloadError) throw offloadError;

      console.log('Successfully recorded milk offload:', offloadData);

      toast({
        title: "Success",
        description: "Milk offload record added successfully",
      });

      setFormData({
        storage_tank: '',
        supplier_name: 'Offload from Tank',
        milk_volume: '',
        temperature: '',
        fat_percentage: '',
        protein_percentage: '',
        total_plate_count: '',
        acidity: '',
        destination: '',
        quality_check: 'Grade A',
        notes: ''
      });

      await refetchMilkReception();

    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred while submitting the form",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Tank Offload Entry</CardTitle>
        </CardHeader>
        <CardContent>
          {validationError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{validationError.title}</AlertTitle>
              <AlertDescription className="mt-2">
                {validationError.description}
                {validationError.suggestedTank && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      onClick={() => handleTankSelection(validationError.suggestedTank)}
                    >
                      Switch to {validationError.suggestedTank}
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storage_tank">Storage Tank</Label>
                <Select 
                  value={formData.storage_tank} 
                  onValueChange={handleTankSelection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tank A">Tank A</SelectItem>
                    <SelectItem value="Tank B">Tank B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality_check">Quality Grade</Label>
                <Select 
                  value={formData.quality_check} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, quality_check: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade A">Grade A</SelectItem>
                    <SelectItem value="Grade B">Grade B</SelectItem>
                    <SelectItem value="Grade C">Grade C</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="milk_volume">Milk Volume (L)</Label>
                <Input
                  id="milk_volume"
                  name="milk_volume"
                  type="number"
                  step="0.01"
                  value={formData.milk_volume}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fat_percentage">Fat Percentage (%)</Label>
                <Input
                  id="fat_percentage"
                  name="fat_percentage"
                  type="number"
                  step="0.01"
                  value={formData.fat_percentage}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="protein_percentage">Protein Percentage (%)</Label>
                <Input
                  id="protein_percentage"
                  name="protein_percentage"
                  type="number"
                  step="0.01"
                  value={formData.protein_percentage}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_plate_count">Total Plate Count</Label>
                <Input
                  id="total_plate_count"
                  name="total_plate_count"
                  type="number"
                  value={formData.total_plate_count}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="acidity">Acidity (pH)</Label>
                <Input
                  id="acidity"
                  name="acidity"
                  type="number"
                  step="0.01"
                  value={formData.acidity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
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
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" className="w-full">
              Submit Offload Record
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Display submitted data */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Offload Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milkReceptionData && milkReceptionData.length > 0 ? (
              <div className="grid gap-4">
                {milkReceptionData
                  .filter(record => record.supplier_name.includes('Offload from'))
                  .slice(0, 5)
                  .map((record) => (
                    <Card key={record.id} className="p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <strong>Tank:</strong> {record.tank_number}
                        </div>
                        <div>
                          <strong>Date:</strong> {format(new Date(record.created_at), 'PPp')}
                        </div>
                        <div>
                          <strong>Volume:</strong> {Math.abs(record.milk_volume)}L
                        </div>
                        <div>
                          <strong>Temperature:</strong> {record.temperature}°C
                        </div>
                        <div>
                          <strong>Quality:</strong> {record.quality_score}
                        </div>
                        {record.notes && (
                          <div className="col-span-2">
                            <strong>Notes:</strong> {record.notes}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No offload records found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkOffloadForm;
