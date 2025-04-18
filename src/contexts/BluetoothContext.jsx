
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
  const toast = useToast();
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

  // Connect to a Bluetooth device
  const connectDevice = useCallback(async () => {
    if (!navigator.bluetooth) {
      showErrorToast(toast, "Bluetooth API is not supported in this browser");
      return;
    }

    try {
      setIsConnecting(true);
      showInfoToast(toast, "Searching for nearby devices...");

      // Request device with specific services for phone data
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '00001105-0000-1000-8000-00805f9b34fb', // OPP (Object Push Profile)
          '0000110a-0000-1000-8000-00805f9b34fb', // PBAP (Phone Book Access Profile)
          '0000111e-0000-1000-8000-00805f9b34fb', // HFP (Hands Free Profile)
          '00001103-0000-1000-8000-00805f9b34fb'  // Dial-up Networking
        ]
      });

      setDevice(device);
      
      // Add event listener for disconnection
      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        showInfoToast(toast, `Device ${device.name} disconnected`);
        addDeviceLog('Disconnected from device');
      });

      // Connect to the GATT server
      const server = await device.gatt.connect();
      setIsConnected(true);
      showSuccessToast(toast, `Connected to ${device.name}`);
      addDeviceLog(`Connected to ${device.name}`);

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
    if (device && device.gatt.connected) {
      device.gatt.disconnect();
      setIsConnected(false);
      showInfoToast(toast, `Disconnected from ${device.name}`);
      addDeviceLog(`Manually disconnected from ${device.name}`);
    }
  }, [device, toast]);

  // Sync device data
  const syncDeviceData = useCallback(async (server) => {
    try {
      addDeviceLog('Starting data synchronization...');
      
      // This is a placeholder for actual data sync
      // In a real implementation, we would:
      // 1. Get the PBAP service for contacts
      // 2. Get the call history service
      // 3. Read the characteristic values
      
      // Instead, we'll simulate a successful sync with mock data
      setTimeout(() => {
        const mockContacts = [
          { id: 'bt1', firstName: 'John', lastName: 'Mobile', type: 'Client', phone: '+256 789-012-3456', email: 'john.mobile@example.com', company: 'Mobile Tech Ltd' },
          { id: 'bt2', firstName: 'Sarah', lastName: 'Device', type: 'Lead', phone: '+256 678-901-2345', email: 'sarah.device@example.com', company: 'Connected Systems' }
        ];
        
        const mockCalls = [
          { id: 'btcall1', contactName: 'John Mobile', company: 'Mobile Tech Ltd', type: 'incoming', duration: '3:45', date: '2025-04-18', time: '10:30 AM', notes: 'Discussed Bluetooth integration' },
          { id: 'btcall2', contactName: 'Sarah Device', company: 'Connected Systems', type: 'outgoing', duration: '2:12', date: '2025-04-17', time: '11:15 AM', notes: 'Followed up on proposal' }
        ];
        
        setContacts(prevContacts => [...mockContacts]);
        setCallLogs(prevLogs => [...mockCalls]);
        
        addDeviceLog('Successfully synchronized contacts and call logs');
        showSuccessToast(toast, "Device data synchronized successfully");
      }, 2000);
      
    } catch (error) {
      addDeviceLog(`Sync error: ${error.message}`);
      showErrorToast(toast, `Failed to sync device data: ${error.message}`);
    }
  }, [toast]);

  // Add a log entry
  const addDeviceLog = (message) => {
    const timestamp = new Date().toISOString();
    setDeviceLogs(prev => [...prev, { timestamp, message }]);
  };

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
