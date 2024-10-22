import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGrandBernaDairies, useKAJONCoffeeLimiteds, useKyalimaFarmersLimiteds } from '@/integrations/supabase';

const CompanyDashboard = () => {
  const { data: grandBernaData, isLoading: isLoadingGrandBerna } = useGrandBernaDairies();
  const { data: kajonData, isLoading: isLoadingKajon } = useKAJONCoffeeLimiteds();
  const { data: kyalimaData, isLoading: isLoadingKyalima } = useKyalimaFarmersLimiteds();

  if (isLoadingGrandBerna || isLoadingKajon || isLoadingKyalima) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Grand Berna Dairies</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total entries: {grandBernaData?.length || 0}</p>
          {/* Add more specific data display here */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>KAJON Coffee Limited</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total entries: {kajonData?.length || 0}</p>
          {/* Add more specific data display here */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Kyalima Farmers Limited</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total entries: {kyalimaData?.length || 0}</p>
          {/* Add more specific data display here */}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboard;