
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Pencil,
  Trash2,
  Cow,
  Printer
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { KyalimaPDFExport } from "./utils/KyalimaPDFExport";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CattleManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Fetch cattle data function would be implemented here in a real app
  const refreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Cattle data has been refreshed.",
    });
  };
  
  // Handle export to PDF
  const handleExportPDF = () => {
    KyalimaPDFExport.exportTableToPDF('cattle-table', 'Kyalima_Cattle_Data');
    toast({
      title: "Export Complete",
      description: "Your cattle data has been exported to PDF.",
    });
  };
  
  // Handle print
  const handlePrint = () => {
    KyalimaPDFExport.printTable('cattle-table');
    toast({
      title: "Print Prepared",
      description: "Sending cattle data to printer...",
    });
  };
  
  // Sample cattle data for demo
  const sampleCattleData = [
    { id: 'KYL-C001', name: 'Bella', type: 'Dam/Mother', age: '4 years', breed: 'Fresian', status: 'Healthy', lactating: 'Yes', lastCheckup: '2023-12-15' },
    { id: 'KYL-C015', name: 'Zara', type: 'Heifer', age: '1.5 years', breed: 'Jersey Cross', status: 'Healthy', lactating: 'No', lastCheckup: '2023-12-10' },
    { id: 'KYL-C023', name: 'Thor', type: 'Bull', age: '3 years', breed: 'Ankole', status: 'Healthy', lactating: 'No', lastCheckup: '2023-12-05' },
    { id: 'KYL-C045', name: 'Lily', type: 'Female Calf', age: '5 months', breed: 'Fresian', status: 'Healthy', lactating: 'No', lastCheckup: '2023-11-28' },
    { id: 'KYL-C052', name: 'Max', type: 'Male Calf', age: '3 months', breed: 'Jersey Cross', status: 'Needs Checkup', lactating: 'No', lastCheckup: '2023-11-20' },
    { id: 'KYL-C018', name: 'Daisy', type: 'Dam/Mother', age: '5 years', breed: 'Ankole Cross', status: 'Healthy', lactating: 'Yes', lastCheckup: '2023-12-12' },
    { id: 'KYL-C037', name: 'Rex', type: 'Bull', age: '4 years', breed: 'Ankole', status: 'Treatment', lactating: 'No', lastCheckup: '2023-12-01' },
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cattle by ID, name or breed..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="dam">Dam/Mother Cows</SelectItem>
              <SelectItem value="heifer">Heifers</SelectItem>
              <SelectItem value="bull">Bulls</SelectItem>
              <SelectItem value="femalecalf">Female Calves</SelectItem>
              <SelectItem value="malecalf">Male Calves</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={refreshData}>
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
                <DialogTitle>Add New Cattle</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cattleId">Cattle ID</Label>
                    <Input id="cattleId" placeholder="KYL-C###" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Cattle name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dam">Dam/Mother</SelectItem>
                        <SelectItem value="heifer">Heifer</SelectItem>
                        <SelectItem value="bull">Bull</SelectItem>
                        <SelectItem value="femalecalf">Female Calf</SelectItem>
                        <SelectItem value="malecalf">Male Calf</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" placeholder="Age (years/months)" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="breed">Breed</Label>
                    <Input id="breed" placeholder="Breed" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthy">Healthy</SelectItem>
                        <SelectItem value="needsCheckup">Needs Checkup</SelectItem>
                        <SelectItem value="treatment">Treatment</SelectItem>
                        <SelectItem value="quarantine">Quarantine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lactating">Lactating</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="na">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastCheckup">Last Checkup</Label>
                    <Input id="lastCheckup" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Additional notes" />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Cattle</Button>
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

      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <Table id="cattle-table">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lactating</TableHead>
                <TableHead>Last Checkup</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleCattleData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">No cattle found. Add your first cattle.</TableCell>
                </TableRow>
              ) : (
                sampleCattleData.map((cattle) => (
                  <TableRow key={cattle.id}>
                    <TableCell className="font-medium">{cattle.id}</TableCell>
                    <TableCell>{cattle.name}</TableCell>
                    <TableCell>{cattle.type}</TableCell>
                    <TableCell>{cattle.age}</TableCell>
                    <TableCell>{cattle.breed}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={cattle.status === 'Healthy' ? 'outline' : 
                              cattle.status === 'Needs Checkup' ? 'secondary' : 'destructive'}
                        className="whitespace-nowrap"
                      >
                        {cattle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{cattle.lactating}</TableCell>
                    <TableCell>{cattle.lastCheckup}</TableCell>
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {sampleCattleData.length} cattle records
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select defaultValue="10">
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page 1 of 1
          </div>
        </div>
      </div>
    </div>
  );
};

export default CattleManagement;
