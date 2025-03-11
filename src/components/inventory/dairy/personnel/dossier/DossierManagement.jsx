
import React, { useState } from 'react';
import { Search, Users, Grid, Plus, Upload, UserCheck, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import DossierList from './DossierList';
import DossierDetails from './DossierDetails';
import DossierScheduler from './DossierScheduler';
import DossierUploader from './DossierUploader';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";

const DossierManagement = () => {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const { toast } = useToast();

  // Fetch employee dossiers using React Query
  const { data: dossiers = [], isLoading, error } = useQuery({
    queryKey: ['employeeDossiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personnel_employee_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredDossiers = dossiers.filter(dossier => 
    dossier.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDossier = () => {
    setSelectedDossier(null);
    setShowDetails(true);
  };

  const handleViewDossier = (dossier) => {
    setSelectedDossier(dossier);
    setShowDetails(true);
  };

  const handleUploadDocuments = (dossier = null) => {
    setSelectedDossier(dossier);
    setShowUploader(true);
  };

  const handleScheduleTask = (dossier = null) => {
    setSelectedDossier(dossier);
    setShowScheduler(true);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated and will download shortly.",
    });
    // Implement export functionality here
  };

  const handleBack = () => {
    setShowDetails(false);
    setShowUploader(false);
    setShowScheduler(false);
  };

  if (showDetails) {
    return <DossierDetails dossier={selectedDossier} onBack={handleBack} />;
  }

  if (showUploader) {
    return <DossierUploader dossier={selectedDossier} onBack={handleBack} />;
  }

  if (showScheduler) {
    return <DossierScheduler dossier={selectedDossier} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Employee Dossiers</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-blue-100' : ''}
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-blue-100' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-auto flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            className="pl-9" 
            placeholder="Search employee records..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCreateDossier} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Dossier
          </Button>
          <Button variant="outline" onClick={() => handleUploadDocuments()} className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload Documents
          </Button>
          <Button variant="outline" onClick={() => handleScheduleTask()} className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Schedule Task
          </Button>
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading dossiers...</div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">Error loading dossiers. Please try again.</div>
          </CardContent>
        </Card>
      ) : (
        <DossierList 
          dossiers={filteredDossiers} 
          viewMode={viewMode} 
          onView={handleViewDossier}
          onUpload={handleUploadDocuments}
          onSchedule={handleScheduleTask}
        />
      )}
    </div>
  );
};

export default DossierManagement;
