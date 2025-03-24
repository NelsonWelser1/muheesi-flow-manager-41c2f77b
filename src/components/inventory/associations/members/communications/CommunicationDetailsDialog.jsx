
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CommunicationExportActions from './CommunicationExportActions';

const CommunicationDetailsDialog = ({ message, isOpen, onClose }) => {
  if (!message) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Message Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Subject</h4>
              <p className="font-medium">{message.subject || 'No subject'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Type</h4>
              <p>{message.type?.toUpperCase() || 'N/A'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Recipients</h4>
              <p>{message.recipients || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <Badge className={getStatusColor(message.status)}>
                {message.status?.charAt(0).toUpperCase() + message.status?.slice(1) || 'Unknown'}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Sent Date</h4>
              <p>
                {message.sentDate 
                  ? new Date(message.sentDate).toLocaleString() 
                  : message.status === 'scheduled' ? 'Scheduled' : 'N/A'
                }
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Sent By</h4>
              <p>{message.sentBy || 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Message</h4>
            <div className="mt-1 p-3 border rounded-md bg-gray-50">
              <p className="whitespace-pre-line">{message.message || 'No message content'}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <CommunicationExportActions messages={[]} selectedMessage={message} />
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommunicationDetailsDialog;
