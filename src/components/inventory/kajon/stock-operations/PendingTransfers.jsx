
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';
import { Loader2 } from 'lucide-react';
import PendingTransferNotification from './notifications/PendingTransferNotification';

const PendingTransfers = ({ location }) => {
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;
    
    const fetchPendingTransfers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('coffee_stock_transfers')
          .select('*')
          .eq('destination_location', location)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setPendingTransfers(data || []);
      } catch (err) {
        console.error('Error fetching pending transfers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingTransfers();
    
    // Set up real-time subscription for new transfers
    const subscription = supabase
      .channel('coffee_stock_transfers_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'coffee_stock_transfers',
        filter: `destination_location=eq.${location}` 
      }, (payload) => {
        if (payload.new.destination_location === location) {
          fetchPendingTransfers();
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4 mb-6">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading pending transfers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
        <p className="text-red-700">Error loading pending transfers: {error}</p>
      </div>
    );
  }

  if (pendingTransfers.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Pending Transfers ({pendingTransfers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingTransfers.map(transfer => (
            <PendingTransferNotification 
              key={transfer.id}
              transfer={transfer}
              onAccept={() => {
                setPendingTransfers(pendingTransfers.filter(t => t.id !== transfer.id));
              }}
              onDecline={() => {
                setPendingTransfers(pendingTransfers.filter(t => t.id !== transfer.id));
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTransfers;
