
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { communicationTemplates, fillTemplate } from '@/utils/communicationTemplates';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';

const MessageForm = ({ onSendMessage, saving }) => {
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
    recipients: 'all',
    type: 'sms',
    status: 'sent',
    scheduledDate: null
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateVariables, setTemplateVariables] = useState({});
  const [schedulingMode, setSchedulingMode] = useState('send-now');
  const [scheduleDate, setScheduleDate] = useState(new Date());
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (selectedTemplate) {
      const template = communicationTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        // Initialize template variables
        const variables = {};
        template.variables.forEach(v => {
          variables[v] = '';
        });
        setTemplateVariables(variables);
        
        // Set template type
        setMessageData(prev => ({
          ...prev,
          type: template.type
        }));
      }
    }
  }, [selectedTemplate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMessageData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setMessageData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleVariableChange = (variable, value) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };
  
  const handleApplyTemplate = () => {
    if (!selectedTemplate) return;
    
    const filled = fillTemplate(selectedTemplate, templateVariables);
    if (filled) {
      setMessageData(prev => ({
        ...prev,
        subject: filled.subject,
        message: filled.message,
        type: filled.type
      }));
      
      toast({
        title: "Template applied",
        description: "The template has been applied with your variables.",
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!messageData.subject.trim()) {
      toast({
        title: "Missing subject",
        description: "Please enter a subject for your message.",
        variant: "destructive"
      });
      return;
    }
    
    if (!messageData.message.trim()) {
      toast({
        title: "Missing message",
        description: "Please enter a message content.",
        variant: "destructive"
      });
      return;
    }
    
    const messageToSend = { ...messageData };
    
    // Handle scheduling
    if (schedulingMode === 'schedule') {
      messageToSend.status = 'scheduled';
      messageToSend.scheduledDate = scheduleDate.toISOString();
    } else {
      messageToSend.status = 'sent';
      messageToSend.scheduledDate = null;
    }
    
    onSendMessage(messageToSend);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="recipients">Recipients</Label>
          <Select 
            name="recipients" 
            value={messageData.recipients}
            onValueChange={(value) => handleSelectChange('recipients', value)}
          >
            <SelectTrigger id="recipients">
              <SelectValue placeholder="Select recipients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="active">Active Members</SelectItem>
              <SelectItem value="inactive">Inactive Members</SelectItem>
              <SelectItem value="arabica">Arabica Farmers</SelectItem>
              <SelectItem value="robusta">Robusta Farmers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message-type">Message Type</Label>
          <Select 
            name="type" 
            value={messageData.type}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger id="message-type">
              <SelectValue placeholder="Select message type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input 
          id="subject" 
          name="subject"
          placeholder="Enter message subject" 
          value={messageData.subject}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message Content</Label>
        <textarea 
          id="message" 
          name="message"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
          placeholder="Enter your message content here..."
          value={messageData.message}
          onChange={handleInputChange}
        />
      </div>
      
      <div>
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="send" onClick={() => setSchedulingMode('send-now')}>Send Now</TabsTrigger>
            <TabsTrigger value="schedule" onClick={() => setSchedulingMode('schedule')}>Schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="send" className="p-4 border rounded-md mt-2">
            <p className="text-sm text-muted-foreground">This message will be sent immediately after submission.</p>
          </TabsContent>
          <TabsContent value="schedule" className="p-4 border rounded-md mt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="schedule-date">Schedule Date and Time</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`justify-start text-left font-normal ${!scheduleDate && "text-muted-foreground"}`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={scheduleDate}
                      onSelect={(date) => setScheduleDate(date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Select 
                  value={format(scheduleDate, 'HH:mm')}
                  onValueChange={(value) => {
                    const [hours, minutes] = value.split(':');
                    const newDate = new Date(scheduleDate);
                    newDate.setHours(parseInt(hours, 10));
                    newDate.setMinutes(parseInt(minutes, 10));
                    setScheduleDate(newDate);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      [0, 30].map(minute => {
                        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        return (
                          <SelectItem key={timeValue} value={timeValue}>
                            {timeValue}
                          </SelectItem>
                        );
                      })
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          className={`gap-2 ${schedulingMode === 'schedule' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
          disabled={saving}
        >
          {schedulingMode === 'schedule' ? (
            <>
              <Calendar size={16} />
              {saving ? 'Scheduling...' : 'Schedule Message'}
            </>
          ) : (
            <>
              <Send size={16} />
              {saving ? 'Sending...' : 'Send Message'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default MessageForm;
