
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
      'Milk Volume (L)',
      'Start Time',
      'Duration (hrs)',
      'Starter Culture',
      'Starter Quantity (g)',
      'Coagulant Type',
      'Coagulant Quantity (ml)',
      'Temperature (°C)',
      'Processing Time (min)',
      'Expected Yield (kg)',
      'Status',
      'Notes',
      'Created At'
    ].join(',');

    const rows = records.map(record => {
      const startTime = record.start_time ? formatDate(new Date(record.start_time), 'PPp') : '';
      const createdAt = record.created_at ? formatDate(new Date(record.created_at), 'PPp') : '';
      
      return [
        record.batch_id || '',
        record.fromager_identifier || '',
        record.cheese_type || '',
        record.milk_volume || '',
        startTime,
        record.estimated_duration || '',
        record.starter_culture || '',
        record.starter_quantity || '',
        record.coagulant_type || '',
        record.coagulant_quantity || '',
        record.processing_temperature || '',
        record.processing_time || '',
        record.expected_yield || '',
        record.status || '',
        record.notes ? `"${record.notes.replace(/"/g, '""')}"` : '',
        createdAt
      ].join(',');
    });

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
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
            font-size: 12px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
            white-space: nowrap;
          }
          td.notes {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          th { 
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .header { 
            margin-bottom: 20px; 
            text-align: center; 
          }
          .status-pending {
            background-color: #fef3c7;
            color: #92400e;
            padding: 2px 8px;
            border-radius: 9999px;
          }
          .status-completed {
            background-color: #d1fae5;
            color: #065f46;
            padding: 2px 8px;
            border-radius: 9999px;
          }
          @media print {
            .no-print { display: none; }
            table { page-break-inside: avoid; }
            th { background-color: #f5f5f5 !important; }
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
              <th>Milk Volume (L)</th>
              <th>Start Time</th>
              <th>Duration (hrs)</th>
              <th>Starter Culture</th>
              <th>Starter Qty (g)</th>
              <th>Coagulant Type</th>
              <th>Coagulant Qty (ml)</th>
              <th>Temp (°C)</th>
              <th>Process Time (min)</th>
              <th>Yield (kg)</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(record => `
              <tr>
                <td>${record.batch_id || ''}</td>
                <td>${record.fromager_identifier || ''}</td>
                <td>${record.cheese_type || ''}</td>
                <td>${record.milk_volume || ''}</td>
                <td>${record.start_time ? formatDate(new Date(record.start_time), 'PPp') : ''}</td>
                <td>${record.estimated_duration || ''}</td>
                <td>${record.starter_culture || ''}</td>
                <td>${record.starter_quantity || ''}</td>
                <td>${record.coagulant_type || ''}</td>
                <td>${record.coagulant_quantity || ''}</td>
                <td>${record.processing_temperature || ''}</td>
                <td>${record.processing_time || ''}</td>
                <td>${record.expected_yield || ''}</td>
                <td>
                  <span class="status-${record.status || 'pending'}">
                    ${record.status || 'pending'}
                  </span>
                </td>
                <td class="notes" title="${record.notes || ''}">${record.notes || ''}</td>
                <td>${record.created_at ? formatDate(new Date(record.created_at), 'PPp') : ''}</td>
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
