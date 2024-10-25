import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFactoryOperations, useColdRoomManagement, useDairySalesRecords } from '@/integrations/supabase/hooks/useGrandBernaDairies';
import { Progress } from "@/components/ui/progress";

const CompanyDashboard = () => {
  const { data: factoryData, isLoading: isLoadingFactory } = useFactoryOperations();
  const { data: coldRoomData, isLoading: isLoadingColdRoom } = useColdRoomManagement();
  const { data: salesData, isLoading: isLoadingSales } = useDairySalesRecords();

  if (isLoadingFactory || isLoadingColdRoom || isLoadingSales) {
    return <div>Loading...</div>;
  }

  const calculateTotalRevenue = (data) => {
    return data?.reduce((acc, record) => acc + (record.revenue || 0), 0) || 0;
  };

  const totalRevenue = calculateTotalRevenue(salesData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Grand Berna Dairies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Factory Operations</h3>
              <p>Total Products: {factoryData?.length || 0}</p>
              <Progress value={factoryData?.length ? (factoryData.length / 100) * 100 : 0} className="mt-2" />
            </div>
            <div>
              <h3 className="font-medium">Cold Room Status</h3>
              <p>Active Storage Units: {coldRoomData?.length || 0}</p>
            </div>
            <div>
              <h3 className="font-medium">Sales Overview</h3>
              <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Add similar cards for KAJON Coffee and Kyalima Farmers */}
    </div>
  );
};

export default CompanyDashboard;