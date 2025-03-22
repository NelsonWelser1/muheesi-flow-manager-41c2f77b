
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import AuthenticationForm from '../AuthenticationForm';
import CoffeeInventoryRecords from './records/CoffeeInventoryRecords';
import { ClipboardList, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const COFFEE_GRADES = {
  arabica: [
    'Arabica Coffee: Bugisu AA',
    'Arabica Coffee: Bugisu A',
    'Arabica Coffee: Bugisu PB',
    'Arabica Coffee: Bugisu B',
    'Arabica Coffee: DRUGAR',
    'Arabica Coffee: Parchment Arabica'
  ],
  robusta: [
    'Robusta Coffee: FAQ',
    'Robusta Coffee: Screen 18',
    'Robusta Coffee: Screen 15',
    'Robusta Coffee: Screen 12',
    'Robusta Coffee: Organic Robusta'
  ]
};

const WAREHOUSE_LOCATIONS = {
  kazo: [
    "Kanoni-Mbogo",
    "Kanoni-Rwakahaya",
    "Engari-Kaichumu",
    "Engari-Kyengando",
    "Migina",
    "Kagarama",
    "Kyampangara",
    "Nkungu",
    "Buremba",
    "Kazo Town council",
    "Burunga",
    "Rwemikoma"
  ],
  regular: [
    "Kampala Store",
    "JBER",
    "Mbarara Warehouse",
    "Kakyinga Factory",
    "Kazo - Kanoni Warehouse",
    "Kazo Coffee"
  ]
};

const ReceiveNewStock = ({ isKazo }) => {
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [managerName, setManagerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewRecords, setViewRecords] = useState(false);
  const [formError, setFormError] = useState('');
  const { toast } = useToast();

  const handleAuthentication = (name, location) => {
    setManagerName(name);
    setSelectedLocation(location);
    setIsAuthenticated(true);
    toast({
      title: "Success",
      description: `Authenticated as ${name} at ${location}`,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Validate all required fields
      const requiredFields = ['coffeeType', 'qualityGrade', 'source', 'humidity', 'buyingPrice', 'quantity'];
      for (const field of requiredFields) {
        if (!data[field]) {
          throw new Error(`${field.replace(/([A-Z])/g, ' $1').trim()} is required`);
        }
      }
      
      // Validate numeric fields
      const humidity = parseFloat(data.humidity);
      if (isNaN(humidity) || humidity < 0 || humidity > 100) {
        throw new Error("Humidity must be a number between 0 and 100");
      }
      
      const buyingPrice = parseFloat(data.buyingPrice);
      if (isNaN(buyingPrice) || buyingPrice <= 0) {
        throw new Error("Buying price must be a positive number");
      }
      
      const quantity = parseFloat(data.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("Quantity must be a positive number");
      }
      
      // Prepare data for Supabase insertion according to the schema
      const coffeeData = {
        manager: managerName,
        location: selectedLocation,
        coffeeType: data.coffeeType,
        qualityGrade: data.qualityGrade,
        source: data.source,
        humidity: humidity,
        buying_price: buyingPrice,
        currency: data.currency || 'UGX',
        quantity: quantity,
        unit: data.unit || 'kg',
        notes: data.notes || null,
        status: 'active'
      };
      
      console.log("Sending data to Supabase:", coffeeData);
      
      // Insert into Supabase
      const { data: insertedData, error } = await supabase
        .from('coffee_inventory')
        .insert([coffeeData])
        .select();
      
      if (error) {
        console.error("Supabase insertion error:", error);
        throw new Error(error.message);
      }
      
      console.log("Successfully added coffee stock:", insertedData);
      
      toast({
        title: "Success",
        description: "Coffee stock received successfully",
      });
      
      // Reset form
      e.target.reset();
      setSelectedCoffeeType('');
      
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewRecords = () => {
    setViewRecords(true);
  };

  if (viewRecords) {
    return <CoffeeInventoryRecords 
      onBack={() => setViewRecords(false)} 
      isKazo={isKazo} 
      location={selectedLocation}
    />;
  }

  if (!selectedLocation) {
    return (
      <div className="space-y-4">
        <Label>Select Store Location</Label>
        <Select onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {isKazo 
              ? WAREHOUSE_LOCATIONS.kazo.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))
              : WAREHOUSE_LOCATIONS.regular.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))
            }
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthenticationForm 
        onAuthenticate={handleAuthentication}
        title={isKazo ? "Store Manager Name" : "Warehouse Manager Name"}
        selectedLocation={selectedLocation}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Receive New Coffee Stock</h2>
        <Button 
          onClick={handleViewRecords}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ClipboardList className="h-4 w-4" />
          View Records
        </Button>
      </div>
      
      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
    
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Warehouse Manager</Label>
            <Input name="manager" value={managerName} readOnly />
          </div>

          <div>
            <Label>Stock Location</Label>
            <Input name="location" value={selectedLocation} readOnly />
          </div>

          <div>
            <Label>Coffee Type</Label>
            <Select 
              name="coffeeType" 
              onValueChange={setSelectedCoffeeType}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select coffee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arabica">Arabica Coffee</SelectItem>
                <SelectItem value="robusta">Robusta Coffee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quality Grade</Label>
            <Select name="qualityGrade" disabled={!selectedCoffeeType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {selectedCoffeeType && COFFEE_GRADES[selectedCoffeeType].map((grade) => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Source of Coffee (Origin)</Label>
            <Input name="source" placeholder="Enter farm or location name" required />
          </div>

          <div>
            <Label>Coffee Bean Humidity (%)</Label>
            <Input 
              name="humidity" 
              type="number" 
              step="0.01" 
              min="0" 
              max="100" 
              placeholder="Enter moisture content" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Buying Price</Label>
              <Input 
                name="buyingPrice" 
                type="number" 
                step="0.01"
                min="0.01"
                placeholder="Enter price" 
                required 
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Select name="currency" defaultValue="UGX">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UGX">UGX</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantity</Label>
              <Input 
                name="quantity" 
                type="number" 
                step="0.01"
                min="0.01"
                placeholder="Enter quantity" 
                required 
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Select name="unit" defaultValue="kg">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="tons">Tons</SelectItem>
                  <SelectItem value="bags">Bags</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="md:col-span-2">
            <Label>Notes</Label>
            <Textarea name="notes" placeholder="Enter any additional notes or details about this coffee stock" />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Receive Coffee Stock"}
        </Button>
      </form>
    </div>
  );
};

export default ReceiveNewStock;
