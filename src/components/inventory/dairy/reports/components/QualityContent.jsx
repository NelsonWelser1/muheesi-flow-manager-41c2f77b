
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const QualityContent = ({ qualityMetrics, productionData }) => {
  // Sort products by quality score (descending)
  const sortedProducts = [...productionData].sort((a, b) => b.quality - a.quality);
  const topProducts = sortedProducts.slice(0, 3);
  const lowQualityProducts = productionData.filter(product => product.quality < 80);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {qualityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {metric.value}
                <span className="text-sm font-normal ml-1">{metric.unit}</span>
              </div>
              <p className="text-sm text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Quality Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topProducts.map((product, index) => (
                <li key={index} className="flex justify-between items-center p-2 border rounded">
                  <span>{product.product}</span>
                  <span className="font-semibold">{product.quality}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quality Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {lowQualityProducts.length > 0 ? (
              <div className="space-y-2">
                {lowQualityProducts.map((product, index) => (
                  <Alert key={index} variant="destructive" className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                    <AlertDescription>
                      {product.product} has a low quality score of {product.quality}%
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-sm text-muted-foreground">
                No quality alerts at this time
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QualityContent;
