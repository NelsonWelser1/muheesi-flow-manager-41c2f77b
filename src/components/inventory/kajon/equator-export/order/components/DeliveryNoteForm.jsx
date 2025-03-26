
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Search, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';

const DeliveryNoteForm = ({ onBack }) => {
  const [items, setItems] = useState([
    { id: 1, name: 'Arabica Beans (AA Grade)', quantity: 10, unit: 'MT', available: 10, packing: 'Jute bags' },
    { id: 2, name: 'Arabica Beans (AB Grade)', quantity: 5, unit: 'MT', available: 5, packing: 'Jute bags' }
  ]);
  
  const today = format(new Date(), 'yyyy-MM-dd');

  // Add item to delivery note
  const handleAddItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, name: '', quantity: 0, unit: 'MT', available: 0, packing: '' }
    ]);
  };

  // Remove item from delivery note
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
        <CardTitle>Create Delivery Note</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Reference Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Order Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search orders..." />
            </div>
            <Select defaultValue="ord-2024-001">
              <SelectTrigger id="order">
                <SelectValue placeholder="Select order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ord-2024-001">ORD-2024-001 - Dunkin Donuts</SelectItem>
                <SelectItem value="ord-2024-002">ORD-2024-002 - Starbucks Corp.</SelectItem>
                <SelectItem value="ord-2024-003">ORD-2024-003 - Blue Bottle Coffee</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Load Order Data</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Note Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Delivery Note Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="delivery-note-number">Delivery Note Number</Label>
              <Input id="delivery-note-number" placeholder="DN-2024-005" />
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
                  <SelectItem value="prepared">Prepared</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input id="customer" placeholder="Enter customer name" defaultValue="Dunkin Donuts" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Person</Label>
              <Input id="contact" placeholder="Enter contact person's name" defaultValue="Sarah Johnson" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delivery-address">Delivery Address</Label>
              <Textarea 
                id="delivery-address" 
                placeholder="Enter delivery address" 
                defaultValue="123 Main Street, Boston, MA 02108, USA"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Items to be Delivered */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Items to be Delivered</h3>
          
          <div className="border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packing</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Include</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Input 
                        placeholder="Item description" 
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 w-24">
                      <Input 
                        type="number" 
                        min="0"
                        max={item.available}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 w-24">
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
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 w-24">
                      <Input 
                        type="number" 
                        value={item.available}
                        readOnly
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Input 
                        placeholder="Packing details" 
                        value={item.packing}
                        onChange={(e) => handleItemChange(item.id, 'packing', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <Checkbox 
                        checked={item.quantity > 0} 
                        onCheckedChange={(checked) => {
                          handleItemChange(item.id, 'quantity', checked ? item.available : 0);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={7} className="px-6 py-4">
                    <Button variant="outline" onClick={handleAddItem} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Shipment Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier / Shipping Line</Label>
              <Input id="carrier" placeholder="Enter carrier name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking / Booking Number</Label>
              <Input id="tracking" placeholder="Enter tracking or booking number" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vessel">Vessel / Vehicle Details</Label>
              <Input id="vessel" placeholder="Enter vessel or vehicle details" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departure">Expected Departure Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="departure" type="date" className="pl-10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="arrival">Expected Arrival Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="arrival" type="date" className="pl-10" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="pickup-details">Pickup Details</Label>
              <Textarea id="pickup-details" placeholder="Enter pickup details" rows={2} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="special-instructions">Special Instructions</Label>
              <Textarea id="special-instructions" placeholder="Enter any special instructions" rows={3} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documents">Accompanying Documents</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="doc-packing-list" />
                  <Label htmlFor="doc-packing-list">Packing List</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doc-invoice" />
                  <Label htmlFor="doc-invoice">Commercial Invoice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doc-certificate" />
                  <Label htmlFor="doc-certificate">Certificate of Origin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doc-quality" />
                  <Label htmlFor="doc-quality">Quality Certificate</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>Cancel</Button>
          <div className="space-x-2">
            <Button variant="outline">Save as Draft</Button>
            <Button>Create Delivery Note</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryNoteForm;
