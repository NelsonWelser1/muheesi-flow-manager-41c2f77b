
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import DossierList from './DossierList';
import DossierDetails from './DossierDetails';
import DossierScheduler from './DossierScheduler';
import DossierUploader from './DossierUploader';
import DossierSearchBar from './components/DossierSearchBar';
import ViewModeToggle from './components/ViewModeToggle';
import DossierActionButtons from './components/DossierActionButtons';
import { useEmployeeDossiers } from './hooks/useEmployeeDossiers';

const DossierManagement = () => {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  
  const { dossiers: filteredDossiers, isLoading, error } = useEmployeeDossiers(searchQuery);

  const handleCreateDossier = () => {
    setSelectedDossier(null);
    setShowDetails(true);
  };

  const handleViewDossier = (dossier) => {
    console.log('Viewing dossier:', dossier);
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
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <DossierSearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <DossierActionButtons 
          onCreateDossier={handleCreateDossier}
          onUploadDocuments={() => handleUploadDocuments()}
          onScheduleTask={() => handleScheduleTask()}
        />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
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

const LoadingState = () => (
  <Card>
    <CardContent className="p-6">
      <div className="text-center">Loading dossiers...</div>
    </CardContent>
  </Card>
);

const ErrorState = ({ error }) => (
  <Card>
    <CardContent className="p-6">
      <div className="text-center text-red-500">
        Error loading dossiers: {error?.message || 'Unknown error'}
      </div>
    </CardContent>
  </Card>
);

export default DossierManagement;
