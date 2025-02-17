
import { format as formatDate } from 'date-fns';

export const exportToCsv = (records, productionLine, timeRange, toast) => {
  if (!records?.length) {
    toast({
      title: "Error",
      description: "No records available to export",
      variant: "destructive",
    });
    return;
  }

  try {
    const timestamp = formatDate(new Date(), 'yyyy-MM-dd-HH-mm');
    const filename = `${productionLine.name.toLowerCase().replace(/\s+/g, '-')}-production-records-${timestamp}.csv`;
    
    const headers = [
      'Batch ID',
      'Fromager',
      'Cheese Type',
      'Volume (L)',
      'Start Time',
      'Status',
      'Created At',
      'Notes'
    ].join(',');

    const rows = records.map(record => [
      record.batch_id,
      record.fromager_identifier,
      record.cheese_type,
      record.milk_volume,
      formatDate(new Date(record.start_time), 'PPp'),
      record.status,
      formatDate(new Date(record.created_at), 'PPp'),
      record.notes ? `"${record.notes.replace(/"/g, '""')}"` : ''
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: `Records exported successfully as ${filename}`,
    });
  } catch (error) {
    console.error('Export error:', error);
    toast({
      title: "Error",
      description: "Failed to export records: " + error.message,
      variant: "destructive",
    });
  }
};

export const printRecords = (records, productionLine, timeRange) => {
  if (!records?.length) return false;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>${productionLine.name} Production Records</title>
        <style>
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          h1 { text-align: center; }
          .header { margin-bottom: 20px; text-align: center; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${productionLine.name} Production Records</h1>
          <p>Manager: ${productionLine.manager}</p>
          <p>Generated on: ${formatDate(new Date(), 'PPp')}</p>
          ${timeRange !== 'all' ? `<p>Time Range: ${timeRange}</p>` : ''}
        </div>
        <table>
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Fromager</th>
              <th>Cheese Type</th>
              <th>Volume (L)</th>
              <th>Start Time</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(record => `
              <tr>
                <td>${record.batch_id}</td>
                <td>${record.fromager_identifier}</td>
                <td>${record.cheese_type}</td>
                <td>${record.milk_volume}</td>
                <td>${formatDate(new Date(record.start_time), 'PPp')}</td>
                <td>${record.status}</td>
                <td>${formatDate(new Date(record.created_at), 'PPp')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <button class="no-print" onclick="window.print()">Print</button>
      </body>
    </html>
  `);
  printWindow.document.close();
  return true;
};
