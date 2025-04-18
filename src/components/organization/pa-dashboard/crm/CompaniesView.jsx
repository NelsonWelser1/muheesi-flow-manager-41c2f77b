
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Buildings, Phone, Mail, MapPin, FileText, MoreHorizontal, Building, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const CompaniesView = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'Grand Berna Dairies',
      industry: 'Dairy Production',
      location: 'Kampala, Uganda',
      contacts: 3,
      logoUrl: null,
      description: 'Leading dairy producer in the region specializing in milk, cheese, and yogurt products.'
    },
    {
      id: 2,
      name: 'KAJON Coffee Limited',
      industry: 'Coffee Export',
      location: 'Mbarara, Uganda',
      contacts: 2,
      logoUrl: null,
      description: 'Premium coffee exporter working with local farmers to bring Ugandan coffee to international markets.'
    },
    {
      id: 3,
      name: 'FreshEco Farms',
      industry: 'Agriculture',
      location: 'Jinja, Uganda',
      contacts: 1,
      logoUrl: null,
      description: 'Sustainable farming operation focusing on organic vegetables and fruits for local markets.'
    },
  ]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isNewCompanyDialogOpen, setIsNewCompanyDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    location: '',
    description: '',
  });

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
  };

  const handleAddCompany = () => {
    // Validation
    if (!newCompany.name || !newCompany.industry || !newCompany.location) {
      // You could add toast notifications here
      return;
    }

    const createdCompany = {
      id: companies.length + 1,
      ...newCompany,
      contacts: 0,
      logoUrl: null,
    };

    setCompanies([...companies, createdCompany]);
    setNewCompany({
      name: '',
      industry: '',
      location: '',
      description: '',
    });
    setIsNewCompanyDialogOpen(false);
  };

  const getAvatarText = (name) => {
    if (!name) return 'CO';
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-280px)]">
      {/* Companies List */}
      <Card className="md:col-span-1">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Companies</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsNewCompanyDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search companies..."
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-0 h-10 rounded-none border-b">
              <TabsTrigger value="all" className="rounded-none">All Companies</TabsTrigger>
              <TabsTrigger value="recent" className="rounded-none">Recently Added</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(100vh-380px)]">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedCompany?.id === company.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => handleSelectCompany(company)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={company.logoUrl} alt={company.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getAvatarText(company.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">{company.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {company.industry}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {company.location}
                        </span>
                        <span className="text-xs text-gray-500">
                          {company.contacts} contacts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      {/* Company Details */}
      <Card className="md:col-span-2 flex flex-col">
        {!selectedCompany ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <Buildings className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">Company Details</h3>
              <p className="mt-2 text-sm text-gray-500">Select a company to view details</p>
            </div>
          </div>
        ) : (
          <>
            <CardHeader className="p-4 border-b flex-shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={selectedCompany.logoUrl} alt={selectedCompany.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {getAvatarText(selectedCompany.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{selectedCompany.name}</CardTitle>
                    <p className="text-sm text-gray-500">{selectedCompany.industry}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Company</DropdownMenuItem>
                      <DropdownMenuItem>Add Contact</DropdownMenuItem>
                      <DropdownMenuItem>Add Note</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete Company</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            
            <Tabs defaultValue="overview" className="flex-1 flex flex-col">
              <TabsList className="p-0 h-10 rounded-none border-b">
                <TabsTrigger value="overview" className="rounded-none">Overview</TabsTrigger>
                <TabsTrigger value="contacts" className="rounded-none">Contacts</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-none">Notes</TabsTrigger>
                <TabsTrigger value="files" className="rounded-none">Files</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1 p-4">
                <TabsContent value="overview" className="mt-0 p-0">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Description</h3>
                      <p className="text-sm text-gray-600">
                        {selectedCompany.description || 'No description available.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Location</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {selectedCompany.location}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="justify-start">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Create Document
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Building className="h-4 w-4 mr-2" />
                          View on Map
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Recent Activity</h3>
                      <div className="space-y-2">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="text-sm text-gray-600 border-b pb-2">
                            <div className="flex justify-between">
                              <span>Activity {item}</span>
                              <span className="text-xs text-gray-500">2 days ago</span>
                            </div>
                            <p className="text-xs mt-1">
                              Brief description of activity {item} related to this company.
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contacts" className="mt-0 p-0">
                  <div className="space-y-4">
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                    
                    {selectedCompany.contacts > 0 ? (
                      <div className="space-y-2">
                        {[...Array(selectedCompany.contacts)].map((_, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 border rounded-md">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {String.fromCharCode(65 + index)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Contact {index + 1}</div>
                              <div className="text-xs text-gray-500">contact{index + 1}@example.com</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 text-gray-500">
                        No contacts added yet
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="mt-0 p-0">
                  <div className="space-y-4">
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                    
                    <div className="text-center p-4 text-gray-500">
                      No notes added yet
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="files" className="mt-0 p-0">
                  <div className="space-y-4">
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                    
                    <div className="text-center p-4 text-gray-500">
                      No files uploaded yet
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </>
        )}
      </Card>
      
      {/* New Company Dialog */}
      <Dialog open={isNewCompanyDialogOpen} onOpenChange={setIsNewCompanyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input 
                id="company-name" 
                placeholder="Enter company name" 
                value={newCompany.name}
                onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="company-industry">Industry</Label>
              <Input 
                id="company-industry" 
                placeholder="Enter industry" 
                value={newCompany.industry}
                onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="company-location">Location</Label>
              <Input 
                id="company-location" 
                placeholder="Enter location" 
                value={newCompany.location}
                onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="company-description">Description</Label>
              <Textarea 
                id="company-description" 
                placeholder="Enter company description" 
                value={newCompany.description}
                onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsNewCompanyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAddCompany}>
              Add Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesView;
