
import React, { useEffect, useState } from 'react';
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';
import PendingTransferNotification from './notifications/PendingTransferNotification';

const PendingTransfers = ({ location, onlyShow = false }) => {
  const { transfers, loading, error, handleRefresh } = useCoffeeStockTransfers();
  const [pendingTransfers, setPendingTransfers] = useState([]);

  // Set initial data and refresh periodically
  useEffect(() => {
    // Initial data fetch
    handleRefresh();
    
    // Refresh data every 60 seconds
    const intervalId = setInterval(() => {
      handleRefresh();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Filter transfers based on destination location
  useEffect(() => {
    if (transfers && transfers.length > 0) {
      const filtered = transfers.filter(transfer => 
        transfer.status === 'pending' && 
        transfer.destination_location === location
      );
      setPendingTransfers(filtered);
    } else {
      setPendingTransfers([]);
    }
  }, [transfers, location]);

  // Handle successful response to a transfer
  const handleTransferResponse = () => {
    handleRefresh();
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-sm text-gray-500">Loading pending transfers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error loading transfers: {error}</p>
      </div>
    );
  }

  if (pendingTransfers.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center mb-6">
        <p className="text-gray-500">No pending transfers for this location</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      <h3 className="font-medium text-lg">Pending Transfers ({pendingTransfers.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingTransfers.map(transfer => (
          <PendingTransferNotification 
            key={transfer.id} 
            transfer={transfer} 
            onAccept={handleTransferResponse}
            onDecline={handleTransferResponse}
          />
        ))}
      </div>
    </div>
  );
};

export default PendingTransfers;
