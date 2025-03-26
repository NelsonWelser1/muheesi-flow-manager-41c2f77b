
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Search, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';

const PackingListForm = ({ onBack }) => {
  const [items, setItems] = useState([
    { 
      id: 1, 
      description: 'Arabica Beans (AA Grade)', 
      quantity: 10, 
      unit: 'MT', 
      packages: 400, 
      packageType: 'Jute bags', 
      grossWeight: 10200, 
      netWeight: 10000, 
      dimensions: '60x40x20 cm' 
    },
  ]);
  
  const today = format(new Date(), 'yyyy-MM-dd');

  // Add new item to the packing list
  const handleAddItem = () => {
    const newItem = {
      id: items.length + 1,
      description: '',
      quantity: 0,
      unit: 'MT',
      packages: 0,
      packageType: '',
      grossWeight: 0,
      netWeight: 0,
      dimensions: ''
    };
    setItems([...items, newItem]);
  };

  // Remove item from the packing list
  const handleRemoveItem = (id) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  // Update item details
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Packing List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Note Reference Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Delivery Note Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search delivery notes..." />
            </div>
            <Select defaultValue="dn-2024-001">
              <SelectTrigger id="delivery-note">
                <SelectValue placeholder="Select delivery note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dn-2024-001">DN-2024-001 - Starbucks Corp.</SelectItem>
                <SelectItem value="dn-2024-002">DN-2024-002 - Dunkin Donuts</SelectItem>
                <SelectItem value="dn-2024-004">DN-2024-004 - Blue Bottle Coffee</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Load Delivery Note Data</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Packing List Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Packing List Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="packing-list-number">Packing List Number</Label>
              <Input id="packing-list-number" placeholder="PL-2024-005" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Issue Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="date" type="date" defaultValue={today} className="pl-10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="draft">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input id="customer" placeholder="Enter customer name" defaultValue="Starbucks Corp." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Person</Label>
              <Input id="contact" placeholder="Enter contact person's name" defaultValue="John Smith" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Textarea 
                id="destination" 
                placeholder="Enter destination" 
                defaultValue="1912 Pike Place, Seattle, WA 98101, USA"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Packing List Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Packing List Items</h3>
          
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Packages</TableHead>
                  <TableHead>Package Type</TableHead>
                  <TableHead>Gross Weight (kg)</TableHead>
                  <TableHead>Net Weight (kg)</TableHead>
                  <TableHead>Dimensions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input 
                        placeholder="Item description" 
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={item.unit}
                        onValueChange={(value) => handleItemChange(item.id, 'unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MT">MT</SelectItem>
                          <SelectItem value="KG">KG</SelectItem>
                          <SelectItem value="BAG">Bag</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        min="0"
                        value={item.packages}
                        onChange={(e) => handleItemChange(item.id, 'packages', parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        placeholder="Package type" 
                        value={item.packageType}
                        onChange={(e) => handleItemChange(item.id, 'packageType', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        min="0"
                        value={item.grossWeight}
                        onChange={(e) => handleItemChange(item.id, 'grossWeight', parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        min="0"
                        value={item.netWeight}
                        onChange={(e) => handleItemChange(item.id, 'netWeight', parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        placeholder="Dimensions" 
                        value={item.dimensions}
                        onChange={(e) => handleItemChange(item.id, 'dimensions', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Button variant="outline" onClick={handleAddItem} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Total Packages</Label>
              <Input value={items.reduce((sum, item) => sum + (item.packages || 0), 0)} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Total Gross Weight (kg)</Label>
              <Input value={items.reduce((sum, item) => sum + (item.grossWeight || 0), 0)} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Total Net Weight (kg)</Label>
              <Input value={items.reduce((sum, item) => sum + (item.netWeight || 0), 0)} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Total MT</Label>
              <Input value={(items.reduce((sum, item) => sum + (item.netWeight || 0), 0) / 1000).toFixed(2)} readOnly />
            </div>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Shipping Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier / Shipping Line</Label>
              <Input id="carrier" placeholder="Enter carrier name" defaultValue="Maersk Line" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vessel">Vessel Name</Label>
              <Input id="vessel" placeholder="Enter vessel name" defaultValue="Maersk Sealand" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="container">Container Number(s)</Label>
              <Input id="container" placeholder="Enter container numbers" defaultValue="MSCU1234567, MSCU7654321" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="special-instructions">Special Instructions</Label>
              <Textarea id="special-instructions" placeholder="Enter any special instructions" rows={3} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" placeholder="Enter remarks" rows={3} />
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div className="space-y-2">
          <Label htmlFor="declaration">Declaration</Label>
          <Textarea id="declaration" rows={3} defaultValue="We hereby certify that the information contained in this packing list is true and correct and in accordance with the related Invoice and Contract. The package is packed in a manner suitable for export by sea freight." />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>Cancel</Button>
          <div className="space-x-2">
            <Button variant="outline">Save as Draft</Button>
            <Button>Create Packing List</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackingListForm;
