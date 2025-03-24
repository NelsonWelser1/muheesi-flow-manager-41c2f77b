
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import { ChevronLeft, RefreshCw, Send, Clock } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import { fromSupabase } from '@/integrations/supabase/utils/supabaseUtils';

import MessageForm from './communications/MessageForm';
import TemplateSelector from './communications/TemplateSelector';
import CommunicationRecordsViewer from './communications/CommunicationRecordsViewer';
import CommunicationStatusTabs from './communications/CommunicationStatusTabs';
import CommunicationTable from './communications/CommunicationTable';
import CommunicationSearchFilters from './communications/CommunicationSearchFilters';
import CommunicationDetailsDialog from './communications/CommunicationDetailsDialog';

const CommunicationsTab = ({ associationId }) => {
  const [activeView, setActiveView] = useState('compose');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [messageStatus, setMessageStatus] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'sentDate', direction: 'desc' });
  const [showRecordsView, setShowRecordsView] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, [associationId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('association_communications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (associationId) {
        query = query.eq('association_id', associationId);
      }
      
      const data = await fromSupabase(query);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      showErrorToast(toast, `Failed to load messages: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSent = () => {
    fetchMessages();
    showSuccessToast(toast, "Message sent successfully");
  };

  const handleRecordsViewToggle = () => {
    setShowRecordsView(!showRecordsView);
  };

  const handleViewMessageDetails = (message) => {
    setSelectedMessage(message);
    setIsDetailsDialogOpen(true);
  };

  const handleRefresh = () => {
    fetchMessages();
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      message.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipients?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = messageStatus === 'all' || message.status === messageStatus;
    
    let matchesTimeRange = true;
    if (timeRange !== 'all' && message.sentDate) {
      const fromDate = getDateFromTimeAgo(timeRange);
      matchesTimeRange = fromDate && new Date(message.sentDate) >= fromDate;
    }
    
    return matchesSearch && matchesStatus && matchesTimeRange;
  }).sort((a, b) => {
    const { key, direction } = sortConfig;
    
    if (!a[key] && !b[key]) return 0;
    if (!a[key]) return direction === 'asc' ? -1 : 1;
    if (!b[key]) return direction === 'asc' ? 1 : -1;
    
    if (key === 'sentDate' || key === 'created_at') {
      return direction === 'asc' 
        ? new Date(a[key]) - new Date(b[key])
        : new Date(b[key]) - new Date(a[key]);
    }
    
    return direction === 'asc'
      ? a[key].localeCompare(b[key])
      : b[key].localeCompare(a[key]);
  });

  if (showRecordsView) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="gap-2" 
            onClick={handleRecordsViewToggle}
          >
            <ChevronLeft size={16} />
            Back to Communications
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="flex items-center gap-1"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="bg-white rounded-md shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Communication Records</h3>
          </div>
          
          <CommunicationStatusTabs 
            messageStatus={messageStatus} 
            setMessageStatus={setMessageStatus} 
          />
          
          <div className="p-4">
            <CommunicationSearchFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />
            
            <CommunicationTable 
              messages={filteredMessages}
              loading={loading}
              onViewDetails={handleViewMessageDetails}
              sortConfig={sortConfig}
              onSort={setSortConfig}
            />
          </div>
        </div>
        
        <CommunicationDetailsDialog 
          message={selectedMessage}
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Member Communications</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRecordsViewToggle}
            className="flex items-center gap-2"
          >
            <Clock size={16} />
            View Records
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="compose" value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="compose">Compose Message</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose" className="space-y-4">
          <MessageForm 
            associationId={associationId} 
            onMessageSent={handleMessageSent} 
          />
        </TabsContent>
        
        <TabsContent value="templates">
          <TemplateSelector 
            associationId={associationId} 
            onTemplateSelect={(template) => {
              setActiveView('compose');
            }} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationsTab;
