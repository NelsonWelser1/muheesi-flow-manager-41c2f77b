import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, Plus, FileText, Download, Eye, 
  Ship, MapPin, Calendar, Clock, Filter,
  ExternalLink, CheckCircle, AlertCircle, Package,
  FileCode, ChevronDown, Printer
} from 'lucide-react';
import ShipmentTemplates from './components/ShipmentTemplates';
import NewShipmentForm from './components/NewShipmentForm';
import { useShipments } from './hooks/useShipments';
import { format } from 'date-fns';
import GlobalShipmentMap from './components/GlobalShipmentMap';
import { useToast } from "@/components/ui/use-toast";
import { generateAndDownloadPDF } from '@/utils/exports/pdfExportUtils';

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
  const [selectedShipment, setSelectedShipment] = useState(null);
  const { shipments, isLoading, updateShipment } = useShipments();
  const { toast } = useToast();
  
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

  const handleStatusChange = async (shipmentId, newStatus) => {
    try {
      const result = await updateShipment(shipmentId, { 
        status: newStatus,
        last_update: new Date().toISOString().split('T')[0]
      });
      
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Shipment status has been changed to ${statusLabels[newStatus] || newStatus}`,
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update shipment status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewShipment = (shipment) => {
    setSelectedShipment(shipment);
    toast({
      title: "Viewing Shipment",
      description: `Viewing details for shipment ${shipment.shipment_id}`,
    });
    
    const viewWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!viewWindow) {
      toast({
        title: "View Failed",
        description: "Pop-up blocked. Please allow pop-ups and try again.",
        variant: "destructive",
      });
      return;
    }
    
    viewWindow.document.write(`
      <html>
        <head>
          <title>Shipment ${shipment.shipment_id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            h1 { color: #2563eb; margin-bottom: 20px; }
            .status-badge { 
              display: inline-block; 
              padding: 5px 10px; 
              border-radius: 4px; 
              font-weight: 500; 
              margin-left: 10px;
              font-size: 14px;
            }
            .status-in-transit { background: #dbeafe; color: #1e40af; }
            .status-loading { background: #fef3c7; color: #92400e; }
            .status-preparing { background: #f3e8ff; color: #6b21a8; }
            .status-delivered { background: #dcfce7; color: #166534; }
            .status-scheduled { background: #f3f4f6; color: #1f2937; }
            .status-delayed { background: #fee2e2; color: #b91c1c; }
            .header { display: flex; align-items: center; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #4b5563; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
            .detail-row { display: flex; margin-bottom: 10px; }
            .detail-label { width: 200px; font-weight: 600; color: #4b5563; }
            .detail-value { flex: 1; }
            .instructions { 
              background-color: #f9fafb; 
              border-left: 4px solid #3b82f6; 
              padding: 15px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Shipment Details: ${shipment.shipment_id}</h1>
            <span class="status-badge status-${shipment.status || 'scheduled'}">
              ${statusLabels[shipment.status] || shipment.status || 'Unknown'}
            </span>
          </div>
          
          <div class="section">
            <h2>General Information</h2>
            <div class="detail-row">
              <div class="detail-label">Container</div>
              <div class="detail-value">${shipment.container || 'N/A'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Volume</div>
              <div class="detail-value">${shipment.volume || 'N/A'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Last Updated</div>
              <div class="detail-value">${shipment.last_update || 'N/A'}</div>
            </div>
          </div>
          
          <div class="section">
            <h2>Route & Schedule</h2>
            <div class="detail-row">
              <div class="detail-label">Departure Date</div>
              <div class="detail-value">${format(new Date(shipment.departure_date), 'MMM d, yyyy')}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Estimated Arrival</div>
              <div class="detail-value">${format(new Date(shipment.eta), 'MMM d, yyyy')}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Destination</div>
              <div class="detail-value">${shipment.destination || 'N/A'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Route</div>
              <div class="detail-value">${shipment.route || 'N/A'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Vessel</div>
              <div class="detail-value">${shipment.vessel || 'N/A'}</div>
            </div>
          </div>
          
          <div class="section">
            <h2>Client Information</h2>
            <div class="detail-row">
              <div class="detail-label">Client</div>
              <div class="detail-value">${shipment.client || 'N/A'}</div>
            </div>
          </div>
          
          ${shipment.special_instructions ? `
          <div class="section">
            <h2>Special Instructions</h2>
            <div class="instructions">
              ${shipment.special_instructions}
            </div>
          </div>
          ` : ''}
          
          <div style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px;">
            Equator Export Management System - ${new Date().toISOString().split('T')[0]}
          </div>
        </body>
      </html>
    `);
    
    viewWindow.document.close();
  };

  const handleDownloadShipment = (shipment) => {
    const columns = [
      'Shipment ID', 'Status', 'Container', 'Volume', 
      'Departure Date', 'ETA', 'Destination', 'Vessel', 
      'Route', 'Client', 'Special Instructions'
    ];
    
    const rows = [[
      shipment.shipment_id,
      statusLabels[shipment.status] || shipment.status,
      shipment.container,
      shipment.volume || 'N/A',
      format(new Date(shipment.departure_date), 'MMM d, yyyy'),
      format(new Date(shipment.eta), 'MMM d, yyyy'),
      shipment.destination || 'N/A',
      shipment.vessel || 'N/A',
      shipment.route || 'N/A',
      shipment.client || 'N/A',
      shipment.special_instructions || 'N/A'
    ]];
    
    const success = generateAndDownloadPDF(
      [shipment], 
      `Shipment-${shipment.shipment_id}`, 
      `Shipment Details: ${shipment.shipment_id}`,
      columns,
      rows
    );
    
    if (success) {
      toast({
        title: "Download Started",
        description: `Shipment ${shipment.shipment_id} details have been downloaded`,
      });
    } else {
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrintShipment = (shipment) => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Print Failed",
        description: "Pop-up blocked. Please allow pop-ups and try again.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipment ${shipment.shipment_id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2563eb; }
            .shipment-header { display: flex; justify-content: space-between; align-items: center; }
            .status { padding: 5px 10px; border-radius: 4px; font-weight: bold; }
            .status.in-transit { background: #dbeafe; color: #1e40af; }
            .status.loading { background: #fef3c7; color: #92400e; }
            .status.preparing { background: #f3e8ff; color: #6b21a8; }
            .status.delivered { background: #dcfce7; color: #166534; }
            .status.scheduled { background: #f3f4f6; color: #1f2937; }
            .status.delayed { background: #fee2e2; color: #b91c1c; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background-color: #f9fafb; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="shipment-header">
            <h1>Shipment Details: ${shipment.shipment_id}</h1>
            <span class="status ${shipment.status || 'scheduled'}">
              ${statusLabels[shipment.status] || shipment.status || 'Unknown'}
            </span>
          </div>
          
          <table>
            <tr>
              <th>Shipment ID</th>
              <td>${shipment.shipment_id}</td>
              <th>Container</th>
              <td>${shipment.container}</td>
            </tr>
            <tr>
              <th>Destination</th>
              <td>${shipment.destination || 'N/A'}</td>
              <th>Client</th>
              <td>${shipment.client || 'N/A'}</td>
            </tr>
            <tr>
              <th>Vessel</th>
              <td>${shipment.vessel || 'N/A'}</td>
              <th>Volume</th>
              <td>${shipment.volume || 'N/A'}</td>
            </tr>
            <tr>
              <th>Departure Date</th>
              <td>${format(new Date(shipment.departure_date), 'MMM d, yyyy')}</td>
              <th>ETA</th>
              <td>${format(new Date(shipment.eta), 'MMM d, yyyy')}</td>
            </tr>
            <tr>
              <th>Route</th>
              <td colspan="3">${shipment.route || 'N/A'}</td>
            </tr>
            <tr>
              <th>Special Instructions</th>
              <td colspan="3">${shipment.special_instructions || 'N/A'}</td>
            </tr>
          </table>
          
          <button onclick="window.print();return false;" style="margin-top: 20px; padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print
          </button>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
    
    toast({
      title: "Print Prepared",
      description: "Print dialog should open automatically",
    });
  };
  
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Badge 
                              className={`${statusColors[shipment.status] || "bg-gray-100 text-gray-800"} cursor-pointer hover:opacity-80 flex items-center gap-1`}
                            >
                              {statusLabels[shipment.status] || shipment.status || 'Unknown'}
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </Badge>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-[160px]">
                            <DropdownMenuItem onClick={() => handleStatusChange(shipment.id, 'scheduled')}>
                              <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                              Scheduled
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(shipment.id, 'preparing')}>
                              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                              Preparing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(shipment.id, 'loading')}>
                              <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                              Loading
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(shipment.id, 'in-transit')}>
                              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                              In Transit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(shipment.id, 'delivered')}>
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                              Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(shipment.id, 'delayed')}>
                              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                              Delayed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewShipment(shipment)}
                            title="View Shipment Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownloadShipment(shipment)}
                            title="Download Shipment Details"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handlePrintShipment(shipment)}
                            title="Print Shipment Details"
                          >
                            <Printer className="h-4 w-4" />
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
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Global Shipment Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GlobalShipmentMap shipments={shipments} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentTracking;
