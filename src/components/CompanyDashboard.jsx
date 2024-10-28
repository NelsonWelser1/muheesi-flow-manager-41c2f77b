import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFactoryOperations, useColdRoomManagement, useDairySalesRecords } from '@/integrations/supabase/hooks/useGrandBernaDairies';
import { useCoffeeInventory, useCoffeeSalesRecords } from '@/integrations/supabase/hooks/useKAJONCoffee';
import { useRiceImports, useBullFattening } from '@/integrations/supabase/hooks/useKyalimaFarmers';
import { useFreshecoInventory, useFreshecoExports } from '@/integrations/supabase/hooks/useFreshecoFarming';
import { Progress } from "@/components/ui/progress";

const CompanyDashboard = () => {
  // Grand Berna Dairies
  const { data: factoryData, isLoading: isLoadingFactory } = useFactoryOperations();
  const { data: coldRoomData, isLoading: isLoadingColdRoom } = useColdRoomManagement();
  const { data: dairySalesData, isLoading: isLoadingDairySales } = useDairySalesRecords();

  // KAJON Coffee
  const { data: coffeeInventory, isLoading: isLoadingCoffee } = useCoffeeInventory();
  const { data: coffeeSales, isLoading: isLoadingCoffeeSales } = useCoffeeSalesRecords();

  // Kyalima Farmers
  const { data: riceImports, isLoading: isLoadingRice } = useRiceImports();
  const { data: bullProgram, isLoading: isLoadingBull } = useBullFattening();

  // Fresheco Farming
  const { data: freshecoInventory, isLoading: isLoadingFresheco } = useFreshecoInventory();
  const { data: freshecoExports, isLoading: isLoadingExports } = useFreshecoExports();

  if (isLoadingFactory || isLoadingColdRoom || isLoadingDairySales || 
      isLoadingCoffee || isLoadingCoffeeSales || isLoadingRice || 
      isLoadingBull || isLoadingFresheco || isLoadingExports) {
    return <div>Loading...</div>;
  }

  const calculateTotalRevenue = (data) => {
    return data?.reduce((acc, record) => acc + (record.revenue || 0), 0) || 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <p>Total Revenue: ${calculateTotalRevenue(dairySalesData).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KAJON Coffee Limited</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Coffee Inventory</h3>
              <p>Total Stock: {coffeeInventory?.length || 0} items</p>
              <Progress value={coffeeInventory?.length ? (coffeeInventory.length / 100) * 100 : 0} className="mt-2" />
            </div>
            <div>
              <h3 className="font-medium">Sales Overview</h3>
              <p>Total Revenue: ${calculateTotalRevenue(coffeeSales).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kyalima Farmers Limited</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Rice Imports</h3>
              <p>Total Imports: {riceImports?.length || 0}</p>
            </div>
            <div>
              <h3 className="font-medium">Bull Fattening Program</h3>
              <p>Active Programs: {bullProgram?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fresheco Farming Limited</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Current Inventory</h3>
              <p>Total Products: {freshecoInventory?.length || 0}</p>
              <Progress value={freshecoInventory?.length ? (freshecoInventory.length / 100) * 100 : 0} className="mt-2" />
            </div>
            <div>
              <h3 className="font-medium">Exports</h3>
              <p>Total Exports: {freshecoExports?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboard;