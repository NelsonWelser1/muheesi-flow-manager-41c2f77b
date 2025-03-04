
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { Search, Plus, Edit, Trash, Mail, Phone, UserPlus } from "lucide-react";

const CustomerManagement = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    customer_type: 'individual',
    notes: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      // In a real application, you'd have a customers table
      // For this example, we'll get unique customer names from sales_records
      const { data, error } = await supabase
        .from('sales_records')
        .select('customer_name')
        .order('customer_name');

      if (error) throw error;
      
      // Create a unique list of customers
      const uniqueCustomers = Array.from(new Set(data.map(item => item.customer_name)))
        .map(name => {
          return {
            id: name.replace(/\s+/g, '-').toLowerCase(),
            name: name,
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            phone: '+1234567890',
            address: '123 Main St',
            city: 'Anytown',
            country: 'Uganda',
            type: Math.random() > 0.5 ? 'individual' : 'business',
            created_at: new Date().toISOString()
          };
        });

      setCustomers(uniqueCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For this example, we'll just show a success message
    // In a real app, you'd save to your customers table
    
    toast({
      title: "Success",
      description: "Customer information saved successfully"
    });
    
    // Reset form and go back to view tab
    setFormData({
      customer_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      customer_type: 'individual',
      notes: ''
    });
    
    setActiveTab('view');
    fetchCustomers(); // Refresh the customer list
  };

  const editCustomer = (customer) => {
    setFormData({
      customer_name: customer.name,
      contact_person: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      country: customer.country,
      customer_type: customer.type,
      notes: ''
    });
    
    setSelectedCustomer(customer);
    setActiveTab('edit');
  };

  const deleteCustomer = (customerId) => {
    // In a real app, you'd delete from the database
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    
    toast({
      title: "Success",
      description: "Customer deleted successfully"
    });
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="view">View Customers</TabsTrigger>
            <TabsTrigger value="add">Add Customer</TabsTrigger>
            {selectedCustomer && (
              <TabsTrigger value="edit">Edit Customer</TabsTrigger>
            )}
          </TabsList>
          
          {activeTab === 'view' && (
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2 text-gray-500" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          )}
        </div>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Customer List</span>
                <Button onClick={() => setActiveTab('add')} className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Add New Customer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p>Loading customers...</p>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No customers found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Customer</th>
                        <th className="text-left py-2 px-4">Contact</th>
                        <th className="text-left py-2 px-4">Type</th>
                        <th className="text-left py-2 px-4">Location</th>
                        <th className="text-left py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">{customer.name}</td>
                          <td className="py-2 px-4">
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1 text-gray-500" />
                                <span className="text-sm">{customer.email}</span>
                              </div>
                              <div className="flex items-center mt-1">
                                <Phone className="h-3 w-3 mr-1 text-gray-500" />
                                <span className="text-sm">{customer.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 px-4 capitalize">{customer.type}</td>
                          <td className="py-2 px-4">{`${customer.city}, ${customer.country}`}</td>
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => editCustomer(customer)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteCustomer(customer.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <CustomerForm 
            formData={formData} 
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSubmit={handleSubmit}
            title="Add New Customer"
            buttonText="Add Customer"
          />
        </TabsContent>

        <TabsContent value="edit">
          <CustomerForm 
            formData={formData} 
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSubmit={handleSubmit}
            title={`Edit Customer: ${selectedCustomer?.name}`}
            buttonText="Update Customer"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CustomerForm = ({ 
  formData, 
  handleInputChange, 
  handleSelectChange,
  handleSubmit,
  title,
  buttonText
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name*</Label>
              <Input
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_type">Customer Type</Label>
              <Select
                value={formData.customer_type}
                onValueChange={(value) => handleSelectChange('customer_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="non-profit">Non-Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone*</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit">
              {buttonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerManagement;
