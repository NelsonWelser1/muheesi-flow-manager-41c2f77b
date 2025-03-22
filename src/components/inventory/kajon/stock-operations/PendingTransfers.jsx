
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';
import PendingTransferNotification from './notifications/PendingTransferNotification';

const PendingTransfers = ({ location }) => {
  const [showAll, setShowAll] = useState(false);
  const { transfers, loading, error, handleRefresh } = useCoffeeStockTransfers();
  
  // Filter transfers for the current location and status = pending
  const pendingTransfers = transfers.filter(transfer => 
    transfer.status === 'pending' && transfer.destination_location === location
  );

  // Get only the most recent 3 transfers to show initially
  const displayTransfers = showAll 
    ? pendingTransfers 
    : pendingTransfers.slice(0, 3);

  useEffect(() => {
    // Fetch transfers when component mounts
    handleRefresh();
    
    // Set up polling to check for new transfers
    const intervalId = setInterval(() => {
      handleRefresh();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading && pendingTransfers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Stock Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Stock Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 p-4">
            <p>Error loading transfers</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingTransfers.length === 0) {
    return null; // Don't show anything if there are no pending transfers
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Pending Stock Transfers</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayTransfers.map(transfer => (
            <PendingTransferNotification
              key={transfer.id}
              transfer={transfer}
              onClose={handleRefresh}
              onRefresh={handleRefresh}
            />
          ))}
          
          {pendingTransfers.length > 3 && !showAll && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => setShowAll(true)}
            >
              Show {pendingTransfers.length - 3} More Pending Transfers
            </Button>
          )}
          
          {showAll && pendingTransfers.length > 3 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => setShowAll(false)}
            >
              Show Less
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTransfers;
