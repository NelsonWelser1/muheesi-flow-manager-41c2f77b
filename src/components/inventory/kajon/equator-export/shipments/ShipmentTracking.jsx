
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
import NewShipmentForm from './components/NewShipmentForm';
import { useShipments } from './hooks/useShipments';
import { format } from 'date-fns';

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
  const [showNewShipmentForm, setShowNewShipmentForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { shipments, isLoading } = useShipments();
  
  const statusCounts = shipments.reduce((counts, shipment) => {
    const status = shipment.status || 'unknown';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  
  const filteredShipments = filterStatus === 'all' 
    ? shipments 
    : shipments.filter(shipment => shipment.status === filterStatus);
  
  const searchFilteredShipments = filteredShipments.filter(shipment => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (shipment.shipment_id?.toLowerCase().includes(searchLower)) ||
      (shipment.destination?.toLowerCase().includes(searchLower)) ||
      (shipment.client?.toLowerCase().includes(searchLower)) ||
      (shipment.vessel?.toLowerCase().includes(searchLower)) ||
      (shipment.status?.toLowerCase().includes(searchLower))
    );
  });
  
  if (showTemplates) {
    return <ShipmentTemplates onBack={() => setShowTemplates(false)} />;
  }

  if (showNewShipmentForm) {
    return <NewShipmentForm onCancel={() => setShowNewShipmentForm(false)} />;
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
          <Button className="flex items-center gap-1" onClick={() => setShowNewShipmentForm(true)}>
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
                <p className="text-2xl font-bold text-blue-900">{statusCounts['in-transit'] || 0}</p>
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
                <p className="text-2xl font-bold text-amber-900">{statusCounts['loading'] || 0}</p>
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
                <p className="text-2xl font-bold text-purple-900">{statusCounts['preparing'] || 0}</p>
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
                <p className="text-2xl font-bold text-green-900">{statusCounts['delivered'] || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{statusCounts['scheduled'] || 0}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Urgent Alert - Only show if there's a relevant shipment */}
      {shipments.some(s => s.special_instructions?.includes('urgent') || s.status === 'delayed') && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <span className="text-orange-800">
              Urgent documentation or delayed shipment requires attention
            </span>
            <Button size="sm" variant="outline" className="ml-auto border-orange-300 text-orange-700 hover:bg-orange-100">
              View Details
            </Button>
          </CardContent>
        </Card>
      )}
      
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
                <Input 
                  placeholder="Search shipments..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : searchFilteredShipments.length === 0 ? (
            <div className="text-center py-8">
              <Ship className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No shipments found</h3>
              <p className="text-gray-500 mt-1 mb-4">
                {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filter' : 'Create your first shipment to get started'}
              </p>
              <Button onClick={() => setShowNewShipmentForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Shipment
              </Button>
            </div>
          ) : (
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
                  {searchFilteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.shipment_id}</TableCell>
                      <TableCell>{shipment.destination || 'N/A'}</TableCell>
                      <TableCell>{shipment.client || 'N/A'}</TableCell>
                      <TableCell>{shipment.volume || 'N/A'}</TableCell>
                      <TableCell>{shipment.vessel || 'N/A'}</TableCell>
                      <TableCell>
                        {shipment.departure_date ? format(new Date(shipment.departure_date), 'MMM d, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {shipment.eta ? format(new Date(shipment.eta), 'MMM d, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[shipment.status] || "bg-gray-100 text-gray-800"}>
                          {statusLabels[shipment.status] || shipment.status || 'Unknown'}
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
          )}
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
