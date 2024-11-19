import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Trash, Edit } from 'lucide-react';

const QuotationsList = () => {
  const mockQuotations = [
    {
      id: 1,
      date: '2024-03-22',
      destination: 'Tianjin',
      incoterm: 'CIF',
      totalRevenue: 150000,
      totalCosts: 120000,
      netProfit: 30000,
    },
    // Add more mock data as needed
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotations</CardTitle>
        <div className="flex gap-4">
          <Input type="date" placeholder="Start Date" />
          <Input type="date" placeholder="End Date" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Revenue</th>
                <th className="text-left p-2">Costs</th>
                <th className="text-left p-2">Profit</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockQuotations.map((quote) => (
                <tr key={quote.id} className="border-b">
                  <td className="p-2">{quote.id}</td>
                  <td className="p-2">{quote.date}</td>
                  <td className="p-2">${quote.totalRevenue}</td>
                  <td className="p-2">${quote.totalCosts}</td>
                  <td className="p-2">${quote.netProfit}</td>
                  <td className="p-2 space-x-2">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationsList;