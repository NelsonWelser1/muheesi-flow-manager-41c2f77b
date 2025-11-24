import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RefreshCw, FileDown, Filter, Pencil, Trash2, Droplet, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { KyalimaPDFExport } from "./utils/KyalimaPDFExport";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { supabase } from '@/integrations/supabase/supabase';
const MilkProduction = () => {
  const {
    toast
  } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [milkData, setMilkData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [milkSalesSummary, setMilkSalesSummary] = useState({
    totalLiters: 0,
    soldLiters: 0,
    averagePrice: 'UGX 0',
    totalRevenue: 'UGX 0',
    topCustomers: []
  });

  // Function to fetch milk production data from Supabase
  const fetchMilkData = async () => {
    setIsLoading(true);
    try {
      // Fetch from the milk_production table
      const {
        data,
        error
      } = await supabase.from('milk_production').select('*').eq('farm_id', 'bukomero') // Filter to only get milk data from Bukomero farm
      .order('date', {
        ascending: false
      });
      if (error) {
        throw error;
      }

      // Transform the data to match the component's expected format
      const transformedData = data.map((record, index) => ({
        id: record.id || `MP-${index + 1}`,
        date: record.date,
        shift: record.session === 'morning' ? 'Morning' : record.session === 'midday' ? 'Midday' : 'Evening',
        cowId: record.cow_id || 'HERD',
        cowName: record.cow_name || 'Entire Herd',
        quantity: record.volume,
        milkingTime: record.created_at ? format(parseISO(record.created_at), 'HH:mm') : '06:30',
        quality: record.fat_content > 4 ? 'A' : record.fat_content > 3 ? 'B' : 'C',
        collectedBy: record.collected_by || 'Staff'
      }));
      setMilkData(transformedData);
      calculateSummaryData(data);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${data.length} milk production records.`
      });
    } catch (error) {
      console.error('Error fetching milk data:', error);
      toast({
        title: "Error",
        description: "Failed to load milk production data. " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary data from fetched records
  const calculateSummaryData = data => {
    if (!data || data.length === 0) return;
    try {
      // Calculate total liters produced
      const totalLiters = data.reduce((sum, record) => sum + (record.volume || 0), 0);

      // Assuming 90% of milk is sold
      const soldLiters = Math.round(totalLiters * 0.9);

      // Calculate average price (example: 2500 UGX per liter)
      const averagePrice = 2500;
      const totalRevenue = soldLiters * averagePrice;

      // Set estimated top customers
      const topCustomers = [{
        name: 'Local Dairy Cooperative',
        volume: `${Math.round(soldLiters * 0.6)} liters`,
        amount: `UGX ${Math.round(soldLiters * 0.6 * averagePrice).toLocaleString()}`
      }, {
        name: 'Community Market Vendors',
        volume: `${Math.round(soldLiters * 0.3)} liters`,
        amount: `UGX ${Math.round(soldLiters * 0.3 * averagePrice).toLocaleString()}`
      }, {
        name: 'Direct Consumers',
        volume: `${Math.round(soldLiters * 0.1)} liters`,
        amount: `UGX ${Math.round(soldLiters * 0.1 * averagePrice).toLocaleString()}`
      }];

      // Weekly average (last 7 days)
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

  // Fetch data on component mount
  useEffect(() => {
    fetchMilkData();
  }, []);
  const refreshData = () => {
    fetchMilkData();
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    KyalimaPDFExport.exportTableToPDF('milk-table', 'Kyalima_Milk_Production_Data');
    toast({
      title: "Export Complete",
      description: "Your milk production data has been exported to PDF."
    });
  };

  // Handle print
  const handlePrint = () => {
    KyalimaPDFExport.printTable('milk-table');
    toast({
      title: "Print Prepared",
      description: "Sending milk production data to printer..."
    });
  };

  // Get total milk by date
  const getTotalMilkByDate = dateStr => {
    return milkData.filter(record => record.date === dateStr).reduce((total, record) => total + record.quantity, 0);
  };

  // Get quality badge color
  const getQualityBadge = quality => {
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

  // Filter milk based on search term and category
  const filteredMilkData = milkData.filter(record => {
    // Apply search term filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = record.id.toLowerCase().includes(searchLower) || record.cowId && record.cowId.toLowerCase().includes(searchLower) || record.cowName && record.cowName.toLowerCase().includes(searchLower) || record.collectedBy && record.collectedBy.toLowerCase().includes(searchLower);

    // Apply shift filter
    const matchesShift = filterShift === 'all' || record.shift.toLowerCase() === filterShift.toLowerCase();
    return matchesSearch && matchesShift;
  });
  return <div className="space-y-4">
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
            <div className="text-2xl font-bold">{milkSalesSummary.weeklyAvg || 0} Liters/day</div>
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
            <Input placeholder="Search by ID, cow, or collector..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExportPDF}>
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        {isLoading ? <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
          </div> : <div className="overflow-x-auto">
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
                {filteredMilkData.length === 0 ? <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">No milk records found.</TableCell>
                  </TableRow> : filteredMilkData.map(record => <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.shift}</TableCell>
                      <TableCell>{record.cowId}</TableCell>
                      <TableCell>{record.cowName}</TableCell>
                      <TableCell>{record.quantity}</TableCell>
                      <TableCell>{getQualityBadge(record.quality)}</TableCell>
                      <TableCell>{record.collectedBy}</TableCell>
                      
                    </TableRow>)}
              </TableBody>
            </Table>
          </div>}
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
                  {milkSalesSummary.topCustomers.map((customer, index) => <TableRow key={index}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.volume}</TableCell>
                      <TableCell>{customer.amount}</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default MilkProduction;