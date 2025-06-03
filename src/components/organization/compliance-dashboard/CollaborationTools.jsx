
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageSquare, 
  BookOpen,
  AlertTriangle,
  Plus,
  Send,
  CheckCircle,
  Clock,
  Calendar,
  User
} from 'lucide-react';

const CollaborationTools = () => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState('general');

  // Sample data
  const trainingRecords = [
    { id: 1, course: 'HACCP Fundamentals', employee: 'Jane Doe', status: 'completed', completionDate: '2024-05-15', score: 95, expiryDate: '2025-05-15' },
    { id: 2, course: 'Cold Chain Management', employee: 'John Smith', status: 'in-progress', completionDate: null, score: null, expiryDate: '2025-06-20' },
    { id: 3, course: 'Quality Control Procedures', employee: 'Mike Wilson', status: 'completed', completionDate: '2024-05-10', score: 88, expiryDate: '2025-05-10' },
    { id: 4, course: 'ISO 22000 Overview', employee: 'Sarah Johnson', status: 'pending', completionDate: null, score: null, expiryDate: '2025-07-01' }
  ];

  const incidentLogs = [
    { id: 1, title: 'Temperature deviation in Cold Room B', severity: 'high', reportedBy: 'Jane Doe', date: '2024-06-01', status: 'resolved', description: 'Temperature spike detected during power outage' },
    { id: 2, title: 'Contamination risk in processing area', severity: 'critical', reportedBy: 'John Smith', date: '2024-05-28', status: 'investigating', description: 'Potential cross-contamination identified' },
    { id: 3, title: 'Equipment malfunction - Pasteurizer #2', severity: 'medium', reportedBy: 'Mike Wilson', date: '2024-05-25', status: 'resolved', description: 'Temperature control system failure' },
    { id: 4, title: 'Documentation missing for Batch C-001', severity: 'low', reportedBy: 'Sarah Johnson', date: '2024-05-20', status: 'closed', description: 'Missing quality control records' }
  ];

  const chatChannels = [
    { id: 'general', name: 'General Discussion', participants: 12, lastMessage: '2 minutes ago' },
    { id: 'quality-team', name: 'Quality Control Team', participants: 6, lastMessage: '15 minutes ago' },
    { id: 'compliance', name: 'Compliance Updates', participants: 8, lastMessage: '1 hour ago' },
    { id: 'incidents', name: 'Incident Reports', participants: 4, lastMessage: '3 hours ago' }
  ];

  const chatMessages = {
    'general': [
      { id: 1, user: 'Jane Doe', message: 'Monthly audit scheduled for next week. Please ensure all documentation is ready.', time: '10:30 AM', type: 'message' },
      { id: 2, user: 'John Smith', message: 'New HACCP guidelines have been published. Link in the compliance channel.', time: '10:25 AM', type: 'message' },
      { id: 3, user: 'Mike Wilson', message: 'Temperature logs for yesterday uploaded to the system.', time: '10:20 AM', type: 'message' }
    ],
    'quality-team': [
      { id: 1, user: 'Jane Doe', message: 'Batch C-2024-005 passed all quality checks.', time: '9:45 AM', type: 'message' },
      { id: 2, user: 'Sarah Johnson', message: 'pH levels are within acceptable range for all morning samples.', time: '9:30 AM', type: 'message' }
    ]
  };

  const teamMembers = [
    { id: 1, name: 'Jane Doe', role: 'Quality Control Manager', status: 'online', avatar: 'JD' },
    { id: 2, name: 'John Smith', role: 'Compliance Officer', status: 'online', avatar: 'JS' },
    { id: 3, name: 'Mike Wilson', role: 'QC Inspector', status: 'away', avatar: 'MW' },
    { id: 4, name: 'Sarah Johnson', role: 'Documentation Specialist', status: 'offline', avatar: 'SJ' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'investigating': return 'bg-blue-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIndicator = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage, 'to channel:', selectedChat);
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="training" className="space-y-4">
        <TabsList>
          <TabsTrigger value="training">Training Tracker</TabsTrigger>
          <TabsTrigger value="incidents">Incident Logging</TabsTrigger>
          <TabsTrigger value="chat">Internal Chat</TabsTrigger>
          <TabsTrigger value="team">Team Directory</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Training Tracker</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Training Record
            </Button>
          </div>

          <div className="grid gap-4">
            {trainingRecords.map((record) => (
              <Card key={record.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{record.course}</h4>
                      <p className="text-sm text-muted-foreground">Employee: {record.employee}</p>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {record.status === 'in-progress' && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex gap-4">
                        {record.completionDate && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Completed: {record.completionDate}
                          </span>
                        )}
                        {record.score && (
                          <span>Score: {record.score}%</span>
                        )}
                      </div>
                      <span>Expires: {record.expiryDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Incident Logging</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </div>

          {/* Quick incident report form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Incident Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input placeholder="Incident title" />
                <Textarea placeholder="Describe the incident..." />
                <div className="flex gap-4">
                  <select className="px-3 py-2 border rounded-md">
                    <option>Select severity</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                  <Button>Submit Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incident list */}
          <div className="grid gap-4">
            {incidentLogs.map((incident) => (
              <Card key={incident.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{incident.title}</h4>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Reported by {incident.reportedBy} on {incident.date}</span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <h3 className="text-lg font-semibold">Internal Communication</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-96">
            {/* Chat channels */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm">Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {chatChannels.map((channel) => (
                    <div 
                      key={channel.id}
                      className={`p-2 rounded cursor-pointer ${selectedChat === channel.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                      onClick={() => setSelectedChat(channel.id)}
                    >
                      <p className="font-medium text-sm"># {channel.name}</p>
                      <p className="text-xs text-muted-foreground">{channel.participants} members</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat area */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  #{chatChannels.find(c => c.id === selectedChat)?.name || 'general'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4 h-48 overflow-y-auto">
                  {(chatMessages[selectedChat] || []).map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        {message.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{message.user}</span>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Team Directory</h3>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusIndicator(member.status)}`}></div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-xs text-muted-foreground capitalize">{member.status}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollaborationTools;
