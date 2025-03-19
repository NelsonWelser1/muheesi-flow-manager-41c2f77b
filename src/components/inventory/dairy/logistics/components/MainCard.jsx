
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContentView from './ContentView';
import FeatureTiles from './FeatureTiles';

const MainCard = ({ 
  activeComponent, 
  setActiveComponent, 
  handleBack,
  activeDeliveries,
  pendingOrders,
  avgDeliveryTime,
  delayedDeliveries 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Logistics & Distribution Management</span>
          {!activeComponent && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setActiveComponent('records')}
              className="flex items-center gap-2"
            >
              View All Records
            </Button>
          )}
          {activeComponent && activeComponent !== 'records' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              ← Back to All Options
            </Button>
          )}
          {activeComponent === 'records' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              ← Back to Management
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeComponent ? (
          <ContentView 
            activeComponent={activeComponent} 
            handleBack={handleBack} 
          />
        ) : (
          <FeatureTiles
            onSelectComponent={setActiveComponent}
            activeDeliveries={activeDeliveries}
            pendingOrders={pendingOrders}
            avgDeliveryTime={avgDeliveryTime}
            delayedDeliveries={delayedDeliveries}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MainCard;
