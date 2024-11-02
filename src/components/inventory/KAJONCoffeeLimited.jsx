import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const KAJONCoffeeLimited = () => {
  const { toast } = useToast();
  const [currentStock, setCurrentStock] = useState(null);
  const [verificationStep, setVerificationStep] = useState(false);
  const [pin, setPin] = useState('');

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

      setCurrentStock(formData);
      toast({
        title: "Stock Updated Successfully",
        description: `Updated ${formData.quantity} ${formData.unit} of ${formData.coffeeType}`,
      });
      setVerificationStep(false);
      setPin('');
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
                {!verificationStep ? (
                  <>
                    <div>
                      <Label htmlFor="manager">Store/Warehouse Manager</Label>
                      <Input id="manager" value={currentUser.name} disabled />
                    </div>
                    <div>
                      <Label htmlFor="location">Stock Location</Label>
                      <Select id="location" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentUser.authorizedLocations.map((location) => (
                            <SelectItem key={location} value={location}>{location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="coffeeType">Coffee Type</Label>
                      <Select id="coffeeType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select coffee type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="robusta-faq">Robusta Coffee: FAQ</SelectItem>
                          <SelectItem value="arabica-bugisuaa">Arabica Coffee: Bugisu AA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="source">Source of Coffee</Label>
                      <Input id="source" placeholder="Enter farm or location name" required />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="beanSizeNumber">Bean Size Number</Label>
                        <Input id="beanSizeNumber" type="number" placeholder="e.g., 18" required />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="beanSizeGrade">Bean Grade</Label>
                        <Select id="beanSizeGrade" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AA">AA</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="PB">PB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="humidity">Coffee Bean Humidity (%)</Label>
                      <Input id="humidity" type="number" step="0.1" min="0" max="100" required />
                    </div>
                    <div>
                      <Label htmlFor="buyingPrice">Buying Price (Farm Gate Price)</Label>
                      <Input id="buyingPrice" type="number" min="0" required />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" type="number" min="0" required />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit of Measurement</Label>
                      <Select id="unit" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (Kg)</SelectItem>
                          <SelectItem value="bag50">Bags of 50kg</SelectItem>
                          <SelectItem value="bag10">Bags of 10kg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="action">Stock Update Action</Label>
                      <Select id="action" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="add">Add Stock</SelectItem>
                          <SelectItem value="remove">Remove Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pin">Enter PIN for Verification</Label>
                      <Input
                        id="pin"
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter your PIN"
                        required
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={() => setVerificationStep(false)}>
                      Back
                    </Button>
                  </div>
                )}
                <Button type="submit">
                  {verificationStep ? 'Verify and Submit' : 'Continue to Verification'}
                </Button>
              </form>

              {currentStock && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Current Stock Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Location: {currentStock.location}</p>
                    <p>Coffee Type: {currentStock.coffeeType}</p>
                    <p>Quantity: {currentStock.quantity} {currentStock.unit}</p>
                    <p>Last Updated: {new Date(currentStock.timestamp).toLocaleString()}</p>
                  </CardContent>
                </Card>
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