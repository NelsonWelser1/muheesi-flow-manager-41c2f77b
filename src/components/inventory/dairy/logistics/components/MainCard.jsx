
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
  // Determine the appropriate back button text based on the active component
  const getBackButtonText = () => {
    if (!activeComponent) return null;
    if (activeComponent === 'records') return '← Back to Management';
    return '← Back to All Options';
  };

  // Only render back button if there's an active component
  const renderBackButton = () => {
    const backText = getBackButtonText();
    if (!backText) return null;
    
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBack} 
        className="flex items-center gap-2"
      >
        {backText}
      </Button>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Logistics & Distribution Management</span>
          {renderBackButton()}
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
