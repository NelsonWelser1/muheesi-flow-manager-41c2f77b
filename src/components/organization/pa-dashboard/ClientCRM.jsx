
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Building
} from 'lucide-react';

const ClientCRM = ({ selectedEntity, view }) => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "East African Dairy Co.",
      company: "Grand Berna Dairies",
      type: "Distributor",
      status: "Active",
      phone: "+256 777 123 456",
      email: "contact@eadairy.com",
      location: "Kampala, Uganda",
      contractValue: "2.5M UGX",
      lastContact: "2024-06-01",
      nextFollowUp: "2024-06-15"
    },
    {
      id: 2,
      name: "Premium Coffee Exports",
      company: "KAJON Coffee Limited",
      type: "Export Partner",
      status: "Active",
      phone: "+256 777 234 567",
      email: "info@premiumcoffee.com",
      location: "Mombasa, Kenya",
      contractValue: "1.8M UGX",
      lastContact: "2024-05-28",
      nextFollowUp: "2024-06-10"
    },
    {
      id: 3,
      name: "Agricultural Supplies Ltd",
      company: "Kyalima Farmers Limited",
      type: "Supplier",
      status: "Pending",
      phone: "+256 777 345 678",
      email: "sales@agsupplies.com",
      location: "Masaka, Uganda",
      contractValue: "800K UGX",
      lastContact: "2024-05-25",
      nextFollowUp: "2024-06-05"
    }
  ]);

  const [newClient, setNewClient] = useState({
    name: '',
    company: 'Grand Berna Dairies',
    type: 'Client',
    phone: '',
    email: '',
    location: '',
    contractValue: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-success';
      case 'Pending': return 'bg-warning';
      case 'Inactive': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const addClient = () => {
    const client = {
      id: clients.length + 1,
      ...newClient,
      status: 'Pending',
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setClients([...clients, client]);
    setNewClient({
      name: '',
      company: 'Grand Berna Dairies',
      type: 'Client',
      phone: '',
      email: '',
      location: '',
      contractValue: ''
    });
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status.toLowerCase() === filterStatus;
    const matchesEntity = selectedEntity === 'all' || client.company === selectedEntity;
    return matchesSearch && matchesStatus && matchesEntity;
  });

  if (view === 'form') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Client/Partner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Client/Partner Name</label>
              <Input
                value={newClient.name}
                onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                placeholder="Company or individual name..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Associated Company</label>
              <Select value={newClient.company} onValueChange={(value) => setNewClient({...newClient, company: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grand Berna Dairies">Grand Berna Dairies</SelectItem>
                  <SelectItem value="KAJON Coffee Limited">KAJON Coffee Limited</SelectItem>
                  <SelectItem value="Kyalima Farmers Limited">Kyalima Farmers Limited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Relationship Type</label>
              <Select value={newClient.type} onValueChange={(value) => setNewClient({...newClient, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Distributor">Distributor</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Export Partner">Export Partner</SelectItem>
                  <SelectItem value="Service Provider">Service Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Contract Value</label>
              <Input
                value={newClient.contractValue}
                onChange={(e) => setNewClient({...newClient, contractValue: e.target.value})}
                placeholder="e.g., 1.5M UGX"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Phone</label>
              <Input
                value={newClient.phone}
                onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                placeholder="+256 777 123 456"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                placeholder="contact@company.com"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <Input
              value={newClient.location}
              onChange={(e) => setNewClient({...newClient, location: e.target.value})}
              placeholder="City, Country"
            />
          </div>
          
          <Button onClick={addClient} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Client/Partner
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Client & Partner Management</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Client List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{client.name}</h4>
                        <Badge variant="outline">{client.type}</Badge>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span>{client.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{client.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Value: {client.contractValue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Last Contact: {new Date(client.lastContact).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Next Follow-up: {new Date(client.nextFollowUp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-xs text-success">+2 this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{clients.filter(c => c.status === 'Active').length}</p>
                <p className="text-xs text-primary">Strong relationships</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Contract Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">5.1M UGX</p>
                <p className="text-xs text-success">+15% growth</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Call with East African Dairy Co.</span>
                        <span className="text-xs text-muted-foreground">June {i}, 2024</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Discussed quarterly supply agreement and delivery schedules.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientCRM;
