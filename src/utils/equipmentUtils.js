
export const generateEquipmentId = (equipment, existingEquipment = []) => {
  const prefix = equipment.type?.substring(0, 3).toUpperCase() || 'EQP';
  const namePrefix = equipment.equipment_name.substring(0, 2).toUpperCase();
  const existingIds = existingEquipment
    .filter(e => e.type === equipment.type)
    .length;
  const sequenceNumber = (existingIds + 1).toString().padStart(3, '0');
  return `${prefix}-${namePrefix}${sequenceNumber}`;
};

export const calculateHealthScore = (equipment) => {
  const now = new Date();
  const lastMaintenance = new Date(equipment.last_maintenance);
  const nextMaintenance = new Date(equipment.next_maintenance);
  const totalDuration = nextMaintenance - lastMaintenance;
  const elapsed = now - lastMaintenance;
  const remainingPercentage = Math.max(0, 100 - (elapsed / totalDuration * 100));
  return Math.round(remainingPercentage);
};

export const getMaintenanceStatus = (equipment) => {
  const now = new Date();
  const nextMaintenance = new Date(equipment.next_maintenance);
  const daysDiff = Math.ceil((nextMaintenance - now) / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) return 'critical';
  if (daysDiff <= 7) return 'maintenance';
  return 'operational';
};
