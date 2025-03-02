
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';
import { useMilkReception } from '@/hooks/useMilkReception';
import { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } from '@/components/ui/notifications';

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

  // Calculate available milk balance in a tank
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

  // Find alternative tank with sufficient volume
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

  // Get most recent tank data and populate form
  const populateFormWithTankData = (tankValue, batchId, availableMilk) => {
    const mostRecentEntry = milkReceptionData
      ?.filter(record => record.tank_number === tankValue && record.milk_volume > 0)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

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

      showInfoToast(toast, `Available milk volume: ${availableMilk.toFixed(2)}L`);
      return true;
    }
    
    return false;
  };

  // Handle tank selection
  const handleTankSelection = (tankValue, batchId) => {
    console.log('Selected tank:', tankValue, 'Batch ID:', batchId);
    
    const availableMilk = calculateTankBalance(tankValue);
    const hasData = populateFormWithTankData(tankValue, batchId, availableMilk);

    if (!hasData) {
      // No previous records for this tank
      setFormData(prev => ({
        ...prev,
        batch_id: batchId,
        storage_tank: tankValue,
        supplier_name: `Offload from ${tankValue}`,
        quality_check: 'Grade A'
      }));

      showWarningToast(toast, "No previous records found for this tank.");
    }
    
    setValidationError(null);
  };

  // Validate milk volume
  const validateMilkVolume = (requestedVolume, tankName) => {
    if (!tankName) return true;

    const availableMilk = calculateTankBalance(tankName);
    if (requestedVolume > availableMilk) {
      const alternativeTank = findAlternativeTank(tankName, requestedVolume);
      
      setValidationError({
        title: "Insufficient Milk Volume",
        description: `Available milk in ${tankName}: ${availableMilk.toFixed(2)}L`,
        suggestedTank: alternativeTank ? alternativeTank.name : null
      });

      if (alternativeTank) {
        toast({
          title: "Alternative Tank Available",
          description: `${alternativeTank.name} has ${alternativeTank.available.toFixed(2)}L available`,
        });
      }

      return false;
    }
    
    setValidationError(null);
    return true;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);

    if (name === 'milk_volume') {
      const requestedVolume = parseFloat(value);
      validateMilkVolume(requestedVolume, formData.storage_tank);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Record milk offload in database
  const recordMilkOffload = async () => {
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
    
    return { receptionData, offloadData };
  };

  // Reset form to initial state
  const resetForm = () => {
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
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate milk volume before submission
    const requestedVolume = parseFloat(formData.milk_volume);
    const isVolumeValid = validateMilkVolume(requestedVolume, formData.storage_tank);
    
    if (!isVolumeValid) {
      showErrorToast(toast, "Requested volume exceeds available milk");
      return;
    }

    setLoading(true);
    console.log('Starting form submission with data:', formData);
    setValidationError(null);

    try {
      console.log('Recording milk offload...');
      
      const { receptionData, offloadData } = await recordMilkOffload();

      console.log('Successfully recorded milk offload:', { receptionData, offloadData });

      showSuccessToast(toast, `Milk offload recorded successfully with Batch ID: ${formData.batch_id}`);

      // Reset form
      resetForm();
      await refetchMilkReception();

    } catch (error) {
      console.error('Form submission error:', error);
      showErrorToast(toast, error.message || "An error occurred while submitting the form");
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
