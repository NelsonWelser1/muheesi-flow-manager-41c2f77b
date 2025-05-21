
import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';

export const useMilkReceptionForm = () => {
  const { toast } = useToast();
  const { addMilkReception } = useMilkReception();
  const [submitting, setSubmitting] = useState(false);
  const lastSubmitTimeRef = useRef(0);
  const cooldownPeriod = 20000; // 20 seconds in milliseconds
  
  const [formData, setFormData] = useState({
    tank_number: '',
    quality_score: 'Grade A',
    supplier_name: '',
    milk_volume: '',
    temperature: '',
    fat_percentage: '',
    protein_percentage: '',
    total_plate_count: '',
    acidity: '',
    notes: ''
  });

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      tank_number: '',
      quality_score: 'Grade A',
      supplier_name: '',
      milk_volume: '',
      temperature: '',
      fat_percentage: '',
      protein_percentage: '',
      total_plate_count: '',
      acidity: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQualityChange = (value) => {
    console.log('Setting quality score to:', value);
    setFormData(prev => ({
      ...prev,
      quality_score: value
    }));
  };

  const handleTankSelection = (value) => {
    console.log('Selected tank:', value);
    setFormData(prev => ({
      ...prev,
      tank_number: value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'supplier_name',
      'milk_volume',
      'temperature',
      'fat_percentage',
      'protein_percentage',
      'total_plate_count',
      'acidity',
      'quality_score',
      'tank_number'
    ];

    const errors = [];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field.replace('_', ' ')} is required`);
      }
    });

    const numericFields = [
      'milk_volume',
      'temperature',
      'fat_percentage',
      'protein_percentage',
      'total_plate_count',
      'acidity'
    ];

    numericFields.forEach(field => {
      if (isNaN(parseFloat(formData[field]))) {
        errors.push(`${field.replace('_', ' ')} must be a valid number`);
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.log('Form data before submission:', formData);

    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive",
      });
      return { success: false, errors };
    }

    // Rate limiting check
    const now = Date.now();
    const timeElapsed = now - lastSubmitTimeRef.current;
    
    if (timeElapsed < cooldownPeriod) {
      const secondsRemaining = Math.ceil((cooldownPeriod - timeElapsed) / 1000);
      toast({
        title: "Rate Limit",
        description: `Please wait ${secondsRemaining} seconds before submitting again`,
        variant: "destructive",
      });
      return { success: false, error: 'Rate limited' };
    }

    setSubmitting(true);

    try {
      const dataToSubmit = {
        ...formData,
        milk_volume: parseFloat(formData.milk_volume),
        temperature: parseFloat(formData.temperature),
        fat_percentage: parseFloat(formData.fat_percentage),
        protein_percentage: parseFloat(formData.protein_percentage),
        total_plate_count: parseInt(formData.total_plate_count),
        acidity: parseFloat(formData.acidity),
        quality_score: formData.quality_score,
        tank_number: formData.tank_number
      };

      console.log('Submitting data:', dataToSubmit);
      const result = await addMilkReception.mutateAsync(dataToSubmit);
      console.log('Submission result:', result);

      if (result) {
        // Update last submit time
        lastSubmitTimeRef.current = Date.now();
        
        // Form-level toast is now handled in MilkReceptionForm.jsx
        // so we don't need to show it here

        // Reset form after successful submission
        resetForm();
        return { success: true, result };
      } else {
        throw new Error('Failed to add record');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      
      // Form-level toast is now handled in MilkReceptionForm.jsx
      // so we don't need to show it here
      
      return { success: false, error };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    submitting,
    handleInputChange,
    handleQualityChange,
    handleTankSelection,
    handleSubmit
  };
};
