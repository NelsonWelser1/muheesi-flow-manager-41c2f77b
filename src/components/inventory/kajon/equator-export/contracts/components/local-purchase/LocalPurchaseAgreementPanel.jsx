
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LocalPurchaseAgreement from './LocalPurchaseAgreement';

const LocalPurchaseAgreementPanel = ({ onBack }) => {
  return (
    <div className="space-y-4">
      <LocalPurchaseAgreement onBack={onBack} />
    </div>
  );
};

export default LocalPurchaseAgreementPanel;
