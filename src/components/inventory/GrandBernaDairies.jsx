import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const GrandBernaDairies = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">Grand Berna Dairies Management</h1>
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Grand Berna Dairies</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-600">Content has been temporarily removed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrandBernaDairies;