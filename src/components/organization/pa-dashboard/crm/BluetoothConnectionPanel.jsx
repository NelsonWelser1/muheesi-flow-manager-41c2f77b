
import React, { useState } from 'react';
import { useBluetooth } from '@/contexts/BluetoothContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Bluetooth, BluetoothConnected, BluetoothOff, BluetoothSearching, Check, Clock, Info, Phone, RefreshCw, User, UserPlus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BluetoothConnectionPanel = () => {
  const { 
    supportsBluetooth, 
    isConnected, 
    isConnecting, 
    device, 
    deviceLogs, 
    contacts, 
    callLogs,
    connectDevice, 
    disconnectDevice 
  } = useBluetooth();
  
  const [activeTab, setActiveTab] = useState('status');
  
  const handleConnect = async () => {
    await connectDevice();
  };
  
  const handleDisconnect = () => {
    disconnectDevice();
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };
  
  // Format device name for display
  const getDeviceName = () => {
    if (!device) return 'No device';
    return device.name || 'Unknown device';
  };
  
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            {isConnected ? (
              <BluetoothConnected className="h-5 w-5 mr-2 text-blue-500" />
            ) : supportsBluetooth ? (
              <Bluetooth className="h-5 w-5 mr-2" />
            ) : (
              <BluetoothOff className="h-5 w-5 mr-2 text-gray-400" />
            )}
            Bluetooth Connection
          </CardTitle>
          
          <div>
            {isConnected ? (
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            ) : supportsBluetooth ? (
              <Badge className="bg-gray-100 text-gray-800">Disconnected</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">Not Supported</Badge>
            )}
          </div>
        </div>
        
        {device && (
          <p className="text-sm text-muted-foreground mt-1">
            {getDeviceName()}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="data">Synced Data</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            {!supportsBluetooth ? (
              <div className="rounded-md bg-yellow-50 p-4 text-yellow-800 border border-yellow-200">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Browser not supported</h3>
                    <p className="text-sm mt-1">
                      Your browser doesn't support the Web Bluetooth API. Try using Chrome, Edge, or Opera.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-md bg-blue-50 p-4 text-blue-800 border border-blue-200">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Bluetooth ready</h3>
                      <p className="text-sm mt-1">
                        Connect to a mobile device to sync contacts and call logs.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {isConnected ? (
                    <Button 
                      variant="outline" 
                      onClick={handleDisconnect}
                      className="w-full"
                    >
                      <BluetoothOff className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleConnect}
                      disabled={isConnecting}
                      className="w-full"
                    >
                      {isConnecting ? (
                        <>
                          <BluetoothSearching className="h-4 w-4 mr-2 animate-pulse" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Bluetooth className="h-4 w-4 mr-2" />
                          Connect Device
                        </>
                      )}
                    </Button>
                  )}
                  
                  {isConnected && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // This would trigger a real sync in a full implementation
                        alert("Sync operation would be triggered here in a real implementation");
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Device Data
                    </Button>
                  )}
                </div>
              </>
            )}
            
            {isConnected && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Connection Details</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Device Name:</span>
                    <span>{getDeviceName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connected:</span>
                    <span className="flex items-center">
                      <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                      Yes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Synced Contacts:</span>
                    <span>{contacts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Synced Call Logs:</span>
                    <span>{callLogs.length}</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="data">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Synced Contacts
                </h3>
                {contacts.length > 0 ? (
                  <ScrollArea className="h-[200px] border rounded-md p-2">
                    <div className="space-y-2">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{getInitials(`${contact.firstName} ${contact.lastName}`)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{contact.firstName} {contact.lastName}</p>
                            <p className="text-xs text-muted-foreground truncate">{contact.phone}</p>
                          </div>
                          <Badge className="ml-2 text-xs">{contact.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-6 border rounded-md">
                    <UserPlus className="h-8 w-8 mx-auto text-gray-300" />
                    <p className="text-sm text-gray-500 mt-2">No contacts synced yet</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Synced Call Logs
                </h3>
                {callLogs.length > 0 ? (
                  <ScrollArea className="h-[200px] border rounded-md p-2">
                    <div className="space-y-2">
                      {callLogs.map((call) => (
                        <div key={call.id} className="p-2 hover:bg-gray-50 rounded-md">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-sm">{call.contactName}</p>
                            <Badge className={`ml-2 text-xs ${
                              call.type === 'incoming' ? 'bg-green-100 text-green-800' : 
                              call.type === 'outgoing' ? 'bg-blue-100 text-blue-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {call.type}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{call.date} at {call.time}</span>
                            <span className="mx-1">•</span>
                            <span>{call.duration}</span>
                          </div>
                          {call.notes && (
                            <p className="text-xs mt-1 truncate">{call.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-6 border rounded-md">
                    <Phone className="h-8 w-8 mx-auto text-gray-300" />
                    <p className="text-sm text-gray-500 mt-2">No call logs synced yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <ScrollArea className="h-[400px] border rounded-md p-2">
              {deviceLogs.length > 0 ? (
                <div className="space-y-2">
                  {deviceLogs.map((log, index) => (
                    <div key={index} className="text-xs border-b border-gray-100 pb-2 last:border-0">
                      <span className="text-gray-500">[{formatTimestamp(log.timestamp)}]</span>{' '}
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Info className="h-8 w-8 mx-auto text-gray-300" />
                  <p className="text-sm text-gray-500 mt-2">No logs available</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BluetoothConnectionPanel;
