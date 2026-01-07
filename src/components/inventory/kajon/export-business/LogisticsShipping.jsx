import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useShipments } from '@/hooks/useShipments';
import { Loader2, Ship } from 'lucide-react';

const LogisticsShipping = () => {
  const { shipments, isLoading, createShipment } = useShipments();
  const [formData, setFormData] = useState({
    destination: '',
    shipping_partner: '',
    incoterms: '',
    container_type: '',
    booking_number: '',
    container_number: ''
  });

  const handleSubmit = () => {
    if (!formData.destination || !formData.shipping_partner) {
      return;
    }
    
    createShipment.mutate({
      destination_port: formData.destination,
      shipping_line: formData.shipping_partner,
      incoterms: formData.incoterms,
      container_type: formData.container_type,
      booking_reference: formData.booking_number,
      container_number: formData.container_number,
      status: 'pending'
    });

    setFormData({
      destination: '',
      shipping_partner: '',
      incoterms: '',
      container_type: '',
      booking_number: '',
      container_number: ''
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      in_transit: 'default',
      delivered: 'outline',
      cancelled: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipping Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Destination</Label>
            <Select value={formData.destination} onValueChange={(v) => setFormData(prev => ({ ...prev, destination: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Turkey (Mersin)">Turkey (Mersin)</SelectItem>
                <SelectItem value="China (Tianjin)">China (Tianjin)</SelectItem>
                <SelectItem value="China (Ningbo)">China (Ningbo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Shipping Partner</Label>
            <Select value={formData.shipping_partner} onValueChange={(v) => setFormData(prev => ({ ...prev, shipping_partner: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maersk Line">Maersk Line</SelectItem>
                <SelectItem value="MSC">MSC</SelectItem>
                <SelectItem value="CMA CGM">CMA CGM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Incoterms</Label>
            <Select value={formData.incoterms} onValueChange={(v) => setFormData(prev => ({ ...prev, incoterms: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select incoterm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FOB">FOB</SelectItem>
                <SelectItem value="CIF">CIF</SelectItem>
                <SelectItem value="CFR">CFR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Container Type</Label>
            <Select value={formData.container_type} onValueChange={(v) => setFormData(prev => ({ ...prev, container_type: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select container" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20ft Standard">20ft Standard</SelectItem>
                <SelectItem value="40ft Standard">40ft Standard</SelectItem>
                <SelectItem value="40ft High Cube">40ft High Cube</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cargo Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Booking Number</Label>
              <Input 
                placeholder="Enter booking number" 
                value={formData.booking_number}
                onChange={(e) => setFormData(prev => ({ ...prev, booking_number: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Container Number</Label>
              <Input 
                placeholder="Enter container number" 
                value={formData.container_number}
                onChange={(e) => setFormData(prev => ({ ...prev, container_number: e.target.value }))}
              />
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={createShipment.isPending || !formData.destination || !formData.shipping_partner}
          >
            {createShipment.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Ship className="h-4 w-4 mr-2" />}
            Create Shipping Order
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : shipments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No shipments recorded yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destination</TableHead>
                  <TableHead>Shipping Line</TableHead>
                  <TableHead>Container</TableHead>
                  <TableHead>Booking Ref</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.slice(0, 10).map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell>{shipment.destination_port}</TableCell>
                    <TableCell>{shipment.shipping_line}</TableCell>
                    <TableCell>{shipment.container_type}</TableCell>
                    <TableCell>{shipment.booking_reference || '-'}</TableCell>
                    <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsShipping;
