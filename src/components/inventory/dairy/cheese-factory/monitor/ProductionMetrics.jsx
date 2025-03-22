
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cheese, MilkOff, CheckCircle2, Timer, AlertCircle } from 'lucide-react';

const ProductionMetrics = ({ activeBatches, totalProduction, averageQuality }) => {
  // Ensure default values if props are undefined
  const batchCount = Array.isArray(activeBatches) ? activeBatches.length : 0;
  const production = totalProduction || '0';
  const quality = averageQuality || 0;
  
  // Determine quality indicator color
  const getQualityColor = (score) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };
  
  const qualityColor = getQualityColor(quality);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          <Cheese className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{batchCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {batchCount === 0 ? 'No active products' : `${batchCount} different product types`}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Production</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{production} kg</div>
          <p className="text-xs text-muted-foreground mt-1">
            Combined production weight
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
          <AlertCircle className={`h-4 w-4 ${qualityColor}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{quality}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`${quality >= 85 ? 'bg-green-500' : quality >= 70 ? 'bg-amber-500' : 'bg-red-500'} h-2 rounded-full`} 
              style={{ width: `${quality}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionMetrics;
