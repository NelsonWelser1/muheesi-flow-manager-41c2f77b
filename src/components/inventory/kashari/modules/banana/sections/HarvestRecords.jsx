
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Tractor, BarChart2 } from "lucide-react";

const INITIAL_HARVESTS = [
  { 
    id: 1, 
    date: "2025-04-12", 
    section: "A1", 
    variety: "Gonja (Plantain)", 
    quantity: 75, 
    unit: "Bunches",
    weight: 1350,
    quality: "Good"
  },
  { 
    id: 2, 
    date: "2025-04-10", 
    section: "C1", 
    variety: "Ndizi (Apple Banana)", 
    quantity: 120, 
    unit: "Bunches",
    weight: 960,
    quality: "Excellent"
  },
  { 
    id: 3, 
    date: "2025-04-05", 
    section: "B2", 
    variety: "Bogoya (Gros Michel)", 
    quantity: 85, 
    unit: "Bunches",
    weight: 1275,
    quality: "Good"
  }
];

const VARIETIES = [
  "Gonja (Plantain)",
  "Bogoya (Gros Michel)",
  "Ndizi (Apple Banana)",
  "Kayinja (Beer Banana)",
  "Kivuvu (Bluggoe)",
  "Kisubi (Ney Poovan)",
  "Kabula (Cavendish)"
];

const SECTIONS = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
const QUALITIES = ["Excellent", "Good", "Fair", "Poor"];
const UNITS = ["Bunches", "Kilograms", "Tonnes"];

const HarvestRecords = () => {
  const [harvests, setHarvests] = useState(INITIAL_HARVESTS);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    section: "",
    variety: "",
    quantity: "",
    unit: "Bunches",
    weight: "",
    quality: "Good"
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.section || !formData.variety || !formData.quantity) return;
    
    const newHarvest = {
      id: Date.now(),
      ...formData,
      quantity: Number(formData.quantity),
      weight: formData.weight ? Number(formData.weight) : 0
    };
    
    setHarvests(prev => [newHarvest, ...prev]);
    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      section: "",
      variety: "",
      quantity: "",
      unit: "Bunches",
      weight: "",
      quality: "Good"
    });
  };

  // Calculate totals for the dashboard cards
  const totalHarvested = harvests.reduce((sum, h) => sum + h.quantity, 0);
  const totalWeight = harvests.reduce((sum, h) => sum + (h.weight || 0), 0);
  
  // Get percentage of quality grades
  const qualityCounts = harvests.reduce((acc, h) => {
    acc[h.quality] = (acc[h.quality] || 0) + 1;
    return acc;
  }, {});
  
  const excellentPercentage = Math.round((qualityCounts['Excellent'] || 0) / harvests.length * 100) || 0;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Banana Harvest Records</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Harvest Record"}
        </Button>
      </div>
      
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tractor className="h-5 w-5 mr-2" />
              New Harvest Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Harvest Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="section">Plantation Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => handleSelectChange("section", value)}
                  required
                >
                  <SelectTrigger id="section">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map(section => (
                      <SelectItem key={section} value={section}>{section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="variety">Banana Variety</Label>
                <Select
                  value={formData.variety}
                  onValueChange={(value) => handleSelectChange("variety", value)}
                  required
                >
                  <SelectTrigger id="variety">
                    <SelectValue placeholder="Select variety" />
                  </SelectTrigger>
                  <SelectContent>
                    {VARIETIES.map(variety => (
                      <SelectItem key={variety} value={variety}>{variety}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Quantity harvested"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleSelectChange("unit", value)}
                  required
                >
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Total Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quality">Quality Grade</Label>
                <Select
                  value={formData.quality}
                  onValueChange={(value) => handleSelectChange("quality", value)}
                >
                  <SelectTrigger id="quality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALITIES.map(quality => (
                      <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                <Button type="submit">Save Harvest Record</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Harvested</p>
                <p className="text-2xl font-bold">{totalHarvested} <span className="text-sm">Bunches</span></p>
              </div>
              <div className="p-2 bg-muted rounded-full">
                <Tractor className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Weight</p>
                <p className="text-2xl font-bold">{totalWeight} <span className="text-sm">kg</span></p>
              </div>
              <div className="p-2 bg-muted rounded-full">
                <BarChart2 className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Excellent Quality</p>
                <p className="text-2xl font-bold">{excellentPercentage}%</p>
              </div>
              <div className="p-2 bg-muted rounded-full">
                <ClipboardList className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="h-5 w-5 mr-2" />
            Harvest History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-left py-3 px-2">Section</th>
                  <th className="text-left py-3 px-2">Variety</th>
                  <th className="text-right py-3 px-2">Quantity</th>
                  <th className="text-left py-3 px-2">Unit</th>
                  <th className="text-right py-3 px-2">Weight (kg)</th>
                  <th className="text-left py-3 px-2">Quality</th>
                </tr>
              </thead>
              <tbody>
                {harvests.map((harvest) => (
                  <tr key={harvest.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">{harvest.date}</td>
                    <td className="py-3 px-2">{harvest.section}</td>
                    <td className="py-3 px-2">{harvest.variety}</td>
                    <td className="py-3 px-2 text-right">{harvest.quantity}</td>
                    <td className="py-3 px-2">{harvest.unit}</td>
                    <td className="py-3 px-2 text-right">{harvest.weight || '-'}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        harvest.quality === 'Excellent' ? 'bg-green-100 text-green-800' :
                        harvest.quality === 'Good' ? 'bg-blue-100 text-blue-800' :
                        harvest.quality === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {harvest.quality}
                      </span>
                    </td>
                  </tr>
                ))}
                {harvests.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No harvest records available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HarvestRecords;
