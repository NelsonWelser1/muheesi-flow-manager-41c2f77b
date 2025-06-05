
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Building
} from 'lucide-react';
import ProceduresList from './ProceduresList';
import CreateProcedureForm from './CreateProcedureForm';
import ProcedureDetails from './ProcedureDetails';
import ProceduresMetrics from './ProceduresMetrics';

const OperationalProcedures = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleCreateProcedure = () => {
    setShowCreateForm(true);
    setSelectedProcedure(null);
  };

  const handleViewProcedure = (procedure) => {
    setSelectedProcedure(procedure);
    setShowCreateForm(false);
  };

  const handleEditProcedure = (procedure) => {
    setSelectedProcedure(procedure);
    setShowCreateForm(true);
  };

  const handleCloseDetails = () => {
    setSelectedProcedure(null);
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <CreateProcedureForm 
        procedure={selectedProcedure}
        onClose={handleCloseDetails}
        onSave={handleCloseDetails}
      />
    );
  }

  if (selectedProcedure && !showCreateForm) {
    return (
      <ProcedureDetails 
        procedure={selectedProcedure}
        onClose={handleCloseDetails}
        onEdit={() => handleEditProcedure(selectedProcedure)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Operational Procedures Management
          </h2>
          <p className="text-muted-foreground">
            Manage and track operational procedures across all companies
          </p>
        </div>
        <Button onClick={handleCreateProcedure} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Procedure
        </Button>
      </div>

      <ProceduresMetrics />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Procedures</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search procedures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Companies</option>
            <option value="grand-berna">Grand Berna Dairies</option>
            <option value="kajon">KAJON Coffee</option>
            <option value="kyalima">Kyalima Farmers</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <ProceduresList 
            status="all"
            searchTerm={searchTerm}
            filterCompany={filterStatus}
            onViewProcedure={handleViewProcedure}
            onEditProcedure={handleEditProcedure}
          />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <ProceduresList 
            status="active"
            searchTerm={searchTerm}
            filterCompany={filterStatus}
            onViewProcedure={handleViewProcedure}
            onEditProcedure={handleEditProcedure}
          />
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <ProceduresList 
            status="draft"
            searchTerm={searchTerm}
            filterCompany={filterStatus}
            onViewProcedure={handleViewProcedure}
            onEditProcedure={handleEditProcedure}
          />
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <ProceduresList 
            status="archived"
            searchTerm={searchTerm}
            filterCompany={filterStatus}
            onViewProcedure={handleViewProcedure}
            onEditProcedure={handleEditProcedure}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OperationalProcedures;
