
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Search } from 'lucide-react';
import { format } from 'date-fns';

const OrderForm = ({ onBack }) => {
  const [items, setItems] = useState([{ 
    id: 1, 
    description: 'Arabica Beans (AA Grade)', 
    quantity: 10, 
    unit: 'MT', 
    price: 4500.00, 
    total: 45000.00 
  }]);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const deliveryDate = format(new Date(new Date().setDate(new Date().getDate() + 45)), 'yyyy-MM-dd');

  // Add new item to the order
  const handleAddItem = () => {
    const newItem = {
      id: items.length + 1,
      description: '',
      quantity: 1,
      unit: 'MT',
      price: 0.00,
      total: 0.00
    };
    setItems([...items, newItem]);
  };

  // Remove item from the order
  const handleRemoveItem = (id) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  // Update item details
  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate total if quantity or price changed
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Calculate grand total
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Proforma Reference Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Proforma Invoice Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search proforma invoices..." />
            </div>
            <Select defaultValue="pi-2024-002">
              <SelectTrigger id="proforma">
                <SelectValue placeholder="Select proforma invoice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pi-2024-001">PI-2024-001 - Starbucks Corp.</SelectItem>
                <SelectItem value="pi-2024-002">PI-2024-002 - Dunkin Donuts</SelectItem>
                <SelectItem value="pi-2024-003">PI-2024-003 - Peet's Coffee</SelectItem>
                <SelectItem value="pi-2024-004">PI-2024-004 - Blue Bottle Coffee</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Load Proforma Data</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email address" defaultValue="sarah.johnson@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Enter phone number" defaultValue="+1 (555) 987-6543" />
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Order Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="order-number">Order Number</Label>
              <Input id="order-number" placeholder="ORD-2024-005" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Order Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="date" type="date" defaultValue={today} className="pl-10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delivery-date">Estimated Delivery Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="delivery-date" type="date" defaultValue={deliveryDate} className="pl-10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Order Status</Label>
              <Select defaultValue="processing">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Order Items</h3>
          
          <div className="border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price ($)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total ($)</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Input 
                        placeholder="Item description" 
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Input 
                        type="number" 
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Select 
                        value={item.unit}
                        onValueChange={(value) => handleItemChange(item.id, 'unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MT">Metric Ton (MT)</SelectItem>
                          <SelectItem value="KG">Kilogram (KG)</SelectItem>
                          <SelectItem value="BAG">Bag</SelectItem>
                          <SelectItem value="CONTAINER">Container</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length === 1}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="px-6 py-4">
                    <Button variant="outline" onClick={handleAddItem}>
                      Add Item
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="flex justify-end text-lg font-medium">
            <span className="mr-4">Grand Total:</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>

        {/* Shipping and Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Shipping Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="shipping-address">Shipping Address</Label>
              <Textarea id="shipping-address" placeholder="Enter shipping address" rows={3} defaultValue="123 Main Street, Boston, MA 02108, USA" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shipping-method">Shipping Method</Label>
              <Select defaultValue="ocean">
                <SelectTrigger id="shipping-method">
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ocean">Ocean Freight</SelectItem>
                  <SelectItem value="air">Air Freight</SelectItem>
                  <SelectItem value="land">Land Transport</SelectItem>
                  <SelectItem value="express">Express Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incoterms">Incoterms</Label>
              <Select defaultValue="fob">
                <SelectTrigger id="incoterms">
                  <SelectValue placeholder="Select incoterms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exw">EXW (Ex Works)</SelectItem>
                  <SelectItem value="fob">FOB (Free on Board)</SelectItem>
                  <SelectItem value="cif">CIF (Cost, Insurance & Freight)</SelectItem>
                  <SelectItem value="ddp">DDP (Delivered Duty Paid)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select defaultValue="wire">
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wire">Wire Transfer</SelectItem>
                  <SelectItem value="lc">Letter of Credit</SelectItem>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Select defaultValue="net30">
                <SelectTrigger id="payment-terms">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advance">100% Advance</SelectItem>
                  <SelectItem value="partial">50% Advance, 50% on Delivery</SelectItem>
                  <SelectItem value="net30">Net 30 Days</SelectItem>
                  <SelectItem value="net60">Net 60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox id="payment-received" />
              <Label htmlFor="payment-received">Payment Received</Label>
            </div>
          </div>
        </div>

        {/* Notes and Additional Information */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes and Additional Information</Label>
          <Textarea id="notes" placeholder="Enter any additional notes" rows={4} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>Cancel</Button>
          <div className="space-x-2">
            <Button variant="outline">Save as Draft</Button>
            <Button>Create Order</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
