import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useAddOrder } from '@/integrations/supabase/hooks/useOrders';
import { useNavigate } from 'react-router-dom';

const OrderForm = ({ company }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const addOrder = useAddOrder();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    items: [],
    specialInstructions: '',
  });

  const getCompanySpecificItems = () => {
    switch (company) {
      case 'Grand Berna Dairies':
        return [
          { code: 'FM-001', description: 'Fresh Milk (1L)', qty: 0, price: 2.50 },
          { code: 'YG-001', description: 'Natural Yogurt (500g)', qty: 0, price: 3.00 },
          { code: 'CH-001', description: 'Cheddar Cheese (250g)', qty: 0, price: 4.50 },
          { code: 'MT-001', description: 'Premium Beef (1kg)', qty: 0, price: 15.00 },
        ];
      case 'KAJON Coffee Limited':
        return [
          { code: 'RC-018', description: 'Robusta Coffee Screen 18 (60kg)', qty: 0, price: 180.00 },
          { code: 'RC-015', description: 'Robusta Coffee Screen 15 (60kg)', qty: 0, price: 165.00 },
          { code: 'AC-BGA', description: 'Arabica Coffee Bugisu AA (60kg)', qty: 0, price: 210.00 },
          { code: 'AC-BGR', description: 'Arabica Coffee DRUGAR (60kg)', qty: 0, price: 195.00 },
        ];
      case 'Kyalima Farmers Limited':
        return [
          { code: 'RC-001', description: 'Premium Rice (50kg)', qty: 0, price: 45.00 },
          { code: 'MZ-001', description: 'Quality Maize (100kg)', qty: 0, price: 35.00 },
          { code: 'SS-001', description: 'White Sesame Seeds (25kg)', qty: 0, price: 60.00 },
          { code: 'SB-001', description: 'Soybean Grade A (100kg)', qty: 0, price: 85.00 },
        ];
      default:
        return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (code, qty) => {
    const items = getCompanySpecificItems().map(item => {
      if (item.code === code) {
        return { ...item, qty: parseInt(qty) || 0 };
      }
      return item;
    });
    setFormData(prev => ({ ...prev, items }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.qty * item.price), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const orderData = {
        company,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_address: formData.customerAddress,
        items: formData.items.filter(item => item.qty > 0),
        total_amount: calculateTotal(),
        special_instructions: formData.specialInstructions,
      };

      await addOrder.mutateAsync(orderData);

      toast({
        title: "Order Submitted Successfully",
        description: "Your order has been received and is being processed.",
      });

      // Redirect based on company
      switch (company) {
        case 'KAJON Coffee Limited':
          navigate('/manage-inventory/kajon-coffee/export-management/orders');
          break;
        case 'Grand Berna Dairies':
          navigate('/manage-inventory/grand-berna');
          break;
        case 'Kyalima Farmers Limited':
          navigate('/manage-inventory/kyalima-farmers');
          break;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Make an Order</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-blue-600">
            PURCHASE ORDER - {company}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-100 p-4 rounded">
                <h3 className="font-bold mb-2">CUSTOMER INFORMATION</h3>
                <div className="space-y-2">
                  <Input 
                    name="customerName"
                    placeholder="Full Name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input 
                    name="customerEmail"
                    type="email"
                    placeholder="Email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                  />
                  <Input 
                    name="customerAddress"
                    placeholder="Delivery Address"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-100 p-4 rounded">
                <h3 className="font-bold mb-2">ORDER DETAILS</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ITEM</TableHead>
                      <TableHead>QTY</TableHead>
                      <TableHead>PRICE</TableHead>
                      <TableHead>TOTAL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getCompanySpecificItems().map((item) => (
                      <TableRow key={item.code}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          <Input 
                            type="number"
                            min="0"
                            value={formData.items.find(i => i.code === item.code)?.qty || 0}
                            onChange={(e) => handleQuantityChange(item.code, e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          ${((formData.items.find(i => i.code === item.code)?.qty || 0) * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Special Instructions</Label>
            <Textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              placeholder="Enter any special instructions or notes"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">
              Total: ${calculateTotal().toFixed(2)}
            </div>
            <div className="space-x-4">
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
              <Button type="submit" disabled={addOrder.isLoading}>
                {addOrder.isLoading ? "Submitting..." : "Submit Order"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;