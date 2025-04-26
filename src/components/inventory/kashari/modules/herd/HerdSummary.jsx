
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCattleInventory } from '@/hooks/useCattleInventory';

const HerdSummary = () => {
  const { cattleList, isLoading } = useCattleInventory();
  
  // Calculate summary statistics
  const totalCattle = cattleList?.length || 0;
  const cattleByType = cattleList?.reduce((acc, cattle) => {
    acc[cattle.type] = (acc[cattle.type] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Herd Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading summary data...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Cattle</p>
              <p className="text-2xl font-bold">{totalCattle}</p>
            </div>
            {cattleByType && Object.entries(cattleByType).map(([type, count]) => (
              <div key={type} className="bg-slate-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500 capitalize">{type}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HerdSummary;
