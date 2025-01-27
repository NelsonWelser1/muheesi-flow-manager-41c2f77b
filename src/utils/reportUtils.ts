import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

export const generateMonthlyReport = async (data: any[], month: number, year: number) => {
  const doc = new jsPDF();
  
  const title = `Monthly Milk Reception Report - ${format(new Date(year, month), 'MMMM yyyy')}`;
  doc.text(title, 14, 15);
  
  const headers = [['Date', 'Supplier', 'Volume (L)', 'Temperature (°C)', 'Quality', 'Notes']];
  const rows = data.map(item => [
    format(new Date(item.datetime), 'dd/MM/yyyy'),
    item.supplier_name,
    item.milk_volume,
    item.temperature,
    item.quality,
    item.notes
  ]);

  doc.autoTable({
    head: headers,
    body: rows,
    startY: 25,
  });

  return doc;
};

export const generateAnnualReport = async (data: any[], year: number) => {
  const doc = new jsPDF();
  
  const title = `Annual Milk Reception Report - ${year}`;
  doc.text(title, 14, 15);
  
  // Group data by month
  const monthlyData = Array.from({ length: 12 }, (_, month) => {
    const monthData = data.filter(item => 
      new Date(item.datetime).getMonth() === month &&
      new Date(item.datetime).getFullYear() === year
    );
    
    return {
      month: format(new Date(year, month), 'MMMM'),
      totalVolume: monthData.reduce((sum, item) => sum + item.milk_volume, 0),
      averageTemp: monthData.length ? 
        monthData.reduce((sum, item) => sum + item.temperature, 0) / monthData.length : 
        0,
      recordCount: monthData.length
    };
  });

  const headers = [['Month', 'Total Volume (L)', 'Avg. Temperature (°C)', 'Records']];
  const rows = monthlyData.map(item => [
    item.month,
    item.totalVolume.toFixed(2),
    item.averageTemp.toFixed(1),
    item.recordCount
  ]);

  doc.autoTable({
    head: headers,
    body: rows,
    startY: 25,
  });

  return doc;
};

export const downloadAsCSV = (data: any[], filename: string) => {
  const headers = ['Date', 'Supplier', 'Volume (L)', 'Temperature (°C)', 'Quality', 'Notes'];
  const rows = data.map(item => [
    format(new Date(item.datetime), 'dd/MM/yyyy'),
    item.supplier_name,
    item.milk_volume,
    item.temperature,
    item.quality,
    item.notes
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const downloadAsJPG = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element);
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/jpeg', 0.8);
  link.click();
};