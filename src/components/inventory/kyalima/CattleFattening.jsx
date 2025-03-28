
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Beef,
  ArrowUpRight,
  Printer,
  Calendar,
  Scale,
  BarChart2,
  Trash2,
  Pencil
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CattleFattening = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Sample data for cattle in fattening program
  const fatteningCattleData = [
    { id: 'FP-001', tagNumber: 'KYL-C037', name: 'Bull 37', entryDate: '2023-10-15', entryWeight: '320 kg', currentWeight: '387 kg', targetWeight: '450 kg', estimatedCompletion: '2024-04-15', status: 'on-track', dailyGain: '0.7 kg', feedType: 'High Energy', notes: 'Performing well' },
    { id: 'FP-002', tagNumber: 'KYL-C043', name: 'Bull 43', entryDate: '2023-10-20', entryWeight: '305 kg', currentWeight: '362 kg', targetWeight: '430 kg', estimatedCompletion: '2024-04-20', status: 'on-track', dailyGain: '0.65 kg', feedType: 'High Energy', notes: 'Slight limp in left hind leg - monitor' },
    { id: 'FP-003', tagNumber: 'KYL-C052', name: 'Bull 52', entryDate: '2023-11-05', entryWeight: '330 kg', currentWeight: '378 kg', targetWeight: '460 kg', estimatedCompletion: '2024-05-05', status: 'behind', dailyGain: '0.5 kg', feedType: 'Standard', notes: 'Not gaining as expected' },
    { id: 'FP-004', tagNumber: 'KYL-C061', name: 'Bull 61', entryDate: '2023-11-15', entryWeight: '345 kg', currentWeight: '410 kg', targetWeight: '470 kg', estimatedCompletion: '2024-04-15', status: 'ahead', dailyGain: '0.85 kg', feedType: 'High Energy + Supplement', notes: 'Excellent performer' },
    { id: 'FP-005', tagNumber: 'KYL-C078', name: 'Bull 78', entryDate: '2023-12-01', entryWeight: '315 kg', currentWeight: '352 kg', targetWeight: '440 kg', estimatedCompletion: '2024-05-30', status: 'on-track', dailyGain: '0.6 kg', feedType: 'Standard', notes: 'Average performance' },
    { id: 'FP-006', tagNumber: 'KYL-C085', name: 'Bull 85', entryDate: '2023-12-10', entryWeight: '325 kg', currentWeight: '345 kg', targetWeight: '450 kg', estimatedCompletion: '2024-06-10', status: 'behind', dailyGain: '0.4 kg', feedType: 'Standard + Supplement', notes: 'Consider switching feed strategy' },
  ];
  
  // Filter cattle based on search term and category filter
  const filteredCattle = fatteningCattleData.filter(cattle => {
    const matchesSearch = 
      cattle.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cattle.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cattle.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || cattle.status === filterCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle status badge display
  const getStatusBadge = (status) => {
    switch(status) {
      case 'on-track':
        return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
      case 'behind':
        return <Badge className="bg-red-100 text-red-800">Behind</Badge>;
      case 'ahead':
        return <Badge className="bg-blue-100 text-blue-800">Ahead</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  // Calculate weight gain percentage
  const calculateGainPercentage = (current, entry) => {
    const currentWeight = parseInt(current.replace(' kg', ''));
    const entryWeight = parseInt(entry.replace(' kg', ''));
    return ((currentWeight - entryWeight) / entryWeight * 100).toFixed(1);
  };
  
  // Calculate progress to target weight
  const calculateProgress = (current, target) => {
    const currentWeight = parseInt(current.replace(' kg', ''));
    const targetWeight = parseInt(target.replace(' kg', ''));
    return (currentWeight / targetWeight * 100).toFixed(0);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, tag number or name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="on-track">On Track</SelectItem>
              <SelectItem value="behind">Behind</SelectItem>
              <SelectItem value="ahead">Ahead</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => toast({
            title: "Data Refreshed",
            description: "Fattening program data has been refreshed."
          })}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Cattle</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => toast({
            title: "Print Prepared",
            description: "Sending fattening program data to printer..."
          })}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => toast({
            title: "Export Complete",
            description: "Your fattening program data has been exported."
          })}>
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active in Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fatteningCattleData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Current participants</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Daily Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.62 kg</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-500">+0.05 kg from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground mt-1">To target weights</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Feed Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250 kg</div>
            <p className="text-xs text-muted-foreground mt-1">Weekly average</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID & Tag</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Entry Date</TableHead>
                <TableHead>Entry Weight</TableHead>
                <TableHead>Current Weight</TableHead>
                <TableHead>Target Weight</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Daily Gain</TableHead>
                <TableHead>Est. Completion</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCattle.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-10">No cattle found in fattening program.</TableCell>
                </TableRow>
              ) : (
                filteredCattle.map((cattle) => (
                  <TableRow key={cattle.id}>
                    <TableCell>
                      <div className="font-medium">{cattle.id}</div>
                      <div className="text-xs text-muted-foreground">{cattle.tagNumber}</div>
                    </TableCell>
                    <TableCell>{cattle.name}</TableCell>
                    <TableCell>{cattle.entryDate}</TableCell>
                    <TableCell>{cattle.entryWeight}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{cattle.currentWeight}</span>
                        <span className="text-xs text-green-600">+{calculateGainPercentage(cattle.currentWeight, cattle.entryWeight)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{cattle.targetWeight}</TableCell>
                    <TableCell className="w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${calculateProgress(cattle.currentWeight, cattle.targetWeight)}%` }} 
                          />
                        </div>
                        <span className="text-xs">{calculateProgress(cattle.currentWeight, cattle.targetWeight)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(cattle.status)}</TableCell>
                    <TableCell>{cattle.dailyGain}</TableCell>
                    <TableCell>{cattle.estimatedCompletion}</TableCell>
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
      </div>
    </div>
  );
};

export default CattleFattening;
