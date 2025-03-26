
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Truck, Ship, Package, Plus, Search, Calendar, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const ShipmentTracking = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  
  const shipments = [
    {
      id: 'EQ-2453',
      destination: 'Hamburg, Germany',
      status: 'in_transit',
      progress: 60,
      eta: '2023-12-15',
      volume: '18 tons',
      container: '20ft',
      buyer: 'European Coffee Imports Ltd',
      coffee: 'Arabica AA Grade',
      departure: '2023-11-25',
      trackingEvents: [
        { date: '2023-11-25', event: 'Departed from Mombasa Port', location: 'Mombasa, Kenya' },
        { date: '2023-11-30', event: 'Arrived at Suez Canal', location: 'Suez Canal, Egypt' },
        { date: '2023-12-05', event: 'Departed Suez Canal', location: 'Suez Canal, Egypt' },
        { date: '2023-12-10', event: 'Mediterranean Sea Transit', location: 'Mediterranean Sea' }
      ]
    },
    {
      id: 'EQ-2455',
      destination: 'New York, USA',
      status: 'loading',
      progress: 20,
      eta: '2024-01-10',
      volume: '24 tons',
      container: '40ft',
      buyer: 'North American Roasters',
      coffee: 'Mixed Arabica & Robusta',
      departure: '2023-12-18',
      trackingEvents: [
        { date: '2023-12-01', event: 'Quality Check Completed', location: 'Kampala, Uganda' },
        { date: '2023-12-05', event: 'Customs Documentation Submitted', location: 'Kampala, Uganda' },
        { date: '2023-12-10', event: 'Container Loading Initiated', location: 'Mombasa, Kenya' }
      ]
    },
    {
      id: 'EQ-2458',
      destination: 'Tokyo, Japan',
      status: 'preparing',
      progress: 10,
      eta: '2024-01-25',
      volume: '16 tons',
      container: '20ft',
      buyer: 'Asian Coffee Trading Co.',
      coffee: 'Robusta Premium Grade',
      departure: '2023-12-30',
      trackingEvents: [
        { date: '2023-12-01', event: 'Purchase Order Confirmed', location: 'Kampala, Uganda' },
        { date: '2023-12-05', event: 'Packaging Materials Ordered', location: 'Kampala, Uganda' }
      ]
    },
    {
      id: 'EQ-2449',
      destination: 'Dubai, UAE',
      status: 'completed',
      progress: 100,
      eta: '2023-11-15',
      volume: '12 tons',
      container: '20ft',
      buyer: 'Middle East Distributors',
      coffee: 'Arabica A Grade',
      departure: '2023-10-20',
      trackingEvents: [
        { date: '2023-10-20', event: 'Departed from Mombasa Port', location: 'Mombasa, Kenya' },
        { date: '2023-10-28', event: 'Arrived at Hormuz Strait', location: 'Hormuz Strait' },
        { date: '2023-11-05', event: 'Arrived at Jebel Ali Port', location: 'Dubai, UAE' },
        { date: '2023-11-08', event: 'Customs Clearance Completed', location: 'Dubai, UAE' },
        { date: '2023-11-15', event: 'Delivered to Buyer Warehouse', location: 'Dubai, UAE' }
      ]
    },
    {
      id: 'EQ-2451',
      destination: 'Amsterdam, Netherlands',
      status: 'completed',
      progress: 100,
      eta: '2023-10-30',
      volume: '20 tons',
      container: '20ft',
      buyer: 'Dutch Coffee Traders',
      coffee: 'Organic Arabica',
      departure: '2023-09-25',
      trackingEvents: [
        { date: '2023-09-25', event: 'Departed from Mombasa Port', location: 'Mombasa, Kenya' },
        { date: '2023-10-05', event: 'Suez Canal Transit', location: 'Suez Canal, Egypt' },
        { date: '2023-10-15', event: 'Mediterranean Sea Transit', location: 'Mediterranean Sea' },
        { date: '2023-10-22', event: 'Arrived at Rotterdam Port', location: 'Rotterdam, Netherlands' },
        { date: '2023-10-25', event: 'Customs Clearance Completed', location: 'Rotterdam, Netherlands' },
        { date: '2023-10-30', event: 'Delivered to Buyer Warehouse', location: 'Amsterdam, Netherlands' }
      ]
    }
  ];
  
  const filteredShipments = shipments.filter(shipment => {
    // Filter by status
    if (activeTab === 'active' && (shipment.status === 'completed')) {
      return false;
    }
    
    if (activeTab === 'completed' && (shipment.status !== 'completed')) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !shipment.buyer.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'in_transit':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Transit</Badge>;
      case 'loading':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Loading</Badge>;
      case 'preparing':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Preparing</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'in_transit':
        return <Ship className="h-5 w-5 text-blue-600" />;
      case 'loading':
        return <Package className="h-5 w-5 text-amber-600" />;
      case 'preparing':
        return <Clock className="h-5 w-5 text-purple-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Shipment Tracking</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Shipment
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search shipments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Filter by Date
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="active" className="flex items-center gap-1">
                <Ship className="h-4 w-4" />
                Active Shipments
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Completed Shipments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-6">
              {filteredShipments.map((shipment) => (
                <Card key={shipment.id} className="mb-4 overflow-hidden">
                  <CardHeader className="pb-2 bg-gray-50 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 p-2 rounded-full">
                          {getStatusIcon(shipment.status)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">Shipment {shipment.id}</CardTitle>
                          <p className="text-sm text-gray-500">{shipment.coffee} • {shipment.volume}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(shipment.status)}
                        <p className="text-sm text-gray-500 mt-1">ETA: {shipment.eta}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{shipment.progress}%</span>
                      </div>
                      <Progress value={shipment.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Shipment Details</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Destination</p>
                              <p className="text-sm text-gray-600">{shipment.destination}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Truck className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Container</p>
                              <p className="text-sm text-gray-600">{shipment.container} • {shipment.volume}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Departure Date</p>
                              <p className="text-sm text-gray-600">{shipment.departure}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Tracking History</h4>
                        <div className="space-y-3">
                          {shipment.trackingEvents.slice(0, 3).map((event, index) => (
                            <div key={index} className="relative pl-5 pb-3">
                              <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              {index < shipment.trackingEvents.length - 1 && (
                                <div className="absolute left-0.5 top-3 bottom-0 w-0.5 bg-gray-200"></div>
                              )}
                              <p className="text-sm font-medium">{event.event}</p>
                              <p className="text-xs text-gray-500">{event.date} • {event.location}</p>
                            </div>
                          ))}
                          {shipment.trackingEvents.length > 3 && (
                            <Button variant="link" size="sm" className="text-xs mt-1 h-auto p-0">
                              View complete history
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm">Track Details</Button>
                      <Button variant="outline" size="sm">View Documents</Button>
                      <Button size="sm">Manage Shipment</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-6">
              {filteredShipments.map((shipment) => (
                <Card key={shipment.id} className="mb-4 overflow-hidden">
                  <CardHeader className="pb-2 bg-gray-50 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Shipment {shipment.id}</CardTitle>
                          <p className="text-sm text-gray-500">{shipment.coffee} • {shipment.volume}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(shipment.status)}
                        <p className="text-sm text-gray-500 mt-1">Delivered: {shipment.eta}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Shipment Details</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Destination</p>
                              <p className="text-sm text-gray-600">{shipment.destination}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Truck className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Container</p>
                              <p className="text-sm text-gray-600">{shipment.container} • {shipment.volume}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Departure Date</p>
                              <p className="text-sm text-gray-600">{shipment.departure}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Final Delivery Status</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <p className="text-sm font-medium">Successfully Delivered</p>
                          </div>
                          <p className="text-sm text-gray-600">Delivered to {shipment.buyer} on {shipment.eta}</p>
                          <p className="text-sm text-gray-600">All customs clearance and documentation complete.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm">Download Report</Button>
                      <Button variant="outline" size="sm">View Documents</Button>
                      <Button size="sm">Shipment Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-2 rounded-full">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-amber-800">Shipment EQ-2453 Requires Attention</p>
            <p className="text-sm text-amber-700 mt-1">
              Documentation for shipment EQ-2453 is incomplete. Customs clearance at Suez Canal may be delayed. 
              Please update missing documentation within 48 hours.
            </p>
            <Button size="sm" variant="outline" className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100">
              Review Documents
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracking;
