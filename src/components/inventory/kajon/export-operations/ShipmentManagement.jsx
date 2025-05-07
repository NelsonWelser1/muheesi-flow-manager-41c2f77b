
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ship, Calendar, ArrowRight, MapPin, Package, FileText, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample shipments data
const shipments = [
  {
    id: "SHP-2023-001",
    order: "EXP-2023-001",
    client: "Equata Coffee Limited",
    destination: "Rotterdam, Netherlands",
    product: "Robusta Grade 1",
    quantity: "35 MT",
    departureDate: "2023-11-20",
    arrivalDate: "2024-01-05",
    status: "Preparing",
    documents: ["Bill of Lading", "Phytosanitary Certificate", "Certificate of Origin"],
    progress: 25
  },
  {
    id: "SHP-2023-002",
    order: "EXP-2023-002",
    client: "Nordic Roasters Group",
    destination: "Hamburg, Germany",
    product: "Arabica AA",
    quantity: "20 MT",
    departureDate: "2023-11-15",
    arrivalDate: "2023-12-28",
    status: "In Transit",
    documents: ["Bill of Lading", "Certificate of Origin", "Coffee Quality Certificate"],
    progress: 60
  },
  {
    id: "SHP-2023-003",
    order: "EXP-2023-003",
    client: "Coffee Bean Co.",
    destination: "New York, USA",
    product: "Robusta Peaberry",
    quantity: "18 MT",
    departureDate: "2023-12-05",
    arrivalDate: "2024-01-20",
    status: "Processing",
    documents: ["Bill of Lading", "Certificate of Origin"],
    progress: 15
  },
  {
    id: "SHP-2023-004",
    order: "EXP-2023-005",
    client: "Global Coffee Solutions",
    destination: "Barcelona, Spain",
    product: "Robusta Grade 2",
    quantity: "40 MT",
    departureDate: "2023-10-25",
    arrivalDate: "2023-12-10",
    status: "Delivered",
    documents: ["Bill of Lading", "Certificate of Origin", "Coffee Quality Certificate"],
    progress: 100
  }
];

const ShipmentManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredShipments = shipments.filter(shipment => {
    if (activeTab === "all") return true;
    return shipment.status.toLowerCase() === activeTab.toLowerCase().replace('-', ' ');
  });
  
  // Function to get color scheme based on shipment status
  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "bg-purple-100 text-purple-800";
      case "Preparing": return "bg-amber-100 text-amber-800";
      case "In Transit": return "bg-blue-100 text-blue-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Delayed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Function to get progress color based on shipment status
  const getProgressColor = (status) => {
    switch (status) {
      case "Processing": return "bg-purple-500";
      case "Preparing": return "bg-amber-500";
      case "In Transit": return "bg-blue-500";
      case "Delivered": return "bg-green-500";
      case "Delayed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Ship className="mr-2 h-6 w-6" />
            Shipment Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Track and manage coffee export shipments worldwide
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" />
            View All Shipments
          </Button>
          <Button>
            <Ship className="mr-2 h-4 w-4" />
            New Shipment
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Current Year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Actively Monitored</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Export Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">215 MT</div>
            <p className="text-xs text-muted-foreground">Total Volume Shipped</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Transit Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 days</div>
            <p className="text-xs text-muted-foreground">Farm to Destination</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Shipment Tracking</CardTitle>
          <CardDescription>
            Monitor international coffee shipments and documentation
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="preparing">Preparing</TabsTrigger>
              <TabsTrigger value="in-transit">In Transit</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
            
            <div className="space-y-6">
              {filteredShipments.length === 0 ? (
                <div className="text-center py-10">
                  <Ship className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No shipments found</h3>
                  <p className="text-sm text-muted-foreground">
                    No shipments matching the selected filter
                  </p>
                </div>
              ) : (
                filteredShipments.map((shipment) => (
                  <Card key={shipment.id} className="overflow-hidden">
                    <div className="border-b">
                      <div className="flex flex-col md:flex-row justify-between p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium">{shipment.id}</h3>
                            <Badge className={`ml-2 ${getStatusColor(shipment.status)}`}>
                              {shipment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Order: {shipment.order} • Client: {shipment.client}
                          </p>
                        </div>
                        <div className="flex mt-2 md:mt-0 gap-3">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Documents
                          </Button>
                          <Button size="sm">
                            Track Shipment
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>Kampala, Uganda</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{shipment.destination}</span>
                            </div>
                          </div>
                          <Progress 
                            value={shipment.progress} 
                            className={`h-2.5 ${getProgressColor(shipment.status)}`} 
                          />
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {shipment.departureDate}
                            </div>
                            <div className="flex items-center">
                              <ArrowRight className="h-3 w-3 mx-1" />
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {shipment.arrivalDate}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-row md:flex-col justify-between md:border-l md:pl-4 md:w-1/4">
                          <div>
                            <p className="text-xs text-muted-foreground">Product</p>
                            <p className="font-medium">{shipment.product}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Quantity</p>
                            <p className="font-medium">{shipment.quantity}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Documents</p>
                            <p className="font-medium">{shipment.documents.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      {shipment.status === "In Transit" && (
                        <div className="flex items-center px-3 py-2 bg-blue-50 text-blue-800 rounded-md text-sm">
                          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>This shipment is currently at sea. Estimated arrival in 18 days.</span>
                        </div>
                      )}
                      
                      {shipment.status === "Preparing" && (
                        <div className="flex items-center px-3 py-2 bg-amber-50 text-amber-800 rounded-md text-sm">
                          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>Customs clearance in progress. Export documents being processed.</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Shipments</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments
                  .filter(s => s.status === "Processing" || s.status === "Preparing")
                  .map(shipment => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.id}</TableCell>
                      <TableCell>{shipment.client}</TableCell>
                      <TableCell>{shipment.departureDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Shipping Routes</CardTitle>
            <CardDescription>Active export corridors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Kampala → Rotterdam</p>
                  <p className="text-sm text-muted-foreground">Via Mombasa Port</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Kampala → Hamburg</p>
                  <p className="text-sm text-muted-foreground">Via Dar es Salaam Port</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Kampala → New York</p>
                  <p className="text-sm text-muted-foreground">Via Mombasa Port</p>
                </div>
                <Badge variant="outline">Planned</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Kampala → Singapore</p>
                  <p className="text-sm text-muted-foreground">Via Dar es Salaam Port</p>
                </div>
                <Badge variant="outline">Planned</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShipmentManagement;
