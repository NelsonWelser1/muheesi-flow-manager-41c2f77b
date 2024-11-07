import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StoreManagement from './StoreManagement';
import FarmManagement from './FarmManagement';

const KazoCoffeeProject = () => {
  const [selectedPage, setSelectedPage] = useState('store');

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-6">
        <Button 
          variant={selectedPage === 'store' ? 'default' : 'outline'}
          onClick={() => setSelectedPage('store')}
        >
          Store Management
        </Button>
        <Button 
          variant={selectedPage === 'farm' ? 'default' : 'outline'}
          onClick={() => setSelectedPage('farm')}
        >
          Farm Management
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {selectedPage === 'store' ? <StoreManagement /> : <FarmManagement />}
        </CardContent>
      </Card>
    </div>
  );
};

export default KazoCoffeeProject;