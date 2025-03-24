
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import CommunicationExportActions from './CommunicationExportActions';

const CommunicationDetailsDialog = ({ message, isOpen, onClose }) => {
  if (!message) return null;
  
  const getStatusBadgeColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'sent': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'scheduled': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'draft': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'failed': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'sms': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'whatsapp': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'email': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>{message.subject}</span>
            <div className="flex space-x-2">
              <Badge className={getTypeBadgeColor(message.type)}>
                {message.type?.toUpperCase()}
              </Badge>
              <Badge className={getStatusBadgeColor(message.status)}>
                {message.status?.charAt(0).toUpperCase() + message.status?.slice(1)}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Sent to: <span className="font-medium">{message.recipients}</span> • 
            {message.sentDate ? ` Sent on: ${formatDate(message.sentDate)}` : ' Not sent yet'}
            {message.sentBy ? ` • By: ${message.sentBy}` : ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
            {message.message}
          </div>
          
          <div className="flex justify-end">
            <CommunicationExportActions messages={[]} selectedMessage={message} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommunicationDetailsDialog;
