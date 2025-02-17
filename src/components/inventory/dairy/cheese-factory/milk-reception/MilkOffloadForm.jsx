import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';
import { useMilkReception } from '@/hooks/useMilkReception';

import { TankSelector } from './components/TankSelector';
import { QualityGradeSelector } from './components/QualityGradeSelector';
import { MilkOffloadFormFields } from './components/MilkOffloadFormFields';
import { ValidationError } from './components/ValidationError';
import { RecentOffloadRecords } from './components/RecentOffloadRecords';

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
    
    const mostRecentEntry = milkReceptionData
      ?.filter(record => record.tank_number === tankValue && record.milk_volume > 0)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    if (mostRecentEntry) {
      setFormData(prev => ({
        ...prev,
        storage_tank: tankValue,
        supplier_name: `Offload from ${tankValue}`,
        quality_check: mostRecentEntry.quality_score || 'Grade A',
        milk_volume: Math.abs(mostRecentEntry.milk_volume).toString(),
        temperature: mostRecentEntry.temperature.toString(),
        fat_percentage: mostRecentEntry.fat_percentage.toString(),
        protein_percentage: mostRecentEntry.protein_percentage.toString(),
        total_plate_count: mostRecentEntry.total_plate_count.toString(),
        acidity: mostRecentEntry.acidity.toString(),
        destination: mostRecentEntry.destination || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        storage_tank: tankValue,
        supplier_name: `Offload from ${tankValue}`,
        quality_check: 'Grade A'
      }));
    }
    
    setValidationError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError(null);
  };

  const validateForm = () => {
    console.log('Validating form with data:', formData);
    const errors = [];
    const requiredFields = [
      'storage_tank', 'milk_volume', 'temperature',
      'fat_percentage', 'protein_percentage', 'total_plate_count', 
      'acidity', 'destination'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field.replace('_', ' ')} is required`);
      }
    });

    const offloadVolume = Math.abs(parseFloat(formData.milk_volume));

    if (formData.storage_tank === 'Direct-Processing') {
      const directProcessingReceived = milkReceptionData
        ?.filter(record => 
          record.tank_number === 'Direct-Processing' && 
          record.milk_volume > 0
        )
        .reduce((total, record) => total + record.milk_volume, 0) || 0;

      const directProcessingOffloaded = milkReceptionData
        ?.filter(record => 
          record.tank_number === 'Direct-Processing' && 
          record.milk_volume < 0
        )
        .reduce((total, record) => total + Math.abs(record.milk_volume), 0) || 0;

      const availableDirectProcessing = directProcessingReceived - directProcessingOffloaded;

      if (offloadVolume > availableDirectProcessing) {
        setValidationError({
          title: "Insufficient Volume in Direct Processing",
          description: `Direct Processing only has ${availableDirectProcessing.toFixed(2)}L available. Consider using Tank A or Tank B if available.`,
          suggestedTank: null
        });
        errors.push("Insufficient volume in Direct Processing");
      }
    } else {
      const tankAMilk = milkReceptionData
        ?.filter(record => record.tank_number === 'Tank A')
        .reduce((total, record) => total + (record.milk_volume || 0), 0) || 0;

      const tankBMilk = milkReceptionData
        ?.filter(record => record.tank_number === 'Tank B')
        .reduce((total, record) => total + (record.milk_volume || 0), 0) || 0;

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
      
      const { data: receptionData, error: receptionError } = await supabase
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
          tank_number: formData.storage_tank,
          destination: formData.destination
        }])
        .select();

      if (receptionError) throw receptionError;

      const { data: offloadData, error: offloadError } = await supabase
        .from('milk_tank_offloads')
        .insert([{
          storage_tank: formData.storage_tank,
          volume_offloaded: Math.abs(parseFloat(formData.milk_volume)),
          temperature: parseFloat(formData.temperature),
          quality_check: formData.quality_check,
          notes: formData.notes,
          destination: formData.destination
        }])
        .select();

      if (offloadError) throw offloadError;

      console.log('Successfully recorded milk offload:', { receptionData, offloadData });

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
          <ValidationError 
            error={validationError} 
            onSwitchTank={handleTankSelection} 
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TankSelector 
                value={formData.storage_tank} 
                onValueChange={handleTankSelection} 
              />
              
              <QualityGradeSelector 
                value={formData.quality_check}
                onValueChange={(value) => setFormData(prev => ({ ...prev, quality_check: value }))}
              />

              <MilkOffloadFormFields 
                formData={formData}
                handleInputChange={handleInputChange}
              />
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Offload Records</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOffloadRecords records={milkReceptionData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkOffloadForm;
