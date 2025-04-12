
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Ship, 
  Plus, 
  Search, 
  CalendarClock,
  RefreshCw,
  FileDown,
  MapPin,
  Users
} from "lucide-react";
import { format, parseISO } from 'date-fns';
import { useShipments } from '../hooks/useShipments';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ShipmentsList = ({ onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { shipments, isLoading, fetchShipments } = useShipments();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'loading': return 'bg-purple-100 text-purple-800';
      case 'in-transit': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const filteredShipments = shipments.filter(shipment => {
    const searchLower = searchTerm.toLowerCase();
    return (
      shipment.shipment_id.toLowerCase().includes(searchLower) ||
      shipment.destination?.toLowerCase().includes(searchLower) ||
      shipment.client?.toLowerCase().includes(searchLower) ||
      shipment.vessel?.toLowerCase().includes(searchLower) ||
      shipment.status?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Ship className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Shipments</h2>
        </div>
        <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Shipment
        </Button>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search shipments..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => fetchShipments()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline">
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : filteredShipments.length === 0 ? (
            <div className="p-8 text-center">
              <Ship className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-900">No shipments found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm ? 'Try adjusting your search term' : 'Create your first shipment to get started'}
              </p>
              <Button 
                onClick={onCreateNew} 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Shipment
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Vessel</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.shipment_id}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        {shipment.destination}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-500" />
                        {shipment.client}
                      </TableCell>
                      <TableCell>{shipment.vessel}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <CalendarClock className="h-3 w-3 text-gray-500" />
                          {format(new Date(shipment.departure_date), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <CalendarClock className="h-3 w-3 text-gray-500" />
                          {format(new Date(shipment.eta), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentsList;
