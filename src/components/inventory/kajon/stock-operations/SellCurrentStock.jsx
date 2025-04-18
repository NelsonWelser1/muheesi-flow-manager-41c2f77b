
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye } from 'lucide-react';
import AuthenticationForm from '../AuthenticationForm';
import CoffeeSalesRecords from './records/CoffeeSalesRecords';
import { useCoffeeSales } from '@/hooks/useCoffeeSales';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

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

const SellCurrentStock = ({ isKazo }) => {
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [managerName, setManagerName] = useState('');
  const [viewRecords, setViewRecords] = useState(false);
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalSellingPrice, setTotalSellingPrice] = useState('');
  const { toast } = useToast();
  const { createSale, isSubmitting } = useCoffeeSales();

  useEffect(() => {
    if (sellingPrice && quantity) {
      const calculatedTotal = parseFloat(sellingPrice) * parseFloat(quantity);
      setTotalSellingPrice(calculatedTotal.toFixed(2));
    } else {
      setTotalSellingPrice('');
    }
  }, [sellingPrice, quantity]);

  const handleAuthentication = (name, location) => {
    setManagerName(name);
    setIsAuthenticated(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Debug: Log form data to console
    console.log('Form data before submission:', data);

    try {
      // Map form data to expected schema
      const saleData = {
        manager: managerName,
        location: selectedLocation,
        buyerName: data.buyerName,
        buyerContact: data.buyerContact,
        coffeeType: data.coffeeType,
        qualityGrade: data.qualityGrade,
        sellingPrice: data.sellingPrice,
        currency: data.currency || 'UGX',
        quantity: data.quantity,
        unit: data.unit || 'kg',
        totalPrice: data.totalSellingPrice || totalSellingPrice
      };
      
      await createSale(saleData);
      
      // Clear form fields after successful submission
      setSellingPrice('');
      setQuantity('');
      setTotalSellingPrice('');
      e.target.reset();
      setSelectedCoffeeType('');
      
    } catch (error) {
      showErrorToast(toast, `Failed to record sale: ${error.message}`);
    }
  };

  if (viewRecords) {
    return <CoffeeSalesRecords onBack={() => setViewRecords(false)} />;
  }

  if (!selectedLocation) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Sell Current Coffee Stock</h2>
        <Label>Select Store Location</Label>
        <Select onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {isKazo 
              ? STORE_LOCATIONS.kazo.filter(location => location && location.trim() !== '').map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))
              : STORE_LOCATIONS.regular.filter(location => location && location.trim() !== '').map(location => (
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
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Sell Current Coffee Stock</h2>
        <AuthenticationForm 
          onAuthenticate={handleAuthentication}
          title={isKazo ? "Store Manager Name" : "Warehouse Manager Name"}
          selectedLocation={selectedLocation}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sell Current Coffee Stock</h2>
        <Button 
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setViewRecords(true)}
        >
          <Eye className="h-4 w-4" />
          View Sales Records
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Manager Name</Label>
            <Input name="manager" value={managerName} readOnly />
          </div>

          <div>
            <Label>Stock Location</Label>
            <Input name="location" value={selectedLocation} readOnly />
          </div>

          <div>
            <Label>Buyer Name</Label>
            <Input name="buyerName" placeholder="Enter buyer's name" required />
          </div>

          <div>
            <Label>Buyer Contact</Label>
            <Input name="buyerContact" placeholder="Enter buyer's contact" required />
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
              <Label>Selling Price</Label>
              <Input 
                name="sellingPrice" 
                type="number" 
                placeholder="Enter price" 
                required 
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
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
                placeholder="Enter quantity" 
                required 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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

          <div>
            <Label>Total Selling Price</Label>
            <Input 
              name="totalSellingPrice"
              value={totalSellingPrice ? `${totalSellingPrice}` : '-'}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Recording Sale...' : 'Record Sale'}
        </Button>
      </form>
    </div>
  );
};

export default SellCurrentStock;
