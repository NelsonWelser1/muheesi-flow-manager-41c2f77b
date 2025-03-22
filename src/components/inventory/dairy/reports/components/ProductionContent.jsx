
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductionChart from './ProductionChart';

const ProductionContent = ({ productionData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Production Volume by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductionChart data={productionData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Production Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2">Volume</th>
                    <th className="text-left py-2">Efficiency</th>
                    <th className="text-left py-2">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {productionData.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2">{item.product}</td>
                      <td className="py-2">{item.volume} L</td>
                      <td className="py-2">{item.efficiency}%</td>
                      <td className="py-2">{item.quality}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductionContent;
