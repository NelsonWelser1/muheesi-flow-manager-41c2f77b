
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Plus, User, Building, UserCheck } from 'lucide-react';

const ClientCRM = ({ selectedEntity }) => {
  // This would be a more complex component in a real implementation
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Client & Vendor Management</h3>
        <Button>
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
          />
        </div>
      </div>

      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="government" className="flex items-center gap-1">
            <UserCheck className="h-4 w-4" />
            Government
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Client Company {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Contact: John Doe</div>
                  <div className="text-sm text-muted-foreground">Email: contact@company{i}.com</div>
                  <div className="text-sm text-muted-foreground">Phone: +256 7123456{i}</div>
                  <div className="text-sm mt-2">Last Contact: April {i + 10}, 2025</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="vendors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Vendor Company {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Contact: Jane Smith</div>
                  <div className="text-sm text-muted-foreground">Email: info@vendor{i}.com</div>
                  <div className="text-sm text-muted-foreground">Phone: +256 7765432{i}</div>
                  <div className="text-sm mt-2">Last Order: March {i + 15}, 2025</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="government" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Government Office {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Contact: Official Name</div>
                  <div className="text-sm text-muted-foreground">Department: Regulatory Affairs</div>
                  <div className="text-sm text-muted-foreground">Email: office@gov.ug</div>
                  <div className="text-sm mt-2">Last Interaction: April {i + 5}, 2025</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientCRM;
