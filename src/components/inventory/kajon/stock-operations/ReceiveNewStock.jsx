
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  useAddKAJONCoffee, 
  useGetInventoryByLocation 
} from '@/integrations/supabase/hooks/useKAJONCoffee';
import AuthenticationForm from '../AuthenticationForm';
import { 
  showSuccessToast, 
  showErrorToast,
  showInfoToast 
} from '@/components/ui/notifications';

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

const ReceiveNewStock = ({ isKazo }) => {
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [managerName, setManagerName] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const { toast } = useToast();
  const addCoffeeMutation = useAddKAJONCoffee();
  
  // Fetch existing inventory for the selected location
  const { data: locationInventory, isLoading } = useGetInventoryByLocation(selectedLocation);

  const validateForm = (formData) => {
    const errors = {};
    
    // Required fields
    const requiredFields = ['coffeeType', 'qualityGrade', 'source', 'humidity', 'buyingPrice', 'quantity'];
    requiredFields.forEach(field => {
      if (!formData.get(field)) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Numeric validation
    ['humidity', 'buyingPrice', 'quantity'].forEach(field => {
      const value = formData.get(field);
      if (value && isNaN(Number(value))) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be a number`;
      }
    });

    // Range validation
    const humidity = Number(formData.get('humidity'));
    if (humidity && (humidity < 0 || humidity > 100)) {
      errors.humidity = 'Humidity must be between 0 and 100';
    }

    const buyingPrice = Number(formData.get('buyingPrice'));
    if (buyingPrice && buyingPrice <= 0) {
      errors.buyingPrice = 'Buying price must be greater than 0';
    }

    const quantity = Number(formData.get('quantity'));
    if (quantity && quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }

    return errors;
  };

  const handleAuthentication = (name, location) => {
    setManagerName(name);
    setIsAuthenticated(true);
    showInfoToast(toast, `Welcome ${name}. You are now managing the ${location} inventory.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormErrors({});
    
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    
    // Log form data to console for debugging
    console.log('Form submission data:', formDataObj);
    
    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showErrorToast(toast, 'Please correct the errors in the form');
      return;
    }

    try {
      const data = {
        manager: managerName,
        location: selectedLocation,
        coffeeType: formData.get('coffeeType'),
        qualityGrade: formData.get('qualityGrade'),
        source: formData.get('source'),
        humidity: formData.get('humidity'),
        buyingPrice: formData.get('buyingPrice'),
        currency: formData.get('currency') || 'UGX',
        quantity: formData.get('quantity'),
        unit: formData.get('unit') || 'kg',
      };

      await addCoffeeMutation.mutateAsync(data);

      showSuccessToast(toast, 'Coffee stock received successfully');
      
      // Reset form
      e.target.reset();
      setSelectedCoffeeType('');
    } catch (error) {
      console.error('Error submitting form:', error);
      showErrorToast(toast, `Failed to receive stock: ${error.message}`);
    }
  };

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
      <AuthenticationForm 
        onAuthenticate={handleAuthentication}
        title={isKazo ? "Store Manager Name" : "Warehouse Manager Name"}
        selectedLocation={selectedLocation}
      />
    );
  }

  return (
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
          <Label>Coffee Type</Label>
          <Select 
            name="coffeeType" 
            onValueChange={setSelectedCoffeeType}
            required
          >
            <SelectTrigger className={formErrors.coffeeType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select coffee type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arabica">Arabica Coffee</SelectItem>
              <SelectItem value="robusta">Robusta Coffee</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.coffeeType && <p className="text-red-500 text-sm mt-1">{formErrors.coffeeType}</p>}
        </div>

        <div>
          <Label>Quality Grade</Label>
          <Select 
            name="qualityGrade" 
            disabled={!selectedCoffeeType} 
            required
          >
            <SelectTrigger className={formErrors.qualityGrade ? "border-red-500" : ""}>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {selectedCoffeeType && COFFEE_GRADES[selectedCoffeeType].map((grade) => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.qualityGrade && <p className="text-red-500 text-sm mt-1">{formErrors.qualityGrade}</p>}
        </div>

        <div>
          <Label>Source of Coffee (Origin)</Label>
          <Input 
            name="source" 
            placeholder="Enter farm or location name" 
            required 
            className={formErrors.source ? "border-red-500" : ""}
          />
          {formErrors.source && <p className="text-red-500 text-sm mt-1">{formErrors.source}</p>}
        </div>

        <div>
          <Label>Coffee Bean Humidity (%)</Label>
          <Input 
            name="humidity" 
            type="number" 
            step="0.1" 
            placeholder="Enter moisture content" 
            required 
            className={formErrors.humidity ? "border-red-500" : ""}
          />
          {formErrors.humidity && <p className="text-red-500 text-sm mt-1">{formErrors.humidity}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Buying Price</Label>
            <Input 
              name="buyingPrice" 
              type="number" 
              placeholder="Enter price" 
              required 
              className={formErrors.buyingPrice ? "border-red-500" : ""}
            />
            {formErrors.buyingPrice && <p className="text-red-500 text-sm mt-1">{formErrors.buyingPrice}</p>}
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
              className={formErrors.quantity ? "border-red-500" : ""}
            />
            {formErrors.quantity && <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>}
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
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading current inventory...</p>
      ) : locationInventory && locationInventory.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Recent Inventory at {selectedLocation}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Grade</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {locationInventory.slice(0, 5).map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2">{item.coffeeType}</td>
                    <td className="px-4 py-2">{item.qualityGrade}</td>
                    <td className="px-4 py-2">{item.quantity} {item.unit}</td>
                    <td className="px-4 py-2">{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full"
        disabled={addCoffeeMutation.isPending}
      >
        {addCoffeeMutation.isPending ? "Submitting..." : "Submit Stock Receipt"}
      </Button>
    </form>
  );
};

export default ReceiveNewStock;
