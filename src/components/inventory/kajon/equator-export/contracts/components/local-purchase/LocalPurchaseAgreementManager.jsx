
import React, { useState } from 'react';
import LocalPurchaseAgreementList from './LocalPurchaseAgreementList';
import LocalPurchaseAgreementForm from './LocalPurchaseAgreementForm';
import LocalPurchaseAgreementView from './LocalPurchaseAgreementView';

const LocalPurchaseAgreementManager = () => {
  const [activeView, setActiveView] = useState('list');
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  
  const handleNewAgreement = () => {
    setSelectedAgreement(null);
    setActiveView('form');
  };
  
  const handleViewAgreement = (agreement) => {
    setSelectedAgreement(agreement);
    setActiveView('view');
  };
  
  const handleEditAgreement = (agreement) => {
    setSelectedAgreement(agreement);
    setActiveView('form');
  };
  
  const handleBackToList = () => {
    setActiveView('list');
    setSelectedAgreement(null);
  };

  // Render the appropriate view based on the activeView state
  return (
    <div>
      {activeView === 'list' && (
        <LocalPurchaseAgreementList 
          onNewAgreement={handleNewAgreement}
          onViewAgreement={handleViewAgreement}
          onEditAgreement={handleEditAgreement}
        />
      )}
      
      {activeView === 'form' && (
        <LocalPurchaseAgreementForm 
          onBack={handleBackToList}
          existingAgreement={selectedAgreement}
        />
      )}
      
      {activeView === 'view' && selectedAgreement && (
        <LocalPurchaseAgreementView 
          agreement={selectedAgreement}
          onBack={handleBackToList}
          onEdit={() => setActiveView('form')}
        />
      )}
    </div>
  );
};

export default LocalPurchaseAgreementManager;
