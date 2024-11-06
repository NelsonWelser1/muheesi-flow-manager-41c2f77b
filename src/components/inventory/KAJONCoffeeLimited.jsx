import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import AddStock from './kajon/stock-actions/AddStock';
import SendStock from './kajon/stock-actions/SendStock';
import RecordLoss from './kajon/stock-actions/RecordLoss';
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import { useAddKAJONCoffeeLimited } from '@/integrations/supabase/hooks/useKAJONCoffeeLimited';

const KAJONCoffeeLimited = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [verificationStep, setVerificationStep] = useState(false);
  const [pin, setPin] = useState('');
  const addStockMutation = useAddKAJONCoffeeLimited();

  const currentUser = {
    name: "John Doe",
    authorizedLocations: ["Kampala Store", "Mbarara Warehouse", "Kakyinga Factory"]
  };

  const handleSubmit = async (formData) => {
    if (!verificationStep) {
      setVerificationStep(true);
      return;
    }

    if (pin === '1234') {
      try {
        await addStockMutation.mutateAsync({
          ...formData,
          manager: currentUser.name,
          timestamp: new Date().toISOString(),
          action: selectedAction
        });

        toast({
          title: "Stock Updated Successfully",
          description: `Updated ${formData.quantity} ${formData.unit} of ${formData.coffeeType}`,
        });
        setVerificationStep(false);
        setPin('');
        
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

  const renderStockAction = () => {
    const props = {
      location: selectedLocation,
      onSubmit: handleSubmit,
      onBack: () => setSelectedAction('')
    };

    switch (selectedAction) {
      case 'add':
        return <AddStock {...props} />;
      case 'transfer':
        return <SendStock {...props} />;
      case 'remove':
        return <RecordLoss {...props} />;
      default:
        return null;
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
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="action">Stock Update Action</Label>
                <Select 
                  value={selectedAction} 
                  onValueChange={setSelectedAction}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock to {selectedLocation}</SelectItem>
                    <SelectItem value="transfer">Send Stock to another Warehouse/Store</SelectItem>
                    <SelectItem value="remove">Record Loss (Remove Stock)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Stock Location</Label>
                <Select 
                  value={selectedLocation} 
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUser.authorizedLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {renderStockAction()}
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