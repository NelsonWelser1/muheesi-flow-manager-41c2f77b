
import React, { useEffect } from 'react';
import { useShipments } from '../hooks/useShipments';
import ShipmentStatusCell from './ShipmentStatusCell';
import ShipmentActionsCell from './ShipmentActionsCell';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const ShipmentsList = ({ onCreateNew, viewOnly = false }) => {
  const { shipments, isLoading, fetchShipments } = useShipments();

  useEffect(() => {
    fetchShipments();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Shipments</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={fetchShipments} 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          {!viewOnly && (
            <Button 
              onClick={onCreateNew} 
              size="sm" 
              className="flex items-center gap-1"
            >
              <PlusCircle size={16} />
              New Shipment
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Shipment ID</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Container</th>
                <th className="px-4 py-3 font-medium">Departs</th>
                <th className="px-4 py-3 font-medium">ETA</th>
                <th className="px-4 py-3 font-medium">Destination</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Last Update</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <RefreshCw size={24} className="animate-spin text-muted-foreground" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading shipments...</p>
                  </td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <p className="text-muted-foreground">No shipments found</p>
                    {!viewOnly && (
                      <Button 
                        variant="link" 
                        onClick={onCreateNew} 
                        className="mt-2"
                      >
                        Create your first shipment
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                shipments.map(shipment => (
                  <tr key={shipment.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{shipment.shipment_id}</td>
                    <td className="px-4 py-3">
                      <ShipmentStatusCell shipment={shipment} readOnly={viewOnly} />
                    </td>
                    <td className="px-4 py-3">{shipment.container}</td>
                    <td className="px-4 py-3">{formatDate(shipment.departure_date)}</td>
                    <td className="px-4 py-3">{formatDate(shipment.eta)}</td>
                    <td className="px-4 py-3">{shipment.destination || 'N/A'}</td>
                    <td className="px-4 py-3">{shipment.client || 'N/A'}</td>
                    <td className="px-4 py-3">{formatDate(shipment.last_update)}</td>
                    <td className="px-4 py-3 text-right">
                      <ShipmentActionsCell shipment={shipment} readOnly={viewOnly} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipmentsList;
