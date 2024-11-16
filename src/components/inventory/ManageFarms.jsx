import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FarmDetails from './farms/FarmDetails';
import FarmOperations from './farms/FarmOperations';
import FarmAnalytics from './farms/FarmAnalytics';
import ImageAnalysis from './farms/ImageAnalysis';

const ManageFarms = ({ isKazo = false }) => {
  const [selectedFarm, setSelectedFarm] = useState(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isKazo ? "Kazo Coffee Development Project Farms" : "KAJON Coffee Limited Farms"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="details">Farm Details</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="image-analysis">Image Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <FarmDetails isKazo={isKazo} selectedFarm={selectedFarm} />
          </TabsContent>

          <TabsContent value="operations">
            <FarmOperations isKazo={isKazo} selectedFarm={selectedFarm} />
          </TabsContent>

          <TabsContent value="analytics">
            <FarmAnalytics isKazo={isKazo} selectedFarm={selectedFarm} />
          </TabsContent>

          <TabsContent value="image-analysis">
            <ImageAnalysis isKazo={isKazo} selectedFarm={selectedFarm} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ManageFarms;