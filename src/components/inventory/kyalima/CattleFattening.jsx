
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  RefreshCw, 
  FileDown, 
  Plus, 
  Filter, 
  Cow,
  ArrowUpRight,
  Printer,
  Pencil,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { KyalimaPDFExport } from "./utils/KyalimaPDFExport";

const CattleFattening = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data for cattle fattening program
  const fatteningData = [
    { 
      id: 'CF-001', 
      cattleId: 'KYL-C032', 
      cattleName: 'Brutus', 
      startDate: '2023-10-15',
      initialWeight: 380, 
      currentWeight: 468, 
      targetWeight: 550,
      dailyGain: 1.8,
      feedType: 'High Energy Mix',
      status: 'active',
      estimatedCompletion: '2024-02-15',
      supervisor: 'James Okello'
    },
    { 
      id: 'CF-002', 
      cattleId: 'KYL-C045', 
      cattleName: 'Zeus', 
      startDate: '2023-10-15',
      initialWeight: 350, 
      currentWeight: 462, 
      targetWeight: 520,
      dailyGain: 2.2,
      feedType: 'High Protein Mix',
      status: 'active',
      estimatedCompletion: '2024-01-30',
      supervisor: 'James Okello'
    },
    { 
      id: 'CF-003', 
      cattleId: 'KYL-C048', 
      cattleName: 'Thor', 
      startDate: '2023-11-01',
      initialWeight: 410, 
      currentWeight: 468, 
      targetWeight: 560,
      dailyGain: 1.6,
      feedType: 'Standard Mix',
      status: 'active',
      estimatedCompletion: '2024-03-10',
      supervisor: 'Sarah Nambi'
    },
    { 
      id: 'CF-004', 
      cattleId: 'KYL-C029', 
      cattleName: 'Hercules', 
      startDate: '2023-09-20',
      initialWeight: 395, 
      currentWeight: 490, 
      targetWeight: 540,
      dailyGain: 1.5,
      feedType: 'High Energy Mix',
      status: 'active',
      estimatedCompletion: '2024-02-05',
      supervisor: 'Sarah Nambi'
    },
    { 
      id: 'CF-005', 
      cattleId: 'KYL-C038', 
      cattleName: 'Apollo', 
      startDate: '2023-08-15',
      initialWeight: 375, 
      currentWeight: 535, 
      targetWeight: 530,
      dailyGain: 1.9,
      feedType: 'High Protein Mix',
      status: 'completed',
      estimatedCompletion: '2023-12-15',
      supervisor: 'James Okello'
    }
  ];

  // Filter data based on search term and status filter
  const filteredData = fatteningData.filter(cattle => {
    const matchesSearch = 
      cattle.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cattle.cattleId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cattle.cattleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cattle.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || cattle.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate weight progress percentage
  const calculateProgress = (current, initial, target) => {
    if (target <= initial) return 100;
    const progress = ((current - initial) / (target - initial)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "Cattle fattening data has been refreshed.",
    });
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    KyalimaPDFExport.exportTableToPDF('fattening-table', 'Kyalima_Cattle_Fattening_Data');
    toast({
      title: "Export Complete",
      description: "Your cattle fattening data has been exported to PDF.",
    });
  };
  
  // Handle print
  const handlePrint = () => {
    KyalimaPDFExport.printTable('fattening-table');
    toast({
      title: "Print Prepared",
      description: "Sending cattle fattening data to printer...",
    });
  };

  // Get status badge based on cattle status
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'sold':
        return <Badge className="bg-purple-100 text-purple-800">Sold</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Fattening</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fatteningData.filter(c => c.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Cattle being fattened</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(fatteningData.filter(c => c.status === 'active').reduce((sum, c) => sum + c.dailyGain, 0) / 
               fatteningData.filter(c => c.status === 'active').length).toFixed(1)} kg/day
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Weight Gained</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fatteningData.reduce((sum, c) => sum + (c.currentWeight - c.initialWeight), 0)} kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all cattle</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fatteningData.filter(c => c.status === 'completed').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, cattle, or supervisor..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Cattle</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Cattle to Fattening Program</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cattleId">Cattle ID</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kyl-c050">KYL-C050 (Atlas)</SelectItem>
                        <SelectItem value="kyl-c051">KYL-C051 (Titan)</SelectItem>
                        <SelectItem value="kyl-c052">KYL-C052 (Hector)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initialWeight">Initial Weight (kg)</Label>
                    <Input id="initialWeight" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                    <Input id="targetWeight" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDailyGain">Est. Daily Gain (kg)</Label>
                    <Input id="estimatedDailyGain" type="number" step="0.1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="feedType">Feed Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feed mix" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-energy">High Energy Mix</SelectItem>
                        <SelectItem value="high-protein">High Protein Mix</SelectItem>
                        <SelectItem value="standard">Standard Mix</SelectItem>
                        <SelectItem value="custom">Custom Mix</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supervisor">Supervisor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="james">James Okello</SelectItem>
                        <SelectItem value="sarah">Sarah Nambi</SelectItem>
                        <SelectItem value="david">David Mugisha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input id="notes" />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline">Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExportPDF}>
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Data table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table id="fattening-table">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cattle</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Initial Weight</TableHead>
                  <TableHead>Current Weight</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Daily Gain</TableHead>
                  <TableHead>Feed Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-10">
                      No cattle fattening records found. Add your first record.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((cattle) => (
                    <TableRow key={cattle.id}>
                      <TableCell className="font-medium">{cattle.id}</TableCell>
                      <TableCell>
                        {cattle.cattleId} 
                        <div className="text-xs text-muted-foreground">{cattle.cattleName}</div>
                      </TableCell>
                      <TableCell>{cattle.startDate}</TableCell>
                      <TableCell>{cattle.initialWeight} kg</TableCell>
                      <TableCell>{cattle.currentWeight} kg</TableCell>
                      <TableCell>{cattle.targetWeight} kg</TableCell>
                      <TableCell className="max-w-[160px]">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-100 h-2 rounded-full">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${calculateProgress(cattle.currentWeight, cattle.initialWeight, cattle.targetWeight)}%` }} 
                            />
                          </div>
                          <span className="text-xs">
                            {calculateProgress(cattle.currentWeight, cattle.initialWeight, cattle.targetWeight).toFixed()}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{cattle.dailyGain} kg/day</TableCell>
                      <TableCell>{cattle.feedType}</TableCell>
                      <TableCell>{getStatusBadge(cattle.status)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Weight tracking section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Expected Completion Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Completions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fatteningData
                  .filter(c => c.status === 'active')
                  .sort((a, b) => new Date(a.estimatedCompletion) - new Date(b.estimatedCompletion))
                  .slice(0, 3)
                  .map((cattle, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{cattle.cattleName} ({cattle.cattleId})</p>
                        <p className="text-sm text-muted-foreground">
                          {calculateProgress(cattle.currentWeight, cattle.initialWeight, cattle.targetWeight).toFixed()}% complete
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{cattle.estimatedCompletion}</p>
                        <p className="text-sm text-muted-foreground">Est. Completion</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feed Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">High Energy Mix</p>
                    <p className="text-2xl font-bold">580 kg</p>
                    <p className="text-xs text-muted-foreground">Weekly consumption</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">High Protein Mix</p>
                    <p className="text-2xl font-bold">420 kg</p>
                    <p className="text-xs text-muted-foreground">Weekly consumption</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Standard Mix</p>
                    <p className="text-2xl font-bold">250 kg</p>
                    <p className="text-xs text-muted-foreground">Weekly consumption</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CattleFattening;
