
import React, { useState, useEffect } from 'react';
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
  Filter, 
  Pencil,
  Trash2,
  Beef,
  Printer,
  Info
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { KyalimaPDFExport } from "./utils/KyalimaPDFExport";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/supabase';
import { format, parseISO, differenceInMonths, differenceInYears } from 'date-fns';

const CattleManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [cattleData, setCattleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to fetch cattle data from Supabase
  const fetchCattleData = async () => {
    setIsLoading(true);
    try {
      // Fetch from the cattle_inventory table
      const { data, error } = await supabase
        .from('cattle_inventory')
        .select('*')
        .eq('farm_id', 'kyalima') // Filter to only get cattle from Kyalima farm
        .order('tag_number', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setCattleData(data || []);
      console.log('Fetched cattle data:', data);
      
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${data.length} cattle records.`,
      });
    } catch (error) {
      console.error('Error fetching cattle data:', error);
      toast({
        title: "Error",
        description: "Failed to load cattle data. " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchCattleData();
  }, []);
  
  const refreshData = () => {
    fetchCattleData();
  };
  
  const handleExportPDF = () => {
    KyalimaPDFExport.exportTableToPDF('cattle-table', 'Kyalima_Cattle_Data');
    toast({
      title: "Export Complete",
      description: "Your cattle data has been exported to PDF.",
    });
  };
  
  const handlePrint = () => {
    KyalimaPDFExport.printTable('cattle-table');
    toast({
      title: "Print Prepared",
      description: "Sending cattle data to printer...",
    });
  };
  
  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    
    try {
      const dob = parseISO(dateOfBirth);
      const years = differenceInYears(new Date(), dob);
      
      if (years > 0) {
        return `${years} years`;
      } else {
        const months = differenceInMonths(new Date(), dob);
        if (months > 0) {
          return `${months} months`;
        } else {
          return 'Under 1 month';
        }
      }
    } catch (error) {
      console.error('Error calculating age:', error);
      return 'N/A';
    }
  };
  
  // Helper function to get status badge color
  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'good':
      case 'healthy':
        return 'outline';
      case 'needs checkup':
      case 'fair':
        return 'secondary';
      case 'treatment':
      case 'poor':
      case 'bad':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  // Filter cattle based on search term and category
  const filteredCattle = cattleData.filter(cattle => {
    const matchesSearch = (
      (cattle.tag_number && cattle.tag_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cattle.name && cattle.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cattle.breed && cattle.breed.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (filterCategory === 'all') {
      return matchesSearch;
    }
    
    // Map filter categories to cattle_type values in the database
    const categoryMapping = {
      'dam': ['cow', 'mother'],
      'heifer': ['heifer'],
      'bull': ['bull'],
      'femalecalf': ['female_calf', 'heifer_calf'],
      'malecalf': ['male_calf', 'bull_calf']
    };
    
    const typeValues = categoryMapping[filterCategory] || [];
    return matchesSearch && (cattle.cattle_type && typeValues.some(type => 
      cattle.cattle_type.toLowerCase().includes(type)));
  });
  
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
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExportPDF}>
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
          </div>
        ) : (
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
                  <TableHead>Weight (kg)</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCattle.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      {searchTerm || filterCategory !== 'all' 
                        ? 'No cattle matching your search criteria.'
                        : 'No cattle records available from Bukomero Farm.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCattle.map((cattle) => (
                    <TableRow key={cattle.id}>
                      <TableCell className="font-medium">{cattle.tag_number}</TableCell>
                      <TableCell>{cattle.name || '-'}</TableCell>
                      <TableCell>{cattle.cattle_type ? cattle.cattle_type.replace(/_/g, ' ') : '-'}</TableCell>
                      <TableCell>{calculateAge(cattle.date_of_birth)}</TableCell>
                      <TableCell>{cattle.breed || '-'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadgeVariant(cattle.health_status)}
                          className="whitespace-nowrap"
                        >
                          {cattle.health_status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>{cattle.weight ? `${cattle.weight}` : '-'}</TableCell>
                      <TableCell>
                        {cattle.notes ? (
                          <div className="flex items-center">
                            <Info className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="truncate max-w-[100px]">{cattle.notes}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredCattle.length} cattle records from Bukomero Farm
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
            Page 1 of {Math.max(1, Math.ceil(filteredCattle.length / 10))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CattleManagement;
