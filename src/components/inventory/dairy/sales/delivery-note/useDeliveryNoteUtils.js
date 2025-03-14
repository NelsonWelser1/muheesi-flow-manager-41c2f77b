
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const useDeliveryNoteUtils = (qrCodeRef, selectedNote, setSelectedNote) => {
  const { toast } = useToast();
  
  // Export QR Code as PNG
  const exportQrCodeAsPng = async () => {
    if (!qrCodeRef.current) return;
    
    try {
      const dataUrl = await toPng(qrCodeRef.current);
      const link = document.createElement('a');
      link.download = `delivery-note-qr-${selectedNote?.id || 'code'}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "QR Code Exported",
        description: "QR Code saved as PNG image"
      });
    } catch (error) {
      console.error('Error exporting QR code as PNG:', error);
      toast({
        title: "Export Failed",
        description: "Could not export QR code as PNG",
        variant: "destructive"
      });
    }
  };

  // Export QR Code as PDF
  const exportQrCodeAsPdf = async () => {
    if (!qrCodeRef.current) return;
    
    try {
      const dataUrl = await toPng(qrCodeRef.current);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('Delivery Note QR Code', 105, 20, { align: 'center' });
      
      // Add delivery info
      if (selectedNote) {
        pdf.setFontSize(12);
        pdf.text(`Order Reference: ${selectedNote.orderReference}`, 20, 40);
        pdf.text(`Receiver: ${selectedNote.receiverName}`, 20, 50);
        pdf.text(`Delivery Date: ${new Date(selectedNote.deliveryDate).toLocaleDateString()}`, 20, 60);
        pdf.text(`Status: ${selectedNote.deliveryStatus}`, 20, 70);
      }
      
      // Add QR code image
      const imgWidth = 100;
      const imgHeight = 100;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const x = (pageWidth - imgWidth) / 2;
      pdf.addImage(dataUrl, 'PNG', x, 80, imgWidth, imgHeight);
      
      // Add footer
      pdf.setFontSize(10);
      pdf.text('Generated on ' + new Date().toLocaleString(), 105, 200, { align: 'center' });
      
      pdf.save(`delivery-note-qr-${selectedNote?.id || 'code'}.pdf`);
      
      toast({
        title: "QR Code Exported",
        description: "QR Code saved as PDF document"
      });
    } catch (error) {
      console.error('Error exporting QR code as PDF:', error);
      toast({
        title: "Export Failed",
        description: "Could not export QR code as PDF",
        variant: "destructive"
      });
    }
  };
  
  // Print delivery note details
  const printDeliveryNote = () => {
    if (!selectedNote) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Print Failed",
        description: "Could not open print window. Please check your popup blocker settings.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a printable HTML document with delivery note details
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Delivery Note - ${selectedNote.orderReference}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 30px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              margin-bottom: 5px;
            }
            .company-info {
              margin-bottom: 20px;
              text-align: center;
              font-size: 14px;
            }
            .delivery-details {
              margin-bottom: 30px;
            }
            .delivery-details h2 {
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .detail-row {
              display: flex;
              margin-bottom: 10px;
            }
            .detail-label {
              font-weight: bold;
              width: 150px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .items-table th, .items-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .items-table th {
              background-color: #f2f2f2;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
            }
            .signature-box {
              width: 45%;
            }
            .signature-line {
              border-top: 1px solid #333;
              margin-top: 50px;
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              @page {
                size: A4;
                margin: 20mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DELIVERY NOTE</h1>
            <p>Document No: DN-${selectedNote.id.slice(0, 8)}</p>
          </div>
          
          <div class="company-info">
            <p><strong>Grand Berna Dairies</strong></p>
            <p>8339 Entebbe Town, Uganda</p>
            <p>Tel: +256 757 757 517 / +256 776 670680</p>
          </div>
          
          <div class="delivery-details">
            <h2>Delivery Information</h2>
            <div class="detail-row">
              <span class="detail-label">Order Reference:</span>
              <span>${selectedNote.orderReference}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Delivery Date:</span>
              <span>${new Date(selectedNote.deliveryDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span>${selectedNote.deliveryStatus}</span>
            </div>
          </div>
          
          <div class="delivery-details">
            <h2>Receiver Information</h2>
            <div class="detail-row">
              <span class="detail-label">Receiver Name:</span>
              <span>${selectedNote.receiverName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Contact:</span>
              <span>${selectedNote.receiverContact}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span>${selectedNote.deliveryLocation}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Delivery Person:</span>
              <span>${selectedNote.deliveryPerson}</span>
            </div>
          </div>
          
          <div class="delivery-details">
            <h2>Delivered Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                ${selectedNote.items && Array.isArray(selectedNote.items) ? 
                  selectedNote.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.unit}</td>
                    </tr>
                  `).join('') : 
                  '<tr><td colspan="3">No items</td></tr>'
                }
              </tbody>
            </table>
          </div>
          
          <div class="signatures">
            <div class="signature-box">
              <p>Delivered by:</p>
              <div class="signature-line"></div>
              <p>Name: ${selectedNote.deliveryPerson}</p>
              <p>Date: ____________________</p>
            </div>
            
            <div class="signature-box">
              <p>Received by:</p>
              <div class="signature-line"></div>
              <p>Name: ${selectedNote.receiverName}</p>
              <p>Date: ____________________</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>This is a system-generated document.</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Let the content load before printing
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
  
  // Export delivery note as PDF
  const exportDeliveryNoteAsPdf = () => {
    if (!selectedNote) return;
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add header
      pdf.setFontSize(18);
      pdf.text('DELIVERY NOTE', 105, 20, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`Document No: DN-${selectedNote.id.slice(0, 8)}`, 105, 27, { align: 'center' });
      
      // Add company information
      pdf.setFontSize(12);
      pdf.text('Grand Berna Dairies', 105, 40, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text('8339 Entebbe Town, Uganda', 105, 46, { align: 'center' });
      pdf.text('Tel: +256 757 757 517 / +256 776 670680', 105, 52, { align: 'center' });
      
      // Add delivery information
      pdf.setFontSize(14);
      pdf.text('Delivery Information', 20, 65);
      pdf.line(20, 67, 190, 67);
      
      pdf.setFontSize(10);
      pdf.text('Order Reference:', 20, 75);
      pdf.text(selectedNote.orderReference, 70, 75);
      
      pdf.text('Delivery Date:', 20, 82);
      pdf.text(new Date(selectedNote.deliveryDate).toLocaleDateString(), 70, 82);
      
      pdf.text('Status:', 20, 89);
      pdf.text(selectedNote.deliveryStatus, 70, 89);
      
      // Add receiver information
      pdf.setFontSize(14);
      pdf.text('Receiver Information', 20, 100);
      pdf.line(20, 102, 190, 102);
      
      pdf.setFontSize(10);
      pdf.text('Receiver Name:', 20, 110);
      pdf.text(selectedNote.receiverName, 70, 110);
      
      pdf.text('Contact:', 20, 117);
      pdf.text(selectedNote.receiverContact, 70, 117);
      
      pdf.text('Location:', 20, 124);
      pdf.text(selectedNote.deliveryLocation, 70, 124);
      
      pdf.text('Delivery Person:', 20, 131);
      pdf.text(selectedNote.deliveryPerson, 70, 131);
      
      // Add delivered items
      pdf.setFontSize(14);
      pdf.text('Delivered Items', 20, 142);
      pdf.line(20, 144, 190, 144);
      
      // Table headers
      const headers = [['Item', 'Quantity', 'Unit']];
      
      // Table data
      const data = selectedNote.items && Array.isArray(selectedNote.items) 
        ? selectedNote.items.map(item => [item.name, item.quantity, item.unit]) 
        : [['No items', '', '']];
      
      pdf.autoTable({
        startY: 148,
        head: headers,
        body: data,
        theme: 'grid',
        headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        margin: { left: 20, right: 20 }
      });
      
      // Add signatures
      const finalY = pdf.autoTable.previous.finalY + 20;
      
      pdf.text('Delivered by:', 30, finalY);
      pdf.line(30, finalY + 20, 80, finalY + 20);
      pdf.text(`Name: ${selectedNote.deliveryPerson}`, 30, finalY + 25);
      pdf.text('Date: ____________________', 30, finalY + 32);
      
      pdf.text('Received by:', 120, finalY);
      pdf.line(120, finalY + 20, 170, finalY + 20);
      pdf.text(`Name: ${selectedNote.receiverName}`, 120, finalY + 25);
      pdf.text('Date: ____________________', 120, finalY + 32);
      
      // Add footer
      pdf.setFontSize(8);
      pdf.text(`Generated on ${new Date().toLocaleString()}`, 105, 280, { align: 'center' });
      pdf.text('This is a system-generated document.', 105, 285, { align: 'center' });
      
      pdf.save(`delivery-note-${selectedNote.orderReference}.pdf`);
      
      toast({
        title: "Export Successful",
        description: "Delivery note exported as PDF"
      });
    } catch (error) {
      console.error('Error exporting delivery note as PDF:', error);
      toast({
        title: "Export Failed",
        description: "Could not export delivery note as PDF",
        variant: "destructive"
      });
    }
  };

  return {
    exportQrCodeAsPng,
    exportQrCodeAsPdf,
    printDeliveryNote,
    exportDeliveryNoteAsPdf
  };
};
