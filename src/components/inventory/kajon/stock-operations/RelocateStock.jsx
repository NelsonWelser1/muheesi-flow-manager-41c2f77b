
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye } from 'lucide-react';
import AuthenticationForm from '../AuthenticationForm';
import CoffeeRelocationRecords from './records/CoffeeRelocationRecords';
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import PendingTransfers from './PendingTransfers';

const COFFEE_GRADES = {
  arabica: [
    'Arabica Coffee: Bugisu AA1',
    'Arabica Coffee: Bugisu A1',
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

const STORE_LOCATIONS = {
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
    "Kampala",
    "JBER",
    "Mbarara",
    "Kakyinga",
    "Kazo-Kanoni",
    "Kazo"
  ]
};

const RelocateStock = ({ isKazo }) => {
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [managerName, setManagerName] = useState('');
  const [viewRecords, setViewRecords] = useState(false);
  const { toast } = useToast();
  const { submitTransfer } = useCoffeeStockTransfers();

  const handleAuthentication = (name, location) => {
    setManagerName(name);
    setSelectedLocation(location);
    setIsAuthenticated(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // Validate required fields
      const requiredFields = ['coffeeType', 'qualityGrade', 'quantity', 'reason'];
      for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
          showErrorToast(toast, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
          return;
        }
      }

      // Validate quantity is a positive number
      const quantity = parseFloat(data.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        showErrorToast(toast, "Quantity must be a positive number");
        return;
      }

      // Prepare transfer data
      const transferData = {
        manager: managerName,
        source_location: selectedLocation,
        destination_location: data.destinationLocation,
        coffee_type: data.coffeeType,
        quality_grade: data.qualityGrade,
        quantity: quantity,
        unit: data.unit || 'kg',
        reason: data.reason || '',
        // Use null instead of string IDs since we're not using authentication yet
        sender_user_id: null,
        recipient_user_id: null
      };

      console.log("Submitting transfer data:", transferData);
      
      // Submit transfer to Supabase via the hook
      await submitTransfer(transferData);

      showSuccessToast(toast, "Stock relocation request sent successfully");
      
      // Reset form
      e.target.reset();
      setSelectedCoffeeType('');
      setDestinationLocation('');
    } catch (error) {
      showErrorToast(toast, `Failed to send relocation request: ${error.message}`);
      console.error("Relocation error:", error);
    }
  };

  if (viewRecords) {
    return <CoffeeRelocationRecords onBack={() => setViewRecords(false)} isKazo={isKazo} />;
  }

  if (!selectedLocation) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Relocate Coffee Stock</h2>
        </div>
        <Label>Select Source Location</Label>
        <Select onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {isKazo 
              ? STORE_LOCATIONS.kazo.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))
              : STORE_LOCATIONS.regular.map(location => (
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
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Relocate Coffee Stock</h2>
        </div>
        <AuthenticationForm 
          onAuthenticate={handleAuthentication}
          title={isKazo ? "Store Manager Name" : "Warehouse Manager Name"}
          selectedLocation={selectedLocation}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Relocate Coffee Stock</h2>
        <Button 
          variant="outline" 
          onClick={() => setViewRecords(true)} 
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" /> View Records
        </Button>
      </div>
      
      {/* Show pending transfers for the current location */}
      <PendingTransfers location={selectedLocation} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Manager Name</Label>
            <Input name="manager" value={managerName} readOnly />
          </div>

          <div>
            <Label>Source Location</Label>
            <Input name="sourceLocation" value={selectedLocation} readOnly />
          </div>

          <div>
            <Label>Destination Location</Label>
            <Select 
              name="destinationLocation" 
              onValueChange={setDestinationLocation}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {isKazo ? (
                  <>
                    {STORE_LOCATIONS.kazo
                      .filter(location => location !== selectedLocation)
                      .map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))
                    }
                  </>
                ) : (
                  <>
                    {STORE_LOCATIONS.regular
                      .filter(location => location !== selectedLocation)
                      .map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))
                    }
                  </>
                )}
              </SelectContent>
            </Select>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantity</Label>
              <Input name="quantity" type="number" placeholder="Enter quantity" required min="0.01" step="0.01" />
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

          <div>
            <Label>Reason for Relocation</Label>
            <Input name="reason" placeholder="Enter reason for relocation" required />
          </div>
        </div>

        <Button type="submit" className="w-full">Submit Relocation Request</Button>
      </form>
    </>
  );
};

export default RelocateStock;
