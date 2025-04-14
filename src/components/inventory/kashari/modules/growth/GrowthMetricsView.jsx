
import React from 'react';
import { Card } from "@/components/ui/card";
import CattleGrowth from '../CattleGrowth';

const GrowthMetricsView = () => {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Growth Metrics</h3>
        <CattleGrowth />
      </Card>
    </div>
  );
};

export default GrowthMetricsView;
