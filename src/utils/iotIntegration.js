// Simulated IoT sensor data (replace with actual IoT API integration)
const MOCK_SENSOR_DATA = {
  temperature: () => 20 + Math.random() * 5,
  humidity: () => 45 + Math.random() * 10,
  pressure: () => 1013 + Math.random() * 10,
};

export const getIoTSensorData = async () => {
  console.log('Fetching IoT sensor data');
  try {
    // Simulate API call to IoT sensors
    return {
      timestamp: new Date().toISOString(),
      sensors: {
        temperature: MOCK_SENSOR_DATA.temperature(),
        humidity: MOCK_SENSOR_DATA.humidity(),
        pressure: MOCK_SENSOR_DATA.pressure(),
      },
      status: 'operational'
    };
  } catch (error) {
    console.error('Error fetching IoT data:', error);
    throw error;
  }
};

export const monitorEquipmentStatus = async () => {
  console.log('Monitoring equipment status');
  try {
    const sensorData = await getIoTSensorData();
    return {
      isOperational: sensorData.status === 'operational',
      alerts: [],
      lastChecked: sensorData.timestamp
    };
  } catch (error) {
    console.error('Error monitoring equipment:', error);
    throw error;
  }
};

// Add new function for cold room specific monitoring
export const getColdRoomSensorData = async (coldRoomId) => {
  console.log('Fetching Cold Room sensor data for:', coldRoomId);
  try {
    const baseData = await getIoTSensorData();
    return {
      ...baseData,
      coldRoomId,
      additionalMetrics: {
        doorStatus: 'closed',
        lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        alertLevel: 'normal'
      }
    };
  } catch (error) {
    console.error('Error fetching Cold Room data:', error);
    throw error;
  }
};

// Add new function for monitoring multiple cold rooms
export const monitorAllColdRooms = async () => {
  console.log('Monitoring all cold rooms');
  try {
    const coldRoomIds = ['CR001', 'CR002', 'CR003'];
    const promises = coldRoomIds.map(id => getColdRoomSensorData(id));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error monitoring cold rooms:', error);
    throw error;
  }
};
