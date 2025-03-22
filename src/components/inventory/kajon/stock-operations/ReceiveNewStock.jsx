
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCoffeeStock } from '@/hooks/useCoffeeStock';
import CoffeeInventoryRecords from './records/CoffeeInventoryRecords';

const COFFEE_TYPES = [
  { value: "arabica", label: "Arabica Coffee" },
  { value: "robusta", label: "Robusta Coffee" },
];

const QUALITY_GRADES = [
  { value: "Arabica Coffee: Bugisu AA", label: "Arabica Coffee: Bugisu AA" },
  { value: "Arabica Coffee: Bugisu AB", label: "Arabica Coffee: Bugisu AB" },
  { value: "Arabica Coffee: Bugisu PB", label: "Arabica Coffee: Bugisu PB" },
  { value: "Arabica Coffee: Drugar", label: "Arabica Coffee: Drugar" },
  { value: "Arabica Coffee: Organic", label: "Arabica Coffee: Organic" },
  { value: "Robusta Coffee: Screen 18", label: "Robusta Coffee: Screen 18" },
  { value: "Robusta Coffee: Screen 15", label: "Robusta Coffee: Screen 15" },
  { value: "Robusta Coffee: Screen 12", label: "Robusta Coffee: Screen 12" },
  { value: "Robusta Coffee: BHP", label: "Robusta Coffee: BHP" },
  { value: "Robusta Coffee: FAQ", label: "Robusta Coffee: FAQ" },
  { value: "Robusta Coffee: Organic", label: "Robusta Coffee: Organic" },
];

const CURRENCIES = [
  { value: "UGX", label: "UGX (Ugandan Shilling)" },
  { value: "USD", label: "USD (US Dollar)" },
  { value: "EUR", label: "EUR (Euro)" },
  { value: "GBP", label: "GBP (British Pound)" },
];

const UNITS = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "g", label: "Grams (g)" },
  { value: "lb", label: "Pounds (lb)" },
  { value: "ton", label: "Tons" },
];

const ReceiveNewStock = () => {
  const [formData, setFormData] = useState({
    manager: "",
    location: "",
    coffeeType: "",
    qualityGrade: "",
    source: "",
    humidity: "",
    buyingPrice: "",
    currency: "UGX",
    quantity: "",
    unit: "kg",
    notes: "",
  });
  const [showRecords, setShowRecords] = useState(false);
  
  const { submitCoffeeStock, loading, recentCoffeeStocks, fetchLoading } = useCoffeeStock();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    
    const result = await submitCoffeeStock(formData);
    
    if (result.success) {
      // Clear form after successful submission
      setFormData({
        manager: "",
        location: "",
        coffeeType: "",
        qualityGrade: "",
        source: "",
        humidity: "",
        buyingPrice: "",
        currency: "UGX",
        quantity: "",
        unit: "kg",
        notes: "",
      });
    }
  };

  const handleViewRecords = () => {
    setShowRecords(true);
  };

  if (showRecords) {
    return <CoffeeInventoryRecords onBack={() => setShowRecords(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Receive New Coffee Stock</h2>
        <Button variant="outline" onClick={handleViewRecords}>
          View Records
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="manager">Manager Name</Label>
            <Input
              id="manager"
              name="manager"
              placeholder="Enter manager name"
              value={formData.manager}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="coffeeType">Coffee Type</Label>
            <Select
              onValueChange={(value) => handleSelectChange("coffeeType", value)}
              value={formData.coffeeType}
              required
            >
              <SelectTrigger id="coffeeType">
                <SelectValue placeholder="Select coffee type" />
              </SelectTrigger>
              <SelectContent>
                {COFFEE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="qualityGrade">Quality Grade</Label>
            <Select
              onValueChange={(value) => handleSelectChange("qualityGrade", value)}
              value={formData.qualityGrade}
              required
            >
              <SelectTrigger id="qualityGrade">
                <SelectValue placeholder="Select quality grade" />
              </SelectTrigger>
              <SelectContent>
                {QUALITY_GRADES.map((grade) => (
                  <SelectItem key={grade.value} value={grade.value}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              name="source"
              placeholder="Enter source"
              value={formData.source}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="humidity">Humidity (%)</Label>
            <Input
              id="humidity"
              name="humidity"
              type="number"
              placeholder="Enter humidity percentage"
              value={formData.humidity}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="buyingPrice">Buying Price</Label>
            <Input
              id="buyingPrice"
              name="buyingPrice"
              type="number"
              placeholder="Enter buying price"
              value={formData.buyingPrice}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              onValueChange={(value) => handleSelectChange("currency", value)}
              value={formData.currency}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex space-x-2">
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="flex-1"
              />
              <Select
                onValueChange={(value) => handleSelectChange("unit", value)}
                value={formData.unit}
                className="w-[120px]"
              >
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Enter any additional notes"
            value={formData.notes}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <Button 
            type="button" 
            onClick={() => console.log("Debug - Current Form Data:", formData)}
            variant="outline"
          >
            Debug
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Coffee Stock"}
          </Button>
        </div>
      </form>
      
      <div className="p-6 text-center">
        {fetchLoading ? (
          <p>Loading recent coffee stock entries...</p>
        ) : recentCoffeeStocks.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Coffee Stock Entries</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Quality</th>
                    <th className="border p-2 text-left">Quantity</th>
                    <th className="border p-2 text-left">Price</th>
                    <th className="border p-2 text-left">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCoffeeStocks.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50">
                      <td className="border p-2">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="border p-2">{item.coffee_type}</td>
                      <td className="border p-2">{item.quality_grade}</td>
                      <td className="border p-2">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="border p-2">
                        {item.currency} {item.buying_price.toLocaleString()}
                      </td>
                      <td className="border p-2">{item.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variant="outline" onClick={handleViewRecords}>
              View All Records
            </Button>
          </div>
        ) : (
          <p>No recent coffee stock entries found.</p>
        )}
      </div>
    </div>
  );
};

export default ReceiveNewStock;
