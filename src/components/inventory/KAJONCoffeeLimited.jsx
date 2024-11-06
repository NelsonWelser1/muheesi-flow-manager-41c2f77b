import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StockUpdateForm from './kajon/StockUpdateForm';
import StockSummary from './kajon/StockSummary';
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import { useAddKAJONCoffeeLimited } from '@/integrations/supabase/hooks/useKAJONCoffeeLimited';

const KAJONCoffeeLimited = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStock, setCurrentStock] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [verificationStep, setVerificationStep] = useState(false);
  const [pin, setPin] = useState('');
  const addStockMutation = useAddKAJONCoffeeLimited();

  const currentUser = {
    name: "John Doe",
    authorizedLocations: ["Kampala Store", "Mbarara Warehouse", "Kakyinga Factory"]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationStep) {
      setVerificationStep(true);
      return;
    }

    if (pin === '1234') {
      const formData = {
        manager: currentUser.name,
        location: e.target.location.value,
        coffeeType: e.target.coffeeType.value,
        source: e.target.source.value,
        beanSize: `${e.target.beanSizeNumber.value}${e.target.beanSizeGrade.value}`,
        humidity: e.target.humidity.value,
        buyingPrice: e.target.buyingPrice.value,
        quantity: e.target.quantity.value,
        unit: e.target.unit.value,
        timestamp: new Date().toISOString(),
        action: selectedAction
      };

      try {
        await addStockMutation.mutateAsync(formData);
        setCurrentStock(formData);
        toast({
          title: "Stock Updated Successfully",
          description: `${selectedAction}: ${formData.quantity} ${formData.unit} of ${formData.coffeeType}`,
        });
        setVerificationStep(false);
        setPin('');
        setSelectedAction(null);
        
        setTimeout(() => {
          navigate('/view-stock');
        }, 2000);
      } catch (error) {
        if (!navigator.onLine) {
          toast({
            title: "Network Error",
            description: "Update pending network connection. Will complete automatically when reconnected.",
            variant: "warning",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } else {
      toast({
        title: "Verification Failed",
        description: "Invalid PIN provided",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setSelectedAction(null);
    setVerificationStep(false);
    setPin('');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="stock" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stock">Stock Management</TabsTrigger>
          <TabsTrigger value="kazo-project">Kazo Coffee Project</TabsTrigger>
        </TabsList>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>KAJON Coffee Limited Stock Update</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedAction ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Stock Update Action</h3>
                  <div className="grid gap-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-4"
                      onClick={() => setSelectedAction('add')}
                    >
                      Add Stock to Location
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-4"
                      onClick={() => setSelectedAction('transfer')}
                    >
                      Send Stock to another Warehouse/Store
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-4"
                      onClick={() => setSelectedAction('remove')}
                    >
                      Record Loss (Remove Stock)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {selectedAction === 'add' && 'Add Stock to Location'}
                      {selectedAction === 'transfer' && 'Send Stock to another Warehouse/Store'}
                      {selectedAction === 'remove' && 'Record Loss (Remove Stock)'}
                    </h3>
                    <Button variant="ghost" onClick={handleBack} className="h-8 w-8 p-0">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <StockUpdateForm
                      currentUser={currentUser}
                      verificationStep={verificationStep}
                      pin={pin}
                      onPinChange={setPin}
                      onBack={() => setVerificationStep(false)}
                      actionType={selectedAction}
                    />
                    <Button type="submit" className="w-full">
                      {verificationStep ? 'Verify and Submit' : 'Continue to Verification'}
                    </Button>
                  </form>
                  <StockSummary stock={currentStock} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kazo-project">
          <KazoCoffeeProject />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KAJONCoffeeLimited;