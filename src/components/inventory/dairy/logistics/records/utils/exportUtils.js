
// Simple export utilities for demonstration
// In a real application, you would use libraries like xlsx, file-saver, and jspdf

export const exportToCSV = (data, filename) => {
  try {
    // Convert data to CSV format
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    const csvContent = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

export const exportToExcel = (data, filename) => {
  try {
    // In a real app, you would use the xlsx library to properly format Excel files
    // For this demonstration, we'll just create a CSV which can be opened in Excel
    exportToCSV(data, filename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

export const exportToPDF = (data, title) => {
  try {
    // In a real app, you would use a library like jspdf to create PDFs
    // For this demonstration, we'll show how to set it up
    
    // Create a simple HTML representation
    let content = `<h1>${title}</h1><table border="1">`;
    
    // Add headers
    const headers = Object.keys(data[0] || {});
    content += '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
    
    // Add rows
    data.forEach(item => {
      content += '<tr>' + headers.map(h => `<td>${item[h]}</td>`).join('') + '</tr>';
    });
    
    content += '</table>';
    
    // Open a new window with the content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${content}
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};
