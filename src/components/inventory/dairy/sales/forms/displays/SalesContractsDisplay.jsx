
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Search, Eye, FileText, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const SalesContractsDisplay = ({ onBack, onViewContract }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    fetchContracts();
  }, [dateRange]);

  useEffect(() => {
    if (contracts.length > 0) {
      filterContracts();
    }
  }, [searchQuery, contracts, statusFilter, sortField, sortDirection]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('sales_contracts')
        .select('*');
      
      // Apply date range filter if set
      if (dateRange?.from) {
        query = query.gte('start_date', dateRange.from.toISOString());
        
        if (dateRange.to) {
          // Add one day to include the end date fully
          const endDate = new Date(dateRange.to);
          endDate.setDate(endDate.getDate() + 1);
          query = query.lt('end_date', endDate.toISOString());
        }
      }
      
      query = query.order(sortField, { ascending: sortDirection === 'asc' });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        console.log('Contracts fetched:', data);
        setContracts(data);
        setFilteredContracts(data);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast({
        title: "Error",
        description: "Failed to load contracts: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterContracts = () => {
    let filtered = [...contracts];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(contract => contract.contract_status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contract => 
        contract.customer_name?.toLowerCase().includes(query) || 
        contract.product_category?.toLowerCase().includes(query) ||
        (contract.description && contract.description.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Handle dates
      if (sortField.includes('date')) {
        valueA = new Date(valueA || 0).getTime();
        valueB = new Date(valueB || 0).getTime();
      }
      
      // Handle numbers
      if (sortField === 'contract_value') {
        valueA = parseFloat(valueA || 0);
        valueB = parseFloat(valueB || 0);
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredContracts(filtered);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (status) => {
    let color;
    switch (status) {
      case 'draft':
        color = "bg-gray-500";
        break;
      case 'pending_approval':
        color = "bg-yellow-500";
        break;
      case 'active':
        color = "bg-green-500";
        break;
      case 'completed':
        color = "bg-blue-500";
        break;
      case 'terminated':
        color = "bg-red-500";
        break;
      default:
        color = "bg-gray-500";
    }
    
    return (
      <Badge className={color}>
        {status?.replace('_', ' ')}
      </Badge>
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const handleExport = (format) => {
    try {
      if (filteredContracts.length === 0) {
        toast({
          title: "Export Failed",
          description: "No data to export",
          variant: "destructive",
        });
        return;
      }

      // Convert contracts data to CSV format
      let exportData;
      
      if (format === 'csv' || format === 'excel') {
        // CSV/Excel format
        const csvData = [
          // Header row
          ["ID", "Customer Name", "Customer Type", "Start Date", "End Date", "Product Category", "Contract Value", "Status", "Created At"],
          // Data rows
          ...filteredContracts.map(contract => [
            contract.id,
            contract.customer_name || "",
            contract.customer_type || "",
            contract.start_date ? format(new Date(contract.start_date), "yyyy-MM-dd") : "",
            contract.end_date ? format(new Date(contract.end_date), "yyyy-MM-dd") : "",
            contract.product_category || "",
            contract.contract_value || "0",
            contract.contract_status || "",
            contract.created_at ? format(new Date(contract.created_at), "yyyy-MM-dd") : ""
          ])
        ];
        
        // Convert to CSV string
        exportData = csvData.map(row => row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join(',')).join('\n');
      } else if (format === 'pdf') {
        // For PDF, we'll just prepare the data
        // In a real app, you would use a library like jsPDF
        exportData = JSON.stringify(filteredContracts, null, 2);
        console.log("PDF export data prepared:", exportData);
        
        toast({
          title: "PDF Export",
          description: "PDF export functionality would be implemented with a library like jsPDF",
        });
        return;
      }

      // Create download
      const blob = new Blob([exportData], { type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `sales-contracts-${new Date().toISOString()}.${format === 'excel' ? 'xlsx' : format}`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `Data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateRange(null);
    setSortField("created_at");
    setSortDirection("desc");
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <CardTitle>Sales Contracts</CardTitle>
          <div className="flex items-center gap-2">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="w-[300px]"
            />
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              title="Clear all filters"
              className="flex items-center gap-1"
            >
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-4 flex-wrap flex-1">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contracts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
                className="w-[180px]"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="mr-2 h-4 w-4" /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <Download className="mr-2 h-4 w-4" /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <FileText className="mr-2 h-4 w-4" /> PDF
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">No contracts found. {searchQuery || statusFilter !== "all" || dateRange ? "Try different search criteria." : "Create your first sales contract."}</p>
              {(searchQuery || statusFilter !== "all" || dateRange) && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 font-medium">
                      <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('customer_name')}>
                        Customer {sortField === 'customer_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('product_category')}>
                        Product Category {sortField === 'product_category' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('start_date')}>
                        Start Date {sortField === 'start_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('end_date')}>
                        End Date {sortField === 'end_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('contract_value')}>
                        Value {sortField === 'contract_value' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('contract_status')}>
                        Status {sortField === 'contract_status' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContracts.map((contract) => (
                      <tr key={contract.id} className="border-b hover:bg-muted/30">
                        <td className="p-3">{contract.customer_name}</td>
                        <td className="p-3 capitalize">{contract.product_category || "—"}</td>
                        <td className="p-3">{contract.start_date ? format(new Date(contract.start_date), "MMM d, yyyy") : "—"}</td>
                        <td className="p-3">{contract.end_date ? format(new Date(contract.end_date), "MMM d, yyyy") : "—"}</td>
                        <td className="p-3">{contract.contract_value ? formatCurrency(contract.contract_value) : "—"}</td>
                        <td className="p-3">{getStatusBadge(contract.contract_status)}</td>
                        <td className="p-3">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onViewContract && onViewContract(contract)}
                            className="h-8 w-8 p-0"
                            title="View contract details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesContractsDisplay;
