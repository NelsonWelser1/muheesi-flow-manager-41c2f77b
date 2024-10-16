import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AccountsChart = ({ companyAccounts }) => {
  const data = companyAccounts.map(company => ({
    name: company.name,
    employees: company.employees.length
  }));

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Company Employees Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="employees" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AccountsChart;