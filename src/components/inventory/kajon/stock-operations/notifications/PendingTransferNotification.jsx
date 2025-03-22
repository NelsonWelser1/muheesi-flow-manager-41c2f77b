
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle, XCircle, Coffee } from 'lucide-react';
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import { format } from 'date-fns';

const PendingTransferNotification = ({ transfer, onAccept, onDecline }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { respondToTransfer } = useCoffeeStockTransfers();

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  const handleAction = async (action) => {
    setIsProcessing(true);
    
    try {
      // In a real app, we would use the authenticated user's ID
      const userId = 'dummy-recipient-id';
      const notes = action === 'accept' 
        ? `Accepted by ${transfer.destination_location} manager` 
        : `Declined by ${transfer.destination_location} manager`;
      
      await respondToTransfer(transfer.id, action, userId, notes);
      
      if (action === 'accept') {
        showSuccessToast(toast, "Transfer accepted successfully");
        if (onAccept) onAccept();
      } else {
        showSuccessToast(toast, "Transfer declined");
        if (onDecline) onDecline();
      }
    } catch (error) {
      showErrorToast(toast, `Failed to ${action} transfer: ${error.message}`);
      console.error(`Error ${action}ing transfer:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="pt-4 pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium">{transfer.quality_grade}</p>
                <p className="text-sm text-gray-500">From: {transfer.source_location}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
              Pending
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm mt-1">
            <div>
              <span className="text-gray-500">Quantity:</span>{' '}
              <span className="font-medium">{transfer.quantity} {transfer.unit}</span>
            </div>
            <div>
              <span className="text-gray-500">Date:</span>{' '}
              <span className="font-medium">{formatDate(transfer.created_at)}</span>
            </div>
            <div>
              <span className="text-gray-500">Manager:</span>{' '}
              <span className="font-medium">{transfer.manager}</span>
            </div>
            <div>
              <span className="text-gray-500">Reason:</span>{' '}
              <span className="font-medium">{transfer.reason || 'N/A'}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            {isProcessing ? (
              <Button disabled className="w-full">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="flex-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                  onClick={() => handleAction('decline')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                  onClick={() => handleAction('accept')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTransferNotification;
