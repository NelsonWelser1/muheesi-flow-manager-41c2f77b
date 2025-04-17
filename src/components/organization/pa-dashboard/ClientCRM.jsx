
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Plus, User, Building, UserCheck, Phone, Mail, Calendar, MoreHorizontal } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const ClientCRM = ({ selectedEntity }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock client data
  const clients = [
    { id: 1, company: "Kampala Supermarkets", contact: "John Mutebi", email: "john@kampalasupermarkets.com", phone: "+256 712345601", lastContact: "April 15, 2025", status: "active", entity: "grand-berna" },
    { id: 2, company: "Uganda Food Exports", contact: "Sarah Nassali", email: "sarah@ugfoodexports.com", phone: "+256 712345602", lastContact: "April 14, 2025", status: "lead", entity: "fresheco" },
    { id: 3, company: "Entebbe Hotels Group", contact: "David Opiyo", email: "david@entebbehotels.com", phone: "+256 712345603", lastContact: "April 13, 2025", status: "active", entity: "kajon-coffee" },
    { id: 4, company: "East African Distributors", contact: "Rebecca Atim", email: "rebecca@eadistributors.com", phone: "+256 712345604", lastContact: "April 12, 2025", status: "inactive", entity: "grand-berna" },
    { id: 5, company: "Mbarara Restaurant Chain", contact: "Joseph Mugisha", email: "joseph@mbararafoods.com", phone: "+256 712345605", lastContact: "April 11, 2025", status: "active", entity: "bukomero-dairy" },
  ];
  
  // Mock vendor data
  const vendors = [
    { id: 1, company: "Packaging Solutions Ltd", contact: "Jane Akello", email: "jane@packagingsolutions.com", phone: "+256 772345601", lastOrder: "March 25, 2025", status: "active", entity: "grand-berna" },
    { id: 2, company: "Farm Equipment Uganda", contact: "Peter Okello", email: "peter@farmequipment.com", phone: "+256 772345602", lastOrder: "March 23, 2025", status: "inactive", entity: "kyalima-farmers" },
    { id: 3, company: "Transportation Services", contact: "Mary Namukasa", email: "mary@transservices.ug", phone: "+256 772345603", lastOrder: "March 20, 2025", status: "active", entity: "kajon-coffee" },
  ];
  
  // Mock government contacts
  const government = [
    { id: 1, office: "Ministry of Agriculture", contact: "Dr. Samuel Mukasa", department: "Export Certification", email: "samuel.mukasa@agriculture.go.ug", lastInteraction: "April 10, 2025", entity: "all" },
    { id: 2, office: "Uganda Revenue Authority", contact: "Ms. Florence Nambi", department: "Tax Compliance", email: "florence.nambi@ura.go.ug", lastInteraction: "April 5, 2025", entity: "all" },
  ];
  
  // Filter based on selected entity
  const filteredClients = selectedEntity === 'all' 
    ? clients 
    : clients.filter(client => client.entity === selectedEntity);
    
  const filteredVendors = selectedEntity === 'all' 
    ? vendors 
    : vendors.filter(vendor => vendor.entity === selectedEntity);
    
  const filteredGovernment = selectedEntity === 'all' 
    ? government 
    : government.filter(gov => gov.entity === selectedEntity || gov.entity === 'all');
  
  // Filter based on search query if present
  const searchedClients = searchQuery.trim() === '' 
    ? filteredClients 
    : filteredClients.filter(client => 
        client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contact.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
  const searchedVendors = searchQuery.trim() === '' 
    ? filteredVendors 
    : filteredVendors.filter(vendor => 
        vendor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.contact.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
  const searchedGovernment = searchQuery.trim() === '' 
    ? filteredGovernment 
    : filteredGovernment.filter(gov => 
        gov.office.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gov.contact.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  const handleAddContact = () => {
    toast.success("Contact form opened. This would add a new contact in a real implementation.");
  };
  
  const handleContactAction = (action, contactName) => {
    toast.success(`${action} initiated for ${contactName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Client & Vendor Management</h3>
        <Button onClick={handleAddContact}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Clients
            <Badge variant="secondary" className="ml-1">{searchedClients.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            Vendors
            <Badge variant="secondary" className="ml-1">{searchedVendors.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="government" className="flex items-center gap-1">
            <UserCheck className="h-4 w-4" />
            Government
            <Badge variant="secondary" className="ml-1">{searchedGovernment.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchedClients.length > 0 ? (
              searchedClients.map((client) => (
                <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2 flex flex-row justify-between items-start">
                    <CardTitle className="text-base">{client.company}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleContactAction('Call', client.contact)}>
                          <Phone className="mr-2 h-4 w-4" />
                          <span>Call</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContactAction('Email', client.contact)}>
                          <Mail className="mr-2 h-4 w-4" />
                          <span>Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContactAction('Schedule meeting', client.contact)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Schedule Meeting</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">Contact: {client.contact}</div>
                    <div className="text-sm text-muted-foreground">Email: {client.email}</div>
                    <div className="text-sm text-muted-foreground">Phone: {client.phone}</div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm">Last Contact: {client.lastContact}</div>
                      <Badge variant={
                        client.status === 'active' ? 'success' : 
                        client.status === 'lead' ? 'warning' : 'secondary'
                      }>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No clients found. Adjust your search or entity filter.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="vendors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchedVendors.length > 0 ? (
              searchedVendors.map((vendor) => (
                <Card key={vendor.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2 flex flex-row justify-between items-start">
                    <CardTitle className="text-base">{vendor.company}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleContactAction('Call', vendor.contact)}>
                          <Phone className="mr-2 h-4 w-4" />
                          <span>Call</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContactAction('Email', vendor.contact)}>
                          <Mail className="mr-2 h-4 w-4" />
                          <span>Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContactAction('Place order', vendor.company)}>
                          <Plus className="mr-2 h-4 w-4" />
                          <span>Place Order</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">Contact: {vendor.contact}</div>
                    <div className="text-sm text-muted-foreground">Email: {vendor.email}</div>
                    <div className="text-sm text-muted-foreground">Phone: {vendor.phone}</div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm">Last Order: {vendor.lastOrder}</div>
                      <Badge variant={vendor.status === 'active' ? 'success' : 'secondary'}>
                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                <Building className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No vendors found. Adjust your search or entity filter.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="government" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchedGovernment.length > 0 ? (
              searchedGovernment.map((gov) => (
                <Card key={gov.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2 flex flex-row justify-between items-start">
                    <CardTitle className="text-base">{gov.office}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleContactAction('Schedule meeting', gov.contact)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Schedule Meeting</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContactAction('Email', gov.contact)}>
                          <Mail className="mr-2 h-4 w-4" />
                          <span>Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContactAction('Document submission', gov.office)}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Submit Documents</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">Contact: {gov.contact}</div>
                    <div className="text-sm text-muted-foreground">Department: {gov.department}</div>
                    <div className="text-sm text-muted-foreground">Email: {gov.email}</div>
                    <div className="text-sm mt-2">Last Interaction: {gov.lastInteraction}</div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                <UserCheck className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No government contacts found. Adjust your search.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientCRM;
