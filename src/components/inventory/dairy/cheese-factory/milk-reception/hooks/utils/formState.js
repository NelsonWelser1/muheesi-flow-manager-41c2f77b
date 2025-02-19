
export const initialFormState = {
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

export const getMostRecentEntry = (milkReceptionData, tankValue) => {
  return milkReceptionData
    ?.filter(record => record.tank_number === tankValue && record.milk_volume > 0)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
};
