import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KyalimaFarmersLimited = () => {
  const grainStock = [
    { name: 'Maize', quantity: '20,000', unit: 'MT' },
    { name: 'Hulled white sesame', quantity: '2,000', unit: 'MT' },
    { name: 'Soybean', quantity: '50,000', unit: 'MT' },
    { name: 'Cocoa', quantity: '500', unit: 'MT' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kyalima Farmers Limited Stock Update</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Grain Stock</h3>
          <ul>
            {grainStock.map((item, index) => (
              <li key={index} className="mb-1">
                {item.name}: {item.quantity} {item.unit}
              </li>
            ))}
          </ul>
          {/* Add other stock management components here */}
        </CardContent>
      </Card>
    </div>
  );
};

export default KyalimaFarmersLimited;