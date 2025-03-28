
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
  Droplet,
  Printer
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { KyalimaPDFExport } from "./utils/KyalimaPDFExport";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

const MilkProduction = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Fetch milk records function would be implemented here in a real app
  const refreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Milk production data has been refreshed.",
    });
  };
  
  // Handle export to PDF
  const handleExportPDF = () => {
    KyalimaPDFExport.exportTableToPDF('milk-table', 'Kyalima_Milk_Production_Data');
    toast({
      title: "Export Complete",
      description: "Your milk production data has been exported to PDF.",
    });
  };
  
  // Handle print
  const handlePrint = () => {
    KyalimaPDFExport.printTable('milk-table');
    toast({
      title: "Print Prepared",
      description: "Sending milk production data to printer...",
    });
  };
  
  // Sample milk production data for demo
  const sampleMilkData = [
    { 
      id: 'MP-001', 
      date: '2023-12-20', 
      shift: 'Morning', 
      cowId: 'KYL-C001', 
      cowName: 'Bella', 
      quantity: 15, 
      milkingTime: '06:30', 
      quality: 'A', 
      collectedBy: 'John' 
    },
    { 
      id: 'MP-002', 
      date: '2023-12-20', 
      shift: 'Evening', 
      cowId: 'KYL-C001', 
      cowName: 'Bella', 
      quantity: 12, 
      milkingTime: '17:30', 
      quality: 'A', 
      collectedBy: 'David' 
    },
    { 
      id: 'MP-003', 
      date: '2023-12-20', 
      shift: 'Morning', 
      cowId: 'KYL-C018', 
      cowName: 'Daisy', 
      quantity: 14, 
      milkingTime: '06:45', 
      quality: 'A', 
      collectedBy: 'John' 
    },
    { 
      id: 'MP-004', 
      date: '2023-12-20', 
      shift: 'Evening', 
      cowId: 'KYL-C018', 
      cowName: 'Daisy', 
      quantity: 11.5, 
      milkingTime: '17:45', 
      quality: 'B', 
      collectedBy: 'David' 
    },
    { 
      id: 'MP-005', 
      date: '2023-12-19', 
      shift: 'Morning', 
      cowId: 'KYL-C001', 
      cowName: 'Bella', 
      quantity: 14.5, 
      milkingTime: '06:30', 
      quality: 'A', 
      collectedBy: 'John' 
    },
    { 
      id: 'MP-006', 
      date: '2023-12-19', 
      shift: 'Evening', 
      cowId: 'KYL-C001', 
      cowName: 'Bella', 
      quantity: 12.5, 
      milkingTime: '17:30', 
      quality: 'A', 
      collectedBy: 'Sarah' 
    },
    { 
      id: 'MP-007', 
      date: '2023-12-19', 
      shift: 'Morning', 
      cowId: 'KYL-C018', 
      cowName: 'Daisy', 
      quantity: 13.5, 
      milkingTime: '06:45', 
      quality: 'A', 
      collectedBy: 'John' 
    },
  ];
  
  // Filter and search logic
  const filteredMilkData = sampleMilkData.filter(record => {
    // Apply search term filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      record.id.toLowerCase().includes(searchLower) ||
      record.cowId.toLowerCase().includes(searchLower) ||
      record.cowName.toLowerCase().includes(searchLower) ||
      record.collectedBy.toLowerCase().includes(searchLower);
      
    // Apply shift filter
    const matchesShift = filterShift === 'all' || record.shift.toLowerCase() === filterShift.toLowerCase();
    
    return matchesSearch && matchesShift;
  });
  
  // Milk sales summary data (sample)
  const milkSalesSummary = {
    totalLiters: 480,
    soldLiters: 450,
    averagePrice: 'UGX 2,500',
    totalRevenue: 'UGX 1,125,000',
    topCustomers: [
      { name: 'Local Dairy Cooperative', volume: '300 liters', amount: 'UGX 750,000' },
      { name: 'Community Market Vendors', volume: '100 liters', amount: 'UGX 250,000' },
      { name: 'Direct Consumers', volume: '50 liters', amount: 'UGX 125,000' },
    ]
  };
  
  // Get total milk by date
  const getTotalMilkByDate = (date) => {
    return sampleMilkData
      .filter(record => record.date === date)
      .reduce((total, record) => total + record.quantity, 0);
  };
  
  // Get quality badge color
  const getQualityBadge = (quality) => {
    switch(quality) {
      case 'A':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Grade A</Badge>;
      case 'B':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Grade B</Badge>;
      case 'C':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Grade C</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800 border-red-200">Grade D</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalMilkByDate(format(new Date(), 'yyyy-MM-dd'))} Liters</div>
            <p className="text-xs text-muted-foreground mt-1">From all cows, both shifts</p>
            <div className="flex items-center mt-2">
              <Droplet className="h-4 w-4 text-blue-500 mr-1" />
              <div className="text-xs text-muted-foreground">Morning + Evening shifts</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">482 Liters/day</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
            <div className="flex items-center justify-between mt-2">
              <div className="h-2 rounded-full bg-slate-100 w-full mr-2">
                <div className="h-2 rounded-full bg-blue-500 w-3/4"></div>
              </div>
              <span className="text-xs text-muted-foreground">+5%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{milkSalesSummary.totalRevenue}</div>
            <p className="text-xs text-muted-foreground mt-1">From {milkSalesSummary.soldLiters} liters sold</p>
            <div className="flex items-center mt-2">
              <div className="text-xs text-muted-foreground">Avg price: {milkSalesSummary.averagePrice}/liter</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, cow, or collector..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterShift} onValueChange={setFilterShift}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
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
                <span>Record Milk</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Record Milk Production</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shift">Shift</Label>
                    <Select defaultValue="morning">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cowId">Cow ID</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cow" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kyl-c001">KYL-C001 (Bella)</SelectItem>
                        <SelectItem value="kyl-c018">KYL-C018 (Daisy)</SelectItem>
                        <SelectItem value="kyl-c023">KYL-C023 (Lucy)</SelectItem>
                        <SelectItem value="kyl-c037">KYL-C037 (Molly)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity (Liters)</Label>
                    <Input id="quantity" type="number" step="0.1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="milkingTime">Milking Time</Label>
                    <Input id="milkingTime" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quality">Quality Grade</Label>
                    <Select defaultValue="A">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Grade A</SelectItem>
                        <SelectItem value="B">Grade B</SelectItem>
                        <SelectItem value="C">Grade C</SelectItem>
                        <SelectItem value="D">Grade D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectedBy">Collected By</Label>
                  <Input id="collectedBy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input id="notes" />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline">Cancel</Button>
                  <Button type="submit">Save Record</Button>
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
          <Table id="milk-table">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Cow ID</TableHead>
                <TableHead>Cow Name</TableHead>
                <TableHead>Quantity (L)</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Collected By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMilkData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">No milk records found. Record your first production.</TableCell>
                </TableRow>
              ) : (
                filteredMilkData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.shift}</TableCell>
                    <TableCell>{record.cowId}</TableCell>
                    <TableCell>{record.cowName}</TableCell>
                    <TableCell>{record.quantity}</TableCell>
                    <TableCell>{getQualityBadge(record.quality)}</TableCell>
                    <TableCell>{record.collectedBy}</TableCell>
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

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Milk Sales Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Total Production</dt>
                  <dd className="text-lg font-semibold">{milkSalesSummary.totalLiters} Liters</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Sold Volume</dt>
                  <dd className="text-lg font-semibold">{milkSalesSummary.soldLiters} Liters</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Average Price</dt>
                  <dd className="text-lg font-semibold">{milkSalesSummary.averagePrice}/L</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Total Revenue</dt>
                  <dd className="text-lg font-semibold">{milkSalesSummary.totalRevenue}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {milkSalesSummary.topCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.volume}</TableCell>
                      <TableCell>{customer.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MilkProduction;
