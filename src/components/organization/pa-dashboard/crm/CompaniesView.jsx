
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Building, MapPin, Phone, Mail, Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const CompaniesView = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isNewCompanyDialogOpen, setIsNewCompanyDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    location: '',
    description: ''
  });

  // Sample data
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'KAJON Coffee Limited',
      industry: 'Agriculture & Food',
      location: 'Kampala, Uganda',
      website: 'www.kajoncoffee.com',
      logoUrl: null,
      description: 'Coffee export and processing company focused on specialty coffee.',
      contacts: 5,
      revenue: '$2.5M',
      employees: '50-100',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Grand Berna Dairies',
      industry: 'Dairy Processing',
      location: 'Mbarara, Uganda',
      website: 'www.grandbernadairies.com',
      logoUrl: null,
      description: 'Leading dairy production and processing company.',
      contacts: 3,
      revenue: '$1.8M',
      employees: '100-250',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Kyalima Farmers Limited',
      industry: 'Agriculture',
      location: 'Masaka, Uganda',
      website: 'www.kyalimafarmers.com',
      logoUrl: null,
      description: 'Cooperative of farmers focusing on sustainable farming practices.',
      contacts: 0,
      revenue: '$950K',
      employees: '25-50',
      status: 'Active'
    }
  ]);

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
  };

  const handleAddCompany = () => {
    const newId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;
    const companyToAdd = {
      ...newCompany,
      id: newId,
      logoUrl: null,
      contacts: 0,
      status: 'Active'
    };
    
    setCompanies([...companies, companyToAdd]);
    setNewCompany({ name: '', industry: '', location: '', description: '' });
    setIsNewCompanyDialogOpen(false);
  };

  // Get avatar text from company name - with null check
  const getAvatarText = (name) => {
    if (!name) return 'CO';
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  // Safe prop access helper
  const handleSafeProp = (value, defaultValue = '') => {
    return value !== undefined && value !== null ? value : defaultValue;
  };

  // Check if company has contacts - with null check
  const hasContacts = (company) => {
    return company && typeof company?.contacts === 'number' && company.contacts > 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-280px)]">
      {/* Companies List */}
      <Card className="md:col-span-1">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Companies</CardTitle>
            <Dialog open={isNewCompanyDialogOpen} onOpenChange={setIsNewCompanyDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Company</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="company-name" className="text-sm font-medium">Company Name</label>
                    <Input 
                      id="company-name" 
                      placeholder="Enter company name" 
                      value={newCompany.name || ''}
                      onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company-industry" className="text-sm font-medium">Industry</label>
                    <Input 
                      id="company-industry" 
                      placeholder="Enter industry" 
                      value={newCompany.industry || ''}
                      onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company-location" className="text-sm font-medium">Location</label>
                    <Input 
                      id="company-location" 
                      placeholder="Enter location" 
                      value={newCompany.location || ''}
                      onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company-description" className="text-sm font-medium">Description</label>
                    <Textarea 
                      id="company-description" 
                      placeholder="Enter company description" 
                      value={newCompany.description || ''}
                      onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewCompanyDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddCompany}>Add Company</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
            <TabsList className="grid w-full grid-cols-3 p-0 h-10 rounded-none border-b">
              <TabsTrigger value="all" className="rounded-none">All</TabsTrigger>
              <TabsTrigger value="active" className="rounded-none">Active</TabsTrigger>
              <TabsTrigger value="recent" className="rounded-none">Recently Added</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(100vh-380px)]">
              {companies && companies.length > 0 ? companies.map((company) => (
                <div
                  key={company?.id || 'unknown'}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedCompany?.id === company?.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => handleSelectCompany(company)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={company?.logoUrl || ''} alt={handleSafeProp(company?.name)} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getAvatarText(handleSafeProp(company?.name))}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{handleSafeProp(company?.name)}</h3>
                      <p className="text-sm text-gray-500 truncate">{handleSafeProp(company?.industry)}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 truncate flex items-center">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          {handleSafeProp(company?.location)}
                        </span>
                        {hasContacts(company) && (
                          <span className="text-xs text-blue-500">{company.contacts} contacts</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-3 text-center text-gray-500">
                  No companies found
                </div>
              )}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      {/* Company Details */}
      <Card className="md:col-span-2 flex flex-col">
        {!selectedCompany ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <Building className="h-12 w-12 mx-auto text-gray-300" />
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
                    <AvatarImage 
                      src={selectedCompany?.logoUrl || ''} 
                      alt={handleSafeProp(selectedCompany?.name)} 
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {getAvatarText(handleSafeProp(selectedCompany?.name))}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl mb-1">{handleSafeProp(selectedCompany?.name)}</CardTitle>
                    <p className="text-sm text-gray-500">{handleSafeProp(selectedCompany?.industry)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button size="sm">Contact</Button>
                </div>
              </div>
            </CardHeader>
            
            <div className="p-4 flex-1 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Company Information</h3>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {handleSafeProp(selectedCompany?.location)}
                    </p>
                  </div>
                  
                  {selectedCompany?.website && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Website</h4>
                      <a href={`https://${selectedCompany.website}`} target="_blank" rel="noopener noreferrer" 
                        className="flex items-center mt-1 text-blue-500 hover:underline">
                        {selectedCompany.website}
                      </a>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="mt-1 text-sm">{handleSafeProp(selectedCompany?.description)}</p>
                  </div>
                </div>
                
                {/* Company Stats */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Company Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <h4 className="text-sm font-medium text-gray-500">Contacts</h4>
                      <p className="text-2xl font-semibold mt-1">{handleSafeProp(selectedCompany?.contacts, 0)}</p>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <p className="mt-1">
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {handleSafeProp(selectedCompany?.status, 'Unknown')}
                        </span>
                      </p>
                    </div>
                    
                    {selectedCompany?.revenue && (
                      <div className="border rounded-md p-3">
                        <h4 className="text-sm font-medium text-gray-500">Annual Revenue</h4>
                        <p className="text-lg font-semibold mt-1">{selectedCompany.revenue}</p>
                      </div>
                    )}
                    
                    {selectedCompany?.employees && (
                      <div className="border rounded-md p-3">
                        <h4 className="text-sm font-medium text-gray-500">Employees</h4>
                        <p className="text-lg font-semibold mt-1">{selectedCompany.employees}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Recent Interactions */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recent Interactions</h3>
                {hasContacts(selectedCompany) ? (
                  <div className="border rounded-md p-4">
                    {/* Recent interactions content would go here */}
                    <p className="text-sm text-gray-500">Recent interaction data coming soon...</p>
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-sm text-gray-500">No contacts added for this company.</p>
                    <Button variant="outline" size="sm" className="mt-2">Add Contact</Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default CompaniesView;
