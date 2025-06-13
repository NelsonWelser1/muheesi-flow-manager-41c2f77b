
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePaymentsReceipts } from '@/integrations/supabase/hooks/accounting/payments/usePaymentsReceipts';
import SearchFilters from './components/payments/SearchFilters';
import StatusTabs from './components/payments/StatusTabs';
import ExportActions from './components/payments/ExportActions';

const PaymentsReceiptsRecords = ({ onBack }) => {
  const { payments, loading, fetchPayments } = usePaymentsReceipts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter and sort payments based on filters
  useEffect(() => {
    let filtered = [...payments];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        payment =>
          payment.paymentNumber?.toLowerCase().includes(searchLower) ||
          payment.partyName?.toLowerCase().includes(searchLower) ||
          payment.referenceNumber?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by payment type
    if (paymentTypeFilter !== 'all') {
      filtered = filtered.filter(payment => payment.paymentType === paymentTypeFilter);
    }

    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case 'hour':
          startDate.setHours(now.getHours() - 1);
          break;
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= startDate && paymentDate <= now;
      });
    }

    // Sort payments
    filtered.sort((a, b) => {
      const dateA = new Date(a.paymentDate);
      const dateB = new Date(b.paymentDate);

      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        case 'name-asc':
          return a.partyName.localeCompare(b.partyName);
        case 'name-desc':
          return b.partyName.localeCompare(a.partyName);
        default:
          return dateB - dateA;
      }
    });

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, timeRange, sortBy, paymentTypeFilter]);

  const handleRefresh = () => {
    fetchPayments();
    toast({
      title: "Refreshed",
      description: "Payment records have been refreshed.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Form
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <ExportActions filteredRecords={filteredPayments} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments & Receipts Records</CardTitle>
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            paymentTypeFilter={paymentTypeFilter}
            setPaymentTypeFilter={setPaymentTypeFilter}
          />
        </CardHeader>
        <CardContent>
          <StatusTabs 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredRecords={filteredPayments}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsReceiptsRecords;
