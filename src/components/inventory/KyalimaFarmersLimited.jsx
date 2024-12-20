import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KyalimaFarmersLimited = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kyalima Farmers Limited</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="kyalima" className="space-y-4">
            <TabsList>
              <TabsTrigger value="kyalima">Kyalima Operations</TabsTrigger>
            </TabsList>

            <TabsContent value="kyalima">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Grain Stock</h3>
                <ul>
                  <li className="mb-1">Maize: 20,000 MT</li>
                  <li className="mb-1">Hulled white sesame: 2,000 MT</li>
                  <li className="mb-1">Soybean: 50,000 MT</li>
                  <li className="mb-1">Cocoa: 500 MT</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KyalimaFarmersLimited;