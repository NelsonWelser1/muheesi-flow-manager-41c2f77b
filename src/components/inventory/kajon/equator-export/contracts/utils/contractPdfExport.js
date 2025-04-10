
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from '@/components/ui/notifications.js';

/**
 * Exports the contract template to PDF by capturing the HTML content
 * @param {HTMLElement} templateRef - Reference to the template DOM element
 * @param {string} filename - Name for the downloaded file
 * @param {Function} toast - Toast function for notifications
 * @returns {Promise<boolean>} - Success status of the export
 */
export const exportContractToPDF = async (templateRef, filename, toast) => {
  try {
    if (!templateRef) {
      throw new Error('Template element not found');
    }

    // Show loading toast
    const loadingToast = showLoadingToast(toast, 'Generating PDF...');
    
    // Temporarily add a class to help with styling during capture
    document.body.classList.add('generating-pdf');
    
    // Configure html2canvas with high quality settings
    const canvas = await html2canvas(templateRef, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: templateRef.scrollWidth,
      windowHeight: templateRef.scrollHeight,
      onclone: (doc) => {
        // Apply print-specific styling to the cloned document
        const element = doc.body.querySelector('.print-container');
        if (element) {
          element.style.padding = '0';
          element.style.margin = '0 auto';
          element.style.border = 'none';
          element.style.boxShadow = 'none';
        }
      }
    });
    
    // Remove the temporary class
    document.body.classList.remove('generating-pdf');
    
    // Create PDF with appropriate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if the content doesn't fit on one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
    
    // Dismiss loading toast and show success
    if (loadingToast) dismissToast(loadingToast);
    showSuccessToast(toast, 'PDF exported successfully');
    
    return true;
  } catch (error) {
    console.error('Error exporting contract to PDF:', error);
    showErrorToast(toast, `Failed to export PDF: ${error.message}`);
    return false;
  }
};
