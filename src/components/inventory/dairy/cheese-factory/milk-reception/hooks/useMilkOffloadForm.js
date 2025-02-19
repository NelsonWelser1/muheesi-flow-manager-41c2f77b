import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';
import { useMilkReception } from '@/hooks/useMilkReception';

export const useMilkOffloadForm = () => {
  const { toast } = useToast();
  const { data: milkReceptionData, refetch: refetchMilkReception } = useMilkReception();
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storage_tank: '',
    supplier_name: 'Offload from Tank',
    milk_volume: '',
    temperature: '',
    quality_check: 'Grade A',
    notes: '',
    destination: ''
  });

  const handleTankSelection = (tankValue, batchId) => {
    console.log('Selected tank:', tankValue, 'Batch ID:', batchId);
    
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
      'storage_tank', 'milk_volume', 'temperature', 'destination'
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
    setLoading(true);
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
      setLoading(false);
      return;
    }

    try {
      console.log('Recording milk offload...');
      
      const newOffload = {
        supplier_name: formData.supplier_name,
        milk_volume: -Math.abs(parseFloat(formData.milk_volume)),
        temperature: parseFloat(formData.temperature),
        notes: formData.notes,
        quality_check: formData.quality_check,
        storage_tank: formData.storage_tank,
        destination: formData.destination
      };

      const { data: receptionData, error: receptionError } = await supabase
        .from('milk_reception')
        .insert([newOffload])
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
        description: `Milk offload recorded successfully with Batch ID: ${offloadData[0].batch_id}`,
      });

      setFormData({
        storage_tank: '',
        supplier_name: 'Offload from Tank',
        milk_volume: '',
        temperature: '',
        quality_check: 'Grade A',
        notes: '',
        destination: ''
      });

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
