
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PerformanceAnalyticsForm from '../forms/PerformanceAnalyticsForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PerformanceModule = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Analytics</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/manage-inventory/logistics')}
        >
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceAnalyticsForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceModule;
