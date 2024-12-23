import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DairyCoolers from './dairy/DairyCoolers';
import FactoryStock from './dairy/FactoryStock';
import ColdRoomStock from './dairy/ColdRoomStock';
import SlaughterhouseStock from './dairy/SlaughterhouseStock';
import SalesMarketing from './dairy/SalesMarketing';

const GrandBernaDairies = () => {
  const [selectedComponent, setSelectedComponent] = React.useState(null);

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'coolers':
        return <DairyCoolers />;
      case 'factory':
        return <FactoryStock />;
      case 'coldroom':
        return <ColdRoomStock />;
      case 'slaughterhouse':
        return <SlaughterhouseStock />;
      case 'sales':
        return <SalesMarketing />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">Grand Berna Dairies Management</h1>
      
      {!selectedComponent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedComponent('coolers')}
          >
            <CardHeader>
              <CardTitle className="text-[#0FA0CE]">Dairy Coolers</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Manage milk storage and temperature control
              </p>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedComponent('factory')}
          >
            <CardHeader>
              <CardTitle className="text-[#F97316]">Factory Stock</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Monitor and manage factory inventory
              </p>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedComponent('coldroom')}
          >
            <CardHeader>
              <CardTitle className="text-[#7E69AB]">Cold Room Stock</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Track cold storage inventory
              </p>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedComponent('slaughterhouse')}
          >
            <CardHeader>
              <CardTitle className="text-[#ea384c]">Slaughterhouse</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Manage slaughterhouse operations
              </p>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedComponent('sales')}
          >
            <CardHeader>
              <CardTitle className="text-[#9b87f5]">Sales & Marketing</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Manage sales operations and marketing campaigns
              </p>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedComponent(null)}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          {renderComponent()}
        </div>
      )}
    </div>
  );
};

export default GrandBernaDairies;
