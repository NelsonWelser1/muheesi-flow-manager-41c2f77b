
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, ArrowLeftRight, Truck, Eye } from "lucide-react";
import ReceiveNewStock from '../kajon/stock-operations/ReceiveNewStock';
import SellCurrentStock from './SellCurrentStock';
import RelocateStock from './RelocateStock';
import ReceivePartnerStock from './ReceivePartnerStock';
import CoffeeInventoryRecords from './records/CoffeeInventoryRecords';

const StockOperations = ({ isKazo = false }) => {
  const [activeComponent, setActiveComponent] = useState(null);
  
  // Define operation tiles
  const operationTiles = [
    {
      id: 'receive-new',
      title: 'Receive New Stock',
      description: 'Record incoming stock from suppliers',
      icon: Package,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      component: <ReceiveNewStock isKazo={isKazo} />
    },
    {
      id: 'sell',
      title: 'Sell Current Stock',
      description: 'Record outgoing stock sales',
      icon: ShoppingCart,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      component: <SellCurrentStock isKazo={isKazo} />
    },
    {
      id: 'relocate',
      title: 'Relocate Stock',
      description: 'Move stock between locations',
      icon: ArrowLeftRight,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      component: <RelocateStock isKazo={isKazo} />
    },
    {
      id: 'receive-partner',
      title: 'Receive Partner Stock',
      description: 'Record stock received from partners',
      icon: Truck,
      color: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
      component: <ReceivePartnerStock isKazo={isKazo} />
    }
  ];

  // Handler for tile click
  const handleTileClick = (tileId) => {
    setActiveComponent(tileId);
  };

  // Handler for back button
  const handleBackClick = () => {
    setActiveComponent(null);
  };

  // Handle view records click
  const handleViewRecords = () => {
    setActiveComponent('records');
  };

  // Render active component
  if (activeComponent === 'records') {
    return (
      <Card>
        <CardContent className="pt-6">
          <CoffeeInventoryRecords onBack={() => setActiveComponent(null)} isKazo={isKazo} />
        </CardContent>
      </Card>
    );
  }
  
  if (activeComponent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              onClick={handleBackClick}
              className="flex items-center gap-2"
            >
              Back to Operations
            </Button>
            
            {activeComponent === 'receive-new' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleViewRecords}
              >
                <Eye className="h-4 w-4" />
                View Records
              </Button>
            )}
          </div>

          {operationTiles.find(tile => tile.id === activeComponent)?.component}
        </CardContent>
      </Card>
    );
  }

  // Render tiles
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-6">Stock Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {operationTiles.map((tile) => (
            <Button
              key={tile.id}
              variant="outline"
              className={`h-32 flex flex-col items-center justify-center space-y-2 ${tile.color} border`}
              onClick={() => handleTileClick(tile.id)}
            >
              <tile.icon className="h-8 w-8" />
              <span className="text-lg font-semibold">{tile.title}</span>
              <span className="text-xs text-gray-500">{tile.description}</span>
            </Button>
          ))}
          
          {activeComponent === 'receive-new' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleViewRecords}
            >
              <Eye className="h-4 w-4" />
              View Records
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockOperations;
