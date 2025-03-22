
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthenticationForm from '../AuthenticationForm';
import { 
  ClipboardList, 
  AlertCircle, 
  BarChart4, 
  Coffee, 
  Package, 
  FileText, 
  Droplet, 
  DollarSign, 
  Weight, 
  Map, 
  HelpCircle 
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('form');
  const [formData, setFormData] = useState({
    manager: '',
    location: '',
    coffeeType: '',
    qualityGrade: '',
    source: '',
    humidity: '',
    buyingPrice: '',
    currency: 'UGX',
    quantity: '',
    unit: 'kg',
    notes: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAuthentication = (name, location) => {
    setManagerName(name);
    setSelectedLocation(location);
    setIsAuthenticated(true);
    setFormData(prev => ({ ...prev, manager: name, location }));
    toast({
      title: "Authentication Successful",
      description: `Welcome, ${name}. You are now managing the ${location} inventory.`,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Note",
        description: "Backend functionality for coffee inventory has been removed.",
      });
      
      // Reset form
      e.target.reset();
      setSelectedCoffeeType('');
      setFormData({
        manager: managerName,
        location: selectedLocation,
        coffeeType: '',
        qualityGrade: '',
        source: '',
        humidity: '',
        buyingPrice: '',
        currency: 'UGX',
        quantity: '',
        unit: 'kg',
        notes: ''
      });
      
    } catch (error) {
      console.error("Error:", error);
      setFormError("Backend functionality has been removed");
      toast({
        title: "Note",
        description: "Backend functionality for coffee inventory has been removed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewRecords = () => {
    setViewRecords(true);
    toast({
      title: "Note",
      description: "Records functionality has been removed.",
    });
  };

  if (viewRecords) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Coffee Inventory Records</h2>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            The coffee inventory records functionality has been removed.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => setViewRecords(false)} 
          className="mt-4"
        >
          Back to Form
        </Button>
      </div>
    );
  }

  if (!selectedLocation) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-2 mb-6">
          <Map className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Select Store Location</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isKazo ? (
            WAREHOUSE_LOCATIONS.kazo.map(location => (
              <Button
                key={location}
                variant="outline"
                className="h-16 justify-start text-left px-4 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                onClick={() => setSelectedLocation(location)}
              >
                <div>
                  <div className="font-medium">{location}</div>
                  <div className="text-xs text-gray-500">Kazo Coffee Project Location</div>
                </div>
              </Button>
            ))
          ) : (
            WAREHOUSE_LOCATIONS.regular.map(location => (
              <Button
                key={location}
                variant="outline"
                className="h-16 justify-start text-left px-4 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                onClick={() => setSelectedLocation(location)}
              >
                <div>
                  <div className="font-medium">{location}</div>
                  <div className="text-xs text-gray-500">KAJON Coffee Limited Location</div>
                </div>
              </Button>
            ))
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthenticationForm 
        onAuthenticate={handleAuthentication}
        title={isKazo ? "Store Manager Authentication" : "Warehouse Manager Authentication"}
        selectedLocation={selectedLocation}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-semibold">Receive New Coffee Stock</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleViewRecords}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ClipboardList className="h-4 w-4" />
            View Records
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setActiveTab(activeTab === 'form' ? 'guide' : 'form')}
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            {activeTab === 'form' ? 'Show Guide' : 'Back to Form'}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="hidden">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="guide">Guide</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Backend functionality for this form has been removed. The form is for UI demonstration only.
            </AlertDescription>
          </Alert>
          
          {formError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
        
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Coffee className="h-4 w-4 text-amber-600" />
                      <Label>Warehouse Manager</Label>
                    </div>
                    <Input 
                      name="manager" 
                      value={managerName} 
                      readOnly 
                      className="bg-amber-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Map className="h-4 w-4 text-blue-600" />
                      <Label>Stock Location</Label>
                    </div>
                    <Input 
                      name="location" 
                      value={selectedLocation} 
                      readOnly 
                      className="bg-blue-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Coffee className="h-4 w-4 text-amber-600" />
                  <h3 className="text-lg font-medium">Coffee Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Coffee Type</Label>
                    <Select 
                      name="coffeeType" 
                      value={formData.coffeeType}
                      onValueChange={(value) => {
                        setSelectedCoffeeType(value);
                        handleInputChange('coffeeType', value);
                      }}
                      required
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select coffee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arabica">Arabica Coffee</SelectItem>
                        <SelectItem value="robusta">Robusta Coffee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quality Grade</Label>
                    <Select 
                      name="qualityGrade" 
                      disabled={!selectedCoffeeType}
                      value={formData.qualityGrade}
                      onValueChange={(value) => handleInputChange('qualityGrade', value)}
                      required
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCoffeeType && COFFEE_GRADES[selectedCoffeeType].map((grade) => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Source of Coffee (Origin)</Label>
                    <Input 
                      name="source" 
                      placeholder="Enter farm or location name" 
                      value={formData.source}
                      onChange={(e) => handleInputChange('source', e.target.value)}
                      required 
                      className="bg-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Droplet className="h-4 w-4 text-blue-600" />
                      <Label>Coffee Bean Humidity (%)</Label>
                    </div>
                    <Input 
                      name="humidity" 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                      placeholder="Enter moisture content" 
                      value={formData.humidity}
                      onChange={(e) => handleInputChange('humidity', e.target.value)}
                      required 
                      className="bg-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <h3 className="text-lg font-medium">Pricing and Quantity</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Buying Price</Label>
                      <Input 
                        name="buyingPrice" 
                        type="number" 
                        step="0.01"
                        min="0.01"
                        placeholder="Enter price" 
                        value={formData.buyingPrice}
                        onChange={(e) => handleInputChange('buyingPrice', e.target.value)}
                        required 
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select 
                        name="currency" 
                        defaultValue="UGX"
                        value={formData.currency}
                        onValueChange={(value) => handleInputChange('currency', value)}
                      >
                        <SelectTrigger className="bg-white">
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
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Weight className="h-4 w-4 text-purple-600" />
                        <Label>Quantity</Label>
                      </div>
                      <Input 
                        name="quantity" 
                        type="number" 
                        step="0.01"
                        min="0.01"
                        placeholder="Enter quantity" 
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        required 
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select 
                        name="unit" 
                        defaultValue="kg"
                        value={formData.unit}
                        onValueChange={(value) => handleInputChange('unit', value)}
                      >
                        <SelectTrigger className="bg-white">
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
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <h3 className="text-lg font-medium">Additional Information</h3>
                </div>
                
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea 
                    name="notes" 
                    placeholder="Enter any additional notes or details about this coffee stock"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="bg-white"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setFormData({
                    manager: managerName,
                    location: selectedLocation,
                    coffeeType: '',
                    qualityGrade: '',
                    source: '',
                    humidity: '',
                    buyingPrice: '',
                    currency: 'UGX',
                    quantity: '',
                    unit: 'kg',
                    notes: ''
                  });
                  setSelectedCoffeeType('');
                }}
              >
                Reset Form
              </Button>
              
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Receive Coffee Stock (Demo Only)"}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="guide">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Coffee Inventory Guide</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Coffee Types</h4>
                  <p className="text-sm">The main coffee types are Arabica and Robusta. Arabica has a sweeter, softer taste, with higher acidity and more complex flavors. Robusta has a stronger, harsher taste, with a grain-like overtone and peanutty aftertaste.</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium mb-2">Quality Grades</h4>
                  <p className="text-sm">Coffee beans are graded based on various factors including size, density, color, and defects. Bugisu AA is the highest grade for Arabica coffee from the Bugisu region, while FAQ (Fair Average Quality) is a common grade for Robusta coffee.</p>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium mb-2">Humidity Levels</h4>
                  <p className="text-sm">Ideal coffee bean humidity is typically between 10-12%. Levels above 12.5% can lead to mold growth, while levels below 9% can cause the beans to become brittle and lose flavor during roasting.</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium mb-2">Storage Guidelines</h4>
                  <p className="text-sm">Store coffee beans in a cool, dry place away from direct sunlight. Ensure proper ventilation to maintain quality. Regular stock rotation is recommended to maintain freshness.</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setActiveTab('form')}
                className="mt-6"
              >
                Back to Form
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart4 className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-medium">Inventory Analytics</h3>
              </div>
              
              <div className="p-12 text-center text-gray-500">
                Analytics visualization coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReceiveNewStock;
