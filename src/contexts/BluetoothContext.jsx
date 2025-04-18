
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { showInfoToast, showErrorToast, showSuccessToast } from "@/components/ui/notifications";

// Create context
const BluetoothContext = createContext(null);

// Custom hook to use the Bluetooth context
export const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};

export const BluetoothProvider = ({ children }) => {
  const { toast } = useToast();
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [supportsBluetooth, setSupportsBluetooth] = useState(false);
  const [deviceLogs, setDeviceLogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [callLogs, setCallLogs] = useState([]);

  // Check if browser supports Bluetooth API
  useEffect(() => {
    const checkBluetoothSupport = () => {
      if (navigator.bluetooth) {
        setSupportsBluetooth(true);
      } else {
        setSupportsBluetooth(false);
      }
    };

    checkBluetoothSupport();
  }, []);

  // Add a device log entry
  const addDeviceLog = (message) => {
    const timestamp = new Date().toISOString();
    setDeviceLogs(prev => [...prev, { timestamp, message }]);
  };

  // Connect to a Bluetooth device (with focus on toothbrush devices)
  const connectDevice = useCallback(async () => {
    if (!navigator.bluetooth) {
      showErrorToast(toast, "Bluetooth API is not supported in this browser");
      return;
    }

    try {
      setIsConnecting(true);
      showInfoToast(toast, "Searching for toothbrush devices...");
      addDeviceLog("Starting scan for toothbrush devices...");

      // Request device with specific services common in toothbrush devices
      // Note: Real toothbrushes often use standard services like Battery Service or specific manufacturer services
      const device = await navigator.bluetooth.requestDevice({
        // Look for devices that advertise as a toothbrush or dental device
        filters: [
          { namePrefix: "Tooth" },  // Many toothbrushes start with "Tooth"
          { namePrefix: "Oral" },   // For Oral-B devices
          { namePrefix: "Philips" }, // For Philips Sonicare
          { namePrefix: "Braun" },   // For Braun devices
          // Include common toothbrush service UUIDs if known
        ],
        // Fall back to accepting all devices if no toothbrush is found
        // This increases the chance of finding the device
        acceptAllDevices: true, 
        optionalServices: [
          'battery_service',                    // Standard battery service
          '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service UUID
          '0000180a-0000-1000-8000-00805f9b34fb', // Device Information Service
          // Add manufacturer-specific service UUIDs for common toothbrush brands
          // These would be added in a real implementation based on the specific brands
          '00001105-0000-1000-8000-00805f9b34fb', // OPP (for contact sync)
          '0000110a-0000-1000-8000-00805f9b34fb', // PBAP (for phone book access)
          '0000111e-0000-1000-8000-00805f9b34fb', // HFP (for call logs)
        ]
      });

      addDeviceLog(`Found device: ${device.name || "Unknown device"}`);
      setDevice(device);
      
      // Add event listener for disconnection
      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        showInfoToast(toast, `Device ${device.name || "Unknown device"} disconnected`);
        addDeviceLog('Disconnected from device');
      });

      // Connect to the GATT server
      addDeviceLog("Attempting to connect to GATT server...");
      const server = await device.gatt.connect();
      setIsConnected(true);
      showSuccessToast(toast, `Connected to ${device.name || "device"}`);
      addDeviceLog(`Connected to ${device.name || "device"}`);

      // After successful connection, attempt to sync data
      await syncDeviceData(server);

      return device;
    } catch (error) {
      showErrorToast(toast, error.message || "Failed to connect to Bluetooth device");
      addDeviceLog(`Connection error: ${error.message}`);
      console.error('Bluetooth connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  // Disconnect from the current Bluetooth device
  const disconnectDevice = useCallback(async () => {
    if (device && device.gatt && device.gatt.connected) {
      addDeviceLog(`Manually disconnecting from ${device.name || "device"}...`);
      device.gatt.disconnect();
      setIsConnected(false);
      showInfoToast(toast, `Disconnected from ${device.name || "device"}`);
      addDeviceLog(`Successfully disconnected from ${device.name || "device"}`);
    }
  }, [device, toast]);

  // Sync device data (simulated for toothbrush device)
  const syncDeviceData = useCallback(async (server) => {
    try {
      addDeviceLog('Starting data synchronization...');
      
      // Attempt to read device information (will work with many real devices)
      try {
        const deviceInfoService = await server.getPrimaryService('device_information');
        if (deviceInfoService) {
          addDeviceLog('Found device information service');
          
          try {
            const modelChar = await deviceInfoService.getCharacteristic('model_number_string');
            const modelValue = await modelChar.readValue();
            const modelName = new TextDecoder().decode(modelValue);
            addDeviceLog(`Device model: ${modelName}`);
          } catch (e) {
            addDeviceLog('Could not read model information');
          }
        }
      } catch (e) {
        addDeviceLog('Device information service not available');
      }
      
      // This is a placeholder for actual data sync with a toothbrush
      // In a real implementation, we would:
      // 1. Look for specific toothbrush services
      // 2. Read brushing history, battery level, etc.
      // 3. Process this information
      
      // For this demo, we'll simulate a successful sync with mock data
      setTimeout(() => {
        // Simulate contacts from "toothbrush app"
        const mockContacts = [
          { id: 'bt1', firstName: 'Dental', lastName: 'Care', type: 'Service', phone: '+256 789-012-3456', email: 'dental.care@example.com', company: 'Smile Dental' },
          { id: 'bt2', firstName: 'Brush', lastName: 'Timer', type: 'App', phone: '+256 678-901-2345', email: 'brush.timer@example.com', company: 'Smart Dental Tech' }
        ];
        
        // Simulate calls from dental reminders
        const mockCalls = [
          { id: 'btcall1', contactName: 'Dental Care', company: 'Smile Dental', type: 'incoming', duration: '0:45', date: '2025-04-18', time: '09:00 AM', notes: 'Reminder for dental appointment' },
          { id: 'btcall2', contactName: 'Brush Timer', company: 'Smart Dental Tech', type: 'outgoing', duration: '0:10', date: '2025-04-17', time: '08:00 AM', notes: 'Brushing technique reminder' }
        ];
        
        setContacts(prevContacts => [...mockContacts]);
        setCallLogs(prevLogs => [...mockCalls]);
        
        addDeviceLog('Successfully synchronized toothbrush data');
        showSuccessToast(toast, "Toothbrush data synchronized successfully");
      }, 2000);
      
    } catch (error) {
      addDeviceLog(`Sync error: ${error.message}`);
      showErrorToast(toast, `Failed to sync device data: ${error.message}`);
    }
  }, [toast]);

  // Value to be provided by the context
  const contextValue = {
    device,
    isConnected,
    isConnecting,
    supportsBluetooth,
    deviceLogs,
    contacts: contacts,
    callLogs: callLogs,
    connectDevice,
    disconnectDevice,
    syncDeviceData
  };

  return (
    <BluetoothContext.Provider value={contextValue}>
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothContext;
