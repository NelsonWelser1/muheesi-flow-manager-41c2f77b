
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
    batch_id: '',
    storage_tank: '',
    supplier_name: 'Offload from Tank',
    milk_volume: '',
    temperature: '',
    quality_check: 'Grade A',
    notes: '',
    destination: ''
  });

  const generateBatchId = (tankValue) => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
    const formattedTime = date.toTimeString().split(' ')[0].replace(/:/g, '');
    return `${formattedDate}-${tankValue}-${formattedTime}`;
  };

  const handleTankSelection = (tankValue) => {
    const batchId = generateBatchId(tankValue);
    console.log('Selected tank:', tankValue, 'Generated Batch ID:', batchId);
    
    // Get the most recent entry for the selected tank
    const mostRecentEntry = milkReceptionData
      ?.filter(record => record.tank_number === tankValue && record.milk_volume > 0)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    // Calculate available milk
    const tankReceived = milkReceptionData
      ?.filter(record => 
        record.tank_number === tankValue && 
        record.milk_volume > 0
      )
      .reduce((total, record) => total + record.milk_volume, 0) || 0;

    const tankOffloaded = milkReceptionData
      ?.filter(record => 
        record.tank_number === tankValue && 
        record.milk_volume < 0
      )
      .reduce((total, record) => total + Math.abs(record.milk_volume), 0) || 0;

    const availableMilk = tankReceived - tankOffloaded;

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

  const validateForm = () => {
    console.log('Validating form with data:', formData);
    const errors = [];
    const requiredFields = [
      'batch_id', 'storage_tank', 'milk_volume', 'temperature', 'destination'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field.replace('_', ' ')} is required`);
      }
    });

    const offloadVolume = Math.abs(parseFloat(formData.milk_volume));

    // Calculate available milk in the selected tank
    const tankReceived = milkReceptionData
      ?.filter(record => 
        record.tank_number === formData.storage_tank && 
        record.milk_volume > 0
      )
      .reduce((total, record) => total + record.milk_volume, 0) || 0;

    const tankOffloaded = milkReceptionData
      ?.filter(record => 
        record.tank_number === formData.storage_tank && 
        record.milk_volume < 0
      )
      .reduce((total, record) => total + Math.abs(record.milk_volume), 0) || 0;

    const availableMilk = tankReceived - tankOffloaded;

    if (offloadVolume > availableMilk) {
      setValidationError({
        title: "Insufficient Volume",
        description: `${formData.storage_tank} only has ${availableMilk.toFixed(2)}L available.`,
        suggestedTank: null
      });
      errors.push("Insufficient volume");
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
      
      // Record in milk_reception table
      const { data: receptionData, error: receptionError } = await supabase
        .from('milk_reception')
        .insert([{
          supplier_name: formData.supplier_name,
          milk_volume: -Math.abs(parseFloat(formData.milk_volume)),
          temperature: parseFloat(formData.temperature),
          notes: formData.notes,
          quality_score: formData.quality_check,
          tank_number: formData.storage_tank,
          destination: formData.destination
        }])
        .select();

      if (receptionError) throw receptionError;

      // Record in milk_tank_offloads table
      const { data: offloadData, error: offloadError } = await supabase
        .from('milk_tank_offloads')
        .insert([{
          batch_id: formData.batch_id,
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
        description: `Milk offload recorded successfully with Batch ID: ${formData.batch_id}`,
      });

      // Reset form
      setFormData({
        batch_id: '',
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
