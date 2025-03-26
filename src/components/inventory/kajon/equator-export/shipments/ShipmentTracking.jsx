
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableHeader, TableBody, TableRow, 
  TableHead, TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, Map, Ship, Package, TrendingUp,
  Filter, Clock, Anchor, Globe, ArrowRight
} from 'lucide-react';

// Status colors for shipments
const shipmentStatusColors = {
  'in transit': "bg-blue-100 text-blue-800",
  'loading': "bg-amber-100 text-amber-800",
  'preparing': "bg-purple-100 text-purple-800",
  'delivered': "bg-green-100 text-green-800",
  'delayed': "bg-red-100 text-red-800",
  'cleared': "bg-teal-100 text-teal-800",
};

const ShipmentTracking = () => {
  const [activeShipment, setActiveShipment] = useState(null);
  
  // Sample shipment data
  const shipments = [
    {
      id: 'EQ-2453',
      reference: 'CNT-1001-S1',
      client: 'European Coffee Roasters GmbH',
      destination: 'Hamburg, Germany',
      departurePort: 'Mombasa, Kenya',
      date: '2023-12-01',
      eta: '2023-12-20',
      status: 'in transit',
      container: '20ft (ECRU7821345)',
      volume: '18 tons',
      coffeeType: 'Arabica - AA Grade',
      value: '$120,000',
      documents: {
        bill: true,
        phyto: true,
        origin: true,
        quality: true,
        customs: true
      },
      timeline: [
        { date: '2023-11-25', event: 'Documents prepared', status: 'completed' },
        { date: '2023-11-28', event: 'Quality certification issued', status: 'completed' },
        { date: '2023-12-01', event: 'Container loaded at origin', status: 'completed' },
        { date: '2023-12-03', event: 'Vessel departed', status: 'completed' },
        { date: '2023-12-15', event: 'Transit through Suez Canal', status: 'in progress' },
        { date: '2023-12-20', event: 'Expected arrival at destination', status: 'pending' },
        { date: '2023-12-22', event: 'Customs clearance', status: 'pending' },
        { date: '2023-12-24', event: 'Delivery to client', status: 'pending' }
      ]
    },
    {
      id: 'EQ-2455',
      reference: 'CNT-1002-S1',
      client: 'Artisan Bean Co.',
      destination: 'New York, USA',
      departurePort: 'Mombasa, Kenya',
      date: '2023-12-10',
      eta: '2024-01-05',
      status: 'loading',
      container: '40ft (ARBN9283716)',
      volume: '24 tons',
      coffeeType: 'Mixed Arabica/Robusta',
      value: '$92,500',
      documents: {
        bill: true,
        phyto: true,
        origin: true,
        quality: true,
        customs: false
      }
    },
    {
      id: 'EQ-2458',
      reference: 'CNT-1003-S1',
      client: 'Tokyo Coffee Imports',
      destination: 'Tokyo, Japan',
      departurePort: 'Mombasa, Kenya',
      date: '2023-12-15',
      eta: '2024-01-15',
      status: 'preparing',
      container: '20ft (TCIJ8276591)',
      volume: '16 tons',
      coffeeType: 'Robusta - Premium',
      value: '$78,300',
      documents: {
        bill: true,
        phyto: false,
        origin: true,
        quality: false,
        customs: false
      }
    },
    {
      id: 'EQ-2448',
      reference: 'CNT-998-S2',
      client: 'Café Parisien',
      destination: 'Marseille, France',
      departurePort: 'Mombasa, Kenya',
      date: '2023-11-15',
      eta: '2023-12-10',
      status: 'delayed',
      container: '20ft (CPFR5432198)',
      volume: '14 tons',
      coffeeType: 'Arabica - Premium',
      value: '$95,000',
      documents: {
        bill: true,
        phyto: true,
        origin: true,
        quality: true,
        customs: true
      }
    },
    {
      id: 'EQ-2445',
      reference: 'CNT-996-S1',
      client: 'Nordic Coffee Collective',
      destination: 'Stockholm, Sweden',
      departurePort: 'Mombasa, Kenya',
      date: '2023-11-05',
      eta: '2023-11-30',
      status: 'delivered',
      container: '20ft (NCCS1234567)',
      volume: '10 tons',
      coffeeType: 'Arabica - AA Grade',
      value: '$65,200',
      documents: {
        bill: true,
        phyto: true,
        origin: true,
        quality: true,
        customs: true
      }
    }
  ];

  return (
    <div className="space-y-6">
      {activeShipment ? (
        <ShipmentDetail 
          shipment={shipments.find(s => s.id === activeShipment)} 
          onBack={() => setActiveShipment(null)} 
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Shipment Tracking</h2>
              <p className="text-gray-500 text-sm">Track and manage export shipments</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>New Shipment</span>
              </Button>
            </div>
          </div>
          
          {/* Shipment Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-blue-700">Total Shipments</p>
                    <p className="text-2xl font-bold text-blue-900">15</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Ship className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-green-700">Delivered</p>
                    <p className="text-2xl font-bold text-green-900">8</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Package className="h-5 w-5 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-amber-700">In Transit</p>
                    <p className="text-2xl font-bold text-amber-900">5</p>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Globe className="h-5 w-5 text-amber-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-purple-700">Preparing</p>
                    <p className="text-2xl font-bold text-purple-900">2</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Shipments Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5 text-blue-600" />
                  <span>Active Shipments</span>
                </CardTitle>
                <div className="flex items-center relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search shipments..." className="pl-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="in-transit">In Transit</TabsTrigger>
                  <TabsTrigger value="loading">Loading</TabsTrigger>
                  <TabsTrigger value="preparing">Preparing</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Shipment ID</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Destination</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>ETA</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Volume</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shipments.map((shipment) => (
                          <TableRow key={shipment.id} className="cursor-pointer hover:bg-gray-50" 
                            onClick={() => setActiveShipment(shipment.id)}>
                            <TableCell className="font-medium">{shipment.id}</TableCell>
                            <TableCell>{shipment.client}</TableCell>
                            <TableCell>{shipment.destination}</TableCell>
                            <TableCell>{shipment.date}</TableCell>
                            <TableCell>{shipment.eta}</TableCell>
                            <TableCell>
                              <Badge className={shipmentStatusColors[shipment.status]}>
                                {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{shipment.volume}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={(e) => {
                                e.stopPropagation();
                                setActiveShipment(shipment.id);
                              }}>
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="in-transit">
                  <div className="p-4 text-center text-gray-500">
                    Showing In Transit shipments
                  </div>
                </TabsContent>
                
                <TabsContent value="loading">
                  <div className="p-4 text-center text-gray-500">
                    Showing Loading shipments
                  </div>
                </TabsContent>
                
                <TabsContent value="preparing">
                  <div className="p-4 text-center text-gray-500">
                    Showing Preparing shipments
                  </div>
                </TabsContent>
                
                <TabsContent value="delivered">
                  <div className="p-4 text-center text-gray-500">
                    Showing Delivered shipments
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

// Shipment Detail Component
const ShipmentDetail = ({ shipment, onBack }) => {
  if (!shipment) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <h2 className="text-xl font-semibold">Shipment {shipment.id}</h2>
          <Badge className={shipmentStatusColors[shipment.status]}>
            {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Generate Report</Button>
          <Button>Update Status</Button>
        </div>
      </div>
      
      {/* Shipment Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Shipment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Client</div>
                <div className="font-medium">{shipment.client}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Contract Reference</div>
                <div className="font-medium">{shipment.reference}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Coffee Type</div>
                <div className="font-medium">{shipment.coffeeType}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Value</div>
                <div className="font-medium">{shipment.value}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Container</div>
                <div className="font-medium">{shipment.container}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Volume</div>
                <div className="font-medium">{shipment.volume}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Departure Date</div>
                <div className="font-medium">{shipment.date}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">ETA</div>
                <div className="font-medium">{shipment.eta}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Departure Port</div>
                <div className="font-medium">{shipment.departurePort}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Destination</div>
                <div className="font-medium">{shipment.destination}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Required Documents</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant={shipment.documents.bill ? "default" : "outline"}>
                    Bill of Lading
                  </Badge>
                  <Badge variant={shipment.documents.phyto ? "default" : "outline"}>
                    Phytosanitary
                  </Badge>
                  <Badge variant={shipment.documents.origin ? "default" : "outline"}>
                    Certificate of Origin
                  </Badge>
                  <Badge variant={shipment.documents.quality ? "default" : "outline"}>
                    Quality Certificate
                  </Badge>
                  <Badge variant={shipment.documents.customs ? "default" : "outline"}>
                    Customs Declaration
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Shipment Timeline */}
      {shipment.timeline && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Shipment Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {shipment.timeline.map((event, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className={`z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                      event.status === 'completed' ? 'bg-green-100' : 
                      event.status === 'in progress' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <div className={`h-3 w-3 rounded-full ${
                        event.status === 'completed' ? 'bg-green-600' : 
                        event.status === 'in progress' ? 'bg-blue-600' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {event.event}
                        </p>
                        <Badge className={
                          event.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          event.status === 'in progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {event.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShipmentTracking;
