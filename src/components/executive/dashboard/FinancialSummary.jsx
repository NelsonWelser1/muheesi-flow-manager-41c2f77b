
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const FinancialSummary = ({ sales, finance, loading }) => {
  // Sample financial data
  const monthlyRevenue = [
    { name: 'Jan', grand_berna: 35000000, kajon: 25000000, kyalima: 22000000, fresheco: 18000000 },
    { name: 'Feb', grand_berna: 38000000, kajon: 27000000, kyalima: 21000000, fresheco: 19000000 },
    { name: 'Mar', grand_berna: 42000000, kajon: 29000000, kyalima: 24000000, fresheco: 21000000 },
    { name: 'Apr', grand_berna: 40000000, kajon: 28000000, kyalima: 26000000, fresheco: 23000000 },
    { name: 'May', grand_berna: 45000000, kajon: 32000000, kyalima: 28000000, fresheco: 24000000 },
    { name: 'Jun', grand_berna: 48000000, kajon: 30000000, kyalima: 27000000, fresheco: 25000000 }
  ];
  
  const profitLoss = [
    { name: 'Jan', profit: 28000000, expenses: 21000000 },
    { name: 'Feb', profit: 31000000, expenses: 23000000 },
    { name: 'Mar', profit: 35000000, expenses: 25000000 },
    { name: 'Apr', profit: 37000000, expenses: 24000000 },
    { name: 'May', profit: 40000000, expenses: 27000000 },
    { name: 'Jun', profit: 42000000, expenses: 28000000 }
  ];
  
  // Recent financial transactions
  const recentTransactions = [
    {
      id: 1,
      description: 'Coffee Export Payment',
      amount: 175000000,
      type: 'income',
      company: 'KAJON Coffee Limited',
      date: '2025-04-15'
    },
    {
      id: 2,
      description: 'Equipment Purchase',
      amount: 85000000,
      type: 'expense',
      company: 'Grand Berna Dairies',
      date: '2025-04-12'
    },
    {
      id: 3,
      description: 'Milk Distribution Revenue',
      amount: 38000000,
      type: 'income',
      company: 'Grand Berna Dairies',
      date: '2025-04-10'
    },
    {
      id: 4,
      description: 'Farm Supplies',
      amount: 22000000,
      type: 'expense',
      company: 'Kyalima Farmers Limited',
      date: '2025-04-08'
    },
    {
      id: 5,
      description: 'Fresh Produce Sales',
      amount: 45000000,
      type: 'income',
      company: 'Fresheco Farming',
      date: '2025-04-05'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading financial data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Financial Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue by Company</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="grand_berna" name="Grand Berna" stroke="#8B5CF6" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="kajon" name="KAJON Coffee" stroke="#0EA5E9" />
                  <Line type="monotone" dataKey="kyalima" name="Kyalima Farmers" stroke="#10B981" />
                  <Line type="monotone" dataKey="fresheco" name="Fresheco" stroke="#F97316" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Profit/Loss Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Profit vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitLoss}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="profit" name="Profit" fill="#10B981" />
                  <Bar dataKey="expenses" name="Expenses" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5DEFF]">
                  <th className="text-left p-3">Description</th>
                  <th className="text-left p-3">Company</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100">
                    <td className="p-3">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-[#8B5CF6]" />
                        <span className="font-medium">{transaction.description}</span>
                      </div>
                    </td>
                    <td className="p-3">{transaction.company}</td>
                    <td className="p-3">{transaction.date}</td>
                    <td className="p-3 font-medium">UGX {transaction.amount.toLocaleString()}</td>
                    <td className="p-3">
                      {transaction.type === 'income' ? (
                        <Badge className="bg-green-100 text-green-800 flex items-center justify-center w-20">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          Income
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 flex items-center justify-center w-20">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          Expense
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;
