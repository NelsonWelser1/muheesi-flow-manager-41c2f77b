import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Milk, Factory, Snowflake } from 'lucide-react';
import DairyCoolers from './dairy/DairyCoolers';
import FactoryStock from './dairy/FactoryStock';
import ColdRoomStock from './dairy/ColdRoomStock';

const GrandBernaDairies = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  
  const handleBack = () => {
    setSelectedSection(null);
  };

  if (selectedSection) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{selectedSection === 'dairyCoolers' ? 'Dairy Coolers' : 
              selectedSection === 'factory' ? 'Factory' : 'Cold Room'}</CardTitle>
            <Button variant="ghost" onClick={handleBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            {selectedSection === 'dairyCoolers' && <DairyCoolers />}
            {selectedSection === 'factory' && <FactoryStock />}
            {selectedSection === 'coldRoom' && <ColdRoomStock />}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grand Berna Dairies Stock Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center space-y-2"
              onClick={() => setSelectedSection('dairyCoolers')}
            >
              <Milk className="h-8 w-8" />
              <span className="text-lg font-semibold">Dairy Coolers</span>
            </Button>
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center space-y-2"
              onClick={() => setSelectedSection('factory')}
            >
              <Factory className="h-8 w-8" />
              <span className="text-lg font-semibold">Factory</span>
            </Button>
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center space-y-2"
              onClick={() => setSelectedSection('coldRoom')}
            >
              <Snowflake className="h-8 w-8" />
              <span className="text-lg font-semibold">Cold Room</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrandBernaDairies;