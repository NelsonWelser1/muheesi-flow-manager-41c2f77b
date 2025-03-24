
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  LineChart, Cow, Package, Truck, Filter, BarChart2, Plus, Download, Printer
} from "lucide-react";

const DairyManagement = () => {
  const [activeTab, setActiveTab] = useState('milk-production');
  
  // Mock data for demonstration
  const milkData = [
    { id: 1, date: '2023-07-12', shift: 'Morning', quantity: '105 L', quality: 'A', notes: 'Normal production' },
    { id: 2, date: '2023-07-12', shift: 'Evening', quantity: '92 L', quality: 'A', notes: 'Slightly lower than expected' },
    { id: 3, date: '2023-07-11', shift: 'Morning', quantity: '110 L', quality: 'A', notes: 'Good production' },
    { id: 4, date: '2023-07-11', shift: 'Evening', quantity: '98 L', quality: 'B', notes: 'Quality issues - check feed' },
    { id: 5, date: '2023-07-10', shift: 'Morning', quantity: '103 L', quality: 'A', notes: 'Normal production' },
  ];
  
  const productData = [
    { id: 1, name: 'Fresh Milk', stock: '180 L', price: 'UGX 3,000/L' },
    { id: 2, name: 'Yogurt (Plain)', stock: '85 units', price: 'UGX 4,500/unit' },
    { id: 3, name: 'Yogurt (Flavored)', stock: '62 units', price: 'UGX 5,000/unit' },
    { id: 4, name: 'Cheese', stock: '24 kg', price: 'UGX 15,000/kg' },
    { id: 5, name: 'Ghee', stock: '18 L', price: 'UGX 25,000/L' },
  ];
  
  const cattleData = [
    { id: 'KF-001', breed: 'Holstein Friesian', age: '4 years', status: 'Lactating', production: '18 L/day' },
    { id: 'KF-002', breed: 'Jersey', age: '3 years', status: 'Lactating', production: '15 L/day' },
    { id: 'KF-014', breed: 'Holstein Friesian', age: '5 years', status: 'Lactating', production: '21 L/day' },
    { id: 'KF-023', breed: 'Guernsey', age: '2 years', status: 'Pregnant', production: 'N/A' },
    { id: 'KF-045', breed: 'Brown Swiss', age: '4 years', status: 'Lactating', production: '16 L/day' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cow className="mr-2 h-5 w-5" /> Dairy Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="milk-production">
              <LineChart className="mr-2 h-4 w-4" /> Milk Production
            </TabsTrigger>
            <TabsTrigger value="dairy-products">
              <Package className="mr-2 h-4 w-4" /> Dairy Products
            </TabsTrigger>
            <TabsTrigger value="cattle-management">
              <Cow className="mr-2 h-4 w-4" /> Cattle Management
            </TabsTrigger>
            <TabsTrigger value="distribution">
              <Truck className="mr-2 h-4 w-4" /> Distribution
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="milk-production" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Select defaultValue="week">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <BarChart2 className="mr-2 h-4 w-4" /> Analytics
                </Button>
                <Button variant="default" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> New Entry
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Quality Grade</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {milkData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.shift}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.quality === 'A' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {row.quality}
                        </span>
                      </TableCell>
                      <TableCell>{row.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end items-center space-x-2 mt-4">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="dairy-products" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Search products..." 
                  className="w-[250px]" 
                />
              </div>
              <Button variant="default" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Available Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productData.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Update Stock</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="cattle-management" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cattle</SelectItem>
                    <SelectItem value="lactating">Lactating</SelectItem>
                    <SelectItem value="pregnant">Pregnant</SelectItem>
                    <SelectItem value="dry">Dry</SelectItem>
                    <SelectItem value="calves">Calves</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Search by ID..." 
                  className="w-[200px]" 
                />
              </div>
              <Button variant="default" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Register Cattle
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cattle ID</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Milk Production</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cattleData.map((cattle) => (
                    <TableRow key={cattle.id}>
                      <TableCell className="font-medium">{cattle.id}</TableCell>
                      <TableCell>{cattle.breed}</TableCell>
                      <TableCell>{cattle.age}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cattle.status === 'Lactating' ? 'bg-green-100 text-green-800' : 
                          cattle.status === 'Pregnant' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {cattle.status}
                        </span>
                      </TableCell>
                      <TableCell>{cattle.production}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Details</Button>
                          <Button variant="outline" size="sm">Health</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Distribution Routes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">Mbarara Town Route</p>
                        <p className="text-sm text-muted-foreground">15 delivery points</p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">Kashari County Route</p>
                        <p className="text-sm text-muted-foreground">8 delivery points</p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">Isingiro Route</p>
                        <p className="text-sm text-muted-foreground">6 delivery points</p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Add New Route
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Today's Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
                      <div>
                        <p className="font-medium">Morning Delivery</p>
                        <p className="text-sm text-muted-foreground">6:00 AM • Completed</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        105L
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div>
                        <p className="font-medium">Afternoon Delivery</p>
                        <p className="text-sm text-muted-foreground">1:00 PM • In Progress</p>
                      </div>
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                        48L
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <div>
                        <p className="font-medium">Evening Delivery</p>
                        <p className="text-sm text-muted-foreground">5:30 PM • Scheduled</p>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                    <Button variant="outline" className="w-full">
                      View All Deliveries
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DairyManagement;
