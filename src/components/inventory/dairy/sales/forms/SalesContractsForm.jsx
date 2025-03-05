
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
import { CalendarIcon, ArrowLeft, PlusCircle, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSalesContracts } from './hooks/useSalesContracts';
import SalesContractsDisplay from './displays/SalesContractsDisplay';

const SalesContractsForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([
    { name: '', quantity: '', unit_price: '', total: '' }
  ]);
  const [showDisplay, setShowDisplay] = useState(false);
  
  const { createContract } = useSalesContracts();
  
  const form = useForm({
    defaultValues: {
      contract_title: '',
      contract_type: 'standard',
      client_name: '',
      client_contact: '',
      client_email: '',
      client_address: '',
      start_date: new Date(),
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      payment_terms: 'net_30',
      delivery_terms: '',
      total_value: '',
      status: 'draft',
      notes: '',
      special_clauses: ''
    }
  });

  if (showDisplay) {
    return <SalesContractsDisplay onBack={() => setShowDisplay(false)} />;
  }

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
        description: "At least one product must be added to the contract",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a contract ID
      const contractId = `SC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Log form data for debugging
      console.log('Form data before submission:', {
        ...data,
        products,
        total_value: calculateTotal()
      });
      
      // Format data for Supabase
      const formattedData = {
        contract_id: contractId,
        contract_title: data.contract_title,
        contract_type: data.contract_type,
        client_name: data.client_name,
        client_contact: data.client_contact,
        client_email: data.client_email,
        client_address: data.client_address,
        products: products,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        payment_terms: data.payment_terms,
        delivery_terms: data.delivery_terms,
        total_value: calculateTotal(),
        status: data.status,
        notes: data.notes,
        special_clauses: data.special_clauses,
        created_at: new Date().toISOString(),
      };
      
      console.log('Formatted data for Supabase:', formattedData);
      
      // Call our createContract function from the hook
      const { success, error } = await createContract(formattedData);

      if (!success) throw new Error(error);

      toast({
        title: "Success",
        description: "Sales contract created successfully"
      });

      // Reset form
      form.reset();
      setProducts([{ name: '', quantity: '', unit_price: '', total: '' }]);
    } catch (error) {
      console.error('Error creating sales contract:', error);
      toast({
        title: "Error",
        description: "Failed to create sales contract: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug function for logging form data
  const debugFormData = () => {
    const formData = form.getValues();
    console.log('Current form values:', formData);
    console.log('Current products:', products);
    console.log('Total contract value:', calculateTotal());
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => setShowDisplay(true)}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" /> View Contracts
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Sales Contract</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contract_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contract title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contract_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Type</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select contract type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                          <SelectItem value="distribution">Distribution</SelectItem>
                          <SelectItem value="framework">Framework</SelectItem>
                          <SelectItem value="one_time">One-time</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Client Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  
                  <FormField
                    control={form.control}
                    name="client_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter client address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
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
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="payment_terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="prepaid">Prepaid</SelectItem>
                          <SelectItem value="cod">Cash on Delivery</SelectItem>
                          <SelectItem value="net_15">Net 15 Days</SelectItem>
                          <SelectItem value="net_30">Net 30 Days</SelectItem>
                          <SelectItem value="net_60">Net 60 Days</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="delivery_terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Terms</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter delivery terms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        <SelectItem value="pending_approval">
                          <div className="flex items-center">
                            <span>Pending Approval</span>
                            <Badge variant="warning" className="ml-2">Pending</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="active">
                          <div className="flex items-center">
                            <span>Active</span>
                            <Badge variant="success" className="ml-2">Active</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="expired">
                          <div className="flex items-center">
                            <span>Expired</span>
                            <Badge variant="destructive" className="ml-2">Expired</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="terminated">
                          <div className="flex items-center">
                            <span>Terminated</span>
                            <Badge className="ml-2">Terminated</Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <p className="text-sm text-gray-500">Total Contract Value</p>
                    <p className="text-2xl font-bold">${calculateTotal()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="special_clauses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Clauses</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter special terms or clauses"
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

              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={debugFormData}
                >
                  Debug Form Data
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Contract"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesContractsForm;
