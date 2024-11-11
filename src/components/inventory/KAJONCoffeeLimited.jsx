import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockUpdateForm from './kajon/StockUpdateForm';
import StockSummary from './kajon/StockSummary';
import ViewCurrentStock from './ViewCurrentStock';
import MakeReports from './MakeReports';
import ManageFarms from './ManageFarms';
import ManageAssociations from './ManageAssociations';
import MakeRequisitions from './MakeRequisitions';
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
        <CardContent className="space-y-4 pt-6">
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
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={handleBack}
        className="mb-4"
      >
        Back
      </Button>
      
      <Card>
        <CardContent className="pt-6">
          {selectedInterface === 'kajon' ? (
            <Tabs defaultValue="update-stock" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="update-stock">Update Stock</TabsTrigger>
                <TabsTrigger value="view-stock">View Stock</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="farms">Farms</TabsTrigger>
                <TabsTrigger value="associations">Associations</TabsTrigger>
                <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
              </TabsList>

              <TabsContent value="update-stock">
                {!selectedAction ? (
                  <StockUpdateForm
                    currentUser={currentUser}
                    verificationStep={verificationStep}
                    pin={pin}
                    onPinChange={setPin}
                    onBack={() => setVerificationStep(false)}
                    actionType={selectedAction}
                    onSubmit={(data) => {
                      addStockMutation.mutate(data, {
                        onSuccess: () => {
                          toast({
                            title: "Stock Updated",
                            description: "The stock has been successfully updated.",
                          });
                          handleBack();
                        },
                        onError: (error) => {
                          toast({
                            title: "Error",
                            description: "Failed to update stock. Please try again.",
                            variant: "destructive",
                          });
                        },
                      });
                    }}
                  />
                ) : (
                  <StockSummary stock={currentStock} />
                )}
              </TabsContent>

              <TabsContent value="view-stock">
                <ViewCurrentStock />
              </TabsContent>

              <TabsContent value="reports">
                <MakeReports />
              </TabsContent>

              <TabsContent value="farms">
                <ManageFarms />
              </TabsContent>

              <TabsContent value="associations">
                <ManageAssociations />
              </TabsContent>

              <TabsContent value="requisitions">
                <MakeRequisitions />
              </TabsContent>
            </Tabs>
          ) : (
            <KazoCoffeeProject />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KAJONCoffeeLimited;