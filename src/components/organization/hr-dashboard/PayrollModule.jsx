
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, FileText, Calculator } from 'lucide-react';

const PayrollModule = () => {
  const payrollSummary = {
    totalEmployees: 156,
    totalSalaries: "UGX 45,250,000",
    totalDeductions: "UGX 6,750,000",
    netPayroll: "UGX 38,500,000",
    lastProcessed: "2024-01-31"
  };

  const companyBreakdown = [
    {
      company: "Grand Berna Dairies",
      employees: 85,
      totalSalary: "UGX 28,500,000",
      netPayroll: "UGX 24,225,000"
    },
    {
      company: "KAJON Coffee",
      employees: 45,
      totalSalary: "UGX 12,250,000",
      netPayroll: "UGX 10,412,500"
    },
    {
      company: "Kyalima Farmers",
      employees: 26,
      totalSalary: "UGX 4,500,000",
      netPayroll: "UGX 3,825,000"
    }
  ];

  const upcomingPayroll = [
    {
      period: "February 2024",
      dueDate: "2024-02-28",
      status: "Pending",
      employees: 156
    },
    {
      period: "January 2024",
      dueDate: "2024-01-31",
      status: "Completed",
      employees: 156
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollSummary.totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gross Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollSummary.totalSalaries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollSummary.totalDeductions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollSummary.netPayroll}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Company Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {companyBreakdown.map((company, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{company.company}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Employees</p>
                    <p className="font-medium">{company.employees}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Salary</p>
                    <p className="font-medium">{company.totalSalary}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Net Payroll</p>
                    <p className="font-medium text-green-600">{company.netPayroll}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Payroll Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingPayroll.map((payroll, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{payroll.period}</h3>
                  <Badge variant={payroll.status === 'Completed' ? 'default' : 'secondary'}>
                    {payroll.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Due: {payroll.dueDate}</p>
                  <p>Employees: {payroll.employees}</p>
                </div>
                <Button size="sm" className="w-full mt-3" variant="outline">
                  {payroll.status === 'Completed' ? 'View Details' : 'Process Payroll'}
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button className="flex-1">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Payroll
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayrollModule;
