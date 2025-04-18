
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Search, 
  Building, 
  BuildingAdd, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  BarChart2, 
  CalendarClock, 
  FileText, 
  Trash, 
  Edit, 
  Globe, 
  MoreHorizontal,
  Tag
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  type: z.string().min(1, "Please select a type"),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  industryType: z.string().optional(),
  employeeCount: z.string().optional(),
  revenue: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

const CompaniesView = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Grand Berna Dairies",
      type: "Client",
      phone: "+256 123 456 789",
      email: "info@grandberna.com",
      website: "https://www.grandberna.com",
      address: "Plot 14, Industrial Area",
      city: "Kampala",
      state: "Central",
      postalCode: "10101",
      country: "Uganda",
      industryType: "Dairy",
      employeeCount: "50-100",
      revenue: "$1M-$5M",
      notes: "Key client for dairy products distribution in the Central region.",
      tags: "dairy, client, distribution",
      contactCount: 3,
      dealCount: 2,
      lastActivity: "2024-04-17T09:30:00"
    },
    {
      id: 2,
      name: "KAJON Coffee Limited",
      type: "Vendor",
      phone: "+256 987 654 321",
      email: "info@kajoncoffee.com",
      website: "https://www.kajoncoffee.com",
      address: "27 Coffee Plaza",
      city: "Entebbe",
      state: "Central",
      postalCode: "10203",
      country: "Uganda",
      industryType: "Coffee",
      employeeCount: "100-250",
      revenue: "$5M-$10M",
      notes: "Premium coffee supplier with export operations.",
      tags: "coffee, vendor, export",
      contactCount: 5,
      dealCount: 1,
      lastActivity: "2024-04-15T14:45:00"
    },
    {
      id: 3,
      name: "FreshEco Farms",
      type: "Partner",
      phone: "+256 765 432 109",
      email: "contact@fresheco.org",
      website: "https://www.fresheco.org",
      address: "Rural Highway 5",
      city: "Jinja",
      state: "Eastern",
      postalCode: "40506",
      country: "Uganda",
      industryType: "Agriculture",
      employeeCount: "10-50",
      revenue: "$500K-$1M",
      notes: "Organic produce partner with a focus on sustainability.",
      tags: "organic, partner, produce",
      contactCount: 2,
      dealCount: 1,
      lastActivity: "2024-04-10T11:15:00"
    },
    {
      id: 4,
      name: "Organic Co-op",
      type: "Lead",
      phone: "+256 234 567 890",
      email: "hello@organiccoop.co.ug",
      website: "https://www.organiccoop.co.ug",
      address: "Plot 78, Farmer's Market",
      city: "Mbale",
      state: "Eastern",
      postalCode: "30405",
      country: "Uganda",
      industryType: "Agriculture",
      employeeCount: "1-10",
      revenue: "Under $500K",
      notes: "Potential partner for organic produce distribution.",
      tags: "organic, lead, small-business",
      contactCount: 1,
      dealCount: 0,
      lastActivity: "2024-04-05T10:00:00"
    },
    {
      id: 5,
      name: "Produce Distributors",
      type: "Client",
      phone: "+256 345 678 901",
      email: "sales@producedist.com",
      website: "https://www.producedist.com",
      address: "Distribution Center, Block 12",
      city: "Kampala",
      state: "Central",
      postalCode: "10104",
      country: "Uganda",
      industryType: "Distribution",
      employeeCount: "25-50",
      revenue: "$1M-$5M",
      notes: "Regional food distributor with multiple retail contracts.",
      tags: "distribution, client, retail",
      contactCount: 2,
      dealCount: 1,
      lastActivity: "2024-04-12T16:30:00"
    }
  ]);

  const [openNewCompanyDialog, setOpenNewCompanyDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      type: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      industryType: "",
      employeeCount: "",
      revenue: "",
      notes: "",
      tags: ""
    }
  });

  const handleAddCompany = (values) => {
    const newCompany = {
      id: companies.length + 1,
      ...values,
      contactCount: 0,
      dealCount: 0,
      lastActivity: new Date().toISOString()
    };
    
    setCompanies([newCompany, ...companies]);
    setOpenNewCompanyDialog(false);
    form.reset();
  };

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
  };

  const handleCloseCompanyView = () => {
    setSelectedCompany(null);
  };

  const handleDeleteCompany = (id) => {
    setCompanies(companies.filter(company => company.id !== id));
    if (selectedCompany && selectedCompany.id === id) {
      setSelectedCompany(null);
    }
  };

  const getStatusBadge = (type) => {
    switch (type) {
      case "Client":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{type}</Badge>;
      case "Vendor":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{type}</Badge>;
      case "Partner":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{type}</Badge>;
      case "Lead":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {selectedCompany ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mb-2" 
                  onClick={handleCloseCompanyView}
                >
                  &larr; Back to Companies
                </Button>
                <CardTitle className="text-2xl">{selectedCompany.name}</CardTitle>
                <div className="flex items-center mt-1 space-x-2">
                  {getStatusBadge(selectedCompany.type)}
                  <span className="text-sm text-muted-foreground">{selectedCompany.industryType}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteCompany(selectedCompany.id)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Contacts</div>
                          <div className="text-2xl font-semibold">{selectedCompany.contactCount}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Deals</div>
                          <div className="text-2xl font-semibold">{selectedCompany.dealCount}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <CalendarClock className="h-5 w-5 text-purple-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Last Activity</div>
                          <div className="text-sm font-medium">
                            {selectedCompany.lastActivity ? new Date(selectedCompany.lastActivity).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Industry Type</div>
                            <div className="font-medium">{selectedCompany.industryType || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Employees</div>
                            <div className="font-medium">{selectedCompany.employeeCount || 'N/A'}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Annual Revenue</div>
                          <div className="font-medium">{selectedCompany.revenue || 'N/A'}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Tags</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedCompany.tags && selectedCompany.tags.split(',').map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Phone className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground" />
                          <span>{selectedCompany.phone || 'No phone number'}</span>
                        </div>
                        
                        <div className="flex items-start">
                          <Mail className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground" />
                          <span>{selectedCompany.email || 'No email'}</span>
                        </div>
                        
                        {selectedCompany.website && (
                          <div className="flex items-start">
                            <Globe className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground" />
                            <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedCompany.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}
                        
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground" />
                          <div>
                            {selectedCompany.address && (
                              <div>{selectedCompany.address}</div>
                            )}
                            {(selectedCompany.city || selectedCompany.state) && (
                              <div>
                                {selectedCompany.city}
                                {selectedCompany.city && selectedCompany.state && ', '}
                                {selectedCompany.state}
                                {selectedCompany.postalCode && ` ${selectedCompany.postalCode}`}
                              </div>
                            )}
                            {selectedCompany.country && (
                              <div>{selectedCompany.country}</div>
                            )}
                            {!selectedCompany.address && !selectedCompany.city && !selectedCompany.country && (
                              <span className="text-muted-foreground">No address available</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {selectedCompany.notes && (
                  <Card className="mt-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="whitespace-pre-line">{selectedCompany.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="contacts">
                {selectedCompany.contactCount > 0 ? (
                  <Card>
                    <CardContent className="p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              <div className="text-muted-foreground">
                                Contact details will appear here
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <Alert>
                    <Users className="h-4 w-4" />
                    <AlertTitle>No contacts found</AlertTitle>
                    <AlertDescription>
                      There are no contacts associated with this company yet.
                      <Button variant="outline" size="sm" className="mt-2">
                        Add Contact
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="deals">
                {selectedCompany.dealCount > 0 ? (
                  <Card>
                    <CardContent className="p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Deal Name</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Stage</TableHead>
                            <TableHead>Expected Close</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              <div className="text-muted-foreground">
                                Deal details will appear here
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertTitle>No deals found</AlertTitle>
                    <AlertDescription>
                      There are no deals associated with this company yet.
                      <Button variant="outline" size="sm" className="mt-2">
                        Add Deal
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="documents">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>No documents found</AlertTitle>
                  <AlertDescription>
                    There are no documents associated with this company yet.
                    <Button variant="outline" size="sm" className="mt-2">
                      Upload Document
                    </Button>
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Companies</CardTitle>
              <Dialog open={openNewCompanyDialog} onOpenChange={setOpenNewCompanyDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <BuildingAdd className="h-4 w-4 mr-2" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddCompany)}>
                      <DialogHeader>
                        <DialogTitle>Add New Company</DialogTitle>
                        <DialogDescription>
                          Enter company details to add it to your CRM.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList className="mb-4 grid grid-cols-3">
                            <TabsTrigger value="basic">Basic</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="additional">Additional</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="basic" className="space-y-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Name *</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Type *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Client">Client</SelectItem>
                                      <SelectItem value="Vendor">Vendor</SelectItem>
                                      <SelectItem value="Partner">Partner</SelectItem>
                                      <SelectItem value="Lead">Lead</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="website"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Website</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TabsContent>
                          
                          <TabsContent value="details" className="space-y-4">
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Textarea rows={2} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State/Region</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="additional" className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="industryType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Industry Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                                        <SelectItem value="Coffee">Coffee</SelectItem>
                                        <SelectItem value="Dairy">Dairy</SelectItem>
                                        <SelectItem value="Distribution">Distribution</SelectItem>
                                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                        <SelectItem value="Retail">Retail</SelectItem>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="employeeCount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Number of Employees</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select range" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="1-10">1-10</SelectItem>
                                        <SelectItem value="10-50">10-50</SelectItem>
                                        <SelectItem value="50-100">50-100</SelectItem>
                                        <SelectItem value="100-250">100-250</SelectItem>
                                        <SelectItem value="250-500">250-500</SelectItem>
                                        <SelectItem value="500+">500+</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="revenue"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Annual Revenue</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select revenue range" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Under $500K">Under $500K</SelectItem>
                                      <SelectItem value="$500K-$1M">$500K-$1M</SelectItem>
                                      <SelectItem value="$1M-$5M">$1M-$5M</SelectItem>
                                      <SelectItem value="$5M-$10M">$5M-$10M</SelectItem>
                                      <SelectItem value="$10M-$50M">$10M-$50M</SelectItem>
                                      <SelectItem value="$50M+">$50M+</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="tags"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tags (Comma-separated)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. dairy, vendor, important" {...field} />
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
                                    <Textarea rows={3} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TabsContent>
                        </Tabs>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenNewCompanyDialog(false)} type="button">
                          Cancel
                        </Button>
                        <Button type="submit">Create Company</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search companies..."
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Companies</TabsTrigger>
                <TabsTrigger value="client">Clients</TabsTrigger>
                <TabsTrigger value="vendor">Vendors</TabsTrigger>
                <TabsTrigger value="partner">Partners</TabsTrigger>
                <TabsTrigger value="lead">Leads</TabsTrigger>
              </TabsList>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Phone/Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contacts</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="cursor-pointer hover:text-primary" onClick={() => handleViewCompany(company)}>
                            {company.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(company.type)}</TableCell>
                      <TableCell>{company.industryType}</TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          {company.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{company.phone}</span>
                            </div>
                          )}
                          {company.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{company.email}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {company.city && company.country && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            {company.city}, {company.country}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          {company.contactCount}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewCompany(company)}>
                              <Building className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add Contact
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <FileText className="h-4 w-4 mr-2" />
                              Add Deal
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDeleteCompany(company.id)}>
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompaniesView;
