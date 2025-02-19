
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';
import { calculateTankBalance, findAlternativeTank } from './utils/tankCalculations';
import { initialFormState, getMostRecentEntry } from './utils/formState';
import { recordMilkOffload } from './utils/databaseOperations';

export const useMilkOffloadForm = () => {
  const { toast } = useToast();
  const { data: milkReceptionData, refetch: refetchMilkReception } = useMilkReception();
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const handleTankSelection = (tankValue, batchId) => {
    console.log('Selected tank:', tankValue, 'Batch ID:', batchId);
    
    const mostRecentEntry = getMostRecentEntry(milkReceptionData, tankValue);
    const availableMilk = calculateTankBalance(milkReceptionData, tankValue);

    if (mostRecentEntry) {
      setFormData(prev => ({
        ...prev,
        batch_id: batchId,
        storage_tank: tankValue,
        supplier_name: `Offload from ${tankValue}`,
        quality_check: mostRecentEntry.quality_score || 'Grade A',
        milk_volume: availableMilk.toString(),
        temperature: mostRecentEntry.temperature.toString(),
        fat_percentage: mostRecentEntry.fat_percentage?.toString() || '',
        protein_percentage: mostRecentEntry.protein_percentage?.toString() || '',
        total_plate_count: mostRecentEntry.total_plate_count?.toString() || '',
        acidity: mostRecentEntry.acidity?.toString() || '',
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

    if (name === 'milk_volume' && formData.storage_tank) {
      const requestedVolume = parseFloat(value);
      const availableMilk = calculateTankBalance(milkReceptionData, formData.storage_tank);

      if (requestedVolume > availableMilk) {
        const alternativeTank = findAlternativeTank(milkReceptionData, formData.storage_tank, requestedVolume);
        
        setValidationError({
          title: "Insufficient Milk Volume",
          description: `Available milk in ${formData.storage_tank}: ${availableMilk.toFixed(2)}L`,
          suggestedTank: alternativeTank ? alternativeTank.name : null
        });

        if (alternativeTank) {
          toast({
            title: "Alternative Tank Available",
            description: `${alternativeTank.name} has ${alternativeTank.available.toFixed(2)}L available`,
          });
        }
      } else {
        setValidationError(null);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requestedVolume = parseFloat(formData.milk_volume);
    const availableMilk = calculateTankBalance(milkReceptionData, formData.storage_tank);
    
    if (requestedVolume > availableMilk) {
      const alternativeTank = findAlternativeTank(milkReceptionData, formData.storage_tank, requestedVolume);
      setValidationError({
        title: "Cannot Submit - Insufficient Volume",
        description: `Available milk in ${formData.storage_tank}: ${availableMilk.toFixed(2)}L`,
        suggestedTank: alternativeTank ? alternativeTank.name : null
      });
      
      toast({
        title: "Submission Failed",
        description: "Requested volume exceeds available milk",
        variant: "destructive",
      });
      
      return;
    }

    setLoading(true);
    console.log('Starting form submission with data:', formData);
    setValidationError(null);

    try {
      console.log('Recording milk offload...');
      
      const { receptionData, offloadData } = await recordMilkOffload(formData);
      console.log('Successfully recorded milk offload:', { receptionData, offloadData });

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
