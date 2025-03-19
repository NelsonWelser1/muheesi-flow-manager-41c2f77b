
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import PayrollPayslipsRecords from '../../records/PayrollPayslipsRecords';
import PayrollFormContent from './PayrollFormContent';
import BulkPayrollModal from '../BulkPayrollModal';

const PayrollPayslipsForm = ({ onBack }) => {
  const [viewMode, setViewMode] = useState('form'); // 'form' or 'records'
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
  const handleOpenBulkModal = () => {
    setIsBulkModalOpen(true);
  };
  
  const handleCloseBulkModal = () => {
    setIsBulkModalOpen(false);
  };
  
  if (viewMode === 'records') {
    return <PayrollPayslipsRecords onBack={() => setViewMode('form')} />;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button variant="outline" onClick={() => setViewMode('records')} className="flex items-center gap-2">
          <Eye className="h-4 w-4" /> View Records
        </Button>
      </div>
      
      <PayrollFormContent 
        onOpenBulkModal={handleOpenBulkModal} 
      />
      
      {/* Bulk Payroll Processing Modal */}
      <BulkPayrollModal 
        isOpen={isBulkModalOpen} 
        onClose={handleCloseBulkModal} 
      />
    </div>
  );
};

export default PayrollPayslipsForm;
