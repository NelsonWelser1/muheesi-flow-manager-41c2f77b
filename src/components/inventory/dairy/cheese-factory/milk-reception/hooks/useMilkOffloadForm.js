
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';
import { generateBatchId } from '../utils/batchIdGenerator';
import { calculateTankVolumes, getMostRecentTankEntry } from '../utils/tankCalculations';
import { validateMilkOffloadForm } from '../utils/formValidation';
import { recordMilkOffload } from '../services/milkOffloadService';

const initialFormState = {
  batch_id: '',
  storage_tank: '',
  supplier_name: 'Offload from Tank',
  milk_volume: '',
  temperature: '',
  quality_check: 'Grade A',
  notes: '',
  destination: ''
};

export const useMilkOffloadForm = () => {
  const { toast } = useToast();
  const { data: milkReceptionData, refetch: refetchMilkReception } = useMilkReception();
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const handleTankSelection = (tankValue) => {
    const batchId = generateBatchId(tankValue);
    console.log('Selected tank:', tankValue, 'Generated Batch ID:', batchId);
    
    const mostRecentEntry = getMostRecentTankEntry(milkReceptionData, tankValue);
    const { availableMilk } = calculateTankVolumes(milkReceptionData, tankValue);

    if (mostRecentEntry) {
      setFormData(prev => ({
        ...prev,
        batch_id: batchId,
        storage_tank: tankValue,
        supplier_name: `Offload from ${tankValue}`,
        quality_check: mostRecentEntry.quality_score || 'Grade A',
        milk_volume: availableMilk.toString(),
        temperature: mostRecentEntry.temperature.toString(),
        destination: mostRecentEntry.destination || ''
      }));

      toast({
        title: `${tankValue} Status`,
        description: `Available milk volume: ${availableMilk.toFixed(2)}L`,
      });
    } else {
      setFormData(prev => ({
        ...prev,
        batch_id: batchId,
        storage_tank: tankValue,
        supplier_name: `Offload from ${tankValue}`,
        quality_check: 'Grade A'
      }));

      toast({
        title: `${tankValue} Status`,
        description: "No previous records found for this tank.",
        variant: "warning"
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Starting form submission with data:', formData);
    setValidationError(null);

    const errors = validateMilkOffloadForm(formData, milkReceptionData);
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const result = await recordMilkOffload(formData);
      console.log('Successfully recorded milk offload:', result);

      toast({
        title: "Success",
        description: `Milk offload recorded successfully with Batch ID: ${formData.batch_id}`,
      });

      setFormData(initialFormState);
      await refetchMilkReception();

    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred while submitting the form",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    validationError,
    handleTankSelection,
    handleInputChange,
    handleSubmit,
    milkReceptionData
  };
};
