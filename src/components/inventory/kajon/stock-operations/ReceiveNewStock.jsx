
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAddKAJONCoffee } from '@/integrations/supabase/hooks/useKAJONCoffee';
import AuthenticationForm from '../AuthenticationForm';
import CoffeeInventoryRecords from './records/CoffeeInventoryRecords';
import { ClipboardList } from 'lucide-react';

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
  const { toast } = useToast();
  const addCoffeeMutation = useAddKAJONCoffee();

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
    
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Format data correctly for Supabase
      const formattedData = {
        manager: managerName,
        location: selectedLocation,
        coffeeType: data.coffeeType,
        qualityGrade: data.qualityGrade,
        source: data.source,
        humidity: Number(data.humidity),
        buying_price: Number(data.buyingPrice),
        currency: data.currency,
        quantity: Number(data.quantity),
        unit: data.unit,
        notes: data.notes,
        status: 'active'
      };
      
      // Log the formatted data before submission
      console.log("Form data being submitted:", formattedData);
      
      // Submit to Supabase
      await addCoffeeMutation.mutateAsync(formattedData);
      
      toast({
        title: "Success",
        description: "Coffee stock received successfully",
      });
      
      // Reset form
      e.target.reset();
      setSelectedCoffeeType('');
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to receive coffee stock",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safely render the records component
  const renderRecords = () => {
    try {
      return <CoffeeInventoryRecords onBack={() => setViewRecords(false)} isKazo={isKazo} />;
    } catch (error) {
      console.error("Error rendering CoffeeInventoryRecords:", error);
      return (
        <div className="p-6 border rounded-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Records View Error</h3>
            <Button onClick={() => setViewRecords(false)} variant="outline" size="sm">
              Back
            </Button>
          </div>
          <p className="text-red-500">There was an error loading the records. Please try again later.</p>
          <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
            {error.message}
          </pre>
        </div>
      );
    }
  };

  if (viewRecords) {
    return renderRecords();
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
          onClick={() => setViewRecords(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ClipboardList className="h-4 w-4" />
          View Records
        </Button>
      </div>
    
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
