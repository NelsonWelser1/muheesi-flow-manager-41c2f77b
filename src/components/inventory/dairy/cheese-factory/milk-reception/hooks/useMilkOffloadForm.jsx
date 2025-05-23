import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';
import { useMilkReception } from '@/hooks/useMilkReception';
import { Check, AlertCircle } from "lucide-react";

export const useMilkOffloadForm = () => {
  const { toast } = useToast();
  const { data: milkReceptionData, refetch: refetchMilkReception } = useMilkReception();
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const cooldownTimerRef = useRef(null);
  
  // Initial form state
  const initialFormState = {
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
  };

  const [formData, setFormData] = useState(initialFormState);

  // Clear form function - resets all fields to initial state
  const clearForm = () => {
    setFormData(initialFormState);
    setValidationError(null);
    console.log('Form cleared - all fields reset to initial state');
  };

  const startCooldown = () => {
    setCooldownActive(true);
    setCooldownTimeLeft(30);
    
    cooldownTimerRef.current = setInterval(() => {
      setCooldownTimeLeft((prev) => {
        if (prev <= 1) {
          setCooldownActive(false);
          clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

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
        className: "bg-blue-50 border-2 border-blue-400 text-blue-800 font-medium",
        duration: 6000,
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
        variant: "warning",
        className: "bg-amber-50 border-2 border-amber-400 text-amber-800 font-medium",
        duration: 6000,
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
            className: "bg-blue-50 border-2 border-blue-400 text-blue-800 font-medium",
            duration: 6000,
          });
        }

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
    
    // Check if cooldown is active
    if (cooldownActive) {
      toast({
        title: "Submission Blocked",
        description: `Please wait ${cooldownTimeLeft} seconds before submitting again`,
        variant: "destructive",
        className: "bg-red-50 border-2 border-red-500 text-red-800 font-medium",
        duration: 3000,
      });
      return;
    }
    
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
        className: "bg-red-50 border-2 border-red-500 text-red-800 font-medium",
        duration: 6000,
        action: (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
        ),
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
        title: "Success!",
        description: `Milk offload recorded successfully with Batch ID: ${formData.batch_id}`,
        className: "bg-green-50 border-2 border-green-500 text-green-800 font-medium",
        duration: 6000,
        action: (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        ),
      });

      // Clear form immediately after successful submission
      clearForm();
      startCooldown();

      await refetchMilkReception();

    } catch (error) {
      console.error('Form submission error:', error);
      // Don't clear form on error - keep user data for retry
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred while submitting the form",
        variant: "destructive",
        className: "bg-red-50 border-2 border-red-500 text-red-800 font-medium",
        duration: 6000,
        action: (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    validationError,
    cooldownActive,
    cooldownTimeLeft,
    handleTankSelection,
    handleInputChange,
    handleSubmit,
    clearForm,
    milkReceptionData
  };
};
