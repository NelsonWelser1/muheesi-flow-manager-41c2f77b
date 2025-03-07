
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from '../forms/displays/components';

const PerformanceModule = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/manage-inventory/logistics');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <BackButton onBack={handleBack} />
          <h1 className="text-3xl font-bold mt-4">Performance Analytics</h1>
          <p className="text-gray-500">Detailed logistics performance metrics and analysis</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">
            Performance analytics functionality coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceModule;
