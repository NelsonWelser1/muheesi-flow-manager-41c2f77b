import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockSalesData = [
  { month: 'Jan', sales: 4000000 },
  { month: 'Feb', sales: 3000000 },
  { month: 'Mar', sales: 2000000 },
  { month: 'Apr', sales: 2780000 },
  { month: 'May', sales: 1890000 },
  { month: 'Jun', sales: 2390000 },
];

const mockTransactions = [
  { id: 1, date: '2024-04-14', product: 'Fresh Milk', quantity: 500, amount: 1500000 },
  { id: 2, date: '2024-04-14', product: 'Yogurt', quantity: 200, amount: 800000 },
  { id: 3, date: '2024-04-13', product: 'Cheese', quantity: 100, amount: 1200000 },
  { id: 4, date: '2024-04-13', product: 'Butter', quantity: 150, amount: 600000 },
];

const SalesAnalytics = () => {
  console.log('Rendering SalesAnalytics component');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `UGX ${value.toLocaleString()}`}
                />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.product}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>UGX {transaction.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesAnalytics;