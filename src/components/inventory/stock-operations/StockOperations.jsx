
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ReceiveNewStock from '../kajon/stock-operations/ReceiveNewStock';
import SellCurrentStock from './SellCurrentStock';
import RelocateStock from './RelocateStock';
import ReceivePartnerStock from './ReceivePartnerStock';

const StockOperations = ({ isKazo = false }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="receive-new" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="receive-new">Receive New Stock</TabsTrigger>
            <TabsTrigger value="sell">Sell Current Stock</TabsTrigger>
            <TabsTrigger value="relocate">Relocate Stock</TabsTrigger>
            <TabsTrigger value="receive-partner">Receive Partner Stock</TabsTrigger>
          </TabsList>

          <TabsContent value="receive-new">
            <ReceiveNewStock isKazo={isKazo} />
          </TabsContent>

          <TabsContent value="sell">
            <SellCurrentStock isKazo={isKazo} />
          </TabsContent>

          <TabsContent value="relocate">
            <RelocateStock isKazo={isKazo} />
          </TabsContent>

          <TabsContent value="receive-partner">
            <ReceivePartnerStock isKazo={isKazo} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StockOperations;
