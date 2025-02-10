
// Simulated IoT sensor data (replace with actual IoT API integration)
const MOCK_SENSOR_DATA = {
  temperature: () => 4 + Math.random() * 2, // Simulate temperature between 4-6°C
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
