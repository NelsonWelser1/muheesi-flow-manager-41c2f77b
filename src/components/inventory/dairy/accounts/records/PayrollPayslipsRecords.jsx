import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchFilters from './components/payroll/SearchFilters';
import StatusTabs from './components/payroll/StatusTabs';
import PayrollTable from './components/payroll/PayrollTable';
import ExportActions from './components/payroll/ExportActions';
import { usePayrollPayslips } from '../forms/hooks/usePayrollPayslips';

const PayrollPayslipsRecords = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const { toast } = useToast();
  const { payrollRecords, loading, fetchPayrollRecords } = usePayrollPayslips();

  useEffect(() => {
    fetchPayrollRecords();
  }, []);

  useEffect(() => {
    let filtered = [...payrollRecords];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        record =>
          record.payslip_number?.toLowerCase().includes(searchLower) ||
          record.employee_name?.toLowerCase().includes(searchLower) ||
          record.employee_id?.toLowerCase().includes(searchLower) ||
          record.department?.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.payment_status === statusFilter);
    }

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

      filtered = filtered.filter(record => {
        const recordDate = new Date(record.payment_date);
        return recordDate >= startDate && recordDate <= now;
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.payment_date);
      const dateB = new Date(b.payment_date);

      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
        case 'amount-asc':
          return a.net_salary - b.net_salary;
        case 'amount-desc':
          return b.net_salary - a.net_salary;
        case 'name-asc':
          return a.employee_name.localeCompare(b.employee_name);
        case 'name-desc':
          return b.employee_name.localeCompare(a.employee_name);
        default:
          return dateB - dateA;
      }
    });

    setFilteredRecords(filtered);
  }, [payrollRecords, searchTerm, statusFilter, timeRange, sortBy]);

  const handleRefresh = () => {
    fetchPayrollRecords();
    toast({
      title: "Refreshed",
      description: "Payroll records have been refreshed.",
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
          <ExportActions filteredRecords={filteredRecords} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll & Payslips Records</CardTitle>
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </CardHeader>
        <CardContent>
          <StatusTabs 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredRecords={filteredRecords}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollPayslipsRecords;
