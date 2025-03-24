
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { getDateFromTimeAgo } from '@/utils/dateUtils';

export const useCommunicationMessages = (associationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Mock data for messages
  const mockMessages = [
    {
      id: '1',
      subject: 'Association Meeting Announcement',
      message: 'Dear members, we will have our monthly meeting on Friday, June 10th at 2:00 PM at the association headquarters.',
      recipients: 'all',
      type: 'sms',
      status: 'sent',
      sentDate: '2023-06-05T10:00:00Z',
      sentBy: 'John Doe'
    },
    {
      id: '2',
      subject: 'Coffee Price Update',
      message: 'Good news! The coffee prices have increased by 10%. Please contact the association office for more details.',
      recipients: 'active',
      type: 'whatsapp',
      status: 'sent',
      sentDate: '2023-05-28T14:30:00Z',
      sentBy: 'Jane Smith'
    },
    {
      id: '3',
      subject: 'Training Workshop',
      message: 'We are organizing a training workshop on sustainable coffee farming techniques on Monday, June 20th.',
      recipients: 'arabica',
      type: 'email',
      status: 'draft',
      sentDate: null,
      sentBy: null
    },
    {
      id: '4',
      subject: 'Certification Program',
      message: 'New certification program available for organic coffee farmers. Register before July 15th to participate.',
      recipients: 'all',
      type: 'sms',
      status: 'scheduled',
      sentDate: '2023-07-01T08:00:00Z',
      sentBy: 'System'
    },
    {
      id: '5',
      subject: 'Coffee Delivery Schedule',
      message: 'Next coffee collection will be on Thursday, June 15th. Please prepare your harvest accordingly.',
      recipients: 'active',
      type: 'whatsapp',
      status: 'failed',
      sentDate: '2023-06-02T09:15:00Z',
      sentBy: 'John Doe'
    }
  ];

  const fetchMessages = () => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 800);
  };

  const sendMessage = async (messageData) => {
    setSaving(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMessage = {
        id: Date.now().toString(),
        ...messageData,
        status: messageData.status || 'sent',
        sentDate: messageData.status === 'scheduled' ? messageData.scheduledDate : new Date().toISOString(),
        sentBy: 'Current User'
      };
      
      setMessages(prev => [newMessage, ...prev]);
      
      toast({
        title: "Message sent successfully",
        description: "Your message has been sent to the selected recipients.",
        variant: "success"
      });
      
      setSaving(false);
      return true;
    } catch (err) {
      setError('Failed to send message');
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
      setSaving(false);
      return false;
    }
  };

  const filterMessages = (searchTerm, status, timeRange) => {
    return messages.filter(message => {
      // Filter by search term
      const matchesSearch = 
        message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        message.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.recipients?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = status === 'all' || message.status === status;
      
      // Filter by time range
      let matchesTimeRange = true;
      if (timeRange !== 'all' && message.sentDate) {
        const fromDate = getDateFromTimeAgo(timeRange);
        matchesTimeRange = fromDate && new Date(message.sentDate) >= fromDate;
      }
      
      return matchesSearch && matchesStatus && matchesTimeRange;
    });
  };

  useEffect(() => {
    fetchMessages();
  }, [associationId]);

  return {
    messages,
    loading,
    saving,
    error,
    fetchMessages,
    sendMessage,
    filterMessages
  };
};
