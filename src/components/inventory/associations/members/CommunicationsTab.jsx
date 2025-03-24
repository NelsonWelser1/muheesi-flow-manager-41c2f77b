
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { useCommunicationMessages } from '@/hooks/useCommunicationMessages';
import CommunicationRecordsViewer from './communications/CommunicationRecordsViewer';
import MessageForm from './communications/MessageForm';
import TemplateSelector from './communications/TemplateSelector';

const CommunicationsTab = ({ associationId }) => {
  const [showRecordsView, setShowRecordsView] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateVariables, setTemplateVariables] = useState({});
  
  const {
    sendMessage,
    saving
  } = useCommunicationMessages(associationId);

  const handleSendMessage = async (messageData) => {
    const success = await sendMessage(messageData);
    if (success) {
      // Reset form state or show success message
    }
  };

  const handleVariableChange = (variable, value) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleApplyTemplate = () => {
    // This is handled in the MessageForm component
  };

  if (showRecordsView) {
    return <CommunicationRecordsViewer 
      onBack={() => setShowRecordsView(false)} 
      associationId={associationId} 
    />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Communication Tools</h3>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowRecordsView(true)}
        >
          <FileText className="h-4 w-4" />
          View Message Records
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="compose">Compose Message</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose" className="space-y-4 pt-4">
          <MessageForm onSendMessage={handleSendMessage} saving={saving} />
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4 pt-4">
          <TemplateSelector 
            onSelectTemplate={setSelectedTemplate}
            onApplyTemplate={handleApplyTemplate}
            selectedTemplate={selectedTemplate}
            templateVariables={templateVariables}
            onVariableChange={handleVariableChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationsTab;
