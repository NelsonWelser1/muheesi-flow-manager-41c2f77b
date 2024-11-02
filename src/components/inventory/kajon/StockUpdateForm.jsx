import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const WAREHOUSE_LOCATIONS = [
  "Kampala Store",
  "JBER",
  "Mbarara Warehouse",
  "Kakyinga Factory",
  "Kazo - Kanoni Warehouse",
  "Kazo Coffee"
];

const COFFEE_GRADES = {
  robusta: [
    "FAQ",
    "Screen 18",
    "Screen 15",
    "Screen 12",
    "Organic Robusta"
  ],
  arabica: [
    "Bugisu AA",
    "Bugisu A",
    "Bugisu PB",
    "Bugisu B",
    "DRUGAR",
    "Parchment Arabica"
  ]
};

const StockUpdateForm = ({ 
  currentUser, 
  onSubmit, 
  verificationStep, 
  pin, 
  onPinChange, 
  onBack 
}) => {
  const [selectedCoffeeType, setSelectedCoffeeType] = React.useState('');
  const [newLocation, setNewLocation] = React.useState('');
  const [showNewLocation, setShowNewLocation] = React.useState(false);

  if (verificationStep) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="pin">Enter PIN for Verification</Label>
          <Input
            id="pin"
            type="password"
            value={pin}
            onChange={(e) => onPinChange(e.target.value)}
            placeholder="Enter your PIN"
            required
          />
        </div>
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <>
      <div>
        <Label htmlFor="manager">Store/Warehouse Manager</Label>
        <Input id="manager" value={currentUser.name} disabled />
      </div>
      <div>
        <Label htmlFor="location">Stock Location</Label>
        {showNewLocation ? (
          <div className="space-y-2">
            <Input 
              id="location" 
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter new location"
              required 
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowNewLocation(false)}
            >
              Select from existing
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Select id="location" required>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {WAREHOUSE_LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowNewLocation(true)}
            >
              Add new location
            </Button>
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="coffeeType">Coffee Type</Label>
        <Select 
          id="coffeeType" 
          required
          onValueChange={setSelectedCoffeeType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select coffee type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="robusta">Robusta Coffee</SelectItem>
            <SelectItem value="arabica">Arabica Coffee</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="source">Source of Coffee</Label>
        <Input id="source" placeholder="Enter farm or location name" required />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="beanSizeNumber">Coffee Bean Screen Size</Label>
          <Input id="beanSizeNumber" type="number" placeholder="e.g., 18" required />
        </div>
        <div className="flex-1">
          <Label htmlFor="beanSizeGrade">Bean Grade</Label>
          <Select id="beanSizeGrade" required>
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
      </div>
      <div>
        <Label htmlFor="humidity">Coffee Bean Humidity (%)</Label>
        <Input id="humidity" type="number" step="0.1" min="0" max="100" required />
      </div>
      <div>
        <Label htmlFor="buyingPrice">Buying Price</Label>
        <div className="flex gap-2">
          <Input id="buyingPrice" type="number" min="0" required className="flex-1" />
          <Select defaultValue="UGX" className="w-[100px]">
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
      <div>
        <Label>Quantity with Unit</Label>
        <div className="flex gap-2">
          <Input id="quantity" type="number" min="0" required className="flex-1" />
          <Select id="unit" required className="w-[120px]">
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kgs">Kgs</SelectItem>
              <SelectItem value="tons">Tons</SelectItem>
              <SelectItem value="bags">Bags</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
  );
};

export default StockUpdateForm;