
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Check, X, Coffee, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { format } from 'date-fns';

const PendingTransferNotification = ({ transfer, onAccept, onDecline }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('coffee_stock_transfers')
        .update({ 
          status: 'received',
          notes: notes || `Accepted by ${transfer.destination_location} manager`,
          received_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', transfer.id);

      if (error) throw error;
      
      toast({
        title: "Transfer accepted",
        description: "Stock transfer has been successfully received",
      });
      
      if (onAccept) onAccept();
    } catch (err) {
      console.error('Error accepting transfer:', err);
      toast({
        title: "Error accepting transfer",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!notes.trim()) {
      toast({
        title: "Notes required",
        description: "Please provide a reason for declining this transfer",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('coffee_stock_transfers')
        .update({ 
          status: 'declined',
          notes: notes,
          declined_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', transfer.id);

      if (error) throw error;
      
      toast({
        title: "Transfer declined",
        description: "Stock transfer has been declined",
      });
      
      if (onDecline) onDecline();
    } catch (err) {
      console.error('Error declining transfer:', err);
      toast({
        title: "Error declining transfer",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-amber-100 p-2 flex-shrink-0">
              <Truck className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-amber-800">Incoming Transfer</h4>
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                  {transfer.quantity} {transfer.unit || 'kg'}
                </span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                {transfer.coffee_type} ({transfer.quality_grade})
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                <span>{transfer.source_location}</span>
                <ArrowRight className="h-3 w-3" />
                <span className="font-medium">{transfer.destination_location}</span>
              </div>
              <div className="mt-1 text-xs text-amber-600">
                <span>From: {transfer.manager}</span> • <span>Date: {formatDate(transfer.created_at)}</span>
              </div>
              {transfer.reason && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-100 p-2 rounded">
                  Reason: {transfer.reason}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            <Label htmlFor="notes" className="text-xs text-amber-700">Notes (required for declining)</Label>
            <Input 
              id="notes"
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Enter any notes or comments"
              className="text-sm bg-white border-amber-200 mt-1"
            />
          </div>
          
          <div className="flex justify-between gap-2 mt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 bg-red-50 border-red-200 hover:bg-red-100 text-red-800"
              onClick={handleDecline}
              disabled={isProcessing}
            >
              <X className="h-4 w-4 mr-1" /> Decline
            </Button>
            <Button 
              type="button" 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAccept}
              disabled={isProcessing}
            >
              <Check className="h-4 w-4 mr-1" /> Accept
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTransferNotification;
