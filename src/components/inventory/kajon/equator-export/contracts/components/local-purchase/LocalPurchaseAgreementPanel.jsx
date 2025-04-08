
import React, { useState } from 'react';
import LocalPurchaseAgreementList from './LocalPurchaseAgreementList';
import LocalPurchaseAgreementForm from './LocalPurchaseAgreementForm';
import LocalPurchaseAgreementView from './LocalPurchaseAgreementView';

const LocalPurchaseAgreementPanel = ({ onBack }) => {
  const [view, setView] = useState('list'); // list, new, view, edit
  const [selectedAgreementId, setSelectedAgreementId] = useState(null);
  
  const handleViewAgreement = (id) => {
    setSelectedAgreementId(id);
    setView('view');
  };
  
  const handleEditAgreement = (id) => {
    setSelectedAgreementId(id);
    setView('edit');
  };
  
  const handleNewAgreement = () => {
    setSelectedAgreementId(null);
    setView('new');
  };
  
  const handleBackToList = () => {
    setView('list');
    setSelectedAgreementId(null);
  };
  
  return (
    <div>
      {view === 'list' && (
        <LocalPurchaseAgreementList 
          onNewAgreement={handleNewAgreement}
          onViewAgreement={handleViewAgreement}
          onBack={onBack}
        />
      )}
      
      {view === 'new' && (
        <LocalPurchaseAgreementForm 
          onBack={handleBackToList}
        />
      )}
      
      {view === 'view' && selectedAgreementId && (
        <LocalPurchaseAgreementView 
          agreementId={selectedAgreementId}
          onBack={handleBackToList}
          onEdit={handleEditAgreement}
        />
      )}
      
      {view === 'edit' && selectedAgreementId && (
        <LocalPurchaseAgreementForm 
          agreementId={selectedAgreementId}
          onBack={handleBackToList}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default LocalPurchaseAgreementPanel;
