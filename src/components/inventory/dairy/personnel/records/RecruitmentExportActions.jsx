
import React from 'react';
import { CSVExportButton } from '../../logistics/records/components/export-buttons/CSVExportButton';
import { ExcelExportButton } from '../../logistics/records/components/export-buttons/ExcelExportButton';
import PDFExportButton from '../../logistics/records/components/export-buttons/PDFExportButton';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

const RecruitmentExportActions = ({ records, fileName = 'recruitment_records' }) => {
  const handleCSVExport = () => {
    if (!records || records.length === 0) {
      console.warn('No records to export');
      return;
    }

    // Format records for CSV
    const formattedRecords = records.map(record => ({
      'Candidate Name': record.candidate_name,
      'Job Title': record.job_title,
      'Interview Date/Time': record.interview_date_time ? format(new Date(record.interview_date_time), 'PPp') : 'Not scheduled',
      'Hiring Manager ID': record.hiring_manager_id,
      'Feedback': record.feedback,
      'Status': record.status,
      'Created At': record.created_at ? format(new Date(record.created_at), 'PPp') : '',
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedRecords);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExcelExport = () => {
    if (!records || records.length === 0) {
      console.warn('No records to export');
      return;
    }

    // Format records for Excel
    const formattedRecords = records.map(record => ({
      'Candidate Name': record.candidate_name,
      'Job Title': record.job_title,
      'Interview Date/Time': record.interview_date_time ? format(new Date(record.interview_date_time), 'PPp') : 'Not scheduled',
      'Hiring Manager ID': record.hiring_manager_id,
      'Feedback': record.feedback,
      'Status': record.status,
      'Created At': record.created_at ? format(new Date(record.created_at), 'PPp') : '',
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recruitment Records');
    
    // Generate excel file and trigger download
    XLSX.writeFile(workbook, `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const handlePDFExport = () => {
    if (!records || records.length === 0) {
      console.warn('No records to export');
      return;
    }

    // Initialize PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Recruitment Records', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(), 'PPp')}`, 14, 22);
    
    // Format data for the table
    const tableData = records.map(record => [
      record.candidate_name,
      record.job_title,
      record.interview_date_time ? format(new Date(record.interview_date_time), 'PPp') : 'Not scheduled',
      record.hiring_manager_id,
      record.status,
    ]);
    
    // Create the table
    autoTable(doc, {
      head: [['Candidate Name', 'Job Title', 'Interview Date/Time', 'Hiring Manager', 'Status']],
      body: tableData,
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });
    
    // Save the PDF
    doc.save(`${fileName}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="flex space-x-2">
      <CSVExportButton onClick={handleCSVExport} />
      <ExcelExportButton onClick={handleExcelExport} />
      <PDFExportButton onClick={handlePDFExport} />
    </div>
  );
};

export default RecruitmentExportActions;
