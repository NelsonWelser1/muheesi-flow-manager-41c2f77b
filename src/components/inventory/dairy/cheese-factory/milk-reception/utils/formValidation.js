
export const validateMilkOffloadForm = (formData, milkReceptionData) => {
  const errors = [];
  const requiredFields = [
    'batch_id', 'storage_tank', 'milk_volume', 'temperature', 'destination'
  ];

  requiredFields.forEach(field => {
    if (!formData[field]) {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });

  if (formData.milk_volume) {
    const { tankReceived, tankOffloaded } = calculateTankVolumes(milkReceptionData, formData.storage_tank);
    const availableMilk = tankReceived - tankOffloaded;
    const offloadVolume = Math.abs(parseFloat(formData.milk_volume));

    if (offloadVolume > availableMilk) {
      errors.push(`Insufficient volume. Only ${availableMilk.toFixed(2)}L available in ${formData.storage_tank}`);
    }
  }

  return errors;
};
