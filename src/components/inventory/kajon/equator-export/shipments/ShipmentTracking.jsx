
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, Plus, Filter, MapPin, Calendar, Ship, Package, 
  Truck, ArrowRight, FileText, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

const ShipmentTracking = () => {
  // Sample shipments data
  const shipments = [
    {
      id: 'EQ-2453',
      destination: 'Hamburg, Germany',
      client: 'European Coffee Roasters GmbH',
      contract: 'CNT-1001',
      status: 'in-transit',
      eta: '2023-12-25',
      volume: '18 tons',
      carrier: 'Maersk Line',
      vessel: 'MSC Hamburg',
      departureDate: '2023-12-05',
      departurePort: 'Mombasa, Kenya'
    },
    {
      id: 'EQ-2455',
      destination: 'New York, USA',
      client: 'Artisan Bean Co.',
      contract: 'CNT-1002',
      status: 'loading',
      eta: '2024-01-15',
      volume: '24 tons',
      carrier: 'Mediterranean Shipping Company',
      vessel: 'MSC Beatrice',
      departureDate: '2023-12-28',
      departurePort: 'Mombasa, Kenya'
    },
    {
      id: 'EQ-2458',
      destination: 'Tokyo, Japan',
      client: 'Tokyo Coffee Imports',
      contract: 'CNT-1003',
      status: 'preparing',
      eta: '2024-01-30',
      volume: '16 tons',
      carrier: 'Ocean Network Express',
      vessel: 'TBD',
      departureDate: '2024-01-05',
      departurePort: 'Mombasa, Kenya'
    },
    {
      id: 'EQ-2452',
      destination: 'Dubai, UAE',
      client: 'Middle East Coffee Trading LLC',
      contract: 'CNT-1004',
      status: 'delivered',
      eta: '2023-11-20',
      volume: '20 tons',
      carrier: 'CMA CGM',
      vessel: 'CMA CGM Titus',
      departureDate: '2023-10-25',
      departurePort: 'Mombasa, Kenya'
    },
    {
      id: 'EQ-2450',
      destination: 'Stockholm, Sweden',
      client: 'Nordic Coffee Collective',
      contract: 'CNT-1005',
      status: 'delayed',
      eta: '2023-12-30',
      volume: '10 tons',
      carrier: 'Hapag-Lloyd',
      vessel: 'Seoul Express',
      departureDate: '2023-11-20',
      departurePort: 'Mombasa, Kenya'
    }
  ];

  const statusColors = {
    'in-transit': "bg-blue-100 text-blue-800",
    'loading': "bg-purple-100 text-purple-800",
    'preparing': "bg-amber-100 text-amber-800",
    'delivered': "bg-green-100 text-green-800",
    'delayed': "bg-red-100 text-red-800",
    'customs': "bg-indigo-100 text-indigo-800"
  };
  
  const statusIcons = {
    'in-transit': <Ship className="h-4 w-4 mr-1" />,
    'loading': <Package className="h-4 w-4 mr-1" />,
    'preparing': <FileText className="h-4 w-4 mr-1" />,
    'delivered': <CheckCircle className="h-4 w-4 mr-1" />,
    'delayed': <AlertCircle className="h-4 w-4 mr-1" />,
    'customs': <Truck className="h-4 w-4 mr-1" />
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Shipment Tracking</h2>
          <p className="text-gray-500 text-sm">Monitor and manage coffee export shipments</p>
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
      
      {/* Shipment Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Ship className="h-5 w-5 text-blue-700" />
              </div>
              <p className="text-sm text-blue-700">In Transit</p>
              <p className="text-2xl font-bold text-blue-900">1</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-purple-100 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="h-5 w-5 text-purple-700" />
              </div>
              <p className="text-sm text-purple-700">Loading</p>
              <p className="text-2xl font-bold text-purple-900">1</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-amber-100 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="h-5 w-5 text-amber-700" />
              </div>
              <p className="text-sm text-amber-700">Preparing</p>
              <p className="text-2xl font-bold text-amber-900">1</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-green-100 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
              <p className="text-sm text-green-700">Delivered</p>
              <p className="text-2xl font-bold text-green-900">1</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-red-100 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertCircle className="h-5 w-5 text-red-700" />
              </div>
              <p className="text-sm text-red-700">Delayed</p>
              <p className="text-2xl font-bold text-red-900">1</p>
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
              <span>Shipment Tracking</span>
            </CardTitle>
            <div className="flex items-center relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search shipments..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Shipment ID</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <div>{shipment.destination}</div>
                          <div className="text-xs text-gray-500">From: {shipment.departurePort}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{shipment.client}</div>
                      <div className="text-xs text-gray-500">{shipment.contract}</div>
                    </TableCell>
                    <TableCell>{shipment.volume}</TableCell>
                    <TableCell>
                      <div>{shipment.carrier}</div>
                      <div className="text-xs text-gray-500">{shipment.vessel}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[shipment.status]}>
                        <div className="flex items-center">
                          {statusIcons[shipment.status]}
                          <span>
                            {shipment.status === 'in-transit' ? 'In Transit' :
                             shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                          </span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{shipment.eta}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <span>Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Shipment Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Active Shipment Timeline - EQ-2453</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-blue-200"></div>
            
            <div className="space-y-6">
              {[
                { 
                  date: '2023-12-05', 
                  event: 'Departed from Port of Mombasa', 
                  details: 'Vessel: MSC Hamburg, Container: MSDU7654321',
                  status: 'complete'
                },
                { 
                  date: '2023-12-11', 
                  event: 'Passed Suez Canal', 
                  details: 'Transit completed in 2 days',
                  status: 'complete'
                },
                { 
                  date: '2023-12-18', 
                  event: 'Mediterranean Sea Transit', 
                  details: 'Current position: 36.5°N, 15.2°E',
                  status: 'in-progress'
                },
                { 
                  date: '2023-12-25', 
                  event: 'Scheduled Arrival at Hamburg Port', 
                  details: 'Terminal: Hamburger Hafen und Logistik AG',
                  status: 'pending'
                },
                { 
                  date: '2023-12-27', 
                  event: 'Customs Clearance', 
                  details: 'Documentation prepared and submitted',
                  status: 'pending'
                },
                { 
                  date: '2023-12-30', 
                  event: 'Delivery to Client Warehouse', 
                  details: 'European Coffee Roasters GmbH, Hamburg',
                  status: 'pending'
                }
              ].map((item, index) => (
                <div key={index} className="relative pl-10">
                  <div className={`absolute left-0 rounded-full h-10 w-10 flex items-center justify-center 
                    ${item.status === 'complete' ? 'bg-green-100' : 
                      item.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {item.status === 'complete' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : item.status === 'in-progress' ? (
                      <Ship className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    <h4 className="font-medium mt-1">{item.event}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentTracking;
