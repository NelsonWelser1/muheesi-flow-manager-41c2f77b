import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RefreshCw, FileDown, Filter, Pencil, Trash2, Droplet, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { KyalimaPDFExport } from "./utils/KyalimaPDFExport";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/supabase';

const MilkProduction = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterShift, setFilterShift] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [milkData, setMilkData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [milkSalesSummary, setMilkSalesSummary] = useState({
    totalLiters: 0,
    soldLiters: 0,
    averagePrice: "UGX 0",
    totalRevenue: "UGX 0",
    topCustomers: []
  });

  const fetchMilkData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('milk_production')
        .select('*')
        .eq('farm_id', 'bukomero')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      const transformedData = data.map((record, index) => ({
        id: record.id || `MP-${index + 1}`,
        date: record.date,
        shift: record.session === 'morning' ? 'Morning' : 
               record.session === 'midday' ? 'Midday' : 'Evening',
        cowId: record.cow_id || 'HERD',
        cowName: record.cow_name || 'Entire Herd',
        quantity: record.volume,
        milkingTime: record.created_at 
          ? format(parseISO(record.created_at), 'HH:mm') 
          : '06:30',
        quality: record.fat_content > 4 ? 'A' : 
                record.fat_content > 3 ? 'B' : 'C',
        collectedBy: record.collected_by || 'Staff'
      }));

      setMilkData(transformedData);
      calculateSummaryData(data);

      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${data.length} milk production records.`,
      });
    } catch (error) {
      console.error('Error fetching milk data:', error);
      toast({
        title: "Error",
        description: "Failed to load milk production data. " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSummaryData = (data) => {
    if (!data || data.length === 0) return;

    try {
      const totalLiters = data.reduce((sum, record) => sum + (record.volume || 0), 0);
      const soldLiters = Math.round(totalLiters * 0.9);
      const averagePrice = 2500;
      const totalRevenue = soldLiters * averagePrice;

      const topCustomers = [
        {
          name: "Local Dairy Cooperative",
          volume: `${Math.round(soldLiters * 0.6)} liters`,
          amount: `UGX ${Math.round(soldLiters * 0.6 * averagePrice).toLocaleString()}`
        },
        {
          name: "Community Market Vendors",
          volume: `${Math.round(soldLiters * 0.3)} liters`,
          amount: `UGX ${Math.round(soldLiters * 0.3 * averagePrice).toLocaleString()}`
        },
        {
          name: "Direct Consumers",
          volume: `${Math.round(soldLiters * 0.1)} liters`,
          amount: `UGX ${Math.round(soldLiters * 0.1 * averagePrice).toLocaleString()}`
        }
      ];

      const last7DaysData = data.filter(record => {
        const recordDate = new Date(record.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return recordDate >= sevenDaysAgo;
      });

      const weeklyTotal = last7DaysData.reduce((sum, record) => sum + (record.volume || 0), 0);
      const weeklyAvg = last7DaysData.length > 0 ? Math.round(weeklyTotal / 7) : 0;

      setMilkSalesSummary({
        totalLiters,
        soldLiters,
        averagePrice: `UGX ${averagePrice.toLocaleString()}`,
        totalRevenue: `UGX ${totalRevenue.toLocaleString()}`,
        topCustomers,
        weeklyAvg
      });
    } catch (error) {
      console.error('Error calculating summary data:', error);
    }
  };

  useEffect(() => {
    fetchMilkData();
  }, []);

  const refreshData = () => {
    fetchMilkData();
  };

  const handleExportPDF = () => {
    KyalimaPDFExport.exportTableToPDF('milk-table', 'Kyalima_Milk_Production_Data');
    toast({
      title: "Export Complete",
      description: "Your milk production data has been exported to PDF.",
    });
  };

  const handlePrint = () => {
    KyalimaPDFExport.printTable('milk-table');
    toast({
      title: "Print Prepared",
      description: "Sending milk production data to printer...",
    });
  };

  const getTotalMilkByDate = (dateStr) => {
    return milkData
      .filter(record => record.date === dateStr)
      .reduce((total, record) => total + record.quantity, 0);
  };

  const getQualityBadge = (quality) => {
    switch (quality) {
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

  const filteredMilkData = milkData.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      record.id.toLowerCase().includes(searchLower) ||
      (record.cowId && record.cowId.toLowerCase().includes(searchLower)) ||
      (record.cowName && record.cowName.toLowerCase().includes(searchLower)) ||
      (record.collectedBy && record.collectedBy.toLowerCase().includes(searchLower));
    
    const matchesShift = filterShift === 'all' || 
      record.shift.toLowerCase() === filterShift.toLowerCase();
    
    return matchesSearch && matchesShift;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalMilkByDate(format(new Date(), 'yyyy-MM-dd'))} Liters
            </div>
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
            <div className="text-2xl font-bold">{milkSalesSummary.weeklyAvg || 0} L/day</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{milkData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time production records</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              Milk Production Records
            </div>
            <div className="flex gap-2">
              <Button onClick={refreshData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button onClick={handleExportPDF} variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-1" />
                Export PDF
              </Button>
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Records</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by ID, cow, or collector..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="shift-filter">Filter by Shift</Label>
              <Select value={filterShift} onValueChange={setFilterShift}>
                <SelectTrigger>
                  <SelectValue placeholder="All shifts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="midday">Midday</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg" id="milk-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Cow ID</TableHead>
                  <TableHead>Cow Name</TableHead>
                  <TableHead>Quantity (L)</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Collected By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Loading milk production data...
                    </TableCell>
                  </TableRow>
                ) : filteredMilkData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      No milk production records found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMilkData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.shift}</TableCell>
                      <TableCell>{record.cowId}</TableCell>
                      <TableCell>{record.cowName}</TableCell>
                      <TableCell className="font-medium">{record.quantity}</TableCell>
                      <TableCell>{record.milkingTime}</TableCell>
                      <TableCell>{getQualityBadge(record.quality)}</TableCell>
                      <TableCell>{record.collectedBy}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkProduction;
