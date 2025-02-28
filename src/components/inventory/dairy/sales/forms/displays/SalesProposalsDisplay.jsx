
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { ArrowLeft, Search, Download, Printer, FileDown, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import { format, subHours, subDays, subWeeks, subMonths, subYears } from 'date-fns';

const SalesProposalsDisplay = ({ onBack }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Function to fetch proposals with time range filter
  const fetchProposals = async (range = timeRange) => {
    setLoading(true);
    try {
      // Start building query
      let query = supabase.from('sales_proposals').select('*');
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`customer_name.ilike.%${searchTerm}%,proposal_id.ilike.%${searchTerm}%,contact_email.ilike.%${searchTerm}%`);
      }
      
      // Apply time range filter
      if (range !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (range) {
          case 'hour':
            startDate = subHours(now, 1);
            break;
          case 'day':
            startDate = subDays(now, 1);
            break;
          case 'week':
            startDate = subWeeks(now, 1);
            break;
          case 'month':
            startDate = subMonths(now, 1);
            break;
          case 'year':
            startDate = subYears(now, 1);
            break;
          default:
            startDate = null;
        }
        
        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }
      
      // Execute query
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Fetched proposals:', data);
      
      if (data) {
        setProposals(data);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast({
        title: "Error",
        description: "Failed to load proposals: " + error.message,
        variant: "destructive",
      });
      
      // Use sample data on error
      setProposals([
        {
          proposal_id: 'PROP-20240501-001',
          customer_name: 'Acme Corporation',
          contact_email: 'contact@acme.com',
          contact_phone: '+123456789',
          created_at: new Date().toISOString(),
          grand_total: 'UGX 5,000,000',
          products: [
            { id: 1, product_type: 'Cheese', quantity: 50, price: 'UGX 10,000', total_amount: 'UGX 500,000' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    // Create table if it doesn't exist
    const createTableIfNotExists = async () => {
      try {
        // Note: In a real app, this would be done via Supabase migrations
        // This is just a fallback for demonstration purposes
        const { error } = await supabase.rpc('create_sales_proposals_table_if_not_exists');
        if (error && !error.message.includes('does not exist')) {
          console.error('Error checking/creating table:', error);
        }
      } catch (err) {
        console.error('Error in RPC call:', err);
      }
    };
    
    createTableIfNotExists();
    fetchProposals();
  }, []);

  // Fetch data when search term or time range changes
  useEffect(() => {
    fetchProposals(timeRange);
  }, [searchTerm, timeRange]);

  // Handle time range adjustment
  const adjustTimeRange = (direction) => {
    const ranges = ['hour', 'day', 'week', 'month', 'year', 'all'];
    const currentIndex = ranges.indexOf(timeRange);
    
    if (direction === 'increase') {
      // Move to wider time range (right in the array)
      const newIndex = Math.min(currentIndex + 1, ranges.length - 1);
      setTimeRange(ranges[newIndex]);
    } else {
      // Move to narrower time range (left in the array)
      const newIndex = Math.max(currentIndex - 1, 0);
      setTimeRange(ranges[newIndex]);
    }
  };

  // Handle export as CSV
  const handleExportCSV = () => {
    try {
      // Create CSV content
      const headers = ["Proposal ID", "Customer Name", "Email", "Phone", "Date", "Grand Total"];
      const csvRows = [headers];
      
      proposals.forEach(proposal => {
        const row = [
          proposal.proposal_id,
          proposal.customer_name,
          proposal.contact_email,
          proposal.contact_phone,
          format(new Date(proposal.created_at), 'yyyy-MM-dd HH:mm'),
          proposal.grand_total
        ];
        csvRows.push(row);
      });
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales_proposals_${format(new Date(), 'yyyyMMdd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "CSV file has been downloaded",
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Error",
        description: "Failed to export data: " + error.message,
        variant: "destructive",
      });
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Format the time range for display
  const formatTimeRangeDisplay = () => {
    switch (timeRange) {
      case 'hour': return 'Last Hour';
      case 'day': return 'Last 24 Hours';
      case 'week': return 'Last Week';
      case 'month': return 'Last Month';
      case 'year': return 'Last Year';
      case 'all': return 'All Time';
      default: return 'Custom Range';
    }
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
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Sales Proposals</span>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => adjustTimeRange('decrease')}
                disabled={timeRange === 'hour'}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {formatTimeRangeDisplay()}
              </span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => adjustTimeRange('increase')}
                disabled={timeRange === 'all'}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, proposal ID or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <FileDown className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Loading proposals...</div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No proposals found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proposal ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Grand Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((proposal) => (
                    <TableRow key={proposal.proposal_id}>
                      <TableCell className="font-medium">{proposal.proposal_id}</TableCell>
                      <TableCell>
                        <div>{proposal.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{proposal.contact_email}</div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(proposal.created_at), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{proposal.grand_total}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedProposal(proposal)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Proposal Details</DialogTitle>
                              <DialogDescription>
                                Viewing details for proposal {proposal.proposal_id}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedProposal && (
                              <div className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                                    <p className="text-lg">{selectedProposal.customer_name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Contact</p>
                                    <p>{selectedProposal.contact_email}</p>
                                    <p>{selectedProposal.contact_phone}</p>
                                  </div>
                                </div>
                                
                                <div className="border rounded-md p-4">
                                  <h3 className="font-medium mb-2">Products</h3>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>No.</TableHead>
                                        <TableHead>Product Type</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedProposal.products && selectedProposal.products.map((product) => (
                                        <TableRow key={product.id}>
                                          <TableCell>{product.id}</TableCell>
                                          <TableCell>{product.product_type}</TableCell>
                                          <TableCell>{product.quantity}</TableCell>
                                          <TableCell>{product.price}</TableCell>
                                          <TableCell>{product.total_amount}</TableCell>
                                        </TableRow>
                                      ))}
                                      <TableRow>
                                        <TableCell colSpan={4} className="text-right font-bold">Grand Total:</TableCell>
                                        <TableCell className="font-bold">{selectedProposal.grand_total}</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                                
                                {selectedProposal.terms_conditions && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Terms & Conditions</p>
                                    <p className="whitespace-pre-wrap">{selectedProposal.terms_conditions}</p>
                                  </div>
                                )}
                                
                                <div className="flex justify-end gap-2">
                                  <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                  </DialogClose>
                                  <Button onClick={handlePrint}>Print Proposal</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesProposalsDisplay;
