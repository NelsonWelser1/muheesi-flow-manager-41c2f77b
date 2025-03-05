
import React from 'react';
import { Button } from "@/components/ui/button";
import SalesMarketingLayout from './sales/SalesMarketingLayout';

const SalesMarketing = ({
  onBackToDashboard
}) => {
  // This component now has a simpler structure that just renders the layout
  return (
    <div className="space-y-4">
      {/* Directly render the SalesMarketingLayout */}
      <SalesMarketingLayout onBack={onBackToDashboard} />
    </div>
  );
};

export default SalesMarketing;
