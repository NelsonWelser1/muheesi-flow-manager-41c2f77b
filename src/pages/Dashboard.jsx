import React from 'react';
import CompanyDashboard from '@/components/CompanyDashboard';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <CompanyDashboard />
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
    </div>
  );
};

export default Dashboard;
