
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { usePaymentsReceipts } from "@/integrations/supabase/hooks/accounting/payments";
import { useToast } from "@/components/ui/use-toast";
import PaymentsReceiptsTabs from './components/PaymentsReceiptsTabs';
import SearchFilters from './components/SearchFilters';
import ExportActions from './components/ExportActions';

const PaymentsReceiptsRecords = ({ setActiveView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const { payments, fetchPaymentsReceipts } = usePaymentsReceipts();
  const { toast } = useToast();
  
  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      await fetchPaymentsReceipts();
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error",
        description: "Could not load payment records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter records based on search term, status, and time range
  const filteredRecords = React.useMemo(() => {
    let filtered = [...payments];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.payment_number?.toLowerCase().includes(term) ||
        record.party_name?.toLowerCase().includes(term) ||
        record.payment_method?.toLowerCase().includes(term) ||
        String(record.amount).includes(term)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'this-week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'this-month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'this-year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.payment_date);
          return recordDate >= startDate && recordDate <= now;
        });
      }
    }
    
    // Sort records
    filtered.sort((a, b) => {
      const dateA = new Date(a.payment_date);
      const dateB = new Date(b.payment_date);
      
      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        default:
          return dateB - dateA;
      }
    });
    
    return filtered;
  }, [payments, searchTerm, statusFilter, timeRange, sortBy]);
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-[#f8fafc]">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <CardTitle>Payments & Receipts Records</CardTitle>
            <CardDescription className="mt-1">
              View and manage all payment and receipt records
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
            <ExportActions filteredRecords={filteredRecords} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SearchFilters 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          
          <PaymentsReceiptsTabs 
            filteredRecords={filteredRecords} 
            isLoading={isLoading} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsReceiptsRecords;
