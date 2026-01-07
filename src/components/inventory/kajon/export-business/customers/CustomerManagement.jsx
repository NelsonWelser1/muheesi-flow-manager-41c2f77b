import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Plus, FileText, Mail, Phone, MapPin, 
  Building, Globe, Filter, Download, Edit, Eye, Loader2 
} from "lucide-react";
import { useCoffeeCustomers } from '@/hooks/useCoffeeCustomers';

const CustomerManagement = ({ viewOnly = false }) => {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer, getCustomerStats } = useCoffeeCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Importer',
    location: '',
    country: '',
    contact_person: '',
    email: '',
    phone: '',
    website: '',
    preferred_coffee_types: [],
    preferred_grades: [],
    status: 'Active',
    notes: ''
  });

  const stats = getCustomerStats();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Importer',
      location: '',
      country: '',
      contact_person: '',
      email: '',
      phone: '',
      website: '',
      preferred_coffee_types: [],
      preferred_grades: [],
      status: 'Active',
      notes: ''
    });
  };

  const handleAddCustomer = async () => {
    if (!formData.name || !formData.type || !formData.location) {
      return;
    }

    const result = await addCustomer(formData);
    
    if (result.success) {
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      customer.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contact_person?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'active') return matchesSearch && customer.status === 'Active';
    if (selectedTab === 'inactive') return matchesSearch && customer.status === 'Inactive';
    if (selectedTab === 'importers') return matchesSearch && customer.type === 'Importer';
    if (selectedTab === 'roasters') return matchesSearch && customer.type === 'Roaster';
    return matchesSearch;
  });

  const exportCustomersToCSV = () => {
    const headers = ["Name", "Type", "Location", "Country", "Contact", "Email", "Phone", "Status"];
    const dataRows = filteredCustomers.map(customer => [
      customer.name,
      customer.type,
      customer.location,
      customer.country,
      customer.contact_person,
      customer.email,
      customer.phone,
      customer.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...dataRows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'coffee_customers.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCustomerTable = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Contact Person</TableHead>
              <TableHead className="hidden sm:table-cell">Location</TableHead>
              <TableHead className="hidden lg:table-cell">Last Order</TableHead>
              <TableHead className="hidden lg:table-cell">Preferred Coffee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p>Loading customers...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Building className="h-10 w-10 text-muted-foreground" />
                    <p className="text-lg font-medium">No customers found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                    {!viewOnly && (
                      <Button onClick={() => setIsAddDialogOpen(true)} className="mt-2">
                        Add Your First Customer
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground hidden sm:block md:hidden">
                      {customer.contact_person}
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.type}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.contact_person}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{customer.location}{customer.country ? `, ${customer.country}` : ''}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'No orders yet'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(customer.preferred_coffee_types || []).slice(0, 2).map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {(customer.preferred_coffee_types || []).length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{customer.preferred_coffee_types.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.status === 'Active' ? 'default' : 'secondary'}
                      className={customer.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'}
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!viewOnly && (
                        <>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-muted-foreground">Manage your coffee export customers and track relationships</p>
        </div>
        {!viewOnly && (
          <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
            <TabsTrigger value="importers">Importers ({stats.byType.importers})</TabsTrigger>
            <TabsTrigger value="roasters">Roasters ({stats.byType.roasters})</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="w-full sm:w-[200px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" title="Filter">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Export" onClick={exportCustomersToCSV}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          {renderCustomerTable()}
        </TabsContent>
        <TabsContent value="active" className="m-0">
          {renderCustomerTable()}
        </TabsContent>
        <TabsContent value="inactive" className="m-0">
          {renderCustomerTable()}
        </TabsContent>
        <TabsContent value="importers" className="m-0">
          {renderCustomerTable()}
        </TabsContent>
        <TabsContent value="roasters" className="m-0">
          {renderCustomerTable()}
        </TabsContent>
      </Tabs>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Company Name *</label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Customer Type *</label>
              <select 
                id="type" name="type" value={formData.type} onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="Importer">Importer</option>
                <option value="Roaster">Roaster</option>
                <option value="Trader">Trader</option>
                <option value="Distributor">Distributor</option>
                <option value="Retailer">Retailer</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">City/Location *</label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">Country *</label>
              <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact_person" className="text-sm font-medium">Contact Person</label>
              <Input id="contact_person" name="contact_person" value={formData.contact_person} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone</label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium">Website</label>
              <Input id="website" name="website" value={formData.website} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <select 
                id="status" name="status" value={formData.status} onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <textarea
                id="notes" name="notes" rows={3} value={formData.notes} onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      {selectedCustomer && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedCustomer.name}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <Card className="md:col-span-2">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="text-muted-foreground">Type:</span> {selectedCustomer.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="text-muted-foreground">Location:</span> {selectedCustomer.location}{selectedCustomer.country ? `, ${selectedCustomer.country}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="text-muted-foreground">Email:</span> {selectedCustomer.email || 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="text-muted-foreground">Phone:</span> {selectedCustomer.phone || 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="text-muted-foreground">Website:</span> {selectedCustomer.website || 'N/A'}
                    </div>
                  </div>
                  {(selectedCustomer.preferred_coffee_types || []).length > 0 && (
                    <div className="pt-2">
                      <div className="text-sm font-medium mb-1">Preferred Coffee Types:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomer.preferred_coffee_types.map((type) => (
                          <Badge key={type} variant="secondary">{type}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {(selectedCustomer.preferred_grades || []).length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Preferred Grades:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomer.preferred_grades.map((grade) => (
                          <Badge key={grade} variant="outline">{grade}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedCustomer.notes && (
                    <div className="pt-2">
                      <div className="text-sm font-medium">Notes:</div>
                      <p className="text-sm text-muted-foreground mt-1">{selectedCustomer.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Status:</div>
                    <Badge
                      variant={selectedCustomer.status === 'Active' ? 'default' : 'secondary'}
                      className={selectedCustomer.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'}
                    >
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Last Order:</div>
                    <div className="text-sm">
                      {selectedCustomer.last_order_date 
                        ? new Date(selectedCustomer.last_order_date).toLocaleDateString()
                        : 'No orders yet'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Total Orders:</div>
                    <div className="text-sm">{selectedCustomer.total_orders || 0}</div>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" disabled={viewOnly}>
                      View Order History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DialogFooter className="gap-2">
              {!viewOnly && (
                <>
                  <Button variant="outline" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Customer
                  </Button>
                </>
              )}
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CustomerManagement;
