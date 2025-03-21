
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ProductionContent = ({ productionData, onOpenReportForm }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {productionData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{item.product}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.quantity.toFixed(2)} kg/L</div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">Efficiency:</span>
                <span className="text-xs font-medium">{item.efficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${item.efficiency}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Production Metrics</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="quantity" fill="#8884d8" name="Production Quantity" />
              <Bar yAxisId="right" dataKey="efficiency" fill="#82ca9d" name="Efficiency %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductionDetailsCard productionData={productionData} />
        <ProductionStatsCard productionData={productionData} onOpenReportForm={onOpenReportForm} />
      </div>
    </>
  );
};

const ProductionDetailsCard = ({ productionData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Production</CardTitle>
      </CardHeader>
      <CardContent>
        {productionData.length > 0 ? (
          <ul className="space-y-2">
            {productionData.slice(0, 5).map((item, index) => (
              <li key={index} className="border-b pb-2">
                <div className="flex justify-between">
                  <span className="font-medium">{item.product}</span>
                  <span>{item.quantity.toFixed(2)} kg/L</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Efficiency: {item.efficiency}%
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
            <h3 className="font-bold mb-2">No data</h3>
            <p>No production data available. Add production reports to see them here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProductionStatsCard = ({ productionData, onOpenReportForm }) => {
  const totalProduction = productionData.reduce((sum, item) => sum + item.quantity, 0).toFixed(2);
  const avgEfficiency = Math.round(
    productionData.reduce((sum, item) => sum + item.efficiency, 0) / 
    (productionData.length || 1)
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Total Production</span>
              <span className="text-sm">{totalProduction} kg/L</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Average Efficiency</span>
              <span className="text-sm">{avgEfficiency}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${avgEfficiency}%` }}
              ></div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={onOpenReportForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Production Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionContent;
