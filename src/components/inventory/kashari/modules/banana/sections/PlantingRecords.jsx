
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText } from "lucide-react";

const INITIAL_RECORDS = [
  { 
    id: 1, 
    date: "2025-03-15", 
    section: "A1", 
    variety: "Gonja (Plantain)", 
    quantity: 200, 
    spacing: "3m x 3m",
    supervisor: "John Mukasa"
  },
  { 
    id: 2, 
    date: "2025-03-22", 
    section: "B2", 
    variety: "Bogoya (Gros Michel)", 
    quantity: 150, 
    spacing: "3m x 2.5m",
    supervisor: "Sarah Namuli"
  },
  { 
    id: 3, 
    date: "2025-04-05", 
    section: "C1", 
    variety: "Ndizi (Apple Banana)", 
    quantity: 180, 
    spacing: "2.5m x 2.5m",
    supervisor: "Robert Kato"
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

const PlantingRecords = () => {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    section: "",
    variety: "",
    quantity: "",
    spacing: "",
    supervisor: ""
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
    
    const newRecord = {
      id: Date.now(),
      ...formData,
      quantity: Number(formData.quantity)
    };
    
    setRecords(prev => [newRecord, ...prev]);
    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      section: "",
      variety: "",
      quantity: "",
      spacing: "",
      supervisor: ""
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Banana Planting Records</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Planting Record"}
        </Button>
      </div>
      
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              New Planting Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Planting Date</Label>
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
                <Label htmlFor="quantity">Quantity (Suckers)</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Number of suckers planted"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="spacing">Planting Spacing</Label>
                <Input
                  id="spacing"
                  name="spacing"
                  value={formData.spacing}
                  onChange={handleChange}
                  placeholder="E.g., 3m x 3m"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supervisor">Field Supervisor</Label>
                <Input
                  id="supervisor"
                  name="supervisor"
                  value={formData.supervisor}
                  onChange={handleChange}
                  placeholder="Name of supervisor"
                />
              </div>
              
              <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                <Button type="submit">Save Record</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Planting History
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
                  <th className="text-left py-3 px-2">Spacing</th>
                  <th className="text-left py-3 px-2">Supervisor</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">{record.date}</td>
                    <td className="py-3 px-2">{record.section}</td>
                    <td className="py-3 px-2">{record.variety}</td>
                    <td className="py-3 px-2 text-right">{record.quantity}</td>
                    <td className="py-3 px-2">{record.spacing}</td>
                    <td className="py-3 px-2">{record.supervisor}</td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No planting records available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{records.reduce((sum, r) => sum + r.quantity, 0)}</div>
            <p className="text-sm text-muted-foreground">Total Suckers Planted</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{SECTIONS.filter(s => records.some(r => r.section === s)).length} / {SECTIONS.length}</div>
            <p className="text-sm text-muted-foreground">Plantation Sections Used</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{new Set(records.map(r => r.variety)).size}</div>
            <p className="text-sm text-muted-foreground">Banana Varieties Planted</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlantingRecords;
