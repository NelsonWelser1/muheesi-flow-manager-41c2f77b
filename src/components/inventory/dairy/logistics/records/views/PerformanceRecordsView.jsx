
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PerformanceRecords from '../PerformanceRecords';

const PerformanceRecordsView = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-4"
      >
        ← Back to Performance Analytics
      </Button>
      
      <PerformanceRecords />
    </div>
  );
};

export default PerformanceRecordsView;
