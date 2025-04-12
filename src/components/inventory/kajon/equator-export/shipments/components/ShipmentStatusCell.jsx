
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Clock, Truck, Package, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useShipments } from '../hooks/useShipments';

const statusConfig = {
  'Scheduled': { color: 'bg-blue-100 text-blue-800', icon: Calendar },
  'Preparing': { color: 'bg-purple-100 text-purple-800', icon: Package },
  'Loading': { color: 'bg-yellow-100 text-yellow-800', icon: Package },
  'In Transit': { color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  'Delivered': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'Delayed': { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
};

const ShipmentStatusCell = ({ shipment }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateShipmentStatus } = useShipments();
  const currentStatus = shipment.status || 'Scheduled';
  
  const StatusIcon = statusConfig[currentStatus]?.icon || Clock;
  const statusColor = statusConfig[currentStatus]?.color || 'bg-gray-100 text-gray-800';

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    try {
      await updateShipmentStatus(shipment.id, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isUpdating} className="w-full focus:outline-none">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`${statusColor} flex items-center gap-1 px-2.5 py-1 text-xs font-medium`}>
            <StatusIcon size={14} />
            <span>{currentStatus}</span>
          </Badge>
          <ChevronDown size={14} className="text-gray-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {Object.keys(statusConfig).map((status) => {
          const StatusIcon = statusConfig[status].icon;
          return (
            <DropdownMenuItem 
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`flex items-center gap-2 cursor-pointer ${currentStatus === status ? 'bg-muted' : ''}`}
            >
              <StatusIcon size={14} />
              <span>{status}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShipmentStatusCell;
