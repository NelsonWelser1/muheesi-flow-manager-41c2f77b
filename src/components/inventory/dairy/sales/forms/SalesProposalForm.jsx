
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { CalendarIcon, ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SalesProposalForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([
    { name: '', quantity: '', unit_price: '', total: '' }
  ]);
  
  const form = useForm({
    defaultValues: {
      proposal_title: '',
      client_name: '',
      client_contact: '',
      client_email: '',
      proposal_date: new Date(),
      expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      status: 'draft',
      terms_conditions: 'Payment due within 30 days of delivery.',
      notes: ''
    }
  });

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: '', unit_price: '', total: '' }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    
    // Calculate total if quantity or unit_price changes
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : 
        parseFloat(updatedProducts[index].quantity) || 0;
      const unitPrice = field === 'unit_price' ? parseFloat(value) || 0 : 
        parseFloat(updatedProducts[index].unit_price) || 0;
      
      updatedProducts[index].total = (quantity * unitPrice).toFixed(2);
    }
    
    setProducts(updatedProducts);
  };

  const calculateTotal = () => {
    return products.reduce((sum, product) => {
      return sum + (parseFloat(product.total) || 0);
    }, 0).toFixed(2);
  };

  const onSubmit = async (data) => {
    // Validate products
    if (products.length === 0 || !products.some(p => p.name.trim() !== '')) {
      toast({
        title: "Validation Error",
        description: "At least one product must be added to the proposal",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a proposal ID
      const proposalId = `SP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format data for Supabase
      const formattedData = {
        proposal_id: proposalId,
        proposal_title: data.proposal_title,
        client_name: data.client_name,
        client_contact: data.client_contact,
        client_email: data.client_email,
        products: JSON.stringify(products),
        total_amount: calculateTotal(),
        proposal_date: data.proposal_date.toISOString(),
        expiry_date: data.expiry_date.toISOString(),
        status: data.status,
        terms_conditions: data.terms_conditions,
        notes: data.notes,
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('sales_proposals')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sales proposal created successfully"
      });

      // Reset form
      form.reset();
      setProducts([{ name: '', quantity: '', unit_price: '', total: '' }]);
    } catch (error) {
      console.error('Error creating sales proposal:', error);
      toast({
        title: "Error",
        description: "Failed to create sales proposal: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Sales Proposal</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="proposal_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposal Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter proposal title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">
                            <div className="flex items-center">
                              <span>Draft</span>
                              <Badge variant="info" className="ml-2">Draft</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="sent">
                            <div className="flex items-center">
                              <span>Sent</span>
                              <Badge variant="pending" className="ml-2">Sent</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="accepted">
                            <div className="flex items-center">
                              <span>Accepted</span>
                              <Badge variant="success" className="ml-2">Accepted</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="rejected">
                            <div className="flex items-center">
                              <span>Rejected</span>
                              <Badge variant="destructive" className="ml-2">Rejected</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Client Information</h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="client_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="client_contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="client_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email address" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Proposal Dates</h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="proposal_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Proposal Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="expiry_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Expiry Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Products</h3>
                
                {products.map((product, index) => (
                  <div key={index} className="p-4 border rounded-md mb-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Product {index + 1}</h4>
                      {products.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeProduct(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <FormLabel>Product Name</FormLabel>
                        <Input 
                          value={product.name} 
                          onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                          placeholder="Enter product name"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Quantity</FormLabel>
                        <Input 
                          value={product.quantity} 
                          onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                          placeholder="Enter quantity"
                          type="number"
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Unit Price</FormLabel>
                        <Input 
                          value={product.unit_price} 
                          onChange={(e) => handleProductChange(index, 'unit_price', e.target.value)}
                          placeholder="Enter unit price"
                          type="number"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Total</FormLabel>
                        <Input 
                          value={product.total} 
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addProduct}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" /> Add Product
                  </Button>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold">${calculateTotal()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="terms_conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter terms and conditions"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter additional notes"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Sales Proposal"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesProposalForm;
