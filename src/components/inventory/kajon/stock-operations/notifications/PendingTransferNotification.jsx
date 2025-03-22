
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';

const PendingTransferNotification = ({ 
  transfer, 
  onClose, 
  onRefresh 
}) => {
  const { respondToTransfer } = useCoffeeStockTransfers();
  
  const handleAction = async (action) => {
    try {
      // In a real app, userId would come from authentication
      const userId = 'dummy-recipient-id'; 
      await respondToTransfer(transfer.id, action, userId);
      onRefresh();
    } catch (error) {
      console.error(`Error ${action} transfer:`, error);
    } finally {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  return (
    <Card className="mb-4 border-l-4 border-l-blue-500 animate-pulse">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">New Stock Transfer</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              From: {transfer.source_location}
            </p>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-800">
            Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Coffee Type:</span> {transfer.coffee_type}
          </div>
          <div>
            <span className="font-medium">Quality Grade:</span> {transfer.quality_grade}
          </div>
          <div>
            <span className="font-medium">Quantity:</span> {transfer.quantity} {transfer.unit}
          </div>
          <div>
            <span className="font-medium">Requested:</span> {formatDate(transfer.created_at)}
          </div>
          {transfer.reason && (
            <div className="col-span-2">
              <span className="font-medium">Reason:</span> {transfer.reason}
            </div>
          )}
          <div className="col-span-2">
            <span className="font-medium">Manager:</span> {transfer.manager}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="border-red-300 text-red-700 hover:bg-red-50"
          onClick={() => handleAction('decline')}
        >
          <X className="h-4 w-4 mr-1" /> Decline
        </Button>
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => handleAction('accept')}
        >
          <Check className="h-4 w-4 mr-1" /> Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingTransferNotification;
