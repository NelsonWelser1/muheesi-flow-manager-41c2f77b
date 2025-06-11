
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
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
    fat_percentage: '',
    protein_percentage: '',
    total_plate_count: '',
    acidity: '',
    notes: '',
    destination: ''
  });

  const calculateTankBalance = (tankName) => {
    if (!milkReceptionData) return 0;
    
    const tankReceived = milkReceptionData
      ?.filter(record => record.tank_number === tankName && record.milk_volume > 0)
      .reduce((total, record) => total + record.milk_volume, 0) || 0;

    const tankOffloaded = milkReceptionData
      ?.filter(record => record.tank_number === tankName && record.milk_volume < 0)
      .reduce((total, record) => total + Math.abs(record.milk_volume), 0) || 0;

    return tankReceived - tankOffloaded;
  };

  const findAlternativeTank = (currentTank, requiredVolume) => {
    const tanks = ['Tank A', 'Tank B', 'Direct-Processing'];
    const alternatives = tanks
      .filter(tank => tank !== currentTank)
      .map(tank => ({
        name: tank,
        available: calculateTankBalance(tank)
      }))
      .filter(tank => tank.available >= requiredVolume)
      .sort((a, b) => b.available - a.available);

    return alternatives[0];
  };

  const handleTankSelection = (tankValue, batchId) => {
    console.log('Selected tank:', tankValue, 'Batch ID:', batchId);
    
    // Get the most recent entry for the selected tank with positive milk volume
    const mostRecentEntry = milkReceptionData
      ?.filter(record => record.tank_number === tankValue && record.milk_volume > 0)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    const availableMilk = calculateTankBalance(tankValue);

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
      const availableMilk = calculateTankBalance(formData.storage_tank);

      if (requestedVolume > availableMilk) {
        const alternativeTank = findAlternativeTank(formData.storage_tank, requestedVolume);
        
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

        // Still update the form value to show the invalid input
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        return;
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
    
    // Validate milk volume before submission
    const requestedVolume = parseFloat(formData.milk_volume);
    const availableMilk = calculateTankBalance(formData.storage_tank);
    
    if (requestedVolume > availableMilk) {
      const alternativeTank = findAlternativeTank(formData.storage_tank, requestedVolume);
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
      
      // Record in milk_reception table
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
          destination: formData.destination,
          batch_id: formData.batch_id
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
          fat_percentage: parseFloat(formData.fat_percentage),
          protein_percentage: parseFloat(formData.protein_percentage),
          total_plate_count: parseInt(formData.total_plate_count),
          acidity: parseFloat(formData.acidity),
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
        fat_percentage: '',
        protein_percentage: '',
        total_plate_count: '',
        acidity: '',
        notes: '',
        destination: ''
      });

      await refetchMilkReception();

      // Add 5-second delay before re-enabling the form to prevent duplicate submissions
      await new Promise(resolve => setTimeout(resolve, 5000));

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
