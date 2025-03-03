
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const PayrollManager = () => {
  // Fetch payroll data
  const {
    data: payrollData = [],
    isLoading: isLoadingPayroll
  } = useQuery({
    queryKey: ['personnel_payroll'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personnel_payroll')
        .select('*')
        .order('payment_date', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="space-y-4">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Payroll Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPayroll ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading payroll data...</TableCell>
                  </TableRow>
                ) : payrollData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No payroll data found</TableCell>
                  </TableRow>
                ) : (
                  payrollData.map(payroll => (
                    <TableRow key={payroll.id}>
                      <TableCell>{payroll.employee_id}</TableCell>
                      <TableCell>
                        {format(new Date(payroll.payment_date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>${payroll.base_salary?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>${payroll.bonus?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>${payroll.deductions?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell className="font-medium">
                        ${((payroll.base_salary || 0) + (payroll.bonus || 0) - (payroll.deductions || 0)).toFixed(2)}
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

export default PayrollManager;
