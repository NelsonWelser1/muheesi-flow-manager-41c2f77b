
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MilkOff, CheckCircle2, Timer, AlertCircle } from 'lucide-react';
import MetricDetailsPopover from '../../reports/components/MetricDetailsPopover';

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

  const getProductionMetricDetails = (metricType) => {
    switch (metricType) {
      case 'activeProducts':
        return {
          title: "Active Products Overview",
          description: "Current products being manufactured across all production lines.",
          details: [
            { label: "Cheese Products", value: Math.floor(batchCount * 0.4) },
            { label: "Milk Products", value: Math.floor(batchCount * 0.35) },
            { label: "Yogurt Products", value: Math.floor(batchCount * 0.25) }
          ],
          trend: batchCount > 0 ? { type: 'positive', value: 'Active' } : { type: 'negative', value: 'Idle' },
          additionalInfo: "Product batches are monitored in real-time throughout the production cycle."
        };
      
      case 'totalProduction':
        return {
          title: "Total Production Analysis",
          description: "Combined production weight across all active manufacturing processes.",
          details: [
            { label: "Today's Production", value: `${production} kg` },
            { label: "Weekly Average", value: `${(parseFloat(production) * 7.2).toFixed(0)} kg` },
            { label: "Monthly Target", value: `${(parseFloat(production) * 30 * 1.15).toFixed(0)} kg` },
            { label: "Capacity Utilization", value: "78.5%" }
          ],
          trend: { type: 'positive', value: '+12%' },
          additionalInfo: "Production metrics include processing, packaging, and quality control stages."
        };
      
      case 'qualityScore':
        return {
          title: "Quality Score Breakdown",
          description: "Comprehensive quality assessment across all production parameters.",
          details: [
            { label: "Raw Material Quality", value: `${Math.min(quality + 5, 100)}%` },
            { label: "Process Compliance", value: `${quality}%` },
            { label: "Final Product Testing", value: `${Math.min(quality + 3, 100)}%` },
            { label: "Packaging Standards", value: `${Math.min(quality + 2, 100)}%` }
          ],
          trend: quality >= 85 ? { type: 'positive', value: 'Excellent' } : quality >= 70 ? { type: 'positive', value: 'Good' } : { type: 'negative', value: 'Needs Improvement' },
          additionalInfo: quality >= 85 ? "Quality scores exceed industry standards." : quality >= 70 ? "Quality scores meet acceptable standards." : "Quality improvement measures should be implemented."
        };
      
      default:
        return {
          title: "Production Metric",
          description: "Detailed production information.",
          details: [],
          additionalInfo: "Real-time production monitoring system."
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricDetailsPopover
        trigger={
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{batchCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {batchCount === 0 ? 'No active products' : `${batchCount} different product types`}
              </p>
            </CardContent>
          </Card>
        }
        {...getProductionMetricDetails('activeProducts')}
        value={batchCount}
      />
      
      <MetricDetailsPopover
        trigger={
          <Card className="transition-all hover:shadow-md">
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
        }
        {...getProductionMetricDetails('totalProduction')}
        value={`${production} kg`}
      />

      <MetricDetailsPopover
        trigger={
          <Card className="transition-all hover:shadow-md">
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
        }
        {...getProductionMetricDetails('qualityScore')}
        value={`${quality}%`}
      />
    </div>
  );
};

export default ProductionMetrics;
