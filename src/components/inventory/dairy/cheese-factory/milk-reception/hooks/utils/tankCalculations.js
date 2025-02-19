
export const calculateTankBalance = (milkReceptionData, tankName) => {
  if (!milkReceptionData) return 0;
  
  const tankReceived = milkReceptionData
    ?.filter(record => record.tank_number === tankName && record.milk_volume > 0)
    .reduce((total, record) => total + record.milk_volume, 0) || 0;

  const tankOffloaded = milkReceptionData
    ?.filter(record => record.tank_number === tankName && record.milk_volume < 0)
    .reduce((total, record) => total + Math.abs(record.milk_volume), 0) || 0;

  return tankReceived - tankOffloaded;
};

export const findAlternativeTank = (milkReceptionData, currentTank, requiredVolume) => {
  const tanks = ['Tank A', 'Tank B', 'Direct-Processing'];
  const alternatives = tanks
    .filter(tank => tank !== currentTank)
    .map(tank => ({
      name: tank,
      available: calculateTankBalance(milkReceptionData, tank)
    }))
    .filter(tank => tank.available >= requiredVolume)
    .sort((a, b) => b.available - a.available);

  return alternatives[0];
};
