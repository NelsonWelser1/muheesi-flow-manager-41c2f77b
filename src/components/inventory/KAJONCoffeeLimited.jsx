import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import StockUpdateForm from './kajon/StockUpdateForm';
import StockSummary from './kajon/StockSummary';
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import { useAddKAJONCoffeeLimited } from '@/integrations/supabase/hooks/useKAJONCoffeeLimited';

const KAJONCoffeeLimited = () => {
  const { toast } = useToast();
  const [selectedInterface, setSelectedInterface] = useState(null);
  const [currentStock, setCurrentStock] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [verificationStep, setVerificationStep] = useState(false);
  const [pin, setPin] = useState('');
  const addStockMutation = useAddKAJONCoffeeLimited();

  const currentUser = {
    name: "Nelson Welser",
    authorizedLocations: ["Kampala Store", "Mbarara Warehouse", "Kakyinga Factory"]
  };

  const handleBack = () => {
    setSelectedInterface(null);
    setSelectedAction(null);
    setVerificationStep(false);
    setPin('');
  };

  if (!selectedInterface) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KAJON Coffee Limited</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-4 text-lg font-semibold"
              onClick={() => setSelectedInterface('kajon')}
            >
              Update KAJON Coffee Limited Stock
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-4 text-lg font-semibold"
              onClick={() => setSelectedInterface('kazo')}
            >
              Update Kazo Coffee Development Project Stock
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedInterface === 'kajon' ? 'Stock Update' : 'Kazo Coffee Development Project'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedInterface === 'kajon' ? (
            !selectedAction ? (
              <StockUpdateForm
                currentUser={currentUser}
                verificationStep={verificationStep}
                pin={pin}
                onPinChange={setPin}
                onBack={() => setVerificationStep(false)}
                actionType={selectedAction}
              />
            ) : (
              <StockSummary stock={currentStock} />
            )
          ) : (
            <KazoCoffeeProject />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KAJONCoffeeLimited;