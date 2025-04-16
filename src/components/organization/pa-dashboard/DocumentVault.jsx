import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, Plus, FolderOpen, FileSearch, Download } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const DocumentVault = ({ selectedEntity }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Document Vault</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search documents..."
            className="pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="legal">Legal & Compliance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => {
              const docTypes = ['Contract', 'Legal', 'Financial', 'Report', 'License', 'Certificate'];
              const docType = docTypes[i % docTypes.length];
              const entityNames = ['Grand Berna Dairies', 'KAJON Coffee Limited', 'Fresheco Farming Limited', 'Kyalima Farmers', 'Personal'];
              const entityName = entityNames[i % entityNames.length];
              
              return (
                <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-3 rounded-md mr-4">
                        <FileText className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{docType} Document #{i}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{entityName}</p>
                          </div>
                          <Badge variant="outline">{docType}</Badge>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Uploaded: Apr {i + 5}, 2025</span>
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <Download className="h-4 w-4" />
                            <span className="text-xs">Download</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="contracts" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-3 rounded-md mr-4">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Supply Contract #{i}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {i === 1 ? 'Grand Berna Dairies' : 'KAJON Coffee Limited'}
                          </p>
                        </div>
                        <Badge variant="outline">Contract</Badge>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Expires: Dec {15 + i}, 2025</span>
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <Download className="h-4 w-4" />
                          <span className="text-xs">Download</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Other tab contents would be similar */}
        <TabsContent value="legal" className="space-y-4">
          <div className="text-center py-10 text-muted-foreground">
            <FolderOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Legal & compliance documents will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <div className="text-center py-10 text-muted-foreground">
            <FolderOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Financial documents will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="operations" className="space-y-4">
          <div className="text-center py-10 text-muted-foreground">
            <FolderOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Operations documents will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentVault;
