
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

const PayrollPayslipsRecords = ({ onBack }) => {
  // Temporary mock data until we have a real API hook
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const { toast } = useToast();

  // Mock fetch function - in a real app, this would call the Supabase hook
  const fetchPayrollRecords = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          payslipNumber: 'PAY-1234-5678',
          employeeName: 'John Doe',
          employeeId: 'EMP001',
          department: 'Operations',
          salaryPeriod: 'monthly',
          paymentDate: '2023-06-15',
          basicSalary: 1500000,
          taxAmount: 150000,
          nssfAmount: 75000,
          loanDeduction: 50000,
          otherDeductions: 25000,
          netSalary: 1200000,
          currency: 'UGX',
          paymentStatus: 'paid',
          paymentMethod: 'bank_transfer',
          notes: 'Regular monthly salary'
        },
        {
          id: 2,
          payslipNumber: 'PAY-2345-6789',
          employeeName: 'Jane Smith',
          employeeId: 'EMP002',
          department: 'Finance',
          salaryPeriod: 'monthly',
          paymentDate: '2023-06-15',
          basicSalary: 1800000,
          taxAmount: 180000,
          nssfAmount: 90000,
          loanDeduction: 0,
          otherDeductions: 30000,
          netSalary: 1500000,
          currency: 'UGX',
          paymentStatus: 'paid',
          paymentMethod: 'bank_transfer',
          notes: 'Regular monthly salary'
        },
        {
          id: 3,
          payslipNumber: 'PAY-3456-7890',
          employeeName: 'Mike Johnson',
          employeeId: 'EMP003',
          department: 'Production',
          salaryPeriod: 'monthly',
          paymentDate: '2023-06-15',
          basicSalary: 1200000,
          taxAmount: 120000,
          nssfAmount: 60000,
          loanDeduction: 100000,
          otherDeductions: 0,
          netSalary: 920000,
          currency: 'UGX',
          paymentStatus: 'pending',
          paymentMethod: 'bank_transfer',
          notes: 'Regular monthly salary'
        },
        {
          id: 4,
          payslipNumber: 'PAY-4567-8901',
          employeeName: 'Sarah Williams',
          employeeId: 'EMP004',
          department: 'Sales',
          salaryPeriod: 'monthly',
          paymentDate: '2023-06-15',
          basicSalary: 1600000,
          taxAmount: 160000,
          nssfAmount: 80000,
          loanDeduction: 0,
          otherDeductions: 0,
          netSalary: 1360000,
          currency: 'UGX',
          paymentStatus: 'paid',
          paymentMethod: 'mobile_money',
          notes: 'Regular monthly salary with performance bonus'
        }
      ];
      setPayrollRecords(mockData);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchPayrollRecords();
  }, []);

  // Filter and sort records based on filters
  useEffect(() => {
    let filtered = [...payrollRecords];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        record =>
          record.payslipNumber?.toLowerCase().includes(searchLower) ||
          record.employeeName?.toLowerCase().includes(searchLower) ||
          record.employeeId?.toLowerCase().includes(searchLower) ||
          record.department?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.paymentStatus === statusFilter);
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

      filtered = filtered.filter(record => {
        const recordDate = new Date(record.paymentDate);
        return recordDate >= startDate && recordDate <= now;
      });
    }

    // Sort records
    filtered.sort((a, b) => {
      const dateA = new Date(a.paymentDate);
      const dateB = new Date(b.paymentDate);

      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
        case 'amount-asc':
          return a.netSalary - b.netSalary;
        case 'amount-desc':
          return b.netSalary - a.netSalary;
        case 'name-asc':
          return a.employeeName.localeCompare(b.employeeName);
        case 'name-desc':
          return b.employeeName.localeCompare(a.employeeName);
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
