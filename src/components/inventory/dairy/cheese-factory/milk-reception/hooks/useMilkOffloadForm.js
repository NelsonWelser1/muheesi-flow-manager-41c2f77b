
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
    fat_percentage: '',
    protein_percentage: '',
    total_plate_count: '',
    acidity: '',
    notes: '',
    destination: ''
  });

  const handleTankSelection = (tankValue, batchId) => {
    console.log('Selected tank:', tankValue, 'Batch ID:', batchId);
    
    // Get the most recent entry for the selected tank with positive milk volume
    const mostRecentEntry = milkReceptionData
      ?.filter(record => record.tank_number === tankValue && record.milk_volume > 0)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    // Calculate total milk received and offloaded for the selected tank
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
          batch_id: formData.batch_id // Add batch_id to milk_reception table
        }])
        .select();

      if (receptionError) throw receptionError;

      // Record in milk_tank_offloads table
      const { data: offloadData, error: offloadError } = await supabase
        .from('milk_tank_offloads')
        .insert([{
          batch_id: formData.batch_id, // Ensure batch_id is included here
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
