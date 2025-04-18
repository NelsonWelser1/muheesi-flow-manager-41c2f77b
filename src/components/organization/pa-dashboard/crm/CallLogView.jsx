
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Plus, Clock } from 'lucide-react';
import { useBluetooth } from '@/contexts/BluetoothContext';
import ExportButtons from '@/components/ui/data-export/ExportButtons';

const CallLogView = ({ initialCallLogs = [] }) => {
  const { callLogs: bluetoothCallLogs } = useBluetooth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Combine initially provided call logs with bluetooth call logs
  const allCallLogs = [...initialCallLogs, ...bluetoothCallLogs];
  
  // Filter call logs based on search query
  const filteredCallLogs = allCallLogs.filter(call => 
    call.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get call icon based on type
  const getCallIcon = (type) => {
    switch(type) {
      case 'incoming':
        return <PhoneIncoming className="h-4 w-4 text-green-500" />;
      case 'outgoing':
        return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
      case 'missed':
        return <PhoneMissed className="h-4 w-4 text-red-500" />;
      default:
        return <Phone className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Call History</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Log Call
          </Button>
          <ExportButtons 
            data={filteredCallLogs} 
            filename="call_logs_export" 
            type="Call Logs"
          />
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search calls by contact, company or notes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {filteredCallLogs.length > 0 ? (
        <div className="space-y-2">
          {filteredCallLogs.map((call, index) => (
            <Card key={index} className="hover:bg-gray-50 cursor-pointer transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {call.avatarUrl ? (
                      <img 
                        src={call.avatarUrl} 
                        alt={call.contactName} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {call.contactName?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium truncate">{call.contactName || "Unknown"}</p>
                      <div className="flex items-center">
                        {getCallIcon(call.type)}
                        <span className="ml-1 text-xs text-gray-500">{call.time}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate">
                      {call.company || ""}
                    </p>
                    
                    <div className="flex items-center mt-1 text-xs">
                      <Badge variant={call.type === 'missed' ? 'destructive' : 'outline'} className="mr-2">
                        {call.type}
                      </Badge>
                      
                      <span className="flex items-center text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {call.duration}
                      </span>
                      
                      {call.notes && (
                        <span className="ml-2 text-gray-500 truncate">
                          {call.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Phone className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <h3 className="text-lg font-medium">No call logs found</h3>
          <p className="text-sm text-gray-500 mt-1">
            {searchQuery 
              ? `No calls match your search "${searchQuery}"`
              : "Your call history will appear here"}
          </p>
          <Button className="mt-4" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Log a New Call
          </Button>
        </div>
      )}
    </div>
  );
};

export default CallLogView;
