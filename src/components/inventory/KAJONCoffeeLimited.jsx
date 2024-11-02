import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import StockUpdateForm from './kajon/StockUpdateForm';
import StockSummary from './kajon/StockSummary';
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import { useAddKAJONCoffeeLimited } from '@/integrations/supabase/hooks/useKAJONCoffeeLimited';

const KAJONCoffeeLimited = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStock, setCurrentStock] = useState(null);
  const [verificationStep, setVerificationStep] = useState(false);
  const [pin, setPin] = useState('');
  const addStockMutation = useAddKAJONCoffeeLimited();

  // Mock user data - replace with actual user data
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

    // Verify PIN - replace with actual verification logic
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
        action: e.target.action.value
      };

      try {
        await addStockMutation.mutateAsync(formData);
        setCurrentStock(formData);
        toast({
          title: "Stock Updated Successfully",
          description: `Updated ${formData.quantity} ${formData.unit} of ${formData.coffeeType}`,
        });
        setVerificationStep(false);
        setPin('');
        
        // Redirect to View Stock panel after successful submission
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <StockUpdateForm
                  currentUser={currentUser}
                  verificationStep={verificationStep}
                  pin={pin}
                  onPinChange={setPin}
                  onBack={() => setVerificationStep(false)}
                />
                <Button type="submit">
                  {verificationStep ? 'Verify and Submit' : 'Continue to Verification'}
                </Button>
              </form>

              <StockSummary stock={currentStock} />
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