import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

// ============= DATA PROCESSORS =============

export const processHarvestData = (harvests) => {
  return harvests.map(h => ({
    'Date': format(new Date(h.harvest_date), 'MMM dd, yyyy'),
    'Quantity (kg)': Number(h.quantity_kg).toFixed(2),
    'Harvester': h.harvester_name,
    'Field Section': h.field_section,
    'Quality Grade': h.quality_grade.replace('_', ' ').toUpperCase(),
    'Notes': h.notes || '-'
  }));
};

export const processSalesData = (sales) => {
  return sales.map(s => ({
    'Date': format(new Date(s.sale_date), 'MMM dd, yyyy'),
    'Buyer': s.buyer_name,
    'Destination': s.destination,
    'Quantity (kg)': Number(s.quantity_kg).toFixed(2),
    'Price/kg (UGX)': Number(s.price_per_kg).toLocaleString(),
    'Total (UGX)': Number(s.total_amount).toLocaleString(),
    'Payment': s.payment_method.replace('_', ' '),
    'Received By': s.money_received_by
  }));
};

export const processEmployeeData = (employees) => {
  return employees.map(e => ({
    'Employee ID': e.employee_id,
    'Name': e.full_name,
    'Position': e.position,
    'Department': e.department,
    'Hire Date': format(new Date(e.hire_date), 'MMM dd, yyyy'),
    'Phone': e.phone || '-',
    'Status': e.status.toUpperCase()
  }));
};

export const processRequisitionData = (requisitions) => {
  return requisitions.map(r => ({
    'Req #': r.requisition_number,
    'Date': format(new Date(r.request_date), 'MMM dd, yyyy'),
    'Requested By': r.requested_by,
    'Category': r.category.replace('_', ' '),
    'Item': r.item_name,
    'Quantity': r.quantity,
    'Priority': r.priority.toUpperCase(),
    'Status': r.status.toUpperCase(),
    'Est. Cost (UGX)': r.estimated_cost ? Number(r.estimated_cost).toLocaleString() : '-'
  }));
};

// ============= PDF EXPORT FUNCTIONS =============

export const exportHarvestsToPDF = (data, filename, dateRange) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Kakyinga Coffee Farm', 14, 20);
    doc.setFontSize(14);
    doc.text('Harvest Report', 14, 28);
    
    // Date range and metadata
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 36);
    if (dateRange) {
      doc.text(`Period: ${dateRange}`, 14, 42);
    }
    
    // Summary
    const totalKg = data.reduce((sum, h) => sum + Number(h['Quantity (kg)']), 0);
    doc.text(`Total Harvested: ${totalKg.toFixed(2)} kg`, 14, 48);
    doc.text(`Total Records: ${data.length}`, 14, 54);
    
    // Table
    const headers = Object.keys(data[0] || {});
    const rows = data.map(item => Object.values(item));
    
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 60,
      theme: 'striped',
      headStyles: { 
        fillColor: [34, 139, 34],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      }
    });
    
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};

export const exportSalesToPDF = (data, filename, dateRange) => {
  try {
    const doc = new jsPDF('landscape');
    
    // Header
    doc.setFontSize(18);
    doc.text('Kakyinga Coffee Farm', 14, 20);
    doc.setFontSize(14);
    doc.text('Sales Report', 14, 28);
    
    // Date range and metadata
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 36);
    if (dateRange) {
      doc.text(`Period: ${dateRange}`, 14, 42);
    }
    
    // Summary
    const totalRevenue = data.reduce((sum, s) => {
      const amount = s['Total (UGX)'].replace(/,/g, '');
      return sum + Number(amount);
    }, 0);
    const totalKg = data.reduce((sum, s) => sum + Number(s['Quantity (kg)']), 0);
    
    doc.text(`Total Revenue: UGX ${totalRevenue.toLocaleString()}`, 14, 48);
    doc.text(`Total Quantity: ${totalKg.toFixed(2)} kg`, 14, 54);
    doc.text(`Total Sales: ${data.length}`, 14, 60);
    
    // Table
    const headers = Object.keys(data[0] || {});
    const rows = data.map(item => Object.values(item));
    
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 66,
      theme: 'striped',
      headStyles: { 
        fillColor: [34, 139, 34],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      }
    });
    
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};

export const exportEmployeesToPDF = (data, filename) => {
  try {
    const doc = new jsPDF('landscape');
    
    // Header
    doc.setFontSize(18);
    doc.text('Kakyinga Coffee Farm', 14, 20);
    doc.setFontSize(14);
    doc.text('Employee Roster', 14, 28);
    
    // Metadata
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 36);
    doc.text(`Total Employees: ${data.length}`, 14, 42);
    
    // Department breakdown
    const deptCounts = data.reduce((acc, e) => {
      acc[e.Department] = (acc[e.Department] || 0) + 1;
      return acc;
    }, {});
    
    let yPos = 48;
    Object.entries(deptCounts).forEach(([dept, count]) => {
      doc.text(`${dept}: ${count}`, 14, yPos);
      yPos += 6;
    });
    
    // Table
    const headers = Object.keys(data[0] || {});
    const rows = data.map(item => Object.values(item));
    
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: yPos + 6,
      theme: 'striped',
      headStyles: { 
        fillColor: [34, 139, 34],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      }
    });
    
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};

export const exportRequisitionsToPDF = (data, filename, dateRange) => {
  try {
    const doc = new jsPDF('landscape');
    
    // Header
    doc.setFontSize(18);
    doc.text('Kakyinga Coffee Farm', 14, 20);
    doc.setFontSize(14);
    doc.text('Requisitions Report', 14, 28);
    
    // Date range and metadata
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 36);
    if (dateRange) {
      doc.text(`Period: ${dateRange}`, 14, 42);
    }
    
    // Summary
    const statusCounts = data.reduce((acc, r) => {
      acc[r.Status] = (acc[r.Status] || 0) + 1;
      return acc;
    }, {});
    
    doc.text(`Total Requisitions: ${data.length}`, 14, 48);
    let yPos = 54;
    Object.entries(statusCounts).forEach(([status, count]) => {
      doc.text(`${status}: ${count}`, 14, yPos);
      yPos += 6;
    });
    
    // Table
    const headers = Object.keys(data[0] || {});
    const rows = data.map(item => Object.values(item));
    
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: yPos + 6,
      theme: 'striped',
      headStyles: { 
        fillColor: [34, 139, 34],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      }
    });
    
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};

// ============= EXCEL EXPORT FUNCTIONS =============

const exportToExcel = (data, filename, sheetName) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Auto-size columns
    const maxWidth = data.reduce((w, r) => {
      return Math.max(w, ...Object.values(r).map(val => String(val).length));
    }, 10);
    
    worksheet['!cols'] = Object.keys(data[0] || {}).map(() => ({ wch: Math.min(maxWidth, 30) }));
    
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel:', error);
    throw new Error('Failed to generate Excel report');
  }
};

export const exportHarvestsToExcel = (data, filename) => {
  exportToExcel(data, filename, 'Harvest Records');
};

export const exportSalesToExcel = (data, filename) => {
  exportToExcel(data, filename, 'Sales Records');
};

export const exportEmployeesToExcel = (data, filename) => {
  exportToExcel(data, filename, 'Employee Roster');
};

export const exportRequisitionsToExcel = (data, filename) => {
  exportToExcel(data, filename, 'Requisitions');
};

// ============= CSV EXPORT FUNCTIONS =============

const exportToCSV = (data, filename) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw new Error('Failed to generate CSV file');
  }
};

export const exportHarvestsToCSV = (data, filename) => {
  exportToCSV(data, filename);
};

export const exportSalesToCSV = (data, filename) => {
  exportToCSV(data, filename);
};

export const exportEmployeesToCSV = (data, filename) => {
  exportToCSV(data, filename);
};

export const exportRequisitionsToCSV = (data, filename) => {
  exportToCSV(data, filename);
};
