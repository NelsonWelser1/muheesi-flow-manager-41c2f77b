
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Download,
  Edit,
  Eye,
  Filter
} from "lucide-react";
import ProceduresList from './ProceduresList';
import ProcedureDetails from './ProcedureDetails';
import CreateProcedureDialog from './CreateProcedureDialog';
import ProcedureFilters from './ProcedureFilters';

const OperationalProceduresManager = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    priority: '',
    lastUpdated: ''
  });

  // Mock data for operational procedures
  const procedures = [
    {
      id: 1,
      title: "Quality Control Standards",
      department: "Production",
      status: "active",
      priority: "high",
      version: "2.1",
      lastUpdated: "2024-05-15",
      description: "Comprehensive quality control procedures for all production lines",
      steps: 12,
      compliance: 95,
      responsible: "Quality Manager"
    },
    {
      id: 2,
      title: "Safety Protocol Guidelines",
      department: "Operations",
      status: "active",
      priority: "critical",
      version: "3.0",
      lastUpdated: "2024-05-10",
      description: "Essential safety protocols for workplace operations",
      steps: 8,
      compliance: 98,
      responsible: "Safety Officer"
    },
    {
      id: 3,
      title: "Inventory Management Process",
      department: "Logistics",
      status: "review",
      priority: "medium",
      version: "1.8",
      lastUpdated: "2024-04-28",
      description: "Standard procedures for inventory tracking and management",
      steps: 15,
      compliance: 87,
      responsible: "Inventory Manager"
    },
    {
      id: 4,
      title: "Customer Service Procedures",
      department: "Sales",
      status: "draft",
      priority: "medium",
      version: "1.0",
      lastUpdated: "2024-05-20",
      description: "Guidelines for customer interaction and service delivery",
      steps: 10,
      compliance: 0,
      responsible: "Sales Manager"
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      review: { color: "bg-yellow-100 text-yellow-800", label: "Under Review" },
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      archived: { color: "bg-red-100 text-red-800", label: "Archived" }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      critical: { color: "bg-red-100 text-red-800", label: "Critical" },
      high: { color: "bg-orange-100 text-orange-800", label: "High" },
      medium: { color: "bg-blue-100 text-blue-800", label: "Medium" },
      low: { color: "bg-gray-100 text-gray-800", label: "Low" }
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const filteredProcedures = procedures.filter(procedure => {
    const matchesSearch = procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         procedure.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || procedure.status === activeTab;
    const matchesDepartment = !filters.department || procedure.department === filters.department;
    const matchesStatus = !filters.status || procedure.status === filters.status;
    const matchesPriority = !filters.priority || procedure.priority === filters.priority;
    
    return matchesSearch && matchesTab && matchesDepartment && matchesStatus && matchesPriority;
  });

  const stats = {
    total: procedures.length,
    active: procedures.filter(p => p.status === 'active').length,
    review: procedures.filter(p => p.status === 'review').length,
    draft: procedures.filter(p => p.status === 'draft').length
  };

  if (selectedProcedure) {
    return (
      <ProcedureDetails 
        procedure={selectedProcedure}
        onBack={() => setSelectedProcedure(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Operational Procedures</h2>
          <p className="text-gray-600">Manage and track organizational procedures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back to Chart
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Procedure
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Procedures</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.review}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search procedures..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ProcedureFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
              <TabsTrigger value="review">Review ({stats.review})</TabsTrigger>
              <TabsTrigger value="draft">Draft ({stats.draft})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <ProceduresList 
            procedures={filteredProcedures}
            onSelectProcedure={setSelectedProcedure}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
          />
        </CardContent>
      </Card>

      {showCreateDialog && (
        <CreateProcedureDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      )}
    </div>
  );
};

export default OperationalProceduresManager;
