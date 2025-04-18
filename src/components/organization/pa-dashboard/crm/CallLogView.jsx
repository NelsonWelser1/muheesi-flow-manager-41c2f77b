
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Phone, PlusCircle, User, Calendar, Clock, MoreHorizontal, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const CallLogView = () => {
  const [callLogs, setCallLogs] = useState([
    {
      id: 1,
      contactName: 'John Doe',
      company: 'KAJON Coffee Limited',
      type: 'outgoing',
      duration: '5:23',
      date: '2025-04-18',
      time: '09:30 AM',
      notes: 'Discussed upcoming coffee shipment',
      avatarUrl: null
    },
    {
      id: 2,
      contactName: 'Jane Smith',
      company: 'Grand Berna Dairies',
      type: 'incoming',
      duration: '3:12',
      date: '2025-04-17',
      time: '02:15 PM',
      notes: 'Inquired about invoice payment',
      avatarUrl: null
    },
    {
      id: 3,
      contactName: 'David Brown',
      company: 'FreshEco Farms',
      type: 'missed',
      duration: '0:00',
      date: '2025-04-15',
      time: '11:45 AM',
      notes: '',
      avatarUrl: null
    }
  ]);

  const [selectedCall, setSelectedCall] = useState(null);
  const [newCallForm, setNewCallForm] = useState({
    contactName: '',
    company: '',
    type: 'outgoing',
    duration: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: ''
  });
  const [isAddingCall, setIsAddingCall] = useState(false);

  const handleSelectCall = (call) => {
    setSelectedCall(call);
  };

  const handleAddCall = () => {
    setIsAddingCall(true);
  };

  const handleCancelAdd = () => {
    setIsAddingCall(false);
    setNewCallForm({
      contactName: '',
      company: '',
      type: 'outgoing',
      duration: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      notes: ''
    });
  };

  const handleSaveCall = () => {
    const newCall = {
      id: callLogs.length > 0 ? Math.max(...callLogs.map(call => call.id)) + 1 : 1,
      ...newCallForm
    };
    
    setCallLogs([newCall, ...callLogs]);
    setIsAddingCall(false);
    setNewCallForm({
      contactName: '',
      company: '',
      type: 'outgoing',
      duration: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCallForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewCallForm(prev => ({ ...prev, [name]: value }));
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCallTypeIcon = (type) => {
    switch (type) {
      case 'incoming':
        return <PhoneIncoming className="h-4 w-4 text-green-500" />;
      case 'outgoing':
        return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
      case 'missed':
        return <PhoneMissed className="h-4 w-4 text-red-500" />;
      default:
        return <PhoneCall className="h-4 w-4" />;
    }
  };

  const getCallTypeBadge = (type) => {
    switch (type) {
      case 'incoming':
        return <Badge className="bg-green-100 text-green-800">Incoming</Badge>;
      case 'outgoing':
        return <Badge className="bg-blue-100 text-blue-800">Outgoing</Badge>;
      case 'missed':
        return <Badge className="bg-red-100 text-red-800">Missed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-280px)]">
      {/* Call Logs List */}
      <Card className="md:col-span-1">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Call Log</CardTitle>
            <Button size="sm" onClick={handleAddCall}>
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search calls..."
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-380px)]">
            {callLogs.map((call) => (
              <div
                key={call.id}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedCall?.id === call.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleSelectCall(call)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={call.avatarUrl} alt={call.contactName} />
                    <AvatarFallback>{getInitials(call.contactName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{call.contactName}</h3>
                      {getCallTypeIcon(call.type)}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{call.company}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {call.date}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {call.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Call Details or Add Form */}
      <Card className="md:col-span-2">
        {isAddingCall ? (
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Log a New Call</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contactName" className="text-sm font-medium">Contact Name</label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={newCallForm.contactName}
                    onChange={handleInputChange}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">Company</label>
                  <Input
                    id="company"
                    name="company"
                    value={newCallForm.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Call Type</label>
                  <Select
                    value={newCallForm.type}
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select call type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incoming">Incoming</SelectItem>
                      <SelectItem value="outgoing">Outgoing</SelectItem>
                      <SelectItem value="missed">Missed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">Date</label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={newCallForm.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm font-medium">Time</label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={newCallForm.time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium">Duration (mm:ss)</label>
                  <Input
                    id="duration"
                    name="duration"
                    value={newCallForm.duration}
                    onChange={handleInputChange}
                    placeholder="Enter call duration"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={newCallForm.notes}
                  onChange={handleInputChange}
                  placeholder="Enter call notes"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancelAdd}>Cancel</Button>
                <Button onClick={handleSaveCall}>Save Call</Button>
              </div>
            </div>
          </CardContent>
        ) : selectedCall ? (
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={selectedCall.avatarUrl} alt={selectedCall.contactName} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedCall.contactName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{selectedCall.contactName}</h2>
                  <p className="text-muted-foreground">{selectedCall.company}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Call</DropdownMenuItem>
                    <DropdownMenuItem>Delete Call</DropdownMenuItem>
                    <DropdownMenuItem>View Contact</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Call Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Call Type</p>
                      <div className="mt-1">{getCallTypeBadge(selectedCall.type)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p>{selectedCall.date} at {selectedCall.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p>{selectedCall.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Added By</p>
                      <p>Current User</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Notes</h3>
                {selectedCall.notes ? (
                  <div className="border rounded-md p-4 bg-gray-50">
                    <p>{selectedCall.notes}</p>
                  </div>
                ) : (
                  <div className="border rounded-md p-4 bg-gray-50 text-gray-500 italic">
                    No notes added for this call.
                  </div>
                )}
                
                <div className="mt-6">
                  <Button className="w-full" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Again
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <Phone className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">Call Details</h3>
              <p className="mt-2 text-sm text-gray-500">Select a call to view details or add a new call</p>
              <Button className="mt-4" onClick={handleAddCall}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Log a New Call
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CallLogView;
