
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import QualityMetricsCard from '../QualityMetricsCard';

const QualityContent = ({ qualityMetrics, productionData, onOpenReportForm }) => {
  return (
    <>
      <QualityMetricsCard qualityMetrics={qualityMetrics} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QualityScoresCard productionData={productionData} />
        <QualityImprovementCard onOpenReportForm={onOpenReportForm} />
      </div>
    </>
  );
};

const QualityScoresCard = ({ productionData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Scores by Product</CardTitle>
      </CardHeader>
      <CardContent>
        {productionData.length > 0 ? (
          <ul className="space-y-4">
            {productionData.map((item, index) => (
              <li key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.product}</span>
                  <span className="text-sm">{item.efficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.efficiency >= 90 ? 'bg-green-500' : 
                      item.efficiency >= 70 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${item.efficiency}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No data</AlertTitle>
            <AlertDescription>
              No quality data available. Add quality reports to see them here.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const QualityImprovementCard = ({ onOpenReportForm }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Improvement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Track quality metrics improvement over time. Our quality score is a composite of:
          </p>
          
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-sm">Taste Score:</span>
              <span className="text-sm font-medium">90%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-sm">Texture Score:</span>
              <span className="text-sm font-medium">85%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-sm">Appearance:</span>
              <span className="text-sm font-medium">92%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-sm">Consistency:</span>
              <span className="text-sm font-medium">88%</span>
            </li>
            <li className="flex justify-between border-t pt-2 mt-2">
              <span className="text-sm font-medium">Overall Quality:</span>
              <span className="text-sm font-medium">89%</span>
            </li>
          </ul>
          
          <Button variant="outline" className="w-full" onClick={onOpenReportForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Quality Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityContent;
