
import React from 'react';
import { useBluetooth } from '@/contexts/BluetoothContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showInfoToast } from "@/components/ui/notifications";
import { Download, RefreshCw, Smartphone, UserPlus } from 'lucide-react';

const BluetoothCRMIntegration = ({ onImportContacts, onImportCalls }) => {
  const { isConnected, contacts, callLogs } = useBluetooth();
  const { toast } = useToast();

  const handleImportContacts = () => {
    if (contacts.length === 0) {
      showInfoToast(toast, "No contacts available to import");
      return;
    }
    
    // Pass the contacts to the parent component
    onImportContacts(contacts);
    showSuccessToast(toast, `${contacts.length} contacts imported to CRM`);
  };

  const handleImportCalls = () => {
    if (callLogs.length === 0) {
      showInfoToast(toast, "No call logs available to import");
      return;
    }
    
    // Pass the call logs to the parent component
    onImportCalls(callLogs);
    showSuccessToast(toast, `${callLogs.length} call logs imported to CRM`);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Smartphone className="h-12 w-12 mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-medium">Connect a Device</h3>
          <p className="mt-2 text-sm text-gray-500">
            Connect your mobile phone via Bluetooth to import contacts and call logs
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Device Integration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Import data from your connected Bluetooth device
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-sm flex items-center">
                <UserPlus className="h-4 w-4 mr-1" />
                Device Contacts
              </h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {contacts.length} Available
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Import contacts from your connected device to your CRM contact list
            </p>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="w-full"
                disabled={contacts.length === 0}
                onClick={handleImportContacts}
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Import Contacts
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-shrink-0"
                onClick={() => showInfoToast(toast, "Refreshing contacts...")}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-sm flex items-center">
                <Smartphone className="h-4 w-4 mr-1" />
                Call History
              </h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {callLogs.length} Available
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Import call logs from your connected device to your CRM call records
            </p>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="w-full"
                disabled={callLogs.length === 0}
                onClick={handleImportCalls}
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Import Call Logs
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-shrink-0"
                onClick={() => showInfoToast(toast, "Refreshing call logs...")}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-md border border-blue-200">
          <p>
            <strong>Note:</strong> Your device data is only stored locally and is never sent to any servers.
            The data will be lost when you refresh the page unless you import it to your CRM.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BluetoothCRMIntegration;
