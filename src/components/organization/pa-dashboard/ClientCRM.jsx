
import React, { useState } from 'react';
import CRMRouter from './crm/CRMRouter';
import { Card } from "@/components/ui/card";

const ClientCRM = ({ selectedEntity, view = 'contacts' }) => {
  return (
    <div className="space-y-4">
      <Card className="p-0 overflow-hidden">
        <CRMRouter view={view} />
      </Card>
    </div>
  );
};

export default ClientCRM;
