
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, Package, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const SupplyChainTracking = () => {
  const shipments = [
    {
      id: 'SH001',
      origin: 'Kazo Processing Plant',
      destination: 'Kampala Distribution',
      product: 'Dairy Products',
      quantity: '500 units',
      status: 'In Transit',
      progress: 65,
      estimatedArrival: '2024-06-05 14:30',
      currentLocation: 'Mbarara Checkpoint',
      temperature: '4°C',
      driver: 'Moses Kato'
    },
    {
      id: 'SH002',
      origin: 'Coffee Processing Facility',
      destination: 'Export Terminal',
      product: 'Arabica Coffee',
      quantity: '2 tons',
      status: 'Delivered',
      progress: 100,
      estimatedArrival: '2024-06-04 16:00',
      currentLocation: 'Export Terminal',
      temperature: 'Ambient',
      driver: 'Sarah Namuli'
    },
    {
      id: 'SH003',
      origin: 'Kyalima Farms',
      destination: 'Processing Center',
      product: 'Raw Materials',
      quantity: '1.2 tons',
      status: 'Pending Pickup',
      progress: 0,
      estimatedArrival: '2024-06-06 10:00',
      currentLocation: 'Kyalima Farms',
      temperature: 'N/A',
      driver: 'Peter Okello'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Pending Pickup': return 'bg-yellow-100 text-yellow-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'In Transit': return <Truck className="h-4 w-4 text-blue-600" />;
      case 'Pending Pickup': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Delayed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Supply Chain Tracking</h3>
          <p className="text-sm text-muted-foreground">Real-time shipment monitoring and tracking</p>
        </div>
        <Button className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Track All Shipments
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Currently tracking</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">On-Time Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.5%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Transit Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2.4 days</div>
            <p className="text-xs text-muted-foreground">Network average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(shipment.status)}
                    <h4 className="font-semibold text-lg">Shipment {shipment.id}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {shipment.origin} → {shipment.destination}
                  </p>
                </div>
                <Badge className={getStatusColor(shipment.status)}>
                  {shipment.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Product</p>
                  <p className="font-semibold">{shipment.product}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-semibold">{shipment.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Driver</p>
                  <p className="font-semibold">{shipment.driver}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="font-semibold">{shipment.temperature}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-semibold">{shipment.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${shipment.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Current: {shipment.currentLocation}</span>
                  <span className="text-muted-foreground">ETA: {shipment.estimatedArrival}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Track Location
                </Button>
                <Button variant="outline" size="sm">
                  Contact Driver
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Temperature Log
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SupplyChainTracking;
