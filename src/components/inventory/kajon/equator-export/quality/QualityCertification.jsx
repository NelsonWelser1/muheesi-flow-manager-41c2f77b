
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  FileDown,
  FilePlus, 
  Coffee, 
  Wheat, 
  Apple, 
  Download, 
  Printer,
  Plus,
  CalendarIcon
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CertificateTemplateForm from './CertificateTemplateForm';
import { useToast } from "@/components/ui/use-toast";

const QualityCertification = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState(null);

  // Sample certificates data
  const certificates = [
    {
      id: 1,
      name: 'Robusta Coffee Quality Certificate',
      type: 'coffee',
      issueDate: new Date('2023-11-15'),
      expiryDate: new Date('2024-11-14'),
      status: 'active',
      issuer: 'Uganda Coffee Development Authority',
      recipient: 'Starbucks Corporation'
    },
    {
      id: 2,
      name: 'Organic Coffee Certification',
      type: 'coffee',
      issueDate: new Date('2023-10-10'),
      expiryDate: new Date('2024-10-09'),
      status: 'active',
      issuer: 'ECOCERT',
      recipient: 'Peet\'s Coffee'
    },
    {
      id: 3,
      name: 'Maize Export Quality Certificate',
      type: 'general',
      issueDate: new Date('2023-09-05'),
      expiryDate: new Date('2024-03-04'),
      status: 'active',
      issuer: 'Uganda National Bureau of Standards',
      recipient: 'Cargill Inc.'
    },
    {
      id: 4,
      name: 'Fresh Fruits Quality Certificate',
      type: 'fresh',
      issueDate: new Date('2023-12-01'),
      expiryDate: new Date('2024-01-31'),
      status: 'active',
      issuer: 'Uganda Export Promotion Board',
      recipient: 'Dole Food Company'
    },
    {
      id: 5,
      name: 'Fair Trade Coffee Certification',
      type: 'coffee',
      issueDate: new Date('2023-06-20'),
      expiryDate: new Date('2024-06-19'),
      status: 'active',
      issuer: 'FLO-CERT',
      recipient: 'Nespresso'
    },
    {
      id: 6,
      name: 'Organic Vegetable Certificate',
      type: 'fresh',
      issueDate: new Date('2023-07-15'),
      expiryDate: new Date('2023-07-14'),
      status: 'expired',
      issuer: 'ECOCERT',
      recipient: 'Whole Foods Market'
    }
  ];

  const filteredCertificates = certificates.filter(cert => {
    // Filter by tab
    if (selectedTab !== 'all' && cert.type !== selectedTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !cert.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Handle showing template selection
  const handleNewCertificate = () => {
    setShowTemplateForm(true);
  };

  // Handle template selection
  const handleSelectTemplate = (type) => {
    setSelectedTemplateType(type);
  };

  // Handle template form closing
  const handleCloseTemplateForm = () => {
    setShowTemplateForm(false);
    setSelectedTemplateType(null);
  };

  // Handle template save
  const handleSaveTemplate = (formData) => {
    toast({
      title: "Certificate Template Saved",
      description: `${formData.name || 'New certificate'} has been created.`,
    });
    setShowTemplateForm(false);
    setSelectedTemplateType(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quality Certification</h2>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleNewCertificate} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            New Certificate
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Certificates Register</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search certificates..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="coffee" className="flex items-center gap-1">
                  <Coffee className="h-4 w-4" />
                  <span className="hidden sm:inline">Coffee</span>
                </TabsTrigger>
                <TabsTrigger value="general" className="flex items-center gap-1">
                  <Wheat className="h-4 w-4" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="fresh" className="flex items-center gap-1">
                  <Apple className="h-4 w-4" />
                  <span className="hidden sm:inline">Fresh</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left">Certificate Name</th>
                  <th className="py-3 px-4 text-left hidden sm:table-cell">Type</th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">Issue Date</th>
                  <th className="py-3 px-4 text-left hidden lg:table-cell">Expiry</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert) => (
                    <tr key={cert.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{cert.name}</div>
                          <div className="text-xs text-muted-foreground hidden sm:block md:hidden">
                            {format(cert.issueDate, 'MMM d, yyyy')}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        {cert.type === 'coffee' && (
                          <div className="flex items-center">
                            <Coffee className="h-4 w-4 mr-1 text-amber-600" />
                            <span className="hidden md:inline">Coffee</span>
                          </div>
                        )}
                        {cert.type === 'general' && (
                          <div className="flex items-center">
                            <Wheat className="h-4 w-4 mr-1 text-amber-600" />
                            <span className="hidden md:inline">General</span>
                          </div>
                        )}
                        {cert.type === 'fresh' && (
                          <div className="flex items-center">
                            <Apple className="h-4 w-4 mr-1 text-green-600" />
                            <span className="hidden md:inline">Fresh</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {format(cert.issueDate, 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        {format(cert.expiryDate, 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4">
                        {cert.status === 'active' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Expired
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon">
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted-foreground">
                      No certificates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showTemplateForm && !selectedTemplateType && (
        <Card>
          <CardHeader>
            <CardTitle>Select Certificate Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSelectTemplate('coffee')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-amber-600" />
                    Coffee Bean Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Template for coffee quality control, grading, cupping scores, and origin verification.</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSelectTemplate('general')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wheat className="h-5 w-5 text-amber-600" />
                    General Produce Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Standard template for general agricultural commodities like grains, seeds, and pulses.</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSelectTemplate('fresh')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Apple className="h-5 w-5 text-green-600" />
                    Fresh Produce Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Specialized template for fresh fruits, vegetables, and perishable produce items.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={handleCloseTemplateForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTemplateType && (
        <CertificateTemplateForm 
          templateType={selectedTemplateType}
          onCancel={handleCloseTemplateForm}
          onSave={handleSaveTemplate}
        />
      )}
    </div>
  );
};

export default QualityCertification;
