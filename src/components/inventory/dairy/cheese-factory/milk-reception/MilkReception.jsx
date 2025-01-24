import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import MilkReceptionForm from './MilkReceptionForm';
import { useMilkReception } from '@/hooks/useMilkReception';

const MilkReception = () => {
  const { receptionData, isLoading } = useMilkReception();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Milk Reception Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="entry" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <TabsTrigger value="entry">Data Entry</TabsTrigger>
            <TabsTrigger value="history">View History</TabsTrigger>
          </TabsList>

          <TabsContent value="entry">
            <MilkReceptionForm />
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Supplier</th>
                      <th className="p-2 text-left">Volume (L)</th>
                      <th className="p-2 text-left">Temperature (°C)</th>
                      <th className="p-2 text-left">Fat %</th>
                      <th className="p-2 text-left">Protein %</th>
                      <th className="p-2 text-left">Quality Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center">Loading...</td>
                      </tr>
                    ) : receptionData?.length > 0 ? (
                      receptionData.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{format(new Date(item.datetime), 'yyyy-MM-dd HH:mm')}</td>
                          <td className="p-2">{item.supplier_name}</td>
                          <td className="p-2">{item.milk_volume}</td>
                          <td className="p-2">{item.temperature}</td>
                          <td className="p-2">{item.fat_percentage}</td>
                          <td className="p-2">{item.protein_percentage}</td>
                          <td className="p-2">{item.quality_score || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-gray-500">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MilkReception;