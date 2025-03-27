import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, Plus, FileText, Download, Eye, 
  Ship, MapPin, Calendar, Clock, Filter,
  ExternalLink, CheckCircle, AlertCircle, Package,
  FileCode
} from 'lucide-react';
import ShipmentTemplates from './components/ShipmentTemplates';

// Sample shipment data
const shipments = [
  {
    id: 'EQ-2453',
    destination: 'Hamburg, Germany',
    client: 'European Coffee Roasters GmbH',
    departureDate: '2023-12-10',
    status: 'in-transit',
    eta: '2024-01-15',
    container: '20ft',
    volume: '18 tons',
    vessel: 'MSC Augusta',
    route: 'Mombasa → Suez Canal → Rotterdam → Hamburg',
    lastUpdate: '2023-12-25'
  },
  {
    id: 'EQ-2455',
    destination: 'New York, USA',
    client: 'Artisan Bean Co.',
    departureDate: '2023-12-18',
    status: 'loading',
    eta: '2024-01-25',
    container: '40ft',
    volume: '24 tons',
    vessel: 'Maersk Nebula',
    route: 'Mombasa → Cape Town → New York',
    lastUpdate: '2023-12-24'
  },
  {
    id: 'EQ-2458',
    destination: 'Tokyo, Japan',
    client: 'Tokyo Coffee Imports',
    departureDate: '2024-01-05',
    status: 'preparing',
    eta: '2024-02-10',
    container: '20ft',
    volume: '16 tons',
    vessel: 'NYK Hermes',
    route: 'Mombasa → Singapore → Tokyo',
    lastUpdate: '2023-12-20'
  },
  {
    id: 'EQ-2451',
    destination: 'Dubai, UAE',
    client: 'Middle East Coffee Trading LLC',
    departureDate: '2023-11-15',
    status: 'delivered',
    eta: '2023-12-10',
    container: '40ft',
    volume: '22 tons',
    vessel: 'CMA CGM Rhone',
    route: 'Mombasa → Jeddah → Dubai',
    lastUpdate: '2023-12-12'
  },
  {
    id: 'EQ-2460',
    destination: 'Amsterdam, Netherlands',
    client: 'Nordic Coffee Collective',
    departureDate: '2024-01-10',
    status: 'scheduled',
    eta: '2024-02-05',
    container: '20ft',
    volume: '15 tons',
    vessel: 'MSC Sarah',
    route: 'Mombasa → Suez Canal → Rotterdam → Amsterdam',
    lastUpdate: '2023-12-22'
  }
];

const statusColors = {
  'in-transit': "bg-blue-100 text-blue-800",
  'loading': "bg-amber-100 text-amber-800",
  'preparing': "bg-purple-100 text-purple-800",
  'delivered': "bg-green-100 text-green-800",
  'scheduled': "bg-gray-100 text-gray-800",
  'delayed': "bg-red-100 text-red-800"
};

const statusLabels = {
  'in-transit': "In Transit",
  'loading': "Loading",
  'preparing': "Preparing",
  'delivered': "Delivered",
  'scheduled': "Scheduled",
  'delayed': "Delayed"
};

const ShipmentTracking = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTemplates, setShowTemplates] = useState(false);
  
  const filteredShipments = filterStatus === 'all' 
    ? shipments 
    : shipments.filter(shipment => shipment.status === filterStatus);
  
  if (showTemplates) {
    return <ShipmentTemplates onBack={() => setShowTemplates(false)} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Shipment Tracking</h2>
          <p className="text-gray-500 text-sm">Monitor and manage global coffee shipments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1" onClick={() => setShowTemplates(true)}>
            <FileCode className="h-4 w-4" />
            <span>Shipment Templates</span>
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
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700">In Transit</p>
                <p className="text-2xl font-bold text-blue-900">3</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Ship className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-700">Loading</p>
                <p className="text-2xl font-bold text-amber-900">1</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Package className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-700">Preparing</p>
                <p className="text-2xl font-bold text-purple-900">1</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-purple-700" />
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
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Urgent Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <span className="text-orange-800">
            Shipment EQ-2453 requires urgent documentation - Due in 48 hours
          </span>
          <Button size="sm" variant="outline" className="ml-auto border-orange-300 text-orange-700 hover:bg-orange-100">
            View Details
          </Button>
        </CardContent>
      </Card>
      
      {/* Shipments Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5 text-blue-600" />
              <span>Active Shipments</span>
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search shipments..." className="pl-8" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="loading">Loading</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
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
                  <TableHead>Vessel</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell>{shipment.client}</TableCell>
                    <TableCell>{shipment.volume}</TableCell>
                    <TableCell>{shipment.vessel}</TableCell>
                    <TableCell>{shipment.departureDate}</TableCell>
                    <TableCell>{shipment.eta}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[shipment.status]}>
                        {statusLabels[shipment.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Shipment Map Placeholder */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Global Shipment Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-100 h-80 flex items-center justify-center rounded-md">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600">Interactive Global Shipment Map</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Track shipments in real-time across global trade routes
              </p>
              <Button variant="outline" className="mt-4">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Full Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentTracking;
