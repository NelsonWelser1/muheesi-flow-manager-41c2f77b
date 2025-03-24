import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Plus, PlusCircle, Save, Search, Filter, BarChart, LineChart, Tractor, Leaf, LineChart as LineChartIcon } from "lucide-react";
import { format, subDays } from 'date-fns';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as ReBarChart, Bar } from 'recharts';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const BananaPlantation = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Harvest records mock data
  const [harvestRecords, setHarvestRecords] = useState([
    {
      id: 'HAR001',
      date: subDays(new Date(), 2),
      block: 'Block A',
      variety: 'Matooke',
      bunches: 25,
      averageWeight: 18,
      totalWeight: 450,
      quality: 'Excellent',
      harvestedBy: 'Team 1',
      notes: 'Excellent quality bunches, high market value'
    },
    {
      id: 'HAR002',
      date: subDays(new Date(), 5),
      block: 'Block B',
      variety: 'Gonja',
      bunches: 15,
      averageWeight: 12,
      totalWeight: 180,
      quality: 'Good',
      harvestedBy: 'Team 2',
      notes: 'Good quality, some bunches affected by mild wind damage'
    },
    {
      id: 'HAR003',
      date: subDays(new Date(), 8),
      block: 'Block C',
      variety: 'Matooke',
      bunches: 30,
      averageWeight: 20,
      totalWeight: 600,
      quality: 'Excellent',
      harvestedBy: 'Team 1',
      notes: 'Premium quality harvest'
    },
    {
      id: 'HAR004',
      date: subDays(new Date(), 12),
      block: 'Block A',
      variety: 'Sweet Banana',
      bunches: 18,
      averageWeight: 10,
      totalWeight: 180,
      quality: 'Good',
      harvestedBy: 'Team 3',
      notes: 'Ripe and ready for immediate market'
    },
    {
      id: 'HAR005',
      date: subDays(new Date(), 15),
      block: 'Block D',
      variety: 'Matooke',
      bunches: 22,
      averageWeight: 19,
      totalWeight: 418,
      quality: 'Good',
      harvestedBy: 'Team 2',
      notes: 'Standard quality harvest'
    }
  ]);
  
  // Plantation blocks mock data
  const [plantationBlocks, setPlantationBlocks] = useState([
    {
      id: 'Block A',
      area: 2.5,
      plants: 1250,
      variety: 'Matooke',
      planted: '2021-05-10',
      lastMaintenance: '2023-06-28',
      status: 'productive',
      notes: 'High-yielding block, well-maintained'
    },
    {
      id: 'Block B',
      area: 1.8,
      plants: 900,
      variety: 'Gonja',
      planted: '2021-08-15',
      lastMaintenance: '2023-07-05',
      status: 'productive',
      notes: 'Good performance, scheduled for expansion'
    },
    {
      id: 'Block C',
      area: 2.2,
      plants: 1100,
      variety: 'Matooke',
      planted: '2022-02-20',
      lastMaintenance: '2023-07-10',
      status: 'productive',
      notes: 'Newer plants showing excellent growth'
    },
    {
      id: 'Block D',
      area: 1.5,
      plants: 750,
      variety: 'Mixed',
      planted: '2022-06-08',
      lastMaintenance: '2023-06-25',
      status: 'growing',
      notes: 'Mixed varieties for diversification'
    },
    {
      id: 'Block E',
      area: 2.0,
      plants: 1000,
      variety: 'Sweet Banana',
      planted: '2023-01-15',
      lastMaintenance: '2023-07-12',
      status: 'growing',
      notes: 'New plantation area, plants establishing well'
    }
  ]);
  
  // Maintenance records mock data
  const [maintenanceRecords, setMaintenanceRecords] = useState([
    {
      id: 'MTN001',
      date: subDays(new Date(), 3),
      block: 'Block A',
      activity: 'Weeding',
      team: 'Maintenance Team 1',
      status: 'completed',
      notes: 'Complete weeding of the block'
    },
    {
      id: 'MTN002',
      date: subDays(new Date(), 5),
      block: 'Block B',
      activity: 'Pruning',
      team: 'Maintenance Team 2',
      status: 'completed',
      notes: 'Removed suckers and dead leaves'
    },
    {
      id: 'MTN003',
      date: subDays(new Date(), 7),
      block: 'Block C',
      activity: 'Fertilization',
      team: 'Maintenance Team 1',
      status: 'completed',
      notes: 'Applied organic fertilizer'
    },
    {
      id: 'MTN004',
      date: subDays(new Date(), 10),
      block: 'Block D',
      activity: 'Pest Control',
      team: 'Pest Control Team',
      status: 'completed',
      notes: 'Preventive treatment against weevils'
    },
    {
      id: 'MTN005',
      date: subDays(new Date(), 14),
      block: 'Block A',
      activity: 'Mulching',
      team: 'Maintenance Team 2',
      status: 'completed',
      notes: 'Applied fresh mulch around plants'
    }
  ]);
  
  // Form states
  const [harvestForm, setHarvestForm] = useState({
    date: new Date(),
    block: '',
    variety: '',
    bunches: '',
    averageWeight: '',
    quality: 'Good',
    harvestedBy: '',
    notes: ''
  });
  
  const [maintenanceForm, setMaintenanceForm] = useState({
    date: new Date(),
    block: '',
    activity: '',
    team: '',
    notes: ''
  });
  
  // Filter records based on search term
  const filteredHarvestRecords = harvestRecords.filter(record => 
    record.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredMaintenanceRecords = maintenanceRecords.filter(record => 
    record.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate statistics
  const totalPlants = plantationBlocks.reduce((sum, block) => sum + block.plants, 0);
  const totalArea = plantationBlocks.reduce((sum, block) => sum + block.area, 0);
  const totalHarvest = harvestRecords.reduce((sum, record) => sum + record.totalWeight, 0);
  
  // Chart data
  const harvestTrendData = [
    { month: 'Jan', harvest: 1200 },
    { month: 'Feb', harvest: 1500 },
    { month: 'Mar', harvest: 1800 },
    { month: 'Apr', harvest: 1600 },
    { month: 'May', harvest: 2100 },
    { month: 'Jun', harvest: 1900 },
    { month: 'Jul', harvest: 2200 }
  ];
  
  const blockPerformanceData = plantationBlocks.map(block => ({
    name: block.id,
    plants: block.plants,
    area: block.area * 100, // Scaled for visualization
    status: block.status === 'productive' ? 100 : 50 // Simple status representation
  }));
  
  // Handle form input change
  const handleHarvestInputChange = (e) => {
    const { name, value } = e.target;
    setHarvestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleMaintenanceInputChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleHarvestSelectChange = (name, value) => {
    setHarvestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleMaintenanceSelectChange = (name, value) => {
    setMaintenanceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle date change
  const handleHarvestDateChange = (date) => {
    setHarvestForm(prev => ({
      ...prev,
      date: date
    }));
  };
  
  const handleMaintenanceDateChange = (date) => {
    setMaintenanceForm(prev => ({
      ...prev,
      date: date
    }));
  };
  
  // Submit harvest form
  const handleHarvestSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!harvestForm.block || !harvestForm.variety || !harvestForm.bunches || !harvestForm.averageWeight) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const bunches = Number(harvestForm.bunches);
    const averageWeight = Number(harvestForm.averageWeight);
    
    // Create new harvest record
    const newHarvestRecord = {
      id: `HAR${String(harvestRecords.length + 1).padStart(3, '0')}`,
      date: harvestForm.date,
      block: harvestForm.block,
      variety: harvestForm.variety,
      bunches: bunches,
      averageWeight: averageWeight,
      totalWeight: bunches * averageWeight,
      quality: harvestForm.quality,
      harvestedBy: harvestForm.harvestedBy,
      notes: harvestForm.notes
    };
    
    // Add to records
    setHarvestRecords(prev => [newHarvestRecord, ...prev]);
    
    // Reset form
    setHarvestForm({
      date: new Date(),
      block: '',
      variety: '',
      bunches: '',
      averageWeight: '',
      quality: 'Good',
      harvestedBy: '',
      notes: ''
    });
    
    // Show success message
    toast({
      title: "Success",
      description: "Harvest record has been added.",
    });
    
    // Switch to harvest records tab
    setActiveTab('harvest');
  };
  
  // Submit maintenance form
  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!maintenanceForm.block || !maintenanceForm.activity || !maintenanceForm.team) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new maintenance record
    const newMaintenanceRecord = {
      id: `MTN${String(maintenanceRecords.length + 1).padStart(3, '0')}`,
      date: maintenanceForm.date,
      block: maintenanceForm.block,
      activity: maintenanceForm.activity,
      team: maintenanceForm.team,
      status: 'completed',
      notes: maintenanceForm.notes
    };
    
    // Add to records
    setMaintenanceRecords(prev => [newMaintenanceRecord, ...prev]);
    
    // Update last maintenance date for the block
    setPlantationBlocks(prev => prev.map(block => 
      block.id === maintenanceForm.block 
        ? { ...block, lastMaintenance: format(maintenanceForm.date, 'yyyy-MM-dd') } 
        : block
    ));
    
    // Reset form
    setMaintenanceForm({
      date: new Date(),
      block: '',
      activity: '',
      team: '',
      notes: ''
    });
    
    // Show success message
    toast({
      title: "Success",
      description: "Maintenance record has been added.",
    });
    
    // Switch to maintenance records tab
    setActiveTab('maintenance');
  };
  
  // Format date
  const formatDate = (date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'productive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'growing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'new':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Get quality color
  const getQualityColor = (quality) => {
    switch (quality.toLowerCase()) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'average':
        return 'text-amber-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Banana Plantation Management</CardTitle>
        <CardDescription>
          Manage plantation blocks, harvests, and maintenance activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="blocks">Plantation Blocks</TabsTrigger>
            <TabsTrigger value="harvest">Harvest Records</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Area</p>
                      <p className="text-2xl font-bold">{totalArea.toFixed(1)} Acres</p>
                      <p className="text-sm text-muted-foreground">{plantationBlocks.length} blocks</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Plants</p>
                      <p className="text-2xl font-bold">{totalPlants.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Banana plants</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Leaf className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Harvest</p>
                      <p className="text-2xl font-bold">{totalHarvest.toLocaleString()} kg</p>
                      <p className="text-sm text-muted-foreground">Year to date</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Tractor className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Harvest Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart
                        data={harvestTrendData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="harvest" stroke="#8884d8" activeDot={{ r: 8 }} name="Harvest (kg)" />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Block Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart
                        data={blockPerformanceData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="plants" fill="#8884d8" name="Plants" />
                        <Bar dataKey="area" fill="#82ca9d" name="Area (scaled)" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Recent Activities</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('harvest')}>
                      Harvest Records
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('maintenance')}>
                      Maintenance Records
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Block</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...maintenanceRecords, ...harvestRecords.map(h => ({
                        id: h.id,
                        date: h.date,
                        block: h.block,
                        activity: 'Harvest',
                        status: 'completed',
                        details: `${h.bunches} bunches of ${h.variety}, ${h.totalWeight} kg`
                      }))].sort((a, b) => b.date - a.date).slice(0, 5).map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>{formatDate(activity.date)}</TableCell>
                          <TableCell className="font-medium">{activity.activity}</TableCell>
                          <TableCell>{activity.block}</TableCell>
                          <TableCell>{activity.details || activity.notes}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="blocks" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blocks..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-1" /> Add New Block
              </Button>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Block ID</TableHead>
                    <TableHead>Area (Acres)</TableHead>
                    <TableHead>Plants</TableHead>
                    <TableHead>Variety</TableHead>
                    <TableHead>Planted Date</TableHead>
                    <TableHead>Last Maintenance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plantationBlocks.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell className="font-medium">{block.id}</TableCell>
                      <TableCell>{block.area.toFixed(1)}</TableCell>
                      <TableCell>{block.plants.toLocaleString()}</TableCell>
                      <TableCell>{block.variety}</TableCell>
                      <TableCell>{formatDate(block.planted)}</TableCell>
                      <TableCell>{formatDate(block.lastMaintenance)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(block.status)}`}>
                          {block.status}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{block.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="harvest" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Record Harvest</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleHarvestSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Harvest Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !harvestForm.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {harvestForm.date ? format(harvestForm.date, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={harvestForm.date}
                              onSelect={handleHarvestDateChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="block">Block *</Label>
                        <Select
                          value={harvestForm.block}
                          onValueChange={(value) => handleHarvestSelectChange('block', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select block" />
                          </SelectTrigger>
                          <SelectContent>
                            {plantationBlocks.map(block => (
                              <SelectItem key={block.id} value={block.id}>{block.id}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="variety">Variety *</Label>
                        <Select
                          value={harvestForm.variety}
                          onValueChange={(value) => handleHarvestSelectChange('variety', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select variety" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Matooke">Matooke</SelectItem>
                            <SelectItem value="Gonja">Gonja</SelectItem>
                            <SelectItem value="Sweet Banana">Sweet Banana</SelectItem>
                            <SelectItem value="Sukali Ndizi">Sukali Ndizi</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bunches">Number of Bunches *</Label>
                        <Input
                          id="bunches"
                          name="bunches"
                          type="number"
                          value={harvestForm.bunches}
                          onChange={handleHarvestInputChange}
                          placeholder="Enter number of bunches"
                          min="1"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="averageWeight">Average Weight (kg) *</Label>
                        <Input
                          id="averageWeight"
                          name="averageWeight"
                          type="number"
                          value={harvestForm.averageWeight}
                          onChange={handleHarvestInputChange}
                          placeholder="Enter average weight"
                          min="1"
                          step="0.1"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quality">Quality *</Label>
                        <Select
                          value={harvestForm.quality}
                          onValueChange={(value) => handleHarvestSelectChange('quality', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Average">Average</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="harvestedBy">Harvested By *</Label>
                        <Input
                          id="harvestedBy"
                          name="harvestedBy"
                          value={harvestForm.harvestedBy}
                          onChange={handleHarvestInputChange}
                          placeholder="Enter team/person"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={harvestForm.notes}
                        onChange={handleHarvestInputChange}
                        placeholder="Enter any additional notes"
                        rows={3}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" /> Record Harvest
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Harvest Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="rounded-md border overflow-y-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Block</TableHead>
                          <TableHead>Variety</TableHead>
                          <TableHead>Bunches</TableHead>
                          <TableHead>Weight (kg)</TableHead>
                          <TableHead>Quality</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHarvestRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{formatDate(record.date)}</TableCell>
                            <TableCell>{record.block}</TableCell>
                            <TableCell>{record.variety}</TableCell>
                            <TableCell>{record.bunches}</TableCell>
                            <TableCell>{record.totalWeight}</TableCell>
                            <TableCell className={getQualityColor(record.quality)}>
                              {record.quality}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Record Maintenance Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Activity Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !maintenanceForm.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {maintenanceForm.date ? format(maintenanceForm.date, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={maintenanceForm.date}
                              onSelect={handleMaintenanceDateChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="block">Block *</Label>
                        <Select
                          value={maintenanceForm.block}
                          onValueChange={(value) => handleMaintenanceSelectChange('block', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select block" />
                          </SelectTrigger>
                          <SelectContent>
                            {plantationBlocks.map(block => (
                              <SelectItem key={block.id} value={block.id}>{block.id}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="activity">Activity Type *</Label>
                        <Select
                          value={maintenanceForm.activity}
                          onValueChange={(value) => handleMaintenanceSelectChange('activity', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Weeding">Weeding</SelectItem>
                            <SelectItem value="Pruning">Pruning</SelectItem>
                            <SelectItem value="Fertilization">Fertilization</SelectItem>
                            <SelectItem value="Pest Control">Pest Control</SelectItem>
                            <SelectItem value="Mulching">Mulching</SelectItem>
                            <SelectItem value="Irrigation">Irrigation</SelectItem>
                            <SelectItem value="Sucker Management">Sucker Management</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="team">Team/Person *</Label>
                        <Input
                          id="team"
                          name="team"
                          value={maintenanceForm.team}
                          onChange={handleMaintenanceInputChange}
                          placeholder="Enter team or person"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={maintenanceForm.notes}
                        onChange={handleMaintenanceInputChange}
                        placeholder="Enter activity details"
                        rows={3}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" /> Record Activity
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Maintenance Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="rounded-md border overflow-y-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Block</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Team</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMaintenanceRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{formatDate(record.date)}</TableCell>
                            <TableCell>{record.block}</TableCell>
                            <TableCell>{record.activity}</TableCell>
                            <TableCell>{record.team}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                                {record.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <BarChart className="h-12 w-12 text-purple-500" />
                  <h3 className="text-lg font-medium">Production Analysis</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Analyze production trends by block and variety
                  </p>
                  <Button className="w-full">View Report</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <LineChartIcon className="h-12 w-12 text-blue-500" />
                  <h3 className="text-lg font-medium">Yield Tracking</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Track yield performance over time
                  </p>
                  <Button className="w-full">View Report</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <Tractor className="h-12 w-12 text-green-500" />
                  <h3 className="text-lg font-medium">Maintenance Efficiency</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Analyze maintenance impact on yield
                  </p>
                  <Button className="w-full">View Report</Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Harvest vs. Maintenance Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="harvest" stroke="#8884d8" name="Harvest (kg)" />
                      <Line yAxisId="right" type="monotone" dataKey="maintenance" stroke="#82ca9d" name="Maintenance Activities" />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Variety Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="matooke" fill="#8884d8" name="Matooke" />
                      <Bar dataKey="gonja" fill="#82ca9d" name="Gonja" />
                      <Bar dataKey="sweet" fill="#ffc658" name="Sweet Banana" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BananaPlantation;
