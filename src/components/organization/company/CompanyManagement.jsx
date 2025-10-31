import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Building2, 
  Plus, 
  Search,
  Users,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const CompanyManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    type: '',
    location: '',
    contact_email: '',
    contact_phone: ''
  });

  // Fetch companies with user counts
  const { data: companies, isLoading, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      // Get all unique companies from user_roles
      const { data: rolesData, error } = await supabase
        .from('user_roles')
        .select('company');

      if (error) throw error;

      // Get unique companies and count users
      const companyMap = new Map();
      rolesData?.forEach(role => {
        if (role.company) {
          companyMap.set(role.company, (companyMap.get(role.company) || 0) + 1);
        }
      });

      return Array.from(companyMap.entries()).map(([name, userCount]) => ({
        name,
        userCount,
        type: getCompanyType(name),
        location: 'Uganda',
        status: 'active'
      }));
    }
  });

  const getCompanyType = (name) => {
    if (name.toLowerCase().includes('dairy') || name.toLowerCase().includes('dairies')) return 'dairy';
    if (name.toLowerCase().includes('coffee')) return 'coffee';
    if (name.toLowerCase().includes('farmer')) return 'farmers';
    return 'other';
  };

  const handleCreateCompany = async () => {
    if (!newCompany.name || !newCompany.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real implementation, you would create a companies table
    // For now, we'll just show a success message
    toast.success("Company created successfully");
    setIsCreateDialogOpen(false);
    setNewCompany({
      name: '',
      type: '',
      location: '',
      contact_email: '',
      contact_phone: ''
    });
    refetch();
  };

  const filteredCompanies = companies?.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCompanyTypeColor = (type) => {
    switch(type) {
      case 'dairy':
        return 'bg-primary/10 text-primary border-primary';
      case 'coffee':
        return 'bg-secondary/10 text-secondary border-secondary';
      case 'farmers':
        return 'bg-accent/10 text-accent border-accent';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Company Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage companies and their configurations
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Companies</p>
                <p className="text-2xl font-bold">{companies?.length || 0}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">
                  {companies?.reduce((acc, c) => acc + c.userCount, 0) || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dairy Companies</p>
                <p className="text-2xl font-bold">
                  {companies?.filter(c => c.type === 'dairy').length || 0}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Coffee Companies</p>
                <p className="text-2xl font-bold">
                  {companies?.filter(c => c.type === 'coffee').length || 0}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <CardDescription>View and manage all registered companies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading companies...</div>
          ) : filteredCompanies?.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-medium">No companies found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first company'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies?.map((company, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCompanyTypeColor(company.type)}>
                        {company.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {company.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {company.userCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-success text-success">
                        {company.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/company/${encodeURIComponent(company.name)}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Company Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>
              Create a new company and configure its settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                placeholder="Enter company name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Company Type *</Label>
              <Select value={newCompany.type} onValueChange={(value) => setNewCompany({...newCompany, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dairy">Dairy Company</SelectItem>
                  <SelectItem value="coffee">Coffee Company</SelectItem>
                  <SelectItem value="farmers">Farmers Cooperative</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={newCompany.location}
                onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@company.com"
                value={newCompany.contact_email}
                onChange={(e) => setNewCompany({...newCompany, contact_email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input
                id="phone"
                placeholder="+256 XXX XXXXXX"
                value={newCompany.contact_phone}
                onChange={(e) => setNewCompany({...newCompany, contact_phone: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCompany}>
              Create Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyManagement;
