
export const calculateTankVolumes = (milkReceptionData, tankValue) => {
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

  return {
    availableMilk: tankReceived - tankOffloaded,
    tankReceived,
    tankOffloaded
  };
};

export const getMostRecentTankEntry = (milkReceptionData, tankValue) => {
  return milkReceptionData
    ?.filter(record => record.tank_number === tankValue && record.milk_volume > 0)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
};
