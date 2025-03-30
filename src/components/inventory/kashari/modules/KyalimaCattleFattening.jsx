
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
import { useKyalimaCattleFattening } from "@/hooks/useKyalimaCattleFattening";
import CattleFatteningForm from "./CattleFatteningForm";
import CattleFatteningDetails from "./CattleFatteningDetails";

const KyalimaCattleFattening = () => {
  const { 
    fatteningData, 
    isLoading, 
    analytics, 
    refreshData, 
    deleteFatteningProgram,
    exportToCSV 
  } = useKyalimaCattleFattening();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCattle, setSelectedCattle] = useState(null);
  const { toast } = useToast();
  
  // Filter cattle based on search term and status filter
  const filteredCattle = fatteningData.filter(cattle => {
    const matchesSearch = 
      cattle.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cattle.tag_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cattle.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || cattle.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle status badge display
  const getStatusBadge = (status) => {
    switch(status) {
      case 'on-track':
      case 'ahead':
        return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
      case 'behind':
        return <Badge className="bg-red-100 text-red-800">Behind</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'sold':
        return <Badge className="bg-amber-100 text-amber-800">Sold</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Active</Badge>;
    }
  };
  
  // Calculate weight gain percentage
  const calculateGainPercentage = (current, entry) => {
    const currentWeight = parseFloat(current);
    const entryWeight = parseFloat(entry);
    return ((currentWeight - entryWeight) / entryWeight * 100).toFixed(1);
  };
  
  // Calculate progress to target weight
  const calculateProgress = (current, target) => {
    const currentWeight = parseFloat(current);
    const targetWeight = parseFloat(target);
    return (currentWeight / targetWeight * 100).toFixed(0);
  };

  // Handle edit cattle
  const handleEditCattle = (cattle) => {
    setSelectedCattle(cattle);
    setShowAddForm(true);
  };

  // Handle delete cattle
  const handleDeleteCattle = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteFatteningProgram(id);
    }
  };

  // Handle print
  const handlePrint = () => {
    toast({
      title: "Print Prepared",
      description: "Sending fattening program data to printer..."
    });
    window.print();
  };
  
  if (showAddForm) {
    return (
      <CattleFatteningForm 
        existingData={selectedCattle} 
        onCancel={() => {
          setShowAddForm(false);
          setSelectedCattle(null);
        }}
      />
    );
  }

  if (selectedCattle && !showAddForm) {
    return (
      <CattleFatteningDetails 
        cattleId={selectedCattle.id}
        onBack={() => setSelectedCattle(null)}
      />
    );
  }

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
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="deceased">Deceased</SelectItem>
              <SelectItem value="transferred">Transferred</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={refreshData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="gap-2" onClick={() => {
            setSelectedCattle(null);
            setShowAddForm(true);
          }}>
            <Plus className="h-4 w-4" />
            <span>Add Cattle</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={exportToCSV}>
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
            <div className="text-2xl font-bold">{analytics.totalActive || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Current participants</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Daily Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageDailyGain?.toFixed(2) || 0} kg</div>
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
            <div className="text-2xl font-bold">{analytics.averageProgress?.toFixed(0) || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">To target weights</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Feed Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.feedConsumption?.toFixed(0) || 0} kg</div>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700 mb-2"></div>
                      <span className="text-sm text-gray-500">Loading data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCattle.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <Beef className="h-12 w-12 text-gray-300 mb-2" />
                      <span className="font-medium text-gray-600 mb-1">No cattle found in fattening program</span>
                      <span className="text-sm text-gray-500 mb-3">Add new cattle or adjust your search filters</span>
                      <Button onClick={() => {
                        setSelectedCattle(null);
                        setShowAddForm(true);
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Cattle to Program
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCattle.map((cattle) => {
                  const idPrefix = cattle.id.substring(0, 6).toUpperCase();
                  return (
                    <TableRow key={cattle.id} onClick={() => setSelectedCattle(cattle)} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{`FP-${idPrefix}`}</div>
                        <div className="text-xs text-muted-foreground">{cattle.tag_number}</div>
                      </TableCell>
                      <TableCell>{cattle.name || "-"}</TableCell>
                      <TableCell>{cattle.entry_date}</TableCell>
                      <TableCell>{cattle.entry_weight} kg</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{cattle.current_weight} kg</span>
                          {cattle.entry_weight && cattle.current_weight && (
                            <span className="text-xs text-green-600">
                              +{calculateGainPercentage(cattle.current_weight, cattle.entry_weight)}%
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{cattle.target_weight} kg</TableCell>
                      <TableCell className="w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-100 h-2 rounded-full">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${calculateProgress(cattle.current_weight, cattle.target_weight)}%` }} 
                            />
                          </div>
                          <span className="text-xs">{calculateProgress(cattle.current_weight, cattle.target_weight)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(cattle.status)}</TableCell>
                      <TableCell>{cattle.daily_gain ? `${cattle.daily_gain.toFixed(2)} kg` : "-"}</TableCell>
                      <TableCell>{cattle.expected_completion_date || "-"}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCattle(cattle);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCattle(cattle.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default KyalimaCattleFattening;
