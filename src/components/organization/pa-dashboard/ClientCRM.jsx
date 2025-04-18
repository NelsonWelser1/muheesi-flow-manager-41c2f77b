
import React from 'react';
import CRMRouter from './crm/CRMRouter';

const ClientCRM = ({ selectedEntity, view = 'contacts' }) => {
  return (
    <div className="space-y-4">
      <CRMRouter view={view} />
    </div>
  );
};

export default ClientCRM;
