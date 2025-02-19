
import { supabase } from '@/integrations/supabase';

export const recordMilkOffload = async (formData) => {
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
