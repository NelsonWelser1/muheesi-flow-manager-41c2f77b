
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, Plus, Download, Tractor, Plant, BarChart2, 
  Bug, Cloud, CloudRain, Filter, AlertTriangle
} from "lucide-react";

const BananaPlantation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [date, setDate] = useState(new Date());

  // Mock data for demonstration
  const plantationBlocks = [
    { id: 'B1', name: 'Block A', area: '4.5 acres', varieties: 'Kibuzi, Mpologoma', planted: '2021-05-15', status: 'Mature' },
    { id: 'B2', name: 'Block B', area: '3.2 acres', varieties: 'Musakala, Kibuzi', planted: '2022-01-10', status: 'Young' },
    { id: 'B3', name: 'Block C', area: '5.0 acres', varieties: 'Mpologoma, Nakitembe', planted: '2020-08-22', status: 'Mature' },
    { id: 'B4', name: 'Block D', area: '2.8 acres', varieties: 'Musakala, Nakabululu', planted: '2022-06-05', status: 'Young' },
    { id: 'B5', name: 'Block E', area: '3.5 acres', varieties: 'Kibuzi, Nakitembe', planted: '2021-11-18', status: 'Mature' },
  ];
  
  const harvestData = [
    { id: 1, date: '2023-07-10', block: 'Block A', bunches: 65, weight: '1,230 kg', quality: 'Good', notes: 'Normal harvest' },
    { id: 2, date: '2023-07-09', block: 'Block C', bunches: 72, weight: '1,450 kg', quality: 'Excellent', notes: 'Above average size' },
    { id: 3, date: '2023-07-06', block: 'Block E', bunches: 48, weight: '980 kg', quality: 'Good', notes: 'Some bunches smaller than usual' },
    { id: 4, date: '2023-07-03', block: 'Block A', bunches: 53, weight: '1,120 kg', quality: 'Fair', notes: 'Affected by recent drought' },
    { id: 5, date: '2023-07-01', block: 'Block C', bunches: 68, weight: '1,360 kg', quality: 'Good', notes: 'Normal harvest' },
  ];
  
  const maintenanceData = [
    { id: 1, date: '2023-07-11', block: 'Block B', activity: 'Weeding', status: 'Completed', notes: 'Manual weeding done' },
    { id: 2, date: '2023-07-08', block: 'Block D', activity: 'Pruning', status: 'Completed', notes: 'Removed damaged leaves' },
    { id: 3, date: '2023-07-15', block: 'Block A', activity: 'Mulching', status: 'Scheduled', notes: 'Need 20 bags of mulch' },
    { id: 4, date: '2023-07-18', block: 'Block C', activity: 'Desuckering', status: 'Scheduled', notes: 'Keep 3 suckers per mat' },
    { id: 5, date: '2023-07-05', block: 'Block E', activity: 'Fertilizer Application', status: 'Completed', notes: 'Applied NPK fertilizer' },
  ];
  
  const issuesData = [
    { id: 1, date: '2023-07-09', block: 'Block A', issue: 'Banana Weevils', severity: 'Moderate', status: 'In Treatment', action: 'Applied pesticide' },
    { id: 2, date: '2023-06-28', block: 'Block C', issue: 'Panama Disease', severity: 'High', status: 'Monitoring', action: 'Quarantined affected plants' },
    { id: 3, date: '2023-07-11', block: 'Block D', issue: 'Storm Damage', severity: 'Moderate', status: 'Resolved', action: 'Removed fallen plants' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plant className="mr-2 h-5 w-5" /> Banana Plantation Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart2 className="mr-2 h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="plantation">
              <Plant className="mr-2 h-4 w-4" /> Plantation Blocks
            </TabsTrigger>
            <TabsTrigger value="harvests">
              <Tractor className="mr-2 h-4 w-4" /> Harvests
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <Cloud className="mr-2 h-4 w-4" /> Maintenance
            </TabsTrigger>
            <TabsTrigger value="issues">
              <Bug className="mr-2 h-4 w-4" /> Issues & Diseases
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Total Plantation Area</span>
                    <span className="text-3xl font-bold">19.0 acres</span>
                    <span className="text-sm text-green-600">5 blocks managed</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">This Month's Harvest</span>
                    <span className="text-3xl font-bold">306 bunches</span>
                    <span className="text-sm text-green-600">6,140 kg total weight</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Active Issues</span>
                    <span className="text-3xl font-bold">2</span>
                    <span className="text-sm text-amber-600">1 high severity</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Tractor className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Harvested 65 bunches</p>
                        <p className="text-sm text-muted-foreground">Block A • July 10, 2023</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Cloud className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Applied fertilizer</p>
                        <p className="text-sm text-muted-foreground">Block E • July 5, 2023</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Bug className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Detected weevil infestation</p>
                        <p className="text-sm text-muted-foreground">Block A • July 9, 2023</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <CloudRain className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Irrigation maintenance</p>
                        <p className="text-sm text-muted-foreground">All Blocks • July 7, 2023</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Tractor className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Scheduled Harvest</p>
                        <p className="text-sm text-muted-foreground">Block B • July 15, 2023</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Cloud className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Mulching</p>
                        <p className="text-sm text-muted-foreground">Block A • July 15, 2023</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <CloudRain className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Irrigation System Check</p>
                        <p className="text-sm text-muted-foreground">All Blocks • July 20, 2023</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Cloud className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Desuckering</p>
                        <p className="text-sm text-muted-foreground">Block C • July 18, 2023</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="plantation" className="space-y-4">
            <div className="flex justify-end">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Block
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Block ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Banana Varieties</TableHead>
                        <TableHead>Planting Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plantationBlocks.map((block) => (
                        <TableRow key={block.id}>
                          <TableCell className="font-medium">{block.id}</TableCell>
                          <TableCell>{block.name}</TableCell>
                          <TableCell>{block.area}</TableCell>
                          <TableCell>{block.varieties}</TableCell>
                          <TableCell>{block.planted}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              block.status === 'Mature' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {block.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Details</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Plantation Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Block Name</label>
                        <Input placeholder="Enter block name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Area (acres)</label>
                        <Input type="number" placeholder="Enter area" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Banana Varieties</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select varieties" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kibuzi">Kibuzi</SelectItem>
                          <SelectItem value="mpologoma">Mpologoma</SelectItem>
                          <SelectItem value="musakala">Musakala</SelectItem>
                          <SelectItem value="nakitembe">Nakitembe</SelectItem>
                          <SelectItem value="nakabululu">Nakabululu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Planting Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea placeholder="Enter any additional notes" />
                    </div>
                    
                    <Button type="submit" className="w-full">Save Plantation Data</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Plantation Map</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[300px]">
                  <div className="text-center text-muted-foreground">
                    <p>Interactive plantation map will be displayed here</p>
                    <p className="text-sm">(Plantation mapping feature coming soon)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="harvests" className="space-y-4">
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
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Record Harvest
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Block</TableHead>
                        <TableHead>Bunches</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {harvestData.map((harvest) => (
                        <TableRow key={harvest.id}>
                          <TableCell>{harvest.date}</TableCell>
                          <TableCell>{harvest.block}</TableCell>
                          <TableCell>{harvest.bunches}</TableCell>
                          <TableCell>{harvest.weight}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              harvest.quality === 'Excellent' ? 'bg-green-100 text-green-800' :
                              harvest.quality === 'Good' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {harvest.quality}
                            </span>
                          </TableCell>
                          <TableCell>{harvest.notes}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Harvest Trends</CardTitle>
              </CardHeader>
              <CardContent className="min-h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>Harvest trends chart will be displayed here</p>
                  <p className="text-sm">(Charts coming soon)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blocks</SelectItem>
                    <SelectItem value="a">Block A</SelectItem>
                    <SelectItem value="b">Block B</SelectItem>
                    <SelectItem value="c">Block C</SelectItem>
                    <SelectItem value="d">Block D</SelectItem>
                    <SelectItem value="e">Block E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Schedule Maintenance
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Block</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintenanceData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.block}</TableCell>
                          <TableCell>{item.activity}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell>{item.notes}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {item.status === 'Scheduled' ? (
                                <Button variant="outline" size="sm">Complete</Button>
                              ) : (
                                <Button variant="outline" size="sm">View</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Regular Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <span>Weeding</span>
                      <span className="text-sm">Every 2 weeks</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <span>Pruning</span>
                      <span className="text-sm">Monthly</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <span>Fertilizer Application</span>
                      <span className="text-sm">Quarterly</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <span>Mulching</span>
                      <span className="text-sm">Twice a year</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Supplies Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <span>Fertilizer</span>
                      <span className="text-sm">24 bags</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <span>Mulch Material</span>
                      <span className="text-sm">15 bags</span>
                    </div>
                    <div className="flex justify-between p-3 bg-amber-50 rounded-md">
                      <span>Pesticides</span>
                      <span className="text-sm text-amber-800">Low (3 units)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <span>Tools</span>
                      <span className="text-sm">Adequate</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Maintenance Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <span>Workers Assigned</span>
                      <span className="text-sm">8 people</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <span>Supervisor</span>
                      <span className="text-sm">James Mukasa</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <span>Last Training</span>
                      <span className="text-sm">June 15, 2023</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Team Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="issues" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Report New Issue
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date Reported</TableHead>
                        <TableHead>Block</TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action Taken</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issuesData.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell>{issue.date}</TableCell>
                          <TableCell>{issue.block}</TableCell>
                          <TableCell>{issue.issue}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              issue.severity === 'High' ? 'bg-red-100 text-red-800' :
                              issue.severity === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {issue.severity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                              issue.status === 'In Treatment' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {issue.status}
                            </span>
                          </TableCell>
                          <TableCell>{issue.action}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Details</Button>
                              {issue.status !== 'Resolved' && (
                                <Button variant="outline" size="sm">Update</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" /> Common Banana Diseases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium">Panama Disease (Fusarium Wilt)</h3>
                      <p className="text-sm text-muted-foreground mt-1">Yellowing of leaves, wilting, and death of the plant. Infected plants should be removed and destroyed.</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium">Black Sigatoka</h3>
                      <p className="text-sm text-muted-foreground mt-1">Black spots on leaves that grow and eventually kill the leaf. Regular fungicide application helps control this disease.</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium">Banana Bacterial Wilt</h3>
                      <p className="text-sm text-muted-foreground mt-1">Yellowing and wilting of leaves, oozing of yellowish bacterial exudate. Infected plants must be removed and destroyed.</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium">Banana Weevil</h3>
                      <p className="text-sm text-muted-foreground mt-1">Insect pest that bores into the corm and pseudostem. Apply appropriate pesticides and practice good field sanitation.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Treatment Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div>
                        <p className="font-medium">Weevil Treatment</p>
                        <p className="text-sm text-muted-foreground">Block A • July 16, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div>
                        <p className="font-medium">Fungicide Application</p>
                        <p className="text-sm text-muted-foreground">Block C • July 20, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
                      <div>
                        <p className="font-medium">Disease Monitoring</p>
                        <p className="text-sm text-muted-foreground">All Blocks • Weekly</p>
                      </div>
                      <Button variant="outline" size="sm">View Schedule</Button>
                    </div>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Schedule New Treatment
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

export default BananaPlantation;
