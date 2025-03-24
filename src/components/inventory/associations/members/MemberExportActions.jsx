
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF } from "@/utils/coffee/coffeeExport";

const MemberExportActions = ({ members, selectedMember = null }) => {
  const formatMembers = (membersToFormat) => {
    return membersToFormat.map(member => ({
      'Member ID': member.id,
      'Full Name': member.full_name,
      'Location': member.location || '',
      'Phone': member.phone || '',
      'Farm Size (ha)': member.farm_size || '',
      'Coffee Type': member.coffee_type || '',
      'Experience (years)': member.experience || '',
      'Member Level': member.member_level || 'Bronze',
      'Status': member.status || 'Active',
      'Join Date': member.join_date ? new Date(member.join_date).toLocaleDateString() : '',
      'Last Delivery': member.last_delivery ? new Date(member.last_delivery).toLocaleDateString() : '',
    }));
  };

  const handleExportCSV = () => {
    const dataToExport = selectedMember ? [selectedMember] : members;
    exportToCSV(formatMembers(dataToExport), 'association-members');
  };

  const handleExportExcel = () => {
    const dataToExport = selectedMember ? [selectedMember] : members;
    exportToExcel(formatMembers(dataToExport), 'association-members');
  };

  const handleExportPDF = () => {
    const dataToExport = selectedMember ? [selectedMember] : members;
    exportToPDF(
      formatMembers(dataToExport), 
      'association-members', 
      selectedMember ? 'Association Member Details' : 'Association Members List'
    );
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportCSV}
        className="flex items-center gap-1"
        title="Export to CSV"
      >
        <Download className="h-4 w-4" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportExcel}
        className="flex items-center gap-1"
        title="Export to Excel"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        className="flex items-center gap-1"
        title="Export to PDF"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
};

export default MemberExportActions;
